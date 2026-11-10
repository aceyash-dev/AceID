package app.tab.aid.ui.theme

import androidx.compose.foundation.isSystemInDarkTheme
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Typography
import androidx.compose.material3.darkColorScheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.ExperimentalTextApi
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontVariation
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.sp
import app.tab.aid.R

private val Paper = Color(0xFFF5F5F2)
private val Ink = Color(0xFF111111)
private val Line = Color(0xFFD1D1CC)
private val PanelLight = Color(0xFFFFFFFF)
private val MutedLight = Color(0xFF70706B)

private val NightBackground = Color(0xFF111111)
private val NightContent = Color(0xFFF5F5F1)
private val NightPanel = Color(0xFF1A1A1A)
private val NightLine = Color(0xFF3A3A3A)
private val NightMuted = Color(0xFFA8A8A2)

/**
 * The Ace ID palette is deliberately monochrome: paper, ink, and hairlines.
 * There is no accent colour, so a border and a panel are part of the contract
 * and live outside the Material colour scheme.
 */
@Immutable
data class AceColors(
    val background: Color,
    val panel: Color,
    val border: Color,
    val content: Color,
    val muted: Color,
)

private val LightAceColors = AceColors(
    background = Paper,
    panel = PanelLight,
    border = Line,
    content = Ink,
    muted = MutedLight,
)

private val DarkAceColors = AceColors(
    background = NightBackground,
    panel = NightPanel,
    border = NightLine,
    content = NightContent,
    muted = NightMuted,
)

val LocalAceColors = staticCompositionLocalOf { LightAceColors }

/**
 * The same faces the web client loads: Instrument Serif for display copy and
 * Satoshi (variable) for UI copy, converted from the files in public/fonts.
 */
private val DisplayFamily = FontFamily(Font(R.font.instrument_serif_regular, FontWeight.Normal))

@OptIn(ExperimentalTextApi::class)
private val UiFamily = FontFamily(
    listOf(
        FontWeight.W400,
        FontWeight.W500,
        FontWeight.W700,
        FontWeight.W800,
    ).map { weight ->
        Font(
            resId = R.font.satoshi_variable,
            weight = weight,
            variationSettings = FontVariation.Settings(FontVariation.weight(weight.weight)),
        )
    },
)

private val AceTypography = Typography(
    displayLarge = TextStyle(
        fontFamily = DisplayFamily,
        fontSize = 48.sp,
        lineHeight = 47.sp,
        letterSpacing = (-1.6).sp,
    ),
    displayMedium = TextStyle(
        fontFamily = DisplayFamily,
        fontSize = 38.sp,
        lineHeight = 39.sp,
        letterSpacing = (-1.1).sp,
    ),
    headlineLarge = TextStyle(
        fontFamily = DisplayFamily,
        fontSize = 30.sp,
        lineHeight = 32.sp,
        letterSpacing = (-0.6).sp,
    ),
    headlineMedium = TextStyle(
        fontFamily = DisplayFamily,
        fontSize = 25.sp,
        lineHeight = 28.sp,
        letterSpacing = (-0.35).sp,
    ),
    titleLarge = TextStyle(
        fontFamily = UiFamily,
        fontSize = 22.sp,
        fontWeight = FontWeight.W800,
        letterSpacing = (-0.4).sp,
    ),
    titleMedium = TextStyle(
        fontFamily = UiFamily,
        fontSize = 16.sp,
        fontWeight = FontWeight.W700,
    ),
    bodyLarge = TextStyle(fontFamily = UiFamily, fontSize = 16.sp, lineHeight = 25.sp),
    bodyMedium = TextStyle(fontFamily = UiFamily, fontSize = 14.sp, lineHeight = 21.sp),
    bodySmall = TextStyle(fontFamily = UiFamily, fontSize = 12.5.sp, lineHeight = 18.sp),
    labelLarge = TextStyle(
        fontFamily = UiFamily,
        fontSize = 14.sp,
        fontWeight = FontWeight.W800,
    ),
    labelSmall = TextStyle(
        fontFamily = UiFamily,
        fontSize = 11.sp,
        fontWeight = FontWeight.W700,
        letterSpacing = 0.45.sp,
    ),
)

@Composable
fun AceTheme(
    darkTheme: Boolean = isSystemInDarkTheme(),
    content: @Composable () -> Unit,
) {
    val ace = if (darkTheme) DarkAceColors else LightAceColors

    val scheme = if (darkTheme) {
        darkColorScheme(
            primary = ace.content,
            onPrimary = ace.background,
            background = ace.background,
            onBackground = ace.content,
            surface = ace.background,
            onSurface = ace.content,
            surfaceVariant = ace.panel,
            onSurfaceVariant = ace.muted,
            outline = ace.border,
            outlineVariant = ace.border,
            error = ace.content,
            onError = ace.background,
        )
    } else {
        lightColorScheme(
            primary = ace.content,
            onPrimary = ace.background,
            background = ace.background,
            onBackground = ace.content,
            surface = ace.background,
            onSurface = ace.content,
            surfaceVariant = ace.panel,
            onSurfaceVariant = ace.muted,
            outline = ace.border,
            outlineVariant = ace.border,
            error = ace.content,
            onError = ace.background,
        )
    }

    CompositionLocalProvider(LocalAceColors provides ace) {
        MaterialTheme(
            colorScheme = scheme,
            typography = AceTypography,
            content = content,
        )
    }
}
