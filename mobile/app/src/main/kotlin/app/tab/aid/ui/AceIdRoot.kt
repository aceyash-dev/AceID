package app.tab.aid.ui

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.size
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Surface
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.LocalViewModelStoreOwner
import app.tab.aid.ui.theme.AceTheme
import app.tab.aid.ui.theme.LocalAceColors

@Composable
fun AceIdRoot(viewModel: AppViewModel, onStartSignIn: () -> Unit) {
    val session by viewModel.session.collectAsState()
    val darkTheme by viewModel.darkTheme.collectAsState()
    val signingIn by viewModel.signingIn.collectAsState()
    val signInError by viewModel.signInError.collectAsState()

    AceTheme(darkTheme = darkTheme) {
        Surface(
            modifier = Modifier.fillMaxSize(),
            color = MaterialTheme.colorScheme.background,
        ) {
            when (val current = session) {
                SessionState.Loading -> LoadingScreen()

                SessionState.SignedOut -> SignInScreen(
                    signingIn = signingIn,
                    error = signInError,
                    darkTheme = darkTheme,
                    onToggleTheme = viewModel::toggleTheme,
                    onSignIn = onStartSignIn,
                )

                is SessionState.SignedIn -> CompositionLocalProvider(
                    LocalViewModelStoreOwner provides viewModel.screenScope,
                ) {
                    HomeScreen(
                        profile = current.profile,
                        api = viewModel.api,
                        darkTheme = darkTheme,
                        onToggleTheme = viewModel::toggleTheme,
                        onSignOut = viewModel::signOut,
                    )
                }
            }
        }
    }
}

@Composable
private fun LoadingScreen() {
    Box(Modifier.fillMaxSize(), contentAlignment = Alignment.Center) {
        CircularProgressIndicator(
            modifier = Modifier.size(26.dp),
            strokeWidth = 2.dp,
            color = LocalAceColors.current.content,
        )
    }
}
