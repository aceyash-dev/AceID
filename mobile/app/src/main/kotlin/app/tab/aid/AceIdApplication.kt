package app.tab.aid

import android.app.Application
import android.content.Context
import app.tab.aid.auth.AceIdConfig
import app.tab.aid.auth.AuthRepository
import app.tab.aid.data.AceIdApi
import app.tab.aid.data.ResponseCache
import app.tab.aid.data.SecureStore
import app.tab.aid.data.SessionStore

/**
 * Manual dependency container. The graph is small and fixed, so a DI framework
 * would add a build-time cost and a code-generation step for no benefit.
 */
class AppContainer(context: Context) {
    val secureStore: SecureStore = SecureStore(context)
    val sessionStore: SessionStore = SessionStore(secureStore)
    val responseCache: ResponseCache = ResponseCache(secureStore)
    val authRepository: AuthRepository = AuthRepository(
        context = context,
        session = sessionStore,
        config = AceIdConfig.fromBuild,
    )
    val api: AceIdApi = AceIdApi(
        tokens = authRepository,
        cache = responseCache,
        baseUrl = AceIdConfig.fromBuild.apiBaseUrl,
    )
}

class AceIdApplication : Application() {
    lateinit var container: AppContainer
        private set

    override fun onCreate() {
        super.onCreate()
        container = AppContainer(this)
    }
}
