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
import androidx.compose.foundation.layout.imePadding
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Button
import androidx.compose.material3.ButtonDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.OutlinedButton
import androidx.compose.material3.Text
import androidx.compose.material3.pulltorefresh.PullToRefreshBox
import androidx.compose.runtime.Composable
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import app.tab.aid.data.AceIdApi
import app.tab.aid.data.IdentityProfile
import app.tab.aid.ui.components.AceIcons
import app.tab.aid.ui.components.ActionTile
import app.tab.aid.ui.components.ErrorPanel
import app.tab.aid.ui.components.LabeledField
import app.tab.aid.ui.theme.LocalAceColors
import app.tab.aid.ui.vm.ProfileViewModel
import org.json.JSONObject

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun ProfileScreen(
    profile: IdentityProfile,
    api: AceIdApi,
    onOpenWeb: (String) -> Unit,
    onSignOut: () -> Unit,
    onMessage: (String) -> Unit,
) {
    val colors = LocalAceColors.current
    val viewModel: ProfileViewModel = viewModel(
        factory = viewModelFactory { initializer { ProfileViewModel(api) } },
    )
    val state by viewModel.state.collectAsState()
    var editing by remember { mutableStateOf(false) }

    val account = state.account
    val displayName = account?.optString("display_name")?.takeIf { it.isNotBlank() }
        ?: profile.name.takeIf { it.isNotBlank() }
        ?: "Ace ID member"
    val email = account?.optString("email")?.takeIf { it.isNotBlank() } ?: profile.email
    val username = account?.optString("username").orEmpty()

    if (editing) {
        EditProfileSheet(
            account = account,
            fallbackName = profile.name,
            fallbackEmail = profile.email,
            saving = state.saving,
            onDismiss = { editing = false },
            onSave = { values ->
                viewModel.save(values) { ok, message ->
                    if (ok) {
                        editing = false
                        onMessage("Your ID was updated.")
                    } else {
                        onMessage(message ?: "Could not save your changes.")
                    }
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
                Text("Your ID", style = MaterialTheme.typography.displayMedium, color = colors.content)
            }
            item {
                Text(
                    text = "Personal details and preferences.",
                    style = MaterialTheme.typography.bodyLarge,
                    color = colors.muted,
                )
            }
            if (!state.error.isNullOrBlank()) {
                item { ErrorPanel(message = state.error!!, onRetry = viewModel::refresh) }
            }
            item {
                Spacer(Modifier.height(8.dp))
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
                                .size(60.dp)
                                .background(colors.content)
                                .border(1.dp, colors.content),
                            contentAlignment = Alignment.Center,
                        ) {
                            Text(
                                text = displayName.trim().firstOrNull()?.uppercaseChar()?.toString() ?: "A",
                                fontFamily = FontFamily.Serif,
                                style = MaterialTheme.typography.headlineLarge,
                                color = colors.background,
                            )
                        }
                        Spacer(Modifier.width(14.dp))
                        Column(Modifier.weight(1f)) {
                            Text(displayName, style = MaterialTheme.typography.titleLarge, color = colors.content)
                            Text(email, style = MaterialTheme.typography.bodySmall, color = colors.muted)
                            Text(
                                text = "@" + username.ifBlank { "…" },
                                style = MaterialTheme.typography.bodySmall,
                                color = colors.content,
                            )
                        }
                    }
                    Spacer(Modifier.height(18.dp))
                    OutlinedButton(
                        onClick = { editing = true },
                        enabled = !state.loading,
                        modifier = Modifier.fillMaxWidth(),
                        shape = androidx.compose.foundation.shape.RoundedCornerShape(0.dp),
                    ) {
                        Icon(AceIcons.Edit, contentDescription = null, modifier = Modifier.size(18.dp))
                        Text("  Edit profile", color = colors.content)
                    }
                }
            }
            item {
                Spacer(Modifier.height(6.dp))
                ActionTile(
                    icon = AceIcons.Lock,
                    title = "Password & sign-in",
                    subtitle = "Change password and recovery options",
                    onClick = { onOpenWeb("/account/security") },
                )
            }
            item {
                ActionTile(
                    icon = AceIcons.Computer,
                    title = "Sessions & trusted devices",
                    subtitle = "Review and sign out devices",
                    onClick = { onOpenWeb("/account/devices") },
                )
            }
            item {
                ActionTile(
                    icon = AceIcons.Shield,
                    title = "Passkeys & two-factor authentication",
                    subtitle = "Manage stronger sign-in methods",
                    onClick = { onOpenWeb("/account/security") },
                )
            }
            item {
                ActionTile(
                    icon = AceIcons.Delete,
                    title = "Delete your ID",
                    subtitle = "Permanently remove your Ace ID",
                    danger = true,
                    onClick = { onOpenWeb("/account/danger") },
                )
            }
            item {
                Spacer(Modifier.height(10.dp))
                OutlinedButton(
                    onClick = onSignOut,
                    modifier = Modifier.fillMaxWidth(),
                    shape = androidx.compose.foundation.shape.RoundedCornerShape(0.dp),
                ) {
                    Icon(AceIcons.Logout, contentDescription = null, modifier = Modifier.size(18.dp))
                    Text("  Sign out", color = colors.content)
                }
            }
            item {
                Spacer(Modifier.height(6.dp))
                Text(
                    text = "Sensitive security changes open in the secure Ace ID site " +
                        "and may require you to sign in again.",
                    style = MaterialTheme.typography.bodySmall,
                    color = colors.muted,
                )
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
private fun EditProfileSheet(
    account: JSONObject?,
    fallbackName: String,
    fallbackEmail: String,
    saving: Boolean,
    onDismiss: () -> Unit,
    onSave: (JSONObject) -> Unit,
) {
    val colors = LocalAceColors.current
    var displayName by remember { mutableStateOf(account?.optString("display_name") ?: fallbackName) }
    var username by remember { mutableStateOf(account?.optString("username").orEmpty()) }
    var email by remember { mutableStateOf(account?.optString("email") ?: fallbackEmail) }
    var avatarUrl by remember { mutableStateOf(account?.optString("avatar_url").orEmpty()) }

    ModalBottomSheet(onDismissRequest = onDismiss) {
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .imePadding()
                .verticalScroll(rememberScrollState())
                .padding(start = 20.dp, end = 20.dp, bottom = 24.dp),
        ) {
            Text("Edit your ID", style = MaterialTheme.typography.headlineLarge, color = colors.content)
            Spacer(Modifier.height(20.dp))
            LabeledField("Display name", displayName, { displayName = it })
            Spacer(Modifier.height(14.dp))
            LabeledField("Username", username, { username = it }, prefix = "@")
            Spacer(Modifier.height(14.dp))
            LabeledField("Email", email, { email = it }, keyboardType = KeyboardType.Email)
            Spacer(Modifier.height(14.dp))
            LabeledField("Avatar URL", avatarUrl, { avatarUrl = it }, keyboardType = KeyboardType.Uri)
            Spacer(Modifier.height(20.dp))
            Button(
                onClick = {
                    onSave(
                        JSONObject()
                            .put("displayName", displayName.trim())
                            .put("username", username.trim())
                            .put("email", email.trim())
                            .put("avatarUrl", avatarUrl.trim()),
                    )
                },
                enabled = !saving,
                modifier = Modifier.fillMaxWidth(),
                shape = androidx.compose.foundation.shape.RoundedCornerShape(0.dp),
                colors = ButtonDefaults.buttonColors(
                    containerColor = colors.content,
                    contentColor = colors.background,
                ),
            ) {
                Text("Save changes", style = MaterialTheme.typography.labelLarge)
            }
        }
    }
}
