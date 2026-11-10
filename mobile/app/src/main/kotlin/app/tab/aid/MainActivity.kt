package app.tab.aid

import android.content.Intent
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.activity.result.contract.ActivityResultContracts
import androidx.activity.viewModels
import androidx.lifecycle.lifecycleScope
import app.tab.aid.ui.AceIdRoot
import app.tab.aid.ui.AppViewModel
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {

    private val container: AppContainer by lazy { (application as AceIdApplication).container }
    private val appViewModel: AppViewModel by viewModels { AppViewModel.factory(container) }

    private val authorizationLauncher =
        registerForActivityResult(ActivityResultContracts.StartActivityForResult()) { result ->
            appViewModel.completeSignIn(result.data)
        }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            AceIdRoot(viewModel = appViewModel, onStartSignIn = ::startSignIn)
        }
    }

    /**
     * Fetches the discovery document and launches the authorization request in
     * a Custom Tab. The redirect returns through AppAuth's receiver activity.
     */
    private fun startSignIn() {
        appViewModel.onSignInStarted()
        lifecycleScope.launch {
            try {
                val request = container.authRepository.createAuthorizationRequest()
                authorizationLauncher.launch(container.authRepository.authorizationIntent(request))
            } catch (error: Exception) {
                appViewModel.onSignInFailed(
                    error.message ?: "Sign-in did not finish. Check your connection and try again.",
                )
            }
        }
    }

    override fun onNewIntent(intent: Intent) {
        super.onNewIntent(intent)
        // A second redirect for an already-signed-in session is ignored: the
        // ActivityResult contract handles the launch we started.
        setIntent(intent)
    }
}
