package app.tab.aid.ui

import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.DarkMode
import androidx.compose.material.icons.outlined.LightMode
import androidx.compose.material.icons.automirrored.outlined.OpenInNew
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material.icons.outlined.Shield
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.platform.LocalUriHandler
import androidx.compose.ui.unit.dp
import app.tab.aid.auth.AceIdConfig
import app.tab.aid.ui.components.Brand
import app.tab.aid.ui.theme.LocalAceColors

@Composable
fun SignInScreen(
    signingIn: Boolean,
    error: String?,
    darkTheme: Boolean,
    onToggleTheme: () -> Unit,
    onSignIn: () -> Unit,
) {
    val colors = LocalAceColors.current
    val uriHandler = LocalUriHandler.current
    val config = AceIdConfig.fromBuild

    Column(
        modifier = Modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(start = 24.dp, end = 24.dp, top = 24.dp, bottom = 28.dp),
    ) {
        Row(verticalAlignment = Alignment.CenterVertically) {
            Brand(Modifier.weight(1f))
            IconButton(onClick = onToggleTheme) {
                Icon(
                    imageVector = if (darkTheme) Icons.Outlined.LightMode else Icons.Outlined.DarkMode,
                    contentDescription = if (darkTheme) "Switch to light mode" else "Switch to dark mode",
                    tint = colors.content,
                )
            }
        }

        Spacer(Modifier.height(56.dp))

        Text(
            text = "Your identity,\nyour way.",
            style = MaterialTheme.typography.displayLarge,
            color = colors.content,
        )
        Spacer(Modifier.height(18.dp))
        Text(
            text = "One ID for the services you use. Sign in to manage your profile and security.",
            style = MaterialTheme.typography.bodyLarge,
            color = colors.muted,
        )

        Spacer(Modifier.height(30.dp))

        Column(
            modifier = Modifier
                .fillMaxWidth()
                .border(1.dp, colors.border)
                .padding(18.dp),
        ) {
            Text(
                text = "YOUR ID",
                style = MaterialTheme.typography.labelSmall,
                color = colors.content,
            )
            Spacer(Modifier.height(18.dp))
            SignInFeature(Icons.Outlined.Person, "Profile and ID details")
            Spacer(Modifier.height(16.dp))
            SignInFeature(Icons.Outlined.Shield, "Security and signed-in devices")
        }

        Spacer(Modifier.height(22.dp))

        Button(
            onClick = onSignIn,
            enabled = !signingIn,
            modifier = Modifier
                .fillMaxWidth()
                .height(52.dp),
            shape = androidx.compose.foundation.shape.RoundedCornerShape(0.dp),
            colors = ButtonDefaults.buttonColors(
                containerColor = colors.content,
                contentColor = colors.background,
                disabledContainerColor = colors.content.copy(alpha = 0.6f),
                disabledContentColor = colors.background,
            ),
        ) {
            if (signingIn) {
                CircularProgressIndicator(
                    modifier = Modifier.size(18.dp),
                    strokeWidth = 2.dp,
                    color = colors.background,
                )
            } else {
                Icon(Icons.AutoMirrored.Outlined.OpenInNew, contentDescription = null, modifier = Modifier.size(18.dp))
            }
            Spacer(Modifier.width(10.dp))
            Text(
                text = if (signingIn) "Connecting securely" else "Continue with Ace ID",
                style = MaterialTheme.typography.labelLarge,
            )
        }

        if (!error.isNullOrBlank()) {
            Spacer(Modifier.height(14.dp))
            Column(
                modifier = Modifier
                    .fillMaxWidth()
                    .border(1.dp, colors.border)
                    .padding(14.dp),
            ) {
                Text(error, style = MaterialTheme.typography.bodySmall, color = colors.content)
            }
        }

        Spacer(Modifier.height(34.dp))
        HorizontalDivider(color = colors.border)
        Spacer(Modifier.height(12.dp))
        Text(
            text = "ACE ID  ·  YOUR ID, IN ONE PLACE",
            style = MaterialTheme.typography.labelSmall,
            color = colors.muted,
        )
        Spacer(Modifier.height(8.dp))
        Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
            TextButton(onClick = { uriHandler.openUri(config.webUrl("/privacy")) }) {
                Text("Privacy", color = colors.content, style = MaterialTheme.typography.bodySmall)
            }
            TextButton(onClick = { uriHandler.openUri(config.webUrl("/terms")) }) {
                Text("Terms", color = colors.content, style = MaterialTheme.typography.bodySmall)
            }
        }
    }
}

@Composable
private fun SignInFeature(icon: ImageVector, label: String) {
    val colors = LocalAceColors.current
    Row(verticalAlignment = Alignment.CenterVertically) {
        Icon(icon, contentDescription = null, tint = colors.content, modifier = Modifier.size(20.dp))
        Spacer(Modifier.width(12.dp))
        Text(label, style = MaterialTheme.typography.bodyMedium, color = colors.content)
    }
}
