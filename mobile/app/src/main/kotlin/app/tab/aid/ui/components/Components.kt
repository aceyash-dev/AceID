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
import androidx.compose.ui.graphics.vector.ImageVector
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
