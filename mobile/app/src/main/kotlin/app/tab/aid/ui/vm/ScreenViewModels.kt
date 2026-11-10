package app.tab.aid.ui.vm

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import app.tab.aid.data.AceIdApi
import app.tab.aid.data.activityLogs
import app.tab.aid.data.optObjects
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch
import org.json.JSONObject

data class OverviewUiState(
    val loading: Boolean = true,
    val refreshing: Boolean = false,
    val account: JSONObject? = null,
    val error: String? = null,
)

class OverviewViewModel(private val api: AceIdApi) : ViewModel() {
    private val _state = MutableStateFlow(OverviewUiState())
    val state: StateFlow<OverviewUiState> = _state.asStateFlow()

    init {
        refresh()
    }

    fun refresh() {
        val current = _state.value
        _state.value = current.copy(
            loading = current.account == null,
            refreshing = current.account != null,
            error = null,
        )
        viewModelScope.launch {
            try {
                val account = api.account()
                _state.value = OverviewUiState(
                    loading = false,
                    refreshing = false,
                    account = account,
                    error = null,
                )
            } catch (error: Exception) {
                _state.value = _state.value.copy(
                    loading = false,
                    refreshing = false,
                    error = error.message ?: "Could not load your ID.",
                )
            }
        }
    }
}

data class SecurityUiState(
    val loading: Boolean = true,
    val refreshing: Boolean = false,
    val devices: List<JSONObject> = emptyList(),
    val logs: List<JSONObject> = emptyList(),
    val error: String? = null,
)

class SecurityViewModel(private val api: AceIdApi) : ViewModel() {
    private val _state = MutableStateFlow(SecurityUiState())
    val state: StateFlow<SecurityUiState> = _state.asStateFlow()

    init {
        refresh()
    }

    fun refresh() {
        _state.value = _state.value.copy(loading = true, refreshing = true, error = null)
        viewModelScope.launch {
            try {
                val devices = api.devices()
                val logs = api.logs()
                _state.value = SecurityUiState(
                    loading = false,
                    refreshing = false,
                    devices = devices.optObjects("devices"),
                    logs = activityLogs(logs),
                    error = null,
                )
            } catch (error: Exception) {
                _state.value = _state.value.copy(
                    loading = false,
                    refreshing = false,
                    error = error.message ?: "Could not load your security activity.",
                )
            }
        }
    }
}

data class ConnectedAppsUiState(
    val loading: Boolean = true,
    val refreshing: Boolean = false,
    val apps: List<JSONObject> = emptyList(),
    val error: String? = null,
    val revoking: Boolean = false,
)

class ConnectedAppsViewModel(private val api: AceIdApi) : ViewModel() {
    private val _state = MutableStateFlow(ConnectedAppsUiState())
    val state: StateFlow<ConnectedAppsUiState> = _state.asStateFlow()

    init {
        refresh()
    }

    fun refresh() {
        _state.value = _state.value.copy(loading = true, refreshing = true, error = null)
        viewModelScope.launch {
            try {
                val apps = api.connectedApps().optObjects("connectedApps")
                _state.value = ConnectedAppsUiState(
                    loading = false,
                    refreshing = false,
                    apps = apps,
                    error = null,
                )
            } catch (error: Exception) {
                _state.value = _state.value.copy(
                    loading = false,
                    refreshing = false,
                    error = error.message ?: "Could not load connected apps.",
                )
            }
        }
    }

    fun revoke(grantId: String, onResult: (String) -> Unit) {
        if (_state.value.revoking) return
        _state.value = _state.value.copy(revoking = true)
        viewModelScope.launch {
            try {
                api.revokeApp(grantId)
                onResult("App disconnected.")
                refresh()
            } catch (error: Exception) {
                onResult(error.message ?: "Could not disconnect that app.")
            } finally {
                _state.value = _state.value.copy(revoking = false)
            }
        }
    }
}

data class ProfileUiState(
    val loading: Boolean = true,
    val refreshing: Boolean = false,
    val account: JSONObject? = null,
    val error: String? = null,
    val saving: Boolean = false,
)

class ProfileViewModel(private val api: AceIdApi) : ViewModel() {
    private val _state = MutableStateFlow(ProfileUiState())
    val state: StateFlow<ProfileUiState> = _state.asStateFlow()

    init {
        refresh()
    }

    fun refresh() {
        val current = _state.value
        _state.value = current.copy(
            loading = current.account == null,
            refreshing = current.account != null,
            error = null,
        )
        viewModelScope.launch {
            try {
                val account = api.account()
                _state.value = ProfileUiState(
                    loading = false,
                    refreshing = false,
                    account = account,
                    error = null,
                )
            } catch (error: Exception) {
                _state.value = _state.value.copy(
                    loading = false,
                    refreshing = false,
                    error = error.message ?: "Could not load your ID.",
                )
            }
        }
    }

    fun save(values: JSONObject, onResult: (Boolean, String?) -> Unit) {
        if (_state.value.saving) return
        _state.value = _state.value.copy(saving = true)
        viewModelScope.launch {
            try {
                val account = api.updateAccount(values)
                _state.value = _state.value.copy(
                    saving = false,
                    account = if (account.length() > 0) account else _state.value.account,
                )
                onResult(true, null)
                refresh()
            } catch (error: Exception) {
                _state.value = _state.value.copy(saving = false)
                onResult(false, error.message ?: "Could not save your changes.")
            }
        }
    }
}
