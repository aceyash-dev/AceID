import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

class AceTheme {
  AceTheme._();
  static const milk = Color(0xFFF5F5F2);
  static const ink = Color(0xFF111111);
  static const line = Color(0xFFD1D1CC);
  static const accent = Color(0xFF111111);
  static const danger = Color(0xFF555555);

  static ThemeData get light => _build(Brightness.light);
  static ThemeData get dark => _build(Brightness.dark);

  static ThemeData _build(Brightness brightness) {
    final dark = brightness == Brightness.dark;
    final bg = dark ? const Color(0xFF151513) : milk;
    final fg = dark ? milk : ink;
    final panel = dark ? const Color(0xFF20201D) : Colors.white;
    final border = dark ? const Color(0xFF41413B) : line;
    final scheme = ColorScheme.fromSeed(
      seedColor: accent, brightness: brightness,
      primary: dark ? const Color(0xFFF5F5F2) : accent,
      onPrimary: dark ? ink : Colors.white,
      surface: bg, onSurface: fg, error: danger,
    );
    final text = GoogleFonts.manropeTextTheme(
      ThemeData(brightness: brightness, colorScheme: scheme).textTheme,
    ).apply(bodyColor: fg, displayColor: fg);
    return ThemeData(
      useMaterial3: true, brightness: brightness, colorScheme: scheme,
      scaffoldBackgroundColor: bg,
      textTheme: text.copyWith(
        displayLarge: GoogleFonts.instrumentSerif(fontSize: 48, height: .98, letterSpacing: -1.6, color: fg),
        displayMedium: GoogleFonts.instrumentSerif(fontSize: 38, height: 1.02, letterSpacing: -1.1, color: fg),
        headlineLarge: GoogleFonts.instrumentSerif(fontSize: 30, height: 1.08, letterSpacing: -.6, color: fg),
        headlineMedium: GoogleFonts.instrumentSerif(fontSize: 25, height: 1.12, letterSpacing: -.35, color: fg),
        titleLarge: text.titleLarge?.copyWith(fontWeight: FontWeight.w800, letterSpacing: -.4),
        bodyMedium: text.bodyMedium?.copyWith(height: 1.5),
      ),
      appBarTheme: AppBarTheme(
        backgroundColor: bg, foregroundColor: fg, surfaceTintColor: Colors.transparent,
        elevation: 0, scrolledUnderElevation: 0,
        titleTextStyle: text.titleLarge?.copyWith(color: fg, fontWeight: FontWeight.w800),
      ),
      cardTheme: CardThemeData(
        color: panel, elevation: 0, margin: EdgeInsets.zero,
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(2), side: BorderSide(color: border)),
      ),
      dividerTheme: DividerThemeData(color: border, thickness: 1, space: 1),
      filledButtonTheme: FilledButtonThemeData(style: FilledButton.styleFrom(
        minimumSize: const Size.fromHeight(52),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(2)),
        textStyle: text.labelLarge?.copyWith(fontWeight: FontWeight.w800),
      )),
      outlinedButtonTheme: OutlinedButtonThemeData(style: OutlinedButton.styleFrom(
        minimumSize: const Size.fromHeight(48),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(2)),
        side: BorderSide(color: border),
      )),
      navigationBarTheme: NavigationBarThemeData(
        backgroundColor: panel,
        indicatorColor: dark ? const Color(0xFF41413B) : const Color(0xFFE5E5E0),
        labelTextStyle: WidgetStatePropertyAll(text.labelSmall?.copyWith(fontWeight: FontWeight.w700)),
      ),
    );
  }
}
