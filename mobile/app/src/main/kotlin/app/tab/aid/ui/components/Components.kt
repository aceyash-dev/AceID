package app.tab.aid.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedTextField
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.TextFieldDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.graphics.vector.PathBuilder
import androidx.compose.ui.graphics.vector.path
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import app.tab.aid.ui.theme.LocalAceColors

/** The Ace ID wordmark: a square ink mark and the product name. */
@Composable
fun Brand(modifier: Modifier = Modifier) {
    val colors = LocalAceColors.current
    Row(modifier = modifier, verticalAlignment = Alignment.CenterVertically) {
        Box(
            modifier = Modifier
                .size(28.dp)
                .background(colors.content)
                .border(1.dp, colors.content),
            contentAlignment = Alignment.Center,
        ) {
            Text(
                text = "A",
                fontFamily = FontFamily.Serif,
                fontSize = MaterialTheme.typography.titleLarge.fontSize,
                color = colors.background,
            )
        }
        Spacer(Modifier.width(10.dp))
        Text(
            text = "Ace ID",
            style = MaterialTheme.typography.titleLarge,
            color = colors.content,
        )
    }
}

@Composable
fun SectionHeading(title: String, count: Int? = null) {
    val colors = LocalAceColors.current
    Row(
        modifier = Modifier.fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween,
    ) {
        Text(title, style = MaterialTheme.typography.titleMedium, color = colors.content)
        if (count != null) {
            Text(
                text = count.toString(),
                style = MaterialTheme.typography.labelSmall,
                color = colors.muted,
            )
        }
    }
}

@Composable
fun InfoRow(label: String, value: String) {
    val colors = LocalAceColors.current
    Column {
        Text(
            text = label.uppercase(),
            style = MaterialTheme.typography.labelSmall,
            color = colors.muted,
        )
        Spacer(Modifier.height(3.dp))
        Text(value, style = MaterialTheme.typography.bodyMedium, color = colors.content)
    }
}

/** A bordered, tappable row that leads somewhere. */
@Composable
fun ActionTile(
    icon: ImageVector,
    title: String,
    subtitle: String? = null,
    trailing: String? = null,
    danger: Boolean = false,
    onClick: () -> Unit,
) {
    val colors = LocalAceColors.current
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(colors.panel)
            .border(1.dp, colors.border)
            .clickable(onClick = onClick)
            .padding(horizontal = 16.dp, vertical = 15.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Icon(
            imageVector = icon,
            contentDescription = null,
            tint = colors.content,
            modifier = Modifier.size(21.dp),
        )
        Spacer(Modifier.width(13.dp))
        Column(Modifier.weight(1f)) {
            Text(
                text = title,
                style = MaterialTheme.typography.titleMedium,
                fontWeight = if (danger) FontWeight.W800 else FontWeight.W700,
                color = colors.content,
            )
            if (!subtitle.isNullOrBlank()) {
                Spacer(Modifier.height(2.dp))
                Text(subtitle, style = MaterialTheme.typography.bodySmall, color = colors.muted)
            }
        }
        if (!trailing.isNullOrBlank()) {
            Spacer(Modifier.width(10.dp))
            Text(trailing, style = MaterialTheme.typography.labelLarge, color = colors.content)
        }
    }
}

/** A non-interactive row used in the device and activity lists. */
@Composable
fun DataTile(
    icon: ImageVector,
    title: String,
    subtitle: String,
    trailing: String? = null,
) {
    val colors = LocalAceColors.current
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .padding(vertical = 12.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Icon(icon, contentDescription = null, tint = colors.content, modifier = Modifier.size(20.dp))
        Spacer(Modifier.width(13.dp))
        Column(Modifier.weight(1f)) {
            Text(title, style = MaterialTheme.typography.bodyMedium, color = colors.content)
            if (subtitle.isNotBlank()) {
                Text(subtitle, style = MaterialTheme.typography.bodySmall, color = colors.muted)
            }
        }
        if (!trailing.isNullOrBlank()) {
            Spacer(Modifier.width(8.dp))
            Text(trailing, style = MaterialTheme.typography.bodySmall, color = colors.muted)
        }
    }
}

@Composable
fun ErrorPanel(message: String, onRetry: () -> Unit) {
    val colors = LocalAceColors.current
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .border(1.dp, colors.border)
            .padding(horizontal = 14.dp, vertical = 12.dp),
    ) {
        Text(message, style = MaterialTheme.typography.bodySmall, color = colors.content)
        TextButton(onClick = onRetry, contentPadding = androidx.compose.foundation.layout.PaddingValues(0.dp)) {
            Text("Try again", style = MaterialTheme.typography.labelLarge, color = colors.content)
        }
    }
}

@Composable
fun EmptyPanel(message: String) {
    val colors = LocalAceColors.current
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .border(1.dp, colors.border)
            .padding(18.dp),
    ) {
        Text(message, style = MaterialTheme.typography.bodySmall, color = colors.muted)
    }
}

/** A labelled input that matches the square, hairline field treatment. */
@Composable
fun LabeledField(
    label: String,
    value: String,
    onValueChange: (String) -> Unit,
    prefix: String? = null,
    keyboardType: KeyboardType = KeyboardType.Text,
    singleLine: Boolean = true,
) {
    val colors = LocalAceColors.current
    Column(Modifier.fillMaxWidth()) {
        Text(
            text = label.uppercase(),
            style = MaterialTheme.typography.labelSmall,
            color = colors.muted,
        )
        Spacer(Modifier.height(6.dp))
        OutlinedTextField(
            value = value,
            onValueChange = onValueChange,
            modifier = Modifier.fillMaxWidth(),
            singleLine = singleLine,
            shape = RoundedCornerShape(0.dp),
            textStyle = MaterialTheme.typography.bodyMedium,
            keyboardOptions = KeyboardOptions(keyboardType = keyboardType),
            prefix = prefix?.let { { Text(it, color = colors.muted) } },
            // Border colour comes from the theme outline (ace.border); the field
            // itself is a filled, square-cornered surface with no underline.
            colors = TextFieldDefaults.colors(
                focusedContainerColor = colors.panel,
                unfocusedContainerColor = colors.panel,
                disabledContainerColor = colors.panel,
                focusedTextColor = colors.content,
                unfocusedTextColor = colors.content,
                cursorColor = colors.content,
                focusedIndicatorColor = Color.Transparent,
                unfocusedIndicatorColor = Color.Transparent,
            ),
        )
    }
}


/** Shared Ace ID 24dp outline icon set. Geometry is local and theme-tinted by Icon(). */
object AceIcons {
    private fun icon(name: String, draw: ImageVector.Builder.() -> Unit): ImageVector =
        ImageVector.Builder(name, 24.dp, 24.dp, 24f, 24f).apply(draw).build()

    private fun ImageVector.Builder.line(block: PathBuilder.() -> Unit) {
        path(
            stroke = SolidColor(Color.Black),
            strokeLineWidth = 1.8f,
            strokeLineCap = StrokeCap.Square,
            strokeLineJoin = StrokeJoin.Miter,
            pathFillType = androidx.compose.ui.graphics.PathFillType.NonZero,
        ) { block() }
    }

    val Home = icon("AceHome") { line { moveTo(3.5f, 11.5f); lineTo(12f, 3.5f); lineTo(20.5f, 11.5f); lineTo(20.5f, 20.5f); lineTo(15f, 20.5f); lineTo(15f, 14f); lineTo(9f, 14f); lineTo(9f, 20.5f); lineTo(3.5f, 20.5f); close() } }
    val User = icon("AceUser") { line { moveTo(9f, 3f); lineTo(15f, 3f); lineTo(15f, 9f); lineTo(9f, 9f); close(); moveTo(4.5f, 20.5f); lineTo(4.5f, 17.5f); lineTo(7.5f, 14.5f); lineTo(16.5f, 14.5f); lineTo(19.5f, 17.5f); lineTo(19.5f, 20.5f); close() } }
    val Shield = icon("AceShield") { line { moveTo(12f, 2.5f); lineTo(19.5f, 6.7f); lineTo(19.5f, 15.3f); lineTo(12f, 21.5f); lineTo(4.5f, 15.3f); lineTo(4.5f, 6.7f); close(); moveTo(12f, 8.2f); cubicTo(14.4f, 8.2f, 14.4f, 11.8f, 12f, 11.8f); cubicTo(9.6f, 11.8f, 9.6f, 8.2f, 12f, 8.2f); moveTo(12f, 11.8f); lineTo(12f, 15f) } }
    val ShieldCheck = icon("AceShieldCheck") { line { moveTo(12f, 2.5f); lineTo(19.5f, 6.7f); lineTo(19.5f, 15.3f); lineTo(12f, 21.5f); lineTo(4.5f, 15.3f); lineTo(4.5f, 6.7f); close(); moveTo(8.5f, 12f); lineTo(11f, 14.5f); lineTo(15.5f, 9.5f) } }
    val Link = icon("AceLink") { line { moveTo(10.5f, 8f); lineTo(13f, 5.5f); lineTo(16.5f, 5.5f); lineTo(19f, 8f); lineTo(19f, 11.5f); lineTo(16.5f, 14f); moveTo(13.5f, 16f); lineTo(11f, 18.5f); lineTo(7.5f, 18.5f); lineTo(5f, 16f); lineTo(5f, 12.5f); lineTo(7.5f, 10f); moveTo(9.5f, 14.5f); lineTo(14.5f, 9.5f) } }
    val LinkOff = icon("AceLinkOff") { line { moveTo(13f, 6f); lineTo(14f, 5.5f); lineTo(16.5f, 5.5f); lineTo(19f, 8f); lineTo(19f, 11.5f); lineTo(17f, 13.5f); moveTo(11f, 18f); lineTo(10f, 18.5f); lineTo(7.5f, 18.5f); lineTo(5f, 16f); lineTo(5f, 12.5f); lineTo(7f, 10.5f); moveTo(8f, 3.5f); lineTo(9f, 6f); moveTo(3.5f, 8.5f); lineTo(6f, 8.5f); moveTo(16f, 20.5f); lineTo(15f, 18f); moveTo(20.5f, 15.5f); lineTo(18f, 15.5f); moveTo(3.5f, 3.5f); lineTo(20.5f, 20.5f) } }
    val Computer = icon("AceComputer") { line { moveTo(3f, 4.5f); lineTo(16f, 4.5f); lineTo(16f, 14.5f); lineTo(3f, 14.5f); close(); moveTo(7f, 19.5f); lineTo(12f, 19.5f); moveTo(9.5f, 14.5f); lineTo(9.5f, 19.5f); moveTo(14.5f, 8.5f); lineTo(21f, 8.5f); lineTo(21f, 19.5f); lineTo(14.5f, 19.5f); close() } }
    val Lock = icon("AceLock") { line { moveTo(5.5f, 10.5f); lineTo(18.5f, 10.5f); lineTo(18.5f, 20.5f); lineTo(5.5f, 20.5f); close(); moveTo(8.5f, 10.5f); lineTo(8.5f, 7f); lineTo(12f, 3.5f); lineTo(15.5f, 7f); lineTo(15.5f, 10.5f); moveTo(12f, 14f); lineTo(12f, 17f) } }
    val Edit = icon("AceEdit") { line { moveTo(4f, 16.5f); lineTo(16.5f, 4f); lineTo(20f, 7.5f); lineTo(7.5f, 20f); lineTo(4f, 20f); close(); moveTo(13.5f, 7f); lineTo(17f, 10.5f) } }
    val Delete = icon("AceDelete") { line { moveTo(3.5f, 6.5f); lineTo(20.5f, 6.5f); moveTo(9f, 6.5f); lineTo(9f, 3.5f); lineTo(15f, 3.5f); lineTo(15f, 6.5f); moveTo(6f, 6.5f); lineTo(6f, 21f); lineTo(18f, 21f); lineTo(18f, 6.5f); moveTo(10f, 10.5f); lineTo(10f, 16.5f); moveTo(14f, 10.5f); lineTo(14f, 16.5f) } }
    val History = icon("AceHistory") { line { moveTo(3.5f, 12f); lineTo(3.5f, 8f); lineTo(7.5f, 4f); lineTo(16.5f, 4f); lineTo(19.5f, 7f); moveTo(20.5f, 12f); lineTo(20.5f, 16f); lineTo(16.5f, 20f); lineTo(7.5f, 20f); lineTo(4.5f, 17f); moveTo(12f, 7.5f); lineTo(12f, 12f); lineTo(15f, 15f) } }
    val Open = icon("AceOpen") { line { moveTo(10.5f, 4f); lineTo(3.5f, 4f); lineTo(3.5f, 20.5f); lineTo(20f, 20.5f); lineTo(20f, 13.5f); moveTo(14f, 3.5f); lineTo(20.5f, 3.5f); lineTo(20.5f, 10f); moveTo(20.5f, 3.5f); lineTo(11f, 13f) } }
    val Sun = icon("AceSun") { line { moveTo(12f, 8f); cubicTo(17.3f, 8f, 17.3f, 16f, 12f, 16f); cubicTo(6.7f, 16f, 6.7f, 8f, 12f, 8f); moveTo(12f, 2.5f); lineTo(12f, 5.5f); moveTo(12f, 18.5f); lineTo(12f, 21.5f); moveTo(2.5f, 12f); lineTo(5.5f, 12f); moveTo(18.5f, 12f); lineTo(21.5f, 12f); moveTo(5.3f, 5.3f); lineTo(7.3f, 7.3f); moveTo(16.7f, 16.7f); lineTo(18.7f, 18.7f); moveTo(5.3f, 18.7f); lineTo(7.3f, 16.7f); moveTo(16.7f, 7.3f); lineTo(18.7f, 5.3f) } }
    val Moon = icon("AceMoon") { line { moveTo(20.5f, 14.5f); cubicTo(15.5f, 15.5f, 8.5f, 8.5f, 9.5f, 3.5f); cubicTo(4f, 4f, 2f, 10f, 5f, 15f); cubicTo(8f, 20f, 15f, 22f, 20.5f, 14.5f) } }
    val Logout = icon("AceLogout") { line { moveTo(13f, 3.5f); lineTo(3.5f, 3.5f); lineTo(3.5f, 20.5f); lineTo(13f, 20.5f); moveTo(9.5f, 12f); lineTo(20.5f, 12f); moveTo(16.5f, 8f); lineTo(20.5f, 12f); lineTo(16.5f, 16f) } }
    val Grid = icon("AceGrid") { line { moveTo(3.5f, 8f); lineTo(3.5f, 3.5f); lineTo(8f, 3.5f); moveTo(16f, 3.5f); lineTo(20.5f, 3.5f); lineTo(20.5f, 8f); moveTo(20.5f, 16f); lineTo(20.5f, 20.5f); lineTo(16f, 20.5f); moveTo(8f, 20.5f); lineTo(3.5f, 20.5f); lineTo(3.5f, 16f); moveTo(7.5f, 7.5f); lineTo(10.5f, 7.5f); lineTo(10.5f, 10.5f); lineTo(7.5f, 10.5f); close(); moveTo(13.5f, 7.5f); lineTo(16.5f, 7.5f); lineTo(16.5f, 10.5f); lineTo(13.5f, 10.5f); close(); moveTo(7.5f, 13.5f); lineTo(10.5f, 13.5f); lineTo(10.5f, 16.5f); lineTo(7.5f, 16.5f); close(); moveTo(13.5f, 13.5f); lineTo(16.5f, 13.5f); lineTo(16.5f, 16.5f); lineTo(13.5f, 16.5f); close() } }
}
