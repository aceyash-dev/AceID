package app.tab.aid.ui

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.outlined.Link
import androidx.compose.material.icons.outlined.Person
import androidx.compose.material.icons.outlined.Shield
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import app.tab.aid.data.AceIdApi
import app.tab.aid.data.IdentityProfile
import app.tab.aid.ui.components.ActionTile
import app.tab.aid.ui.components.ErrorPanel
import app.tab.aid.ui.components.InfoRow
import app.tab.aid.ui.theme.LocalAceColors
import app.tab.aid.ui.vm.OverviewViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun OverviewScreen(
    profile: IdentityProfile,
    api: AceIdApi,
    onOpenId: () -> Unit,
    onOpenSecurity: () -> Unit,
    onOpenConnected: () -> Unit,
) {
    val colors = LocalAceColors.current
    val viewModel: OverviewViewModel = viewModel(
        factory = viewModelFactory { initializer { OverviewViewModel(api) } },
    )
    val state by viewModel.state.collectAsState()

    val account = state.account
    val name = account?.optString("display_name")?.takeIf { it.isNotBlank() }
        ?: profile.name.takeIf { it.isNotBlank() }
        ?: "Ace ID member"
    val email = account?.optString("email")?.takeIf { it.isNotBlank() } ?: profile.email
    val username = account?.optString("username")?.takeIf { it.isNotBlank() }
    val verified = account?.optBoolean("email_verified", true) ?: true

    PullToRefreshBox(
        isRefreshing = state.refreshing,
        onRefresh = viewModel::refresh,
        modifier = Modifier.fillMaxSize(),
    ) {
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(start = 20.dp, end = 20.dp, top = 22.dp, bottom = 28.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp),
        ) {
            item {
                Text(
                    text = "YOUR ID",
                    style = MaterialTheme.typography.labelSmall,
                    color = colors.content,
                )
            }
            item {
                Text(
                    text = "Good to have you here.",
                    style = MaterialTheme.typography.displayMedium,
                    color = colors.content,
                )
            }
            item {
                Text(
                    text = "Your identity, all in one place.",
                    style = MaterialTheme.typography.bodyLarge,
                    color = colors.muted,
                )
            }
            if (!state.error.isNullOrBlank()) {
                item {
                    ErrorPanel(message = state.error!!, onRetry = viewModel::refresh)
                }
            }
            item {
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(colors.panel)
                        .border(1.dp, colors.border)
                        .padding(18.dp),
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(52.dp)
                                .background(colors.content)
                                .border(1.dp, colors.content),
                            contentAlignment = Alignment.Center,
                        ) {
                            Text(
                                text = name.trim().firstOrNull()?.uppercaseChar()?.toString() ?: "A",
                                fontFamily = FontFamily.Serif,
                                style = MaterialTheme.typography.headlineMedium,
                                color = colors.background,
                            )
                        }
                        Spacer(Modifier.width(14.dp))
                        Column(Modifier.weight(1f)) {
                            Text(
                                text = name,
                                style = MaterialTheme.typography.titleLarge,
                                color = colors.content,
                            )
                            Text(
                                text = email,
                                style = MaterialTheme.typography.bodySmall,
                                color = colors.muted,
                            )
                            if (!verified) {
                                Text(
                                    text = "Email not verified",
                                    style = MaterialTheme.typography.labelSmall,
                                    color = colors.content,
                                )
                            }
                        }
                        Icon(
                            imageVector = Icons.Outlined.Shield,
                            contentDescription = null,
                            tint = colors.content,
                            modifier = Modifier.size(22.dp),
                        )
                    }
                    Spacer(Modifier.height(18.dp))
                    HorizontalDivider(color = colors.border)
                    Spacer(Modifier.height(14.dp))
                    InfoRow(label = "Username", value = "@" + (username ?: "…"))
                    Spacer(Modifier.height(16.dp))
                    Button(
                        onClick = onOpenId,
                        modifier = Modifier.fillMaxWidth(),
                        shape = androidx.compose.foundation.shape.RoundedCornerShape(0.dp),
                        colors = ButtonDefaults.buttonColors(
                            containerColor = colors.content,
                            contentColor = colors.background,
                        ),
                    ) {
                        Icon(Icons.Outlined.Person, contentDescription = null, modifier = Modifier.size(18.dp))
                        Spacer(Modifier.width(8.dp))
                        Text("Manage ID", style = MaterialTheme.typography.labelLarge)
                    }
                }
            }
            item {
                ActionTile(
                    icon = Icons.Outlined.Shield,
                    title = "Security & devices",
                    subtitle = "Review sessions and ID protection",
                    onClick = onOpenSecurity,
                )
            }
            item {
                ActionTile(
                    icon = Icons.Outlined.Link,
                    title = "Connected apps",
                    subtitle = "Review and revoke app access",
                    onClick = onOpenConnected,
                )
            }
            item {
                Text(
                    text = "Pull down to refresh your ID details.",
                    style = MaterialTheme.typography.bodySmall,
                    color = colors.muted,
                )
            }
        }
    }
}
