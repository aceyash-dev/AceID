import 'package:flutter/material.dart';
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
  bool _loading = true;
  IdentityProfile? _profile;

  @override
  void initState() {
    super.initState();
    _restoreSession();
  }

  Future<void> _restoreSession() async {
    final profile = await _auth.restoreSession();
    if (!mounted) return;
    setState(() { _profile = profile; _loading = false; });
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
    themeMode: ThemeMode.system,
    home: _loading
      ? const Scaffold(body: Center(child: CircularProgressIndicator(strokeWidth: 2)))
      : _profile == null
        ? SignInScreen(onSignIn: _signIn)
        : HomeScreen(profile: _profile!, auth: _auth, onSignOut: _signOut),
  );
}
