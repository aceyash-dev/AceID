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
import androidx.compose.material.icons.outlined.GridView
import androidx.compose.material.icons.outlined.LinkOff
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import app.tab.aid.data.AceIdApi
import app.tab.aid.data.optStrings
import app.tab.aid.ui.components.EmptyPanel
import app.tab.aid.ui.components.ErrorPanel
import app.tab.aid.ui.theme.LocalAceColors
import app.tab.aid.ui.vm.ConnectedAppsViewModel
import org.json.JSONObject

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ConnectedAppsScreen(api: AceIdApi, onMessage: (String) -> Unit) {
    val colors = LocalAceColors.current
    val viewModel: ConnectedAppsViewModel = viewModel(
        factory = viewModelFactory { initializer { ConnectedAppsViewModel(api) } },
    )
    val state by viewModel.state.collectAsState()
    var pendingRevoke by remember { mutableStateOf<JSONObject?>(null) }

    val pending = pendingRevoke
    if (pending != null) {
        val clientName = pending.optString("clientName").ifBlank { "This app" }
        AlertDialog(
            onDismissRequest = { pendingRevoke = null },
            title = { Text("Disconnect this app?", style = MaterialTheme.typography.titleLarge) },
            text = {
                Text(
                    "$clientName will no longer be able to use this authorization.",
                    style = MaterialTheme.typography.bodyMedium,
                )
            },
            confirmButton = {
                Button(
                    onClick = {
                        val grantId = pending.optString("grantId")
                        pendingRevoke = null
                        if (grantId.isNotBlank()) {
                            viewModel.revoke(grantId) { message -> onMessage(message) }
                        } else {
                            onMessage("That app did not report a grant ID.")
                        }
                    },
                    shape = androidx.compose.foundation.shape.RoundedCornerShape(0.dp),
                    colors = ButtonDefaults.buttonColors(
                        containerColor = colors.content,
                        contentColor = colors.background,
                    ),
                ) {
                    Text("Disconnect")
                }
            },
            dismissButton = {
                TextButton(onClick = { pendingRevoke = null }) {
                    Text("Keep connected", color = colors.content)
                }
            },
        )
    }

    PullToRefreshBox(
        isRefreshing = state.refreshing,
        onRefresh = viewModel::refresh,
        modifier = Modifier.fillMaxSize(),
    ) {
        LazyColumn(
            modifier = Modifier.fillMaxSize(),
            contentPadding = PaddingValues(start = 20.dp, end = 20.dp, top = 24.dp, bottom = 28.dp),
            verticalArrangement = Arrangement.spacedBy(10.dp),
        ) {
            item {
                Text("Connected apps", style = MaterialTheme.typography.displayMedium, color = colors.content)
            }
            item {
                Text(
                    text = "Control which services can access your Ace ID.",
                    style = MaterialTheme.typography.bodyLarge,
                    color = colors.muted,
                )
            }
            if (!state.error.isNullOrBlank()) {
                item { ErrorPanel(message = state.error!!, onRetry = viewModel::refresh) }
            }
            if (!state.loading && state.apps.isEmpty() && state.error == null) {
                item {
                    EmptyPanel(
                        "No connected apps yet. When a service uses Ace ID, it will appear here.",
                    )
                }
            }
            items(state.apps.size) { index ->
                val app = state.apps[index]
                val scopes = app.optStrings("scopes")
                Column(
                    modifier = Modifier
                        .fillMaxWidth()
                        .background(colors.panel)
                        .border(1.dp, colors.border)
                        .padding(16.dp),
                ) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            modifier = Modifier
                                .size(42.dp)
                                .border(1.dp, colors.border),
                            contentAlignment = Alignment.Center,
                        ) {
                            Icon(
                                Icons.Outlined.GridView,
                                contentDescription = null,
                                tint = colors.content,
                                modifier = Modifier.size(22.dp),
                            )
                        }
                        Spacer(Modifier.width(12.dp))
                        Column(Modifier.weight(1f)) {
                            Text(
                                text = app.optString("clientName").ifBlank { "Connected app" },
                                style = MaterialTheme.typography.titleMedium,
                                color = colors.content,
                            )
                            Text(
                                text = app.optString("clientUri").ifBlank { app.optString("clientId") },
                                style = MaterialTheme.typography.bodySmall,
                                color = colors.muted,
                                maxLines = 1,
                                overflow = TextOverflow.Ellipsis,
                            )
                        }
                    }
                    Spacer(Modifier.height(12.dp))
                    Text(
                        text = "Access: " + scopes.joinToString(", "),
                        style = MaterialTheme.typography.bodySmall,
                        color = colors.content,
                    )
                    Spacer(Modifier.height(6.dp))
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.End,
                    ) {
                        TextButton(
                            onClick = { pendingRevoke = app },
                            enabled = !state.revoking,
                        ) {
                            Icon(
                                Icons.Outlined.LinkOff,
                                contentDescription = null,
                                modifier = Modifier.size(18.dp),
                                tint = colors.content,
                            )
                            Text("Disconnect", color = colors.content)
                        }
                    }
                }
            }
        }
    }
}
