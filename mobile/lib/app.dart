import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import 'core/auth_service.dart';
import 'core/ace_theme.dart';
import 'screens.dart';

class AceIdApp extends StatefulWidget {
  const AceIdApp({super.key});
  @override
  State<AceIdApp> createState() => _AceIdAppState();
}

class _AceIdAppState extends State<AceIdApp> {
  final _auth = OidcAuthService();
  static const _storage = FlutterSecureStorage();
  bool _loading = true;
  IdentityProfile? _profile;
  ThemeMode _themeMode = ThemeMode.light;

  Future<void> _toggleTheme() async {
    final nextMode = _themeMode == ThemeMode.dark ? ThemeMode.light : ThemeMode.dark;
    setState(() => _themeMode = nextMode);
    try {
      await _storage.write(
        key: 'ace_id_theme_mode',
        value: nextMode == ThemeMode.dark ? 'dark' : 'light',
      );
    } catch (_) {
      // Keep the in-memory toggle usable if secure storage is unavailable.
    }
  }

  @override
  void initState() {
    super.initState();
    _restoreSession();
  }

  Future<void> _restoreSession() async {
    try {
      final savedTheme = await _storage.read(key: 'ace_id_theme_mode');
      if (savedTheme == 'dark') _themeMode = ThemeMode.dark;
    } catch (_) {
      // Use the light default if reading preferences fails.
    }
    final profile = await _auth.restoreSession();
    if (!mounted) return;
    setState(() {
      _profile = profile;
      _loading = false;
    });
  }

  Future<void> _signIn() async {
    final profile = await _auth.signIn();
    if (mounted && profile != null) setState(() => _profile = profile);
  }

  Future<void> _signOut() async {
    await _auth.signOut();
    if (mounted) setState(() => _profile = null);
  }

  @override
  Widget build(BuildContext context) => MaterialApp(
    title: 'Ace ID',
    debugShowCheckedModeBanner: false,
    theme: AceTheme.light,
    darkTheme: AceTheme.dark,
    themeMode: _themeMode,
    home: _loading
        ? const Scaffold(
            body: Center(child: CircularProgressIndicator(strokeWidth: 2)),
          )
        : _profile == null
        ? SignInScreen(
            onSignIn: _signIn,
            isDark: _themeMode == ThemeMode.dark,
            onToggleTheme: _toggleTheme,
          )
        : HomeScreen(
            profile: _profile!,
            auth: _auth,
            onSignOut: _signOut,
            isDark: _themeMode == ThemeMode.dark,
            onToggleTheme: _toggleTheme,
          ),
  );
}
