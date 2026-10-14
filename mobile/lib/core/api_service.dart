import 'dart:convert';
import 'package:http/http.dart' as http;
import 'auth_service.dart';

class AceIdApi {
  AceIdApi(this.auth, {http.Client? client}) : _client = client ?? http.Client();
  final OidcAuthService auth;
  final http.Client _client;
  static const baseUrl = OidcAuthService.issuer;

  Future<Map<String, dynamic>> request(String method, String path, {Map<String, dynamic>? body}) async {
    final token = await auth.getAccessToken();
    if (token == null || token.isEmpty) throw const ApiException('Your session expired. Sign in again.');
    final uri = Uri.parse(baseUrl).resolve(path);
    final headers = <String, String>{
      'Accept': 'application/json',
      'Authorization': 'Bearer $token',
      'Cache-Control': 'no-store',
    };
    if (body != null) headers['Content-Type'] = 'application/json';
    final request = http.Request(method, uri)..headers.addAll(headers);
    if (body != null) request.body = jsonEncode(body);
    final streamed = await _client.send(request).timeout(const Duration(seconds: 20));
    final response = await http.Response.fromStream(streamed);
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
    return data;
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

class ApiException implements Exception {
  const ApiException(this.message, {this.statusCode, this.code});
  final String message;
  final int? statusCode;
  final String? code;
  @override
  String toString() => message;
}
