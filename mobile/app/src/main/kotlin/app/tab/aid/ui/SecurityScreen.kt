package app.tab.aid.ui

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import app.tab.aid.data.AceIdApi
import app.tab.aid.ui.components.AceIcons
import app.tab.aid.ui.components.DataTile
import app.tab.aid.ui.components.EmptyPanel
import app.tab.aid.ui.components.ErrorPanel
import app.tab.aid.ui.components.SectionHeading
import app.tab.aid.ui.theme.LocalAceColors
import app.tab.aid.ui.vm.SecurityViewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun SecurityScreen(api: AceIdApi, onOpenWeb: () -> Unit) {
    val colors = LocalAceColors.current
    val viewModel: SecurityViewModel = viewModel(
        factory = viewModelFactory { initializer { SecurityViewModel(api) } },
    )
    val state by viewModel.state.collectAsState()
    val recentActivity = state.logs.take(12)

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
                Text("Security", style = MaterialTheme.typography.displayMedium, color = colors.content)
            }
            item {
                Text(
                    text = "Your recent sessions and ID activity.",
                    style = MaterialTheme.typography.bodyLarge,
                    color = colors.muted,
                )
            }
            if (!state.error.isNullOrBlank()) {
                item { ErrorPanel(message = state.error!!, onRetry = viewModel::refresh) }
            }
            item {
                Spacer(Modifier.height(8.dp))
                SectionHeading("Signed-in devices", state.devices.size)
            }
            if (!state.loading && state.devices.isEmpty() && state.error == null) {
                item { EmptyPanel("No session details were returned.") }
            }
            items(state.devices.size) { index ->
                val device = state.devices[index]
                DataTile(
                    icon = AceIcons.Computer,
                    title = device.optString("device_name").ifBlank {
                        device.optString("browser").ifBlank {
                            device.optString("device_type").ifBlank { "Signed-in device" }
                        }
                    },
                    subtitle = device.optString("os").ifBlank { "Device" } +
                        " · " +
                        device.optString("location").ifBlank { "Location unavailable" },
                    trailing = Dates.short(
                        device.optString("last_seen_at").ifBlank { device.optString("created_at") },
                    ),
                )
            }
            item {
                Spacer(Modifier.height(10.dp))
                SectionHeading("Recent activity", state.logs.size)
            }
            if (!state.loading && state.logs.isEmpty() && state.error == null) {
                item { EmptyPanel("No recent activity was returned.") }
            }
            items(recentActivity.size) { index ->
                val entry = recentActivity[index]
                DataTile(
                    icon = AceIcons.History,
                    title = entry.optString("name").ifBlank {
                        entry.optString("event_type").ifBlank { "ID activity" }
                    },
                    subtitle = entry.optString("category").ifBlank { "id" } +
                        " · " +
                        entry.optString("browser").ifBlank { "Ace ID" },
                    trailing = Dates.short(entry.optString("created_at")),
                )
            }
            item {
                Spacer(Modifier.height(14.dp))
                OutlinedButton(
                    onClick = onOpenWeb,
                    modifier = Modifier.fillMaxWidth(),
                    shape = androidx.compose.foundation.shape.RoundedCornerShape(0.dp),
                ) {
                    Icon(AceIcons.Open, contentDescription = null)
                    Text("More security settings", color = colors.content)
                }
            }
        }
    }
}
