import 'dart:async';
import 'dart:convert';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:http/http.dart' as http;
import 'auth_service.dart';

class AceIdApi {
  AceIdApi(this.auth, {http.Client? client, FlutterSecureStorage? storage})
      : _client = client ?? http.Client(),
        _storage = storage ?? const FlutterSecureStorage();

  final OidcAuthService auth;
  final http.Client _client;
  final FlutterSecureStorage _storage;
  static const baseUrl = OidcAuthService.issuer;
  static const _cachePrefix = 'aceid.cache.';
  static const _maxCacheBytes = 256 * 1024;
  static const _maxOfflineAge = Duration(days: 7);

  Future<Map<String, dynamic>> request(String method, String path, {Map<String, dynamic>? body}) async {
    final token = await auth.getAccessToken();
    if (token == null || token.isEmpty) throw const ApiException('Your session expired. Sign in again.');

    final isRead = method.toUpperCase() == 'GET';
    final cacheKey = _cacheKey(path);
    final cached = isRead ? await _readCache(cacheKey) : null;

    try {
      final uri = Uri.parse(baseUrl).resolve(path);
      final headers = <String, String>{
        'Accept': 'application/json',
        'Authorization': 'Bearer $token',
        'Cache-Control': isRead ? 'no-cache' : 'no-store',
      };
      if (isRead && cached?.etag != null) headers['If-None-Match'] = cached!.etag!;
      if (body != null) headers['Content-Type'] = 'application/json';
      final request = http.Request(method, uri)..headers.addAll(headers);
      if (body != null) request.body = jsonEncode(body);
      final streamed = await _client.send(request).timeout(const Duration(seconds: 20));
      final response = await http.Response.fromStream(streamed).timeout(const Duration(seconds: 20));

      // Express can answer conditional GETs with 304 when the stored representation is unchanged.
      if (isRead && response.statusCode == 304 && cached != null) {
        await _writeCacheIfChanged(cacheKey, cached.data, etag: response.headers['etag'] ?? cached.etag, previous: cached);
        return cached.data;
      }

      Map<String, dynamic> data = {};
      try {
        final decoded = jsonDecode(response.body);
        if (decoded is Map<String, dynamic>) data = decoded;
      } catch (_) {}

      if (response.statusCode < 200 || response.statusCode >= 300) {
        final code = data['error']?.toString();
        final message = switch (code) {
          'not_authenticated' || 'authentication_required' || 'invalid_token' => 'Your session expired. Sign in again.',
          'razorpay_not_configured' || 'razorpay_plan_not_configured' => 'Subscriptions are temporarily unavailable.',
          'subscription_already_active' => 'You already have this plan.',
          'username_change_cooldown' => 'Your username cannot be changed yet.',
          _ => data['error_description']?.toString() ?? code?.replaceAll('_', ' ') ?? 'Request failed (${response.statusCode}).',
        };
        throw ApiException(message, statusCode: response.statusCode, code: code);
      }

      if (isRead) {
        await _writeCacheIfChanged(cacheKey, data, etag: response.headers['etag'], previous: cached);
      } else {
        // Mutations must not leave a stale account, device, grant, or plan snapshot behind.
        await _clearResponseCache();
      }
      return data;
    } on ApiException catch (error) {
      // Never mask authentication/authorization failures with cached private data.
      if (cached != null && (error.statusCode ?? 0) >= 500) return cached.data;
      rethrow;
    } catch (_) {
      // Cache is an offline/temporary-network fallback only. Every online GET still
      // checks the server, and cached snapshots expire after seven days without verification.
      if (cached != null) return cached.data;
      rethrow;
    }
  }

  String _cacheKey(String path) => '$_cachePrefix${base64Url.encode(utf8.encode(path)).replaceAll('=', '')}';

  Future<_CachedApiResponse?> _readCache(String key) async {
    try {
      final raw = await _storage.read(key: key);
      if (raw == null || raw.length > _maxCacheBytes) return null;
      final value = jsonDecode(raw);
      if (value is! Map || value['_cacheVersion'] != 1 || value['data'] is! Map) return null;
      final verifiedAt = DateTime.tryParse(value['verifiedAt']?.toString() ?? '');
      if (verifiedAt == null || DateTime.now().toUtc().difference(verifiedAt.toUtc()) > _maxOfflineAge) return null;
      return _CachedApiResponse(
        data: Map<String, dynamic>.from(value['data'] as Map),
        etag: value['etag']?.toString(),
      );
    } catch (_) {
      return null;
    }
  }

  Future<void> _writeCacheIfChanged(String key, Map<String, dynamic> data, {String? etag, _CachedApiResponse? previous}) async {
    try {
      final unchanged = previous != null && _canonicalJson(previous.data) == _canonicalJson(data);
      final payload = <String, dynamic>{
        '_cacheVersion': 1,
        'verifiedAt': DateTime.now().toUtc().toIso8601String(),
        'etag': etag ?? previous?.etag,
        'data': unchanged ? previous.data : data,
      };
      final encoded = jsonEncode(payload);
      if (encoded.length > _maxCacheBytes) return;
      await _storage.write(key: key, value: encoded);
    } catch (_) {
      // A cache write failure must never make a successful server request fail.
    }
  }

  String _canonicalJson(dynamic value) => jsonEncode(_normalize(value));

  dynamic _normalize(dynamic value) {
    if (value is Map) {
      final keys = value.keys.map((key) => key.toString()).toList()..sort();
      return <String, dynamic>{for (final key in keys) key: _normalize(value[key])};
    }
    if (value is List) return value.map(_normalize).toList();
    return value;
  }

  Future<void> _clearResponseCache() async {
    try {
      final values = await _storage.readAll();
      for (final key in values.keys.where((key) => key.startsWith(_cachePrefix))) {
        await _storage.delete(key: key);
      }
    } catch (_) {}
  }

  /// The server currently serializes account activity under the singular `log` key.
  /// Accept `logs` as a compatibility alias for older deployments.
  static List<dynamic> activityLogs(Map<String, dynamic> response) {
    final value = response['log'] ?? response['logs'];
    return value is List ? value : const <dynamic>[];
  }

  Future<Map<String, dynamic>> account() => request('GET', '/api/account');
  Future<Map<String, dynamic>> updateAccount(Map<String, dynamic> values) => request('POST', '/api/account', body: values);
  Future<Map<String, dynamic>> devices() => request('GET', '/api/account/devices');
  Future<Map<String, dynamic>> logs() => request('GET', '/api/account/logs');
  Future<Map<String, dynamic>> connectedApps() => request('GET', '/api/account/connected-apps');
  Future<Map<String, dynamic>> revokeApp(String grantId) => request('DELETE', '/api/account/connected-apps/${Uri.encodeComponent(grantId)}');
  Future<Map<String, dynamic>> plans() => request('GET', '/api/subscription/plans');
  Future<Map<String, dynamic>> subscription() => request('GET', '/api/subscription');
  Future<Map<String, dynamic>> checkout(String planId) => request('POST', '/api/subscription/checkout', body: {'planId': planId});
}

class _CachedApiResponse {
  const _CachedApiResponse({required this.data, required this.etag});
  final Map<String, dynamic> data;
  final String? etag;
}

class ApiException implements Exception {
  const ApiException(this.message, {this.statusCode, this.code});
  final String message;
  final int? statusCode;
  final String? code;
  @override
  String toString() => message;
}
