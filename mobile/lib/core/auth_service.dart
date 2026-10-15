import 'dart:convert';
import 'package:flutter_appauth/flutter_appauth.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

class IdentityProfile {
  const IdentityProfile({required this.subject, required this.name, required this.email, required this.expiresAt});
  final String subject;
  final String name;
  final String email;
  final DateTime expiresAt;
}

class OidcAuthService {
  OidcAuthService({FlutterAppAuth? appAuth, FlutterSecureStorage? storage})
      : _appAuth = appAuth ?? FlutterAppAuth(),
        _storage = storage ?? const FlutterSecureStorage();

  static const issuer = String.fromEnvironment('ACEID_ISSUER', defaultValue: 'https://identity.ace-base.cc');
  static const clientId = String.fromEnvironment('ACEID_MOBILE_CLIENT_ID');
  static const redirectUrl = String.fromEnvironment('ACEID_MOBILE_REDIRECT_URI', defaultValue: 'app.tab.aid:/oauth2redirect');
  static const _tokenKey = 'aceid.access_token';
  static const _refreshKey = 'aceid.refresh_token';
  static const _profileKey = 'aceid.profile';
  static const _expiryKey = 'aceid.expires_at';
  static const _idTokenKey = 'aceid.id_token';
  final FlutterAppAuth _appAuth;
  final FlutterSecureStorage _storage;

  Future<IdentityProfile?> restoreSession() async {
    try {
      final token = await getAccessToken();
      if (token == null) {
        await _clearLocalSession();
        return null;
      }
      final raw = await _storage.read(key: _profileKey);
      final expiryRaw = await _storage.read(key: _expiryKey);
      if (raw == null || expiryRaw == null) {
        await _clearLocalSession();
        return null;
      }
      final expiry = DateTime.tryParse(expiryRaw);
      if (expiry == null || !expiry.isAfter(DateTime.now())) {
        await _clearLocalSession();
        return null;
      }
      final claims = jsonDecode(raw) as Map<String, dynamic>;
      return _profileFromClaims(claims, expiry);
    } catch (_) {
      try { await _clearLocalSession(); } catch (_) {}
      return null;
    }
  }

  Future<String?> getAccessToken() async {
    var token = await _storage.read(key: _tokenKey);
    final expiryRaw = await _storage.read(key: _expiryKey);
    final expiry = expiryRaw == null ? null : DateTime.tryParse(expiryRaw);
    if (token != null && expiry != null && expiry.isAfter(DateTime.now().add(const Duration(seconds: 60)))) return token;
    final refresh = await _storage.read(key: _refreshKey);
    if (refresh == null || clientId.isEmpty) return null;
    try {
      final response = await _appAuth.token(TokenRequest(clientId, redirectUrl, issuer: issuer, refreshToken: refresh, scopes: const ['openid', 'profile', 'email', 'offline_access']));
      token = response.accessToken;
      if (token == null || token.isEmpty) {
        return null;
      }
      await _storage.write(key: _tokenKey, value: token);
      final refreshedToken = response.refreshToken;
      if (refreshedToken != null) {
        await _storage.write(key: _refreshKey, value: refreshedToken);
      }
      final nextExpiry = response.accessTokenExpirationDateTime ?? DateTime.now().add(const Duration(minutes: 5));
      await _storage.write(key: _expiryKey, value: nextExpiry.toIso8601String());
      final idToken = response.idToken;
      if (idToken != null) {
        await _storage.write(key: _idTokenKey, value: idToken);
        await _storage.write(key: _profileKey, value: jsonEncode(_decodeClaims(idToken)));
      }
      return token;
    } catch (_) {
      await _clearLocalSession();
      return null;
    }
  }

  Future<IdentityProfile?> signIn() async {
    if (clientId.trim().isEmpty) {
      throw const AuthConfigurationException('Native sign-in needs the Ace ID mobile client ID. Use web sign-in until it is registered.');
    }
    final response = await _appAuth.authorizeAndExchangeCode(AuthorizationTokenRequest(
      clientId, redirectUrl, issuer: issuer,
      scopes: const ['openid', 'profile', 'email', 'offline_access'],
    ));
    final token = response.accessToken;
    if (token == null || token.isEmpty) {
      return null;
    }
    final idToken = response.idToken;
    final claims = idToken == null ? <String, dynamic>{} : _decodeClaims(idToken);
    final expiry = response.accessTokenExpirationDateTime ?? DateTime.now().add(const Duration(minutes: 5));
    await _storage.write(key: _tokenKey, value: token);
    final refreshToken = response.refreshToken;
    if (refreshToken != null) {
      await _storage.write(key: _refreshKey, value: refreshToken);
    }
    if (idToken != null) {
      await _storage.write(key: _idTokenKey, value: idToken);
    } else {
      await _storage.delete(key: _idTokenKey);
    }
    await _storage.write(key: _profileKey, value: jsonEncode(claims));
    await _storage.write(key: _expiryKey, value: expiry.toIso8601String());
    return _profileFromClaims(claims, expiry);
  }

  IdentityProfile _profileFromClaims(Map<String, dynamic> claims, DateTime expiry) => IdentityProfile(
    subject: claims['sub'] as String? ?? '',
    name: claims['name'] as String? ?? claims['preferred_username'] as String? ?? 'Ace ID member',
    email: claims['email'] as String? ?? '',
    expiresAt: expiry,
  );

  Map<String, dynamic> _decodeClaims(String token) {
    final parts = token.split('.');
    if (parts.length != 3) return <String, dynamic>{};
    return jsonDecode(utf8.decode(base64Url.decode(base64Url.normalize(parts[1])))) as Map<String, dynamic>;
  }

  Future<void> _clearLocalSession() async {
    await _storage.delete(key: _tokenKey);
    await _storage.delete(key: _refreshKey);
    await _storage.delete(key: _profileKey);
    await _storage.delete(key: _expiryKey);
    await _storage.delete(key: _idTokenKey);
    // Private account snapshots must never survive sign-out or an invalid session.
    try {
      final stored = await _storage.readAll();
      for (final key in stored.keys.where((key) => key.startsWith('aceid.cache.'))) {
        await _storage.delete(key: key);
      }
    } catch (_) {
      // A cache cleanup issue must not prevent the user from signing out locally.
    }
  }

  Future<void> signOut() async {
    try {
      final idToken = await _storage.read(key: _idTokenKey);
      if (clientId.trim().isNotEmpty && idToken != null && idToken.isNotEmpty) {
        await _appAuth.endSession(EndSessionRequest(
          idTokenHint: idToken,
          postLogoutRedirectUrl: redirectUrl,
          issuer: issuer,
        ));
      }
    } catch (_) {
      // Local sign-out must still complete if the provider is unreachable or
      // the browser logout flow is cancelled.
    } finally {
      await _clearLocalSession();
    }
  }
}

class AuthConfigurationException implements Exception {
  const AuthConfigurationException(this.message);
  final String message;
  @override
  String toString() => message;
}
