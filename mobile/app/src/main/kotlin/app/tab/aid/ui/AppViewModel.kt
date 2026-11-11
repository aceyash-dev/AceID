package app.tab.aid.ui

import android.content.Intent
import androidx.lifecycle.ViewModel
import androidx.lifecycle.ViewModelStore
import androidx.lifecycle.ViewModelStoreOwner
import androidx.lifecycle.viewModelScope
import androidx.lifecycle.viewmodel.initializer
import androidx.lifecycle.viewmodel.viewModelFactory
import app.tab.aid.AppContainer
import app.tab.aid.data.AceIdApi
import app.tab.aid.data.IdentityProfile
import app.tab.aid.data.ThemeMode
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

sealed interface SessionState {
    data object Loading : SessionState
    data object SignedOut : SessionState
    data class SignedIn(val profile: IdentityProfile) : SessionState
}

/** Owns the screen ViewModels of one signed-in session, so none outlive sign-out. */
class SessionScope : ViewModelStoreOwner {
    override val viewModelStore = ViewModelStore()
}

/** Session, theme, and sign-in progress for the whole app. */
class AppViewModel(private val container: AppContainer) : ViewModel() {

    /** Screens reach the account API through the container the app owns. */
    val api: AceIdApi get() = container.api

    /** Replaced on sign-out; the old scope is cleared so account data cannot leak into the next session. */
    var screenScope = SessionScope()
        private set

    private val _session = MutableStateFlow<SessionState>(SessionState.Loading)
    val session: StateFlow<SessionState> = _session.asStateFlow()

    private val _signingIn = MutableStateFlow(false)
    val signingIn: StateFlow<Boolean> = _signingIn.asStateFlow()

    private val _signInError = MutableStateFlow<String?>(null)
    val signInError: StateFlow<String?> = _signInError.asStateFlow()

    private val _darkTheme = MutableStateFlow(container.sessionStore.themeMode() == ThemeMode.DARK)
    val darkTheme: StateFlow<Boolean> = _darkTheme.asStateFlow()

    init {
        viewModelScope.launch {
            val profile = container.authRepository.restore()
            _session.value = if (profile != null) SessionState.SignedIn(profile) else SessionState.SignedOut
        }
    }

    fun toggleTheme() {
        val next = !_darkTheme.value
        _darkTheme.value = next
        container.sessionStore.saveThemeMode(if (next) ThemeMode.DARK else ThemeMode.LIGHT)
    }

    fun onSignInStarted() {
        _signingIn.value = true
        _signInError.value = null
    }

    fun onSignInFailed(message: String) {
        _signingIn.value = false
        _signInError.value = message
    }

    /** Exchanges the authorization redirect for tokens, off the main thread. */
    fun completeSignIn(data: Intent?) {
        viewModelScope.launch {
            try {
                val profile = container.authRepository.completeSignIn(data)
                _signingIn.value = false
                _signInError.value = null
                _session.value = SessionState.SignedIn(profile)
            } catch (error: Exception) {
                onSignInFailed(
                    error.message ?: "Sign-in did not finish. Check your connection and try again.",
                )
            }
        }
    }

    fun signOut() {
        viewModelScope.launch {
            container.authRepository.signOut()
            _signingIn.value = false
            _signInError.value = null
            _session.value = SessionState.SignedOut
            screenScope.viewModelStore.clear()
            screenScope = SessionScope()
        }
    }

    companion object {
        fun factory(container: AppContainer) = viewModelFactory {
            initializer { AppViewModel(container) }
        }
    }
}
