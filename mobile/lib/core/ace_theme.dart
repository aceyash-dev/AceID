import 'package:flutter/material.dart';

class AceTheme {
  AceTheme._();

  static const paper = Color(0xFFF4F4F1);
  static const ink = Color(0xFF111111);
  static const line = Color(0xFFD5D5D0);
  static const danger = Color(0xFF4A4A4A);

  static ThemeData get light => _build(Brightness.light);
  static ThemeData get dark => _build(Brightness.dark);

  static ThemeData _build(Brightness brightness) {
    final dark = brightness == Brightness.dark;
    final background = dark ? const Color(0xFF111111) : paper;
    final foreground = dark ? const Color(0xFFF5F5F1) : ink;
    final panel = dark ? const Color(0xFF1A1A1A) : Colors.white;
    final border = dark ? const Color(0xFF3A3A3A) : line;
    final scheme = ColorScheme.fromSeed(seedColor: ink, brightness: brightness)
        .copyWith(
          primary: foreground,
          onPrimary: background,
          secondary: foreground,
          onSecondary: background,
          tertiary: foreground,
          onTertiary: background,
          surface: background,
          onSurface: foreground,
          error: foreground,
          onError: background,
          outline: border,
          outlineVariant: border,
          surfaceContainerHighest: panel,
        );
    final baseText = ThemeData(
      brightness: brightness,
      colorScheme: scheme,
      fontFamily: 'Satoshi',
    ).textTheme.apply(bodyColor: foreground, displayColor: foreground);
    final text = baseText
        .copyWith(
          displayLarge: const TextStyle(
            fontFamily: 'InstrumentSerif',
            fontSize: 48,
            height: .98,
            letterSpacing: -1.6,
          ),
          displayMedium: const TextStyle(
            fontFamily: 'InstrumentSerif',
            fontSize: 38,
            height: 1.02,
            letterSpacing: -1.1,
          ),
          headlineLarge: const TextStyle(
            fontFamily: 'InstrumentSerif',
            fontSize: 30,
            height: 1.08,
            letterSpacing: -.6,
          ),
          headlineMedium: const TextStyle(
            fontFamily: 'InstrumentSerif',
            fontSize: 25,
            height: 1.12,
            letterSpacing: -.35,
          ),
          titleLarge: baseText.titleLarge?.copyWith(
            fontWeight: FontWeight.w800,
            letterSpacing: -.4,
          ),
          titleMedium: baseText.titleMedium?.copyWith(
            fontWeight: FontWeight.w700,
          ),
          bodyMedium: baseText.bodyMedium?.copyWith(height: 1.5),
          bodyLarge: baseText.bodyLarge?.copyWith(height: 1.55),
          labelSmall: baseText.labelSmall?.copyWith(
            letterSpacing: .45,
            fontWeight: FontWeight.w700,
          ),
        )
        .apply(bodyColor: foreground, displayColor: foreground);

    return ThemeData(
      useMaterial3: true,
      brightness: brightness,
      colorScheme: scheme,
      fontFamily: 'Satoshi',
      scaffoldBackgroundColor: background,
      textTheme: text,
      visualDensity: VisualDensity.standard,
      splashFactory: InkRipple.splashFactory,
      appBarTheme: AppBarTheme(
        backgroundColor: background,
        foregroundColor: foreground,
        surfaceTintColor: Colors.transparent,
        elevation: 0,
        scrolledUnderElevation: 0,
        titleTextStyle: text.titleLarge?.copyWith(
          color: foreground,
          fontWeight: FontWeight.w800,
        ),
      ),
      cardTheme: CardThemeData(
        color: panel,
        elevation: 0,
        margin: EdgeInsets.zero,
        shape: RoundedRectangleBorder(side: BorderSide(color: border)),
      ),
      dividerTheme: DividerThemeData(color: border, thickness: 1, space: 1),
      iconTheme: IconThemeData(color: foreground, size: 22),
      filledButtonTheme: FilledButtonThemeData(
        style: FilledButton.styleFrom(
          minimumSize: const Size.fromHeight(52),
          backgroundColor: foreground,
          foregroundColor: background,
          shape: const RoundedRectangleBorder(),
          textStyle: text.labelLarge?.copyWith(fontWeight: FontWeight.w800),
        ),
      ),
      outlinedButtonTheme: OutlinedButtonThemeData(
        style: OutlinedButton.styleFrom(
          minimumSize: const Size.fromHeight(48),
          foregroundColor: foreground,
          shape: const RoundedRectangleBorder(),
          side: BorderSide(color: border),
        ),
      ),
      textButtonTheme: TextButtonThemeData(
        style: TextButton.styleFrom(
          foregroundColor: foreground,
          shape: const RoundedRectangleBorder(),
        ),
      ),
      inputDecorationTheme: InputDecorationTheme(
        filled: true,
        fillColor: panel,
        border: OutlineInputBorder(borderSide: BorderSide(color: border)),
        enabledBorder: OutlineInputBorder(
          borderSide: BorderSide(color: border),
        ),
        focusedBorder: OutlineInputBorder(
          borderSide: BorderSide(color: foreground, width: 1.5),
        ),
      ),
      snackBarTheme: SnackBarThemeData(
        backgroundColor: foreground,
        contentTextStyle: TextStyle(fontFamily: 'Satoshi', color: background),
        shape: const RoundedRectangleBorder(),
        behavior: SnackBarBehavior.floating,
      ),
      progressIndicatorTheme: ProgressIndicatorThemeData(color: foreground),
      bottomSheetTheme: const BottomSheetThemeData(
        shape: RoundedRectangleBorder(),
      ),
    );
  }
}
