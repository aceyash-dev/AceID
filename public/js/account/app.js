
    const loading = document.getElementById("loading");
    const content = document.getElementById("content");
    const editButton = document.getElementById("editButton");
    const editPanel = document.getElementById("editPanel");
    const cancelButton = document.getElementById("cancelButton");
    const saveButton = document.getElementById("saveButton");
    const logoutButton = document.getElementById("logoutButton");
    const deleteButton = document.getElementById("deleteButton");
    const qrScanFab = document.getElementById("qrScanFab");
    const qrScannerBackdrop = document.getElementById("qrScannerBackdrop");
    const closeQrScanner = document.getElementById("closeQrScanner");
    const qrCamera = document.getElementById("qrCamera");
    const qrScannerStatus = document.getElementById("qrScannerStatus");
    let qrCameraStream = null;
    let qrScanFrame = 0;
    let qrScanBusy = false;
    const mfaAccordion = document.getElementById("mfaAccordion");
    const mfaPanel = document.getElementById("mfaPanel");
    const mfaStatusTitle = document.getElementById("mfaStatusTitle");
    const mfaStatusText = document.getElementById("mfaStatusText");
    const mfaStatusIcon = document.getElementById("mfaStatusIcon");
    const mfaSetupButton = document.getElementById("mfaSetupButton");
    const mfaChangeButton = document.getElementById("mfaChangeButton");
    const mfaRecoveryButton = document.getElementById("mfaRecoveryButton");
    const mfaDisableButton = document.getElementById("mfaDisableButton");
    const mfaSetup = document.getElementById("mfaSetup");
    const mfaQr = document.getElementById("mfaQr");
    const mfaSecret = document.getElementById("mfaSecret");
    const mfaSetupCode = document.getElementById("mfaSetupCode");
    const mfaConfirmButton = document.getElementById("mfaConfirmButton");
    const mfaCopyButton = document.getElementById("mfaCopyButton");
    const mfaCopyCodesButton = document.getElementById("mfaCopyCodesButton");
    const mfaDownloadCodesButton = document.getElementById("mfaDownloadCodesButton");
    const mfaCodes = document.getElementById("mfaCodes");
    const mfaCodesList = document.getElementById("mfaCodesList");
    const mfaStatus = document.getElementById("mfaStatus");
    const mfaRetryButton = document.getElementById("mfaRetryButton");
    let mfaStatusController = null;
    let mfaStatusRequestId = 0;
    let mfaRequiresReauth = false;
    let mfaSetupMode = "setup";
    let securityActionKind = "";
    let securityActionCodeMode = "totp";
    let securityActionBusy = false;
    let securityActionPreviousFocus = null;

    const securityActionModal = document.getElementById("securityActionModal");
    const securityActionForm = document.getElementById("securityActionForm");
    const securityActionTitle = document.getElementById("securityActionTitle");
    const securityActionDescription = document.getElementById("securityActionDescription");
    const securityActionPassword = document.getElementById("securityActionPassword");
    const securityActionCode = document.getElementById("securityActionCode");
    const securityActionCodeLabel = document.getElementById("securityActionCodeLabel");
    const securityUseRecoveryCode = document.getElementById("securityUseRecoveryCode");
    const securityPasswordField = document.getElementById("securityPasswordField");
    const securityCodeField = document.getElementById("securityCodeField");
    const securityActionStatus = document.getElementById("securityActionStatus");
    const securityPasskeyField = document.getElementById("securityPasskeyField");
    const securityPasskeyButton = document.getElementById("securityPasskeyButton");
    const securityActionDivider = document.getElementById("securityActionDivider");
    const submitSecurityAction = document.getElementById("submitSecurityAction");
    const cancelSecurityAction = document.getElementById("cancelSecurityAction");
    const closeSecurityActionModal = document.getElementById("closeSecurityActionModal");

    const passwordAccordion = document.getElementById("passwordAccordion");
    const passwordPanel = document.getElementById("passwordPanel");
    const deviceActionModal = document.getElementById("deviceActionModal");
    const deviceActionForm = document.getElementById("deviceActionForm");
    const deviceActionTitle = document.getElementById("deviceActionTitle");
    const deviceActionDescription = document.getElementById("deviceActionDescription");
    const deviceActionPassword = document.getElementById("deviceActionPassword");
    const deviceActionLabelField = document.getElementById("deviceActionLabelField");
    const deviceActionLabel = document.getElementById("deviceActionLabel");
    const deviceActionStatus = document.getElementById("deviceActionStatus");
    const submitDeviceAction = document.getElementById("submitDeviceAction");
    const cancelDeviceAction = document.getElementById("cancelDeviceAction");
    const closeDeviceActionModal = document.getElementById("closeDeviceActionModal");
    const devicesStatus = document.getElementById("devicesStatus");
    const devicesList = document.getElementById("devicesList");
    const passwordLocked = document.getElementById("passwordLocked");
    const passwordForm = document.getElementById("passwordForm");
    const currentPasswordInput = document.getElementById("currentPassword");
    const newPasswordInput = document.getElementById("newPassword");
    const confirmPasswordInput = document.getElementById("confirmPassword");
    const passwordStatus = document.getElementById("passwordStatus");
    const changePasswordButton = document.getElementById("changePasswordButton");
    const deleteModal = document.getElementById("deleteModal");
    const closeDeleteModal = document.getElementById("closeDeleteModal");
    const cancelDelete = document.getElementById("cancelDelete");
    const confirmDelete = document.getElementById("confirmDelete");
    const deleteConfirmation = document.getElementById("deleteConfirmation");
    const snackbar = document.getElementById("snackbar");
    const switchAccountButton = document.getElementById("switchAccountButton");
    const switcherBackdrop = document.getElementById("switcherBackdrop");
    const closeSwitcher = document.getElementById("closeSwitcher");
    const accountChoices = document.getElementById("accountChoices");
    const addAccountButton = document.getElementById("addAccountButton");
    const onboardingBackdrop = document.getElementById("onboardingBackdrop");
    const onboardingStep = document.getElementById("onboardingStep");
    const onboardingTitle = document.getElementById("onboardingTitle");
    const onboardingViewport = document.getElementById("onboardingViewport");
    const onboardingTrack = document.getElementById("onboardingTrack");
    const onboardingProgress = document.getElementById("onboardingProgress");
    const onboardingBack = document.getElementById("onboardingBack");
    const onboardingNext = document.getElementById("onboardingNext");
    const onboardingSkip = document.getElementById("onboardingSkip");

    const avatarImage = document.getElementById("avatarImage");
    const avatarFallback = document.getElementById("avatarFallback");
    const editAvatarImage = document.getElementById("editAvatarImage");
    const editAvatarFallback = document.getElementById("editAvatarFallback");

    const avatarUrl = document.getElementById("avatarUrl");
    const displayNameInput = document.getElementById("displayName");
    const usernameInput = document.getElementById("username");
    const emailInput = document.getElementById("email");
    const usernameStatus = document.getElementById("usernameStatus");

    const identityName = document.getElementById("identityName");
    const identityUsername = document.getElementById("identityUsername");
    const displayNameValue = document.getElementById("displayNameValue");
    const usernameValue = document.getElementById("usernameValue");
    const emailValue = document.getElementById("emailValue");
    const emailStatus = document.getElementById("emailStatus");
    const accountIdValue = document.getElementById("accountIdValue");

    let account = null;
    const snackbarItems = [];
    const MAX_SNACKBARS = 4;
    let snackbarRaf = 0;
    let usernameCheckTimer = null;
    let usernameCheckSequence = 0;
    let emailVerificationBusy = false;
    let passwordChangeBusy = false;
    let devicesBusy = false;
    let deviceActionKind = "";
    let deviceActionDeviceId = "";
    let deviceActionBusy = false;
    let deviceActionPreviousFocus = null;
    let switcherBusy = false;
    let switchingAccountBusy = false;

    const onboardingSteps = [
      {
        eyebrow: "Welcome · 1 of 4",
        title: "Welcome to Ace ID",
        body: "Ace ID is the control center for your identity, security, devices, and connected services.",
        list: [
          "Edit your name, username, email, and avatar from Profile.",
          "Manage sign-in protection from Security.",
          "Review access whenever you sign in somewhere new."
        ]
      },
      {
        eyebrow: "Protect · 2 of 4",
        title: "Protect your Ace ID",
        body: "Use a passkey for fast, phishing-resistant sign-in and add an authenticator for another layer of protection.",
        list: [
          "Open Passkeys to add a passkey from this device.",
          "Open Authenticator & recovery to configure TOTP and recovery codes.",
          "Keep recovery codes private and stored somewhere you can reach."
        ],
        actions: ["passkeyAccordion", "mfaAccordion"]
      },
      {
        eyebrow: "Review · 3 of 4",
        title: "Know what has access",
        body: "Ace ID gives you a single place to review active devices, sign-in history, and connected services.",
        list: [
          "Use Devices to sign out sessions you no longer recognize.",
          "Use Activity to review sign-ins and security changes.",
          "Revoke connected services you no longer use."
        ],
        action: "devicesAccordion"
      },
      {
        eyebrow: "Ready · 4 of 4",
        title: "You're ready",
        body: "Keep your email verified, use a unique password, and treat unexpected security activity as a reason to investigate.",
        list: [
          "Only enter credentials on the official Ace ID origin.",
          "You can return to Profile and Security whenever you need them.",
          "This tour changes no authentication settings by itself."
        ],
        note: "You can reopen the relevant account sections at any time. The welcome tour is shown only once."
      }
    ];

    let onboardingIndex = 0;
    let onboardingBusy = false;
    let onboardingPointerStartX = null;
    let onboardingPointerCurrentX = null;
    let onboardingDragging = false;

    function animateOnboardingTitle() {
      onboardingTitle.classList.remove("bounce");
      void onboardingTitle.offsetWidth;
      onboardingTitle.classList.add("bounce");
    }

    function setOnboardingIndex(nextIndex, { animate = true } = {}) {
      const next = Math.max(0, Math.min(onboardingSteps.length - 1, nextIndex));
      onboardingIndex = next;
      renderOnboarding();
      if (animate) animateOnboardingTitle();
    }

    function beginOnboardingSwipe(event) {
      if (onboardingBusy) return;
      onboardingPointerStartX = event.clientX;
      onboardingPointerCurrentX = event.clientX;
      onboardingDragging = true;
      onboardingTrack.classList.add("dragging");
      onboardingViewport.setPointerCapture?.(event.pointerId);
    }

    function moveOnboardingSwipe(event) {
      if (!onboardingDragging || onboardingPointerStartX === null) return;
      onboardingPointerCurrentX = event.clientX;
      const delta = onboardingPointerCurrentX - onboardingPointerStartX;
      const base = -(onboardingIndex * 25);
      const viewportWidth = Math.max(1, onboardingViewport.clientWidth);
      const percent = (delta / viewportWidth) * 25;
      onboardingTrack.style.transform = "translate3d(" + (base + percent) + "%,0,0)";
    }

    function endOnboardingSwipe(event) {
      if (!onboardingDragging || onboardingPointerStartX === null) return;
      const delta = (onboardingPointerCurrentX ?? onboardingPointerStartX) - onboardingPointerStartX;
      onboardingDragging = false;
      onboardingPointerStartX = null;
      onboardingPointerCurrentX = null;
      onboardingTrack.classList.remove("dragging");
      const threshold = Math.max(42, onboardingViewport.clientWidth * .14);
      if (Math.abs(delta) >= threshold) {
        setOnboardingIndex(onboardingIndex + (delta < 0 ? 1 : -1));
      } else {
        renderOnboarding();
      }
    }


    function renderOnboarding() {
      const step = onboardingSteps[onboardingIndex];
      onboardingStep.textContent = step.eyebrow;
      onboardingTitle.textContent = step.title;
      onboardingTrack.innerHTML = onboardingSteps.map((item, index) => {
        const items = item.list.map(text =>
          '<li><iconify-icon icon="hugeicons:checkmark-circle-02" aria-hidden="true"></iconify-icon><span>' + escapeHtmlClient(text) + '</span></li>'
        ).join("");
        const note = item.note
          ? '<div class="onboarding-note">' + escapeHtmlClient(item.note) + '</div>'
          : "";
        const actions = item.actions || (item.action ? [item.action] : []);
        const action = actions.length
          ? '<div class="onboarding-links">' + actions.map(actionId =>
              '<button type="button" class="onboarding-section-link" data-onboarding-action="' + actionId + '">' +
                (actionId === "passkeyAccordion" ? "Open passkeys" : actionId === "mfaAccordion" ? "Open authenticator" : "Open devices") +
              '</button>'
            ).join("") + '</div>'
          : "";
        return '<article class="onboarding-slide" aria-hidden="' + (index === onboardingIndex ? "false" : "true") + '">' +
          '<p class="onboarding-copy">' + escapeHtmlClient(item.body) + '</p>' +
          '<ul class="onboarding-list">' + items + '</ul>' + note + action +
          '</article>';
      }).join("");

      onboardingTrack.style.transform = "translate3d(-" + (onboardingIndex * 25) + "%,0,0)";
      onboardingProgress.innerHTML = onboardingSteps.map((_, index) =>
        '<span class="onboarding-dot' + (index === onboardingIndex ? ' active' : '') + '"></span>'
      ).join("");

      onboardingBack.disabled = onboardingIndex === 0 || onboardingBusy;
      onboardingNext.disabled = onboardingBusy;
      onboardingNext.textContent = onboardingIndex === onboardingSteps.length - 1 ? "Done" : "Next";
      onboardingSkip.disabled = onboardingBusy;

      onboardingTrack.querySelectorAll("[data-onboarding-action]").forEach(button => {
        button.addEventListener("click", () => {
          const target = document.getElementById(button.dataset.onboardingAction);
          if (target) {
            target.click();
            target.scrollIntoView({ behavior: "smooth", block: "center" });
          }
        });
      });
    }

    function openOnboarding() {
      if (!account?.onboarding_required || onboardingBusy) return;

      onboardingIndex = 0;
      renderOnboarding();
      animateOnboardingTitle();
      onboardingBackdrop.classList.add("active");
      onboardingBackdrop.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      haptic("light");
    }

    function closeOnboarding() {
      onboardingBackdrop.classList.remove("active");
      onboardingBackdrop.setAttribute("aria-hidden", "true");
      document.body.style.overflow = "";
    }

    async function completeOnboarding() {
      if (onboardingBusy) return;
      onboardingBusy = true;
      onboardingNext.textContent = "Saving…";
      onboardingSkip.disabled = true;
      onboardingBack.disabled = true;

      try {
        const response = await fetch("/api/account/onboarding/complete", {
          method: "POST",
          credentials: "same-origin",
          headers: { "Accept": "application/json" }
        });
        const data = await readApiPayload(response);
        if (!response.ok) throw new Error(apiErrorMessage(data, "Unable to save onboarding state."));
        if (account) account.onboarding_required = false;
        closeOnboarding();
      } catch (error) {
        onboardingBusy = false;
        onboardingNext.disabled = false;
        onboardingSkip.disabled = false;
        onboardingBack.disabled = onboardingIndex === 0;
        onboardingNext.textContent = "Done";
        showSnackbar(error.message || "Unable to save onboarding state.");
      }
    }

    function openOnboardingSection(id) {
      const target = document.getElementById(id);
      if (!target) return;
      target.click();
      target.scrollIntoView({ behavior: "smooth", block: "center" });
    }

    function haptic(type = "light") {
      if (!('vibrate' in navigator)) return;
      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
      const pattern = { light: 8, medium: 16, success: [10,35,12], error: [18,45,18] }[type];
      try { navigator.vibrate(pattern || 8); } catch {}
    }

    function openSwitcher() {
      switcherBackdrop.classList.add('active');
      switcherBackdrop.setAttribute('aria-hidden', 'false');
      haptic('light');
      loadAuthenticatedAccounts();
    }

    function closeSwitcherDialog() {
      switcherBackdrop.classList.remove('active');
      switcherBackdrop.setAttribute('aria-hidden', 'true');
    }

    function renderAccountChoices(accounts) {
      accountChoices.innerHTML = '';
      if (!accounts.length) {
        accountChoices.innerHTML = '<div class="devices-empty" style="padding:18px 12px">No other signed-in accounts.</div>';
        return;
      }
      for (const item of accounts) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'account-choice' + (item.current ? ' current' : '');
        button.dataset.accountId = String(item.id);
        const avatar = document.createElement('span');
        avatar.className = 'account-choice-avatar';
        if (item.avatar_url && isHttpUrl(item.avatar_url)) {
          const img = document.createElement('img');
          img.src = item.avatar_url; img.alt = ''; img.loading = 'lazy'; img.referrerPolicy = 'no-referrer';
          avatar.appendChild(img);
        } else avatar.textContent = getInitial(item.display_name || item.email);
        const copy = document.createElement('span'); copy.className = 'account-choice-copy';
        const name = document.createElement('span'); name.className = 'account-choice-name'; name.textContent = item.display_name || 'Ace ID account';
        const meta = document.createElement('span'); meta.className = 'account-choice-meta'; meta.textContent = item.username ? '@' + item.username : (item.email || 'Signed in account');
        copy.append(name, meta); button.append(avatar, copy);
        if (item.current) { const check = document.createElement('iconify-icon'); check.className='account-choice-check'; check.setAttribute('icon','hugeicons:checkmark-circle-02'); check.setAttribute('aria-label','Current account'); button.appendChild(check); }
        button.addEventListener('click', async () => {
          haptic('medium');

          if (item.current || !item.switchable || switchingAccountBusy) {
            if (item.current) closeSwitcherDialog();
            return;
          }

          switchingAccountBusy = true;
          button.disabled = true;
          button.setAttribute("aria-busy", "true");

          const previousText = name.textContent;
          name.textContent = "Switching…";

          try {
            const response = await fetch("/api/account/switch", {
              method: "POST",
              credentials: "same-origin",
              cache: "no-store",
              headers: {
                "Content-Type": "application/json",
                "Accept": "application/json"
              },
              body: JSON.stringify({
                user_id: String(item.id)
              })
            });

            const data = await readApiPayload(response);

            if (!response.ok) {
              if (response.status === 401 && data.error === "reauthentication_required") {
                location.replace("/login?switch=1&return=" + encodeURIComponent("/account"));
                return;
              }

              if (response.status === 403) {
                throw new Error("This Ace ID needs a fresh sign-in before one-tap switching is available.");
              }

              throw new Error(apiErrorMessage(data, "Unable to switch identity."));
            }

            location.replace(data.redirect || "/account");
          } catch (error) {
            name.textContent = previousText;
            button.disabled = false;
            button.removeAttribute("aria-busy");
            switchingAccountBusy = false;
            showSnackbar(error.message || "Unable to switch identity.");
            haptic("error");
          }
        });
        accountChoices.appendChild(button);
      }
    }

    let authenticatedAccountsPromise = null;

    async function loadAuthenticatedAccounts({ silent = false } = {}) {
      if (authenticatedAccountsPromise) return authenticatedAccountsPromise;

      if (!silent) {
        accountChoices.innerHTML = '<div class="devices-empty" style="padding:18px 12px">Loading signed-in accounts…</div>';
      }

      authenticatedAccountsPromise = fetch('/api/account/accounts', {
        credentials: 'same-origin',
        cache: 'no-store',
        headers: { Accept: 'application/json' }
      })
        .then(async response => {
          const data = await readApiPayload(response);
          if (!response.ok) throw new Error(data.error || 'Unable to load signed-in accounts.');
          renderAccountChoices(data.accounts || []);
          return data.accounts || [];
        })
        .catch(error => {
          authenticatedAccountsPromise = null;
          if (!silent) {
            accountChoices.textContent = error.message || 'Unable to load signed-in accounts.';
            haptic('error');
          }
          throw error;
        });

      return authenticatedAccountsPromise;
    }

    function prewarmAccountSwitcher() {
      if (document.hidden) return;
      void loadAuthenticatedAccounts({ silent: true }).catch(() => {});
    }

    function showSnackbar(message) {
      const text = String(message || "").trim();
      if (!text) return;

      const current = snackbarItems[0];
      if (current && current.textContent === text) {
        current.dataset.expires = String(performance.now() + 3200);
        return;
      }

      const item = document.createElement("div");
      item.className = "snackbar-item is-visible";
      item.setAttribute("role", "status");
      item.textContent = text;
      item.dataset.expires = String(performance.now() + 3200);

      snackbarItems.unshift(item);
      snackbar.appendChild(item);

      while (snackbarItems.length > MAX_SNACKBARS) {
        snackbarItems.pop()?.remove();
      }

      scheduleSnackbarFrame();
    }

    function scheduleSnackbarFrame() {
      if (snackbarRaf) return;
      snackbarRaf = requestAnimationFrame(runSnackbarFrame);
    }

    function runSnackbarFrame(now) {
      snackbarRaf = 0;

      for (let index = snackbarItems.length - 1; index >= 0; index--) {
        const item = snackbarItems[index];
        const depth = Math.min(index, 3);
        item.dataset.depth = String(depth);

        if (now >= Number(item.dataset.expires)) {
          snackbarItems.splice(index, 1);
          item.classList.remove("is-visible");
          setTimeout(() => item.remove(), 220);
        }
      }

      if (snackbarItems.length) scheduleSnackbarFrame();
    }

    function getInitial(name) {
      const value = String(name || "").trim();
      return value.charAt(0).toUpperCase() || "A";
    }

    function isHttpUrl(value) {
      try {
        const url = new URL(value);
        return (
          (url.protocol === "https:" || url.protocol === "http:") &&
          !url.username &&
          !url.password
        );
      } catch {
        return false;
      }
    }

    function setAvatar(imageElement, fallbackElement, url, name) {
      const initial = getInitial(name);
      const cleanUrl = String(url || "").trim();

      fallbackElement.textContent = initial;

      imageElement.onload = null;
      imageElement.onerror = null;
      imageElement.removeAttribute("src");
      imageElement.classList.add("hidden");
      fallbackElement.classList.remove("hidden");

      if (!cleanUrl || !isHttpUrl(cleanUrl)) {
        return;
      }

      imageElement.decoding = "async";
      imageElement.referrerPolicy = "no-referrer";

      imageElement.onload = () => {
        if (imageElement.naturalWidth > 0 && imageElement.naturalHeight > 0) {
          imageElement.classList.remove("hidden");
          fallbackElement.classList.add("hidden");
        } else {
          imageElement.removeAttribute("src");
        }
      };

      imageElement.onerror = () => {
        imageElement.removeAttribute("src");
        imageElement.classList.add("hidden");
        fallbackElement.classList.remove("hidden");
      };

      imageElement.src = cleanUrl;
    }


    function setAccordion(button, panel, expanded) {
      button.setAttribute(
        "aria-expanded",
        expanded ? "true" : "false"
      );
      panel.classList.toggle(
        "active",
        expanded
      );
    }


    function formatDeviceDate(value, fallback = "Unknown") {
      if (!value) return fallback;
      const date = new Date(value);
      if (Number.isNaN(date.getTime())) return fallback;
      return date.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
    }

    function formatDeviceRelative(value) {
      if (!value) return "Unknown";
      const time = new Date(value).getTime();
      if (!Number.isFinite(time)) return "Unknown";
      const seconds = Math.max(0, Math.round((Date.now() - time) / 1000));
      if (seconds < 60) return "Just now";
      const minutes = Math.round(seconds / 60);
      if (minutes < 60) return minutes + " min ago";
      const hours = Math.round(minutes / 60);
      if (hours < 24) return hours + " hr ago";
      const days = Math.round(hours / 24);
      return days + " day" + (days === 1 ? "" : "s") + " ago";
    }

    function renderDevices(devices) {
      if (!devices.length) {
        devicesList.innerHTML = '<div class="devices-empty">No active sessions found.</div>';
        return;
      }

      devicesList.innerHTML = devices.map(device => {
        const browser = device.browser || "Unknown browser";
        const deviceType = device.deviceType || "Device";
        const os = device.os || "Unknown OS";
        const ip = device.ip_address || "Unknown IP";
        const signedIn = formatDeviceDate(device.created_at, "Unknown sign-in time");
        const lastActive = formatDeviceRelative(device.last_seen_at || device.created_at);
        const expires = formatDeviceDate(device.expires_at, "Unknown");
        const actionLabel = device.current ? "" : `
          <button class="device-logout" type="button" data-device-id="${encodeURIComponent(device.device_id)}">
            <iconify-icon icon="hugeicons:logout-01" aria-hidden="true"></iconify-icon>
            Sign out
          </button>
        `;

        return `
          <article class="device-card${device.current ? " current" : ""}">
            <div class="device-main">
              <div class="device-hero">
                <div class="device-hero-copy">
                  <div class="device-title-row">
                    <div class="device-name">${escapeHtmlClient(browser)}</div>
                    <span class="device-kind">${escapeHtmlClient(deviceType)} · ${escapeHtmlClient(os)}</span>
                  </div>
                  <div class="device-subtitle">${escapeHtmlClient(os)} · ${escapeHtmlClient(deviceType)} session</div>
                </div>
              </div>
              <div class="device-badges">
                ${device.current ? `
                  <span class="device-badge current"><iconify-icon icon="hugeicons:checkmark-circle-02" aria-hidden="true"></iconify-icon>Current</span>
                ` : ""}
              </div>
              <div class="device-meta-grid">
                <div class="device-meta-item"><iconify-icon icon="hugeicons:clock-01" aria-hidden="true"></iconify-icon><span><small>Last active</small><strong>${escapeHtmlClient(lastActive)}</strong></span></div>
                <div class="device-meta-item"><iconify-icon icon="hugeicons:calendar-01" aria-hidden="true"></iconify-icon><span><small>Signed in</small><strong>${escapeHtmlClient(signedIn)}</strong></span></div>
                <div class="device-meta-item"><iconify-icon icon="hugeicons:location-01" aria-hidden="true"></iconify-icon><span><small>IP address</small><code>${escapeHtmlClient(ip)}</code></span></div>
                <div class="device-meta-item"><iconify-icon icon="hugeicons:lock" aria-hidden="true"></iconify-icon><span><small>Session expires</small><strong>${escapeHtmlClient(expires)}</strong></span></div>
              </div>
            </div>
            <div class="device-actions">
              ${device.trustable ? `
                <button class="device-trust" type="button" data-device-id="${encodeURIComponent(device.device_id)}" data-trusted="${device.trusted ? "true" : "false"}">
                  <iconify-icon icon="hugeicons:shield-01" aria-hidden="true"></iconify-icon>
                  ${device.trusted ? "Remove trust" : "Trust device"}
                </button>
              ` : ""}
              ${actionLabel}
            </div>
          </article>
        `;
      }).join("");

      devicesList.querySelectorAll(".device-logout").forEach(button => {
        button.addEventListener("click", () => openDeviceAction("signout", decodeURIComponent(button.dataset.deviceId), button));
      });
      devicesList.querySelectorAll(".device-trust").forEach(button => {
        button.addEventListener("click", () => openDeviceAction(
          button.dataset.trusted === "true" ? "untrust" : "trust",
          decodeURIComponent(button.dataset.deviceId),
          button
        ));
      });
    }

    function openDeviceAction(kind, deviceId = "", trigger = null) {
      const config = {
        trust: { title: "Trust this device.", description: "Name this device so you can recognize it later. Your password is required only to change trust.", submit: "Trust device", label: true },
        untrust: { title: "Remove device trust.", description: "This keeps the session active but removes its trusted-device status.", submit: "Remove trust", label: false },
        signout: { title: "Sign out this device.", description: "This immediately ends the selected session. The device will need to sign in again.", submit: "Sign out", label: false },
        "signout-others": { title: "Sign out other devices.", description: "This ends every active session except the device you are using now.", submit: "Sign out all others", label: false }
      }[kind];
      if (!config || !deviceActionModal) return;

      deviceActionKind = kind;
      deviceActionDeviceId = deviceId;
      deviceActionPreviousFocus = trigger || document.activeElement;
      deviceActionTitle.textContent = config.title;
      deviceActionDescription.textContent = config.description;
      submitDeviceAction.textContent = config.submit;
      deviceActionLabelField.classList.toggle("hidden", !config.label);
      deviceActionPassword.value = "";
      deviceActionLabel.value = "";
      deviceActionStatus.textContent = "";
      deviceActionModal.classList.add("active");
      deviceActionModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
      setTimeout(() => (config.label ? deviceActionLabel : deviceActionPassword).focus(), 30);
    }

    function closeDeviceActionDialog(force = false) {
      if (!deviceActionModal || (deviceActionBusy && !force)) return;
      deviceActionModal.classList.remove("active");
      deviceActionModal.setAttribute("aria-hidden", "true");
      deviceActionPassword.value = "";
      deviceActionLabel.value = "";
      deviceActionStatus.textContent = "";
      deviceActionKind = "";
      deviceActionDeviceId = "";
      document.body.style.overflow = "";
      const previous = deviceActionPreviousFocus;
      deviceActionPreviousFocus = null;
      previous?.focus?.({ preventScroll: true });
    }

    async function submitDeviceActionForm(event) {
      event.preventDefault();
      if (deviceActionBusy || !deviceActionKind) return;
      const password = deviceActionPassword.value;
      if (!password) {
        deviceActionStatus.textContent = "Enter your current password.";
        deviceActionPassword.focus();
        return;
      }

      deviceActionBusy = true;
      submitDeviceAction.disabled = true;
      cancelDeviceAction.disabled = true;
      submitDeviceAction.setAttribute("aria-busy", "true");
      deviceActionStatus.textContent = "";

      try {
        let endpoint = "/api/account/devices/";
        let method = "DELETE";
        const body = { password };

        if (deviceActionKind === "trust" || deviceActionKind === "untrust") {
          endpoint += encodeURIComponent(deviceActionDeviceId) + "/trust";
          method = deviceActionKind === "trust" ? "POST" : "DELETE";
          if (deviceActionKind === "trust") body.label = deviceActionLabel.value.trim() || "Trusted device";
        } else if (deviceActionKind === "signout") {
          endpoint += encodeURIComponent(deviceActionDeviceId);
        } else {
          endpoint = "/api/account/devices/logout-others";
          method = "POST";
        }

        const response = await fetch(endpoint, {
          method,
          credentials: "same-origin",
          cache: "no-store",
          headers: { "Content-Type": "application/json", "Accept": "application/json" },
          body: JSON.stringify(body)
        });
        const data = await readApiPayload(response);
        if (!response.ok) {
          throw new Error(
            data.error === "incorrect_password"
              ? "Incorrect password."
              : data.error === "reauthentication_required"
                ? "Re-authenticate before changing device access."
                : apiErrorMessage(data, "Unable to update this device.")
          );
        }

        const message =
          deviceActionKind === "trust" ? "Device added as trusted." :
          deviceActionKind === "untrust" ? "Device trust removed." :
          deviceActionKind === "signout" ? "Device signed out." :
          `${data.count || 0} other device${data.count === 1 ? "" : "s"} signed out.`;

        closeDeviceActionDialog(true);
        devicesStatus.textContent = message;
        haptic("success");
        await loadDevices();
      } catch (error) {
        deviceActionStatus.textContent = error.message || "Unable to update this device.";
      } finally {
        deviceActionBusy = false;
        submitDeviceAction.disabled = false;
        cancelDeviceAction.disabled = false;
        submitDeviceAction.removeAttribute("aria-busy");
      }
    }

    // Ace ID's API answers with JSON, but a proxy, edge or platform layer can
    // return an HTML page or a structured object instead. Coerce whatever we
    // receive into a readable string so the UI never shows "[object Object]"
    // or a raw JSON parse error.
    function apiErrorMessage(payload, fallback) {
      if (typeof payload === "string") {
        const text = payload.trim();
        if (text) return text;
      }
      if (payload && typeof payload === "object") {
        for (const candidate of [payload.error, payload.error_description, payload.message]) {
          if (typeof candidate === "string" && candidate.trim()) return candidate.trim();
          if (candidate && typeof candidate === "object") {
            if (typeof candidate.message === "string" && candidate.message.trim()) return candidate.message.trim();
            if (typeof candidate.error === "string" && candidate.error.trim()) return candidate.error.trim();
          }
        }
      }
      return fallback;
    }

    // Read a response body defensively: a JSON body is parsed, anything else
    // becomes a clear message instead of throwing "not valid JSON".
    async function readApiPayload(response) {
      const raw = await response.text().catch(() => "");
      const text = String(raw || "").trim();
      if (!text) return {};
      if (text.startsWith("{") || text.startsWith("[")) {
        try { return JSON.parse(text); } catch { /* fall through */ }
      }
      return { error: "Ace ID returned an unexpected response. Please try again." };
    }

    function escapeHtmlClient(value) {
      return String(value ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
    }

    async function loadDevices() {
      if (devicesBusy) return;
      devicesBusy = true;
      devicesStatus.textContent = "Loading active sessions…";

      try {
        const response = await fetch("/api/account/devices", {
          credentials: "same-origin",
          cache: "no-store",
          headers: { "Accept": "application/json" }
        });
        const data = await readApiPayload(response);
        if (!response.ok) {
          throw new Error(
            data.error === "not_authenticated"
              ? "Your session has expired. Sign in again."
              : apiErrorMessage(data, "Unable to load devices.")
          );
        }
        renderDevices(data.devices || []);
        devicesStatus.textContent =
          `${data.devices?.length || 0} active session${data.devices?.length === 1 ? "" : "s"}.`;
      } catch (error) {
        devicesStatus.textContent = error.message || "Unable to load devices.";
      } finally {
        devicesBusy = false;
      }
    }

    const signOutOtherDevicesButton = document.getElementById("signOutOtherDevicesButton");
    signOutOtherDevicesButton?.addEventListener("click", () =>
      openDeviceAction("signout-others", "", signOutOtherDevicesButton)
    );

    window.__aceDevices = {
      load: loadDevices,
      openAction: openDeviceAction
    };

    function renderPasswordManagement() {
      const verified = Boolean(account?.email_verified);

      passwordLocked.classList.toggle("hidden", verified);
      passwordForm.classList.toggle("hidden", !verified);

      if (!verified) {
        passwordForm.reset();
        passwordStatus.textContent = "";
      }
    }

    function renderEmailStatus() {
      if (account?.email_verified) {
        emailStatus.innerHTML = `
          <div class="status-row">
            <span class="verified">
              <iconify-icon icon="hugeicons:checkmark-circle-02"></iconify-icon>
              Verified
            </span>
          </div>
        `;
        return;
      }

      emailStatus.innerHTML = `
        <div class="status-row">
          <span class="unverified">
            <iconify-icon icon="hugeicons:alert-02"></iconify-icon>
            Not verified
          </span>
          <button id="verifyEmailButton" class="verify-button" type="button">
            Verify email
          </button>
        </div>
      `;

      document
        .getElementById("verifyEmailButton")
        ?.addEventListener("click", sendVerificationEmail);
    }

    function renderAccount(user) {
      account = user;

      const name = user.display_name || "Ace ID user";
      const username = user.username ? "@" + user.username : "No username";

      identityName.textContent = name;
      identityUsername.textContent = username;
      displayNameValue.textContent = user.display_name || "Not set";
      usernameValue.textContent = user.username ? "@" + user.username : "Not set";
      emailValue.textContent = user.email || "Not set";
      accountIdValue.textContent = user.id ? String(user.id) : "Not available";

      renderEmailStatus();
      renderPasswordManagement();

      setAvatar(avatarImage, avatarFallback, user.avatar_url, name);
      setAvatar(editAvatarImage, editAvatarFallback, user.avatar_url, name);
      void refreshAccountIdEligibility();
    }

    async function refreshAccountIdEligibility() {
      try {
        const response = await fetch("/api/subscription", {
          credentials: "same-origin",
          cache: "no-store",
          headers: { "Accept": "application/json" }
        });
        const data = await readApiPayload(response);
        const plan = String(data?.plan || "base").toLowerCase();
        const cooldownDays = Math.max(0, Number(data?.usernameChangeCooldownDays) || 0);
        const lastChangedAt = account?.username_changed_at ? new Date(account.username_changed_at) : null;
        const nextAllowedAt = lastChangedAt && Number.isFinite(lastChangedAt.getTime()) && cooldownDays > 0
          ? new Date(lastChangedAt.getTime() + cooldownDays * 24 * 60 * 60 * 1000)
          : null;
        const cooldownActive = Boolean(nextAllowedAt && nextAllowedAt > new Date());
        const allowed = !cooldownActive;
        usernameInput.disabled = !allowed;
        usernameInput.title = allowed
          ? plan === "base"
            ? "Base users can change their username once every 30 days."
            : "Your plan does not impose a username change cooldown."
          : "Username can be changed again after " + nextAllowedAt.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }) + ".";
        if (cooldownActive) {
          usernameStatus.textContent = "Base plan: next username change available " +
            nextAllowedAt.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" }) + ".";
        } else if (plan === "base") {
          usernameStatus.textContent = "Base plan: username changes are limited to once every 30 days.";
        } else {
          usernameStatus.textContent = "Your plan allows username changes without a cooldown.";
        }
      } catch {
        usernameInput.disabled = false;
        usernameInput.title = "Username eligibility will be checked when you save.";
      }
    }

    function populateForm() {
      displayNameInput.value = account?.display_name || "";
      usernameInput.value = account?.username || "";
      emailInput.value = account?.email || "";
      avatarUrl.value = account?.avatar_url || "";
      usernameStatus.textContent = "";

      setAvatar(
        editAvatarImage,
        editAvatarFallback,
        account?.avatar_url,
        account?.display_name
      );
    }

    function openEditor() {
      populateForm();
      editPanel.classList.add("active");
      editPanel.setAttribute("aria-hidden", "false");
      editButton.classList.add("hidden");
      displayNameInput.focus();
    }

    function closeEditor() {
      clearTimeout(usernameCheckTimer);
      editPanel.classList.remove("active");
      editPanel.setAttribute("aria-hidden", "true");
      editButton.classList.remove("hidden");
      populateForm();
    }

    function formatConnectionTime(value) {
      if (!value) return "Connection time unavailable";
      const date = new Date(value);
      if (!Number.isFinite(date.getTime())) return "Connection time unavailable";
      return "Connected " + new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short"
      }).format(date);
    }

    function appendIcon(container, iconUrl, fallbackIcon) {
      if (iconUrl && isHttpUrl(iconUrl)) {
        const img = document.createElement("img");
        img.src = iconUrl;
        img.alt = "";
        img.loading = "lazy";
        img.referrerPolicy = "no-referrer";
        img.addEventListener("error", () => {
          img.remove();
          const icon = document.createElement("iconify-icon");
          icon.setAttribute("icon", fallbackIcon);
          container.appendChild(icon);
        }, { once: true });
        container.appendChild(img);
        return;
      }
      const icon = document.createElement("iconify-icon");
      icon.setAttribute("icon", fallbackIcon);
      container.appendChild(icon);
    }

    function renderServices(services) {
      servicesList.innerHTML = "";
      if (!services.length) {
        servicesList.innerHTML = '<div class="service-empty">No connected services.</div>';
        return;
      }
      for (const service of services) {
        const row = document.createElement("div");
        row.className = "service-row";
        const icon = document.createElement("span");
        icon.className = "service-icon";
        appendIcon(icon, service.icon, "hugeicons:link-02");
        const copy = document.createElement("span");
        copy.className = "service-copy";
        const name = document.createElement("span");
        name.className = "service-name";
        name.textContent = service.name || "Service";
        const time = document.createElement("span");
        time.className = "service-time";
        time.textContent = formatConnectionTime(service.connected_at);
        copy.append(name, time);
        const revoke = document.createElement("button");
        revoke.type = "button";
        revoke.className = "service-revoke";
        revoke.textContent = "Revoke";
        revoke.addEventListener("click", () => revokeService(service.client_id, revoke));
        row.append(icon, copy, revoke);
        servicesList.appendChild(row);
      }
    }

    function formatLoginLocation(value) {
      if (!value) return "Location unavailable";
      const country = String(value).trim().toUpperCase();
      try {
        return new Intl.DisplayNames([navigator.language || "en"], { type: "region" }).of(country) || country;
      } catch {
        return country;
      }
    }

    async function loadMfaStatus() {
      const requestId = ++mfaStatusRequestId;

      if (mfaStatusController) {
        mfaStatusController.abort();
      }

      const controller = new AbortController();
      mfaStatusController = controller;
      mfaRequiresReauth = false;

      mfaStatus.setAttribute("aria-busy", "true");
      mfaStatusTitle.textContent = "Authenticator";
      mfaStatusText.textContent = "Checking security settings…";
      mfaStatusIcon.setAttribute("icon", "hugeicons:loading-03");
      mfaRetryButton.classList.add("hidden");
      mfaRetryButton.disabled = false;

      try {
        const response = await fetch("/api/account/mfa", {
          credentials: "same-origin",
          cache: "no-store",
          signal: controller.signal,
          headers: { Accept: "application/json" }
        });
        const data = await readApiPayload(response);

        if (!response.ok) {
          if (response.status === 401 || response.status === 403 || data.error === "not_authenticated") {
            mfaRequiresReauth = true;
            throw new Error("Your session has expired. Sign in again to manage authenticator settings.");
          }

          throw new Error(apiErrorMessage(data, "Unable to load authenticator settings right now."));
        }

        if (requestId !== mfaStatusRequestId) return;

        const enabled = Boolean(data.enabled);
        const recoveryCodes = Number(data.recoveryCodes || 0);
        const passkeysAvailable = Boolean(data.passkeysAvailable);

        mfaStatusTitle.textContent = enabled
          ? "Authenticator enabled"
          : "Authenticator not enabled";
        mfaStatusText.textContent = enabled
          ? recoveryCodes + " recovery code" + (recoveryCodes === 1 ? "" : "s") + " remaining."
          : "Use any TOTP-compatible authenticator app.";
        mfaStatusIcon.setAttribute(
          "icon",
          enabled ? "hugeicons:checkmark-circle-02" : "hugeicons:shield-02"
        );

        mfaSetupButton.classList.toggle("hidden", enabled);
        mfaChangeButton.classList.toggle("hidden", !enabled);
        mfaRecoveryButton.classList.toggle("hidden", !enabled);
        mfaDisableButton.classList.toggle("hidden", !enabled);
        securityPasskeyField?.classList.toggle("hidden", !enabled || !passkeysAvailable);
        securityActionDivider?.classList.toggle("hidden", !enabled || !passkeysAvailable);
      } catch (error) {
        if (error?.name === "AbortError" || requestId !== mfaStatusRequestId) return;

        mfaStatusTitle.textContent = "Authenticator unavailable";
        mfaStatusText.textContent =
          error.message || "Unable to load authenticator settings right now.";
        mfaStatusIcon.setAttribute("icon", "hugeicons:alert-02");
        mfaRetryButton.textContent = mfaRequiresReauth ? "Sign in again" : "Retry";
        mfaRetryButton.classList.remove("hidden");
        mfaSetupButton.classList.add("hidden");
        mfaRecoveryButton.classList.add("hidden");
        mfaDisableButton.classList.add("hidden");
      } finally {
        if (requestId === mfaStatusRequestId) {
          mfaStatus.setAttribute("aria-busy", "false");
          mfaRetryButton.disabled = false;
        }
        if (mfaStatusController === controller) {
          mfaStatusController = null;
        }
      }
    }

    async function copyText(value, successMessage) {
      const text = String(value || "");
      if (!text) return false;

      try {
        if (navigator.clipboard && typeof navigator.clipboard.writeText === "function") {
          await navigator.clipboard.writeText(text);
          showSnackbar(successMessage);
          return true;
        }
      } catch {
        // Fall through to the synchronous browser fallback.
      }

      let area = null;
      try {
        area = document.createElement("textarea");
        area.value = text;
        area.setAttribute("readonly", "");
        area.setAttribute("aria-hidden", "true");
        area.style.position = "fixed";
        area.style.top = "0";
        area.style.left = "0";
        area.style.width = "1px";
        area.style.height = "1px";
        area.style.padding = "0";
        area.style.border = "0";
        // Keep the target in the rendered layout: some mobile browsers
        // refuse to copy from fully transparent selection targets.
        area.style.opacity = "0.01";
        area.style.fontSize = "16px";
        // Keep the fallback above the page so mobile browsers can focus
        // and select it before execCommand("copy") runs.
        area.style.zIndex = "2147483647";
        area.style.pointerEvents = "none";
        document.body.appendChild(area);
        area.focus({ preventScroll: true });
        area.select();
        area.setSelectionRange(0, area.value.length);

        if (!document.execCommand("copy")) {
          throw new Error("copy_failed");
        }

        showSnackbar(successMessage);
        return true;
      } catch {
        // Last-resort fallback for browsers that block both Clipboard API
        // and execCommand. Prompt is synchronous but preserves the user's copy intent.
        try {
          const manualCopy = window.prompt("Copy this text:", text);
          if (manualCopy !== null) {
            showSnackbar("Text shown for manual copying.");
            return true;
          }
        } catch {
          // Continue to the accessible failure message below.
        }
        showSnackbar("Copy failed. Select the text manually.");
        return false;
      } finally {
        area?.remove();
      }
    }

    function getRecoveryCodes() {
      return Array.from(mfaCodesList.querySelectorAll(".mfa-code"))
        .map(element => element.textContent.trim())
        .filter(Boolean);
    }

    function downloadRecoveryCodes() {
      const codes = getRecoveryCodes();
      if (!codes.length) return;
      const blob = new Blob([
        "Ace ID recovery codes\n\n",
        ...codes.map((code, index) => (index + 1) + ". " + code + "\n"),
        "\nKeep these codes somewhere secure. Each code can be used once."
      ], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "ace-id-recovery-codes.txt";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      showSnackbar("Recovery codes downloaded.");
    }

    function resetMfaSetup() {
      mfaSetupMode = "setup";
      mfaSetup.classList.add("hidden");
      mfaSetupCode.value = "";
      mfaQr.removeAttribute("src");
      mfaSecret.textContent = "";
      mfaConfirmButton.disabled = false;
      mfaConfirmButton.textContent = "Enable authenticator";
    }

    function redirectForSecurityReauth() {
      const returnPath = location.pathname || "/account/security";
      location.replace("/login?return=" + encodeURIComponent(returnPath));
    }

    function openSecurityAction(kind) {
      securityActionKind = kind;
      securityActionBusy = false;
      securityActionPreviousFocus = document.activeElement;

      const config = {
        change: {
          title: "Change authenticator.",
          description: "Verify your current password and authenticator code before replacing the TOTP device.",
          submit: "Start authenticator change.",
          password: true,
          code: true
        },
        disable: {
          title: "Disable authenticator.",
          description: "Verify with your passkey or current authenticator code to turn off TOTP sign-in protection.",
          submit: "Disable authenticator.",
          password: false,
          code: true
        },
        recovery: {
          title: "Regenerate recovery codes.",
          description: "Enter your current authenticator code. Your old recovery codes will stop working.",
          submit: "Regenerate codes.",
          password: false,
          code: true
        }
      }[kind];

      if (!config || !securityActionModal) return;

      securityActionTitle.textContent = config.title;
      securityActionDescription.textContent = config.description;
      submitSecurityAction.textContent = config.submit;
      securityPasswordField.classList.toggle("hidden", !config.password);
      securityCodeField.classList.toggle("hidden", !config.code);
      securityActionPassword.value = "";
      securityActionCode.value = "";
      securityActionCodeMode = "totp";
      if (securityActionCodeLabel) securityActionCodeLabel.textContent = "Authenticator code";
      if (securityUseRecoveryCode) {
        securityUseRecoveryCode.classList.toggle("hidden", kind !== "disable");
        securityUseRecoveryCode.textContent = "Use a recovery code instead";
      }
      securityActionCode.inputMode = "numeric";
      securityActionCode.autocomplete = "one-time-code";
      securityActionCode.pattern = "[0-9]{6}";
      securityActionCode.maxLength = 6;
      securityActionCode.placeholder = "000000";
      securityActionStatus.textContent = "";
      securityPasskeyField?.classList.toggle("hidden", kind !== "disable");
      securityActionDivider?.classList.toggle("hidden", kind !== "disable");

      securityActionModal.classList.add("active");
      securityActionModal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";

      setTimeout(() => {
        (config.password ? securityActionPassword : securityActionCode).focus();
      }, 30);
    }

    function closeSecurityActionDialog(force = false) {
      if (!securityActionModal || (securityActionBusy && !force)) return;

      securityActionModal.classList.remove("active");
      securityActionModal.setAttribute("aria-hidden", "true");
      securityActionPassword.value = "";
      securityActionCode.value = "";
      securityActionStatus.textContent = "";
      document.body.style.overflow = "";

      const previous = securityActionPreviousFocus;
      securityActionPreviousFocus = null;
      previous?.focus?.({ preventScroll: true });
    }

    function securityActionError(data, fallback) {
      const messages = {
        reauthentication_required: "Your recent authentication has expired. Sign in again before changing security settings.",
        incorrect_password: "The current password is incorrect.",
        invalid_current_authenticator_code: "The current authenticator code is incorrect.",
        authenticator_code_required: "Enter the current authenticator code.",
        invalid_recovery_code: "That recovery code is invalid or has already been used.",
        passkey_verification_expired: "Passkey verification expired. Start again.",
        passkey_authentication_required: "Use your passkey to continue.",
        passkey_not_registered: "That passkey is not registered to this account.",
        passkey_verification_failed: "Passkey verification failed. Try again.",
        "The new authenticator code is incorrect.": "The new authenticator code is incorrect."
      };
      return messages[data?.error] || data?.error || fallback;
    }

    let passkeyClientPromise;

    async function loadAccountPasskeyClient() {
      if (window.passkeyClient?.isAvailable && window.passkeyClient?.authenticate) {
        return window.passkeyClient;
      }

      if (!passkeyClientPromise) {
        passkeyClientPromise = import("https://cdn.jsdelivr.net/npm/@passwordless-id/webauthn@2.4.0/+esm")
          .then(module => {
            const client = module?.client;
            if (!client?.isAvailable || !client?.authenticate) {
              throw new Error("Secure passkey support could not be loaded.");
            }
            window.passkeyClient = client;
            return client;
          })
          .catch(error => {
            passkeyClientPromise = null;
            throw error;
          });
      }

      return passkeyClientPromise;
    }

    async function verifyMfaDisableWithPasskey() {
      if (securityActionBusy || securityActionKind !== "disable") return;
      securityActionBusy = true;
      securityPasskeyButton.disabled = true;
      submitSecurityAction.disabled = true;
      cancelSecurityAction.disabled = true;
      securityPasskeyButton.setAttribute("aria-busy", "true");
      securityActionStatus.textContent = "Waiting for your passkey…";

      try {
        const passkeyClient = await loadAccountPasskeyClient();
        if (!passkeyClient.isAvailable()) {
          throw new Error("Passkeys are not available on this device.");
        }

        const optionsResponse = await fetch("/api/account/mfa/disable/options", {
          method: "POST",
          credentials: "same-origin",
          cache: "no-store",
          headers: { Accept: "application/json" }
        });
        const options = await optionsResponse.json().catch(() => ({}));
        if (!optionsResponse.ok) {
          if (options.error === "reauthentication_required" || optionsResponse.status === 403) {
            closeSecurityActionDialog(true);
            redirectForSecurityReauth();
            return;
          }
          throw new Error(securityActionError(options, "Unable to start passkey verification."));
        }

        const authentication = await passkeyClient.authenticate({
          challenge: options.challenge,
          userVerification: "required",
          timeout: 210000,
          domain: options.rpId
        });

        const response = await fetch("/api/account/mfa/disable/passkey", {
          method: "POST",
          credentials: "same-origin",
          cache: "no-store",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ authentication })
        });
        const data = await readApiPayload(response);
        if (!response.ok) {
          if (data.error === "reauthentication_required" || response.status === 403) {
            closeSecurityActionDialog(true);
            redirectForSecurityReauth();
            return;
          }
          throw new Error(securityActionError(data, "Unable to disable authenticator."));
        }

        closeSecurityActionDialog(true);
        resetMfaSetup();
        await loadMfaStatus();
        showSnackbar("Authenticator disabled with your passkey.");
      } catch (error) {
        securityActionStatus.textContent =
          error?.name === "NotAllowedError"
            ? "Passkey verification was cancelled."
            : (error.message || "Unable to verify with passkey.");
      } finally {
        securityActionBusy = false;
        securityPasskeyButton.disabled = false;
        submitSecurityAction.disabled = false;
        cancelSecurityAction.disabled = false;
        securityPasskeyButton.removeAttribute("aria-busy");
      }
    }

    async function submitSecurityActionForm(event) {
      event.preventDefault();
      if (securityActionBusy || !securityActionKind) return;

      const password = securityActionPassword.value;
      const code = securityActionCodeMode === "recovery"
        ? securityActionCode.value.replace(/[^a-z0-9-]/gi, "").slice(0, 39).toUpperCase()
        : securityActionCode.value.replace(/\D/g, "").slice(0, 6);
      securityActionCode.value = code;

      if (securityActionKind === "disable") {
        const validCode = securityActionCodeMode === "recovery"
          ? /^[A-F0-9]{4}(?:-[A-F0-9]{4}){7}$/.test(code)
          : /^\d{6}$/.test(code);
        if (!validCode) {
          securityActionStatus.textContent = securityActionCodeMode === "recovery"
            ? "Enter one unused recovery code in the format XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX."
            : "Enter the 6-digit authenticator code, or use your passkey or a recovery code.";
          securityActionCode.focus();
          return;
        }
      } else {
        if (securityActionKind === "change" && !password) {
          securityActionStatus.textContent = "Enter your current password.";
          securityActionPassword.focus();
          return;
        }

        if (code.length !== 6) {
          securityActionStatus.textContent = "Enter the 6-digit authenticator code.";
          securityActionCode.focus();
          return;
        }
      }

      securityActionBusy = true;
      submitSecurityAction.disabled = true;
      cancelSecurityAction.disabled = true;
      submitSecurityAction.setAttribute("aria-busy", "true");
      securityActionStatus.textContent = "";

      try {
        const endpoint =
          securityActionKind === "change"
            ? "/api/account/mfa/change"
            : securityActionKind === "disable"
              ? "/api/account/mfa/disable"
              : "/api/account/mfa/recovery/regenerate";

        const body =
          securityActionKind === "recovery"
            ? { code }
            : securityActionKind === "disable"
              ? { code, method: securityActionCodeMode }
              : { password, code };

        const response = await fetch(endpoint, {
          method: "POST",
          credentials: "same-origin",
          cache: "no-store",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(body)
        });

        const data = await readApiPayload(response);

        if (!response.ok) {
          if (data.error === "reauthentication_required" || response.status === 403) {
            closeSecurityActionDialog(true);
            redirectForSecurityReauth();
            return;
          }
          throw new Error(securityActionError(data, "Unable to update authenticator settings."));
        }

        if (securityActionKind === "change") {
          if (!data.qrDataUrl || !data.secret) {
            throw new Error("The new authenticator setup response was incomplete.");
          }

          mfaSetupMode = "change";
          mfaQr.src = data.qrDataUrl;
          mfaSecret.textContent = data.secret;
          mfaSetupCode.value = "";
          mfaCodes.classList.add("hidden");
          mfaConfirmButton.textContent = "Confirm new authenticator";
          mfaSetup.classList.remove("hidden");
          setAccordion(mfaAccordion, mfaPanel, true);
          closeSecurityActionDialog(true);
          mfaSetupCode.focus();
          return;
        }

        if (securityActionKind === "disable") {
          closeSecurityActionDialog(true);
          resetMfaSetup();
          await loadMfaStatus();
          showSnackbar("Authenticator disabled.");
          return;
        }

        mfaCodesList.innerHTML = "";
        for (const value of data.recovery_codes || []) {
          const el = document.createElement("div");
          el.className = "mfa-code";
          el.textContent = value;
          mfaCodesList.appendChild(el);
        }
        mfaCodes.classList.remove("hidden");
        closeSecurityActionDialog(true);
        await loadMfaStatus();
        showSnackbar("Recovery codes regenerated. Previous codes no longer work.");
      } catch (error) {
        securityActionStatus.textContent = error.message || "Unable to update authenticator settings.";
      } finally {
        securityActionBusy = false;
        submitSecurityAction.disabled = false;
        cancelSecurityAction.disabled = false;
        submitSecurityAction.removeAttribute("aria-busy");
      }
    }

    async function setupMfa() {
      mfaSetupMode = "setup";
      mfaSetupButton.disabled = true;
      try {
        const response = await fetch("/api/account/mfa/setup", {
          method: "POST",
          credentials: "same-origin",
          cache: "no-store",
          headers: { Accept: "application/json" }
        });
        const data = await readApiPayload(response);

        if (!response.ok) {
          if (data.error === "reauthentication_required" || response.status === 403) {
            redirectForSecurityReauth();
            return;
          }
          throw new Error(apiErrorMessage(data, "Unable to start authenticator setup."));
        }

        if (!data.qrDataUrl || !data.secret) {
          throw new Error("The authenticator setup response was incomplete.");
        }

        mfaQr.src = data.qrDataUrl;
        mfaSecret.textContent = data.secret;
        mfaSetupCode.value = "";
        mfaSetup.classList.remove("hidden");
        mfaCodes.classList.add("hidden");
        mfaConfirmButton.textContent = "Enable authenticator";
        mfaSetupCode.focus();
      } catch (error) {
        showSnackbar(error.message || "Unable to start authenticator setup.");
      } finally {
        mfaSetupButton.disabled = false;
      }
    }

    async function confirmMfaSetup() {
      const code = mfaSetupCode.value.replace(/\D/g, "").slice(0, 6);
      mfaSetupCode.value = code;
      if (code.length !== 6) {
        showSnackbar("Enter the 6-digit code from your authenticator.");
        return;
      }

      mfaConfirmButton.disabled = true;
      try {
        const endpoint =
          mfaSetupMode === "change"
            ? "/api/account/mfa/change/verify"
            : "/api/account/mfa/setup/verify";

        const response = await fetch(endpoint, {
          method: "POST",
          credentials: "same-origin",
          cache: "no-store",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ code })
        });
        const data = await readApiPayload(response);

        if (!response.ok) {
          if (data.error === "reauthentication_required" || response.status === 403) {
            redirectForSecurityReauth();
            return;
          }
          throw new Error(apiErrorMessage(data, "Unable to enable authenticator."));
        }

        if (!Array.isArray(data.recovery_codes) || data.recovery_codes.length === 0) {
          throw new Error("Authenticator was not completed because recovery codes were missing.");
        }

        const changed = mfaSetupMode === "change";
        mfaSetup.classList.add("hidden");
        mfaSetupMode = "setup";
        mfaConfirmButton.textContent = "Enable authenticator";
        mfaCodesList.innerHTML = "";
        for (const value of data.recovery_codes) {
          const el = document.createElement("div");
          el.className = "mfa-code";
          el.textContent = value;
          mfaCodesList.appendChild(el);
        }
        mfaCodes.classList.remove("hidden");
        await loadMfaStatus();
        showSnackbar(changed
          ? "Authenticator changed. Save your new recovery codes."
          : "Authenticator enabled. Save your recovery codes.");
      } catch (error) {
        showSnackbar(error.message || "Unable to enable authenticator.");
      } finally {
        mfaConfirmButton.disabled = false;
      }
    }

    async function regenerateMfaCodes() {
      openSecurityAction("recovery");
    }

    async function disableMfa() {
      openSecurityAction("disable");
    }

    async function revokeService(clientId, button) {
      if (!clientId || button.disabled) return;
      if (!confirm("Revoke this service's Ace ID access?")) return;
      button.disabled = true;
      try {
        const response = await fetch("/api/account/services/" + encodeURIComponent(clientId), {
          method: "DELETE",
          credentials: "same-origin",
          headers: { Accept: "application/json" }
        });
        const data = await readApiPayload(response);
        if (!response.ok) throw new Error(apiErrorMessage(data, "Unable to revoke service access."));
        haptic("success");
        showSnackbar("Service access revoked.");
        await loadLoggedInServices();
      } catch (error) {
        button.disabled = false;
        showSnackbar(error.message || "Unable to revoke service access.");
      }
    }

    function stopQrScanner() {
      if (qrScanFrame) cancelAnimationFrame(qrScanFrame);
      qrScanFrame = 0;
      if (qrCameraStream) qrCameraStream.getTracks().forEach(track => track.stop());
      qrCameraStream = null;
      qrCamera.srcObject = null;
      qrScanBusy = false;
    }

    function closeQrScannerDialog() {
      stopQrScanner();
      qrScannerBackdrop.classList.remove("active");
      qrScannerBackdrop.setAttribute("aria-hidden", "true");
      qrScanFab.focus({ preventScroll: true });
    }

    function isAceQrLoginUrl(value) {
      try {
        const url = new URL(String(value || ""), location.origin);
        return url.origin === location.origin && url.pathname === "/login/qr/approve" && url.searchParams.has("request") && url.searchParams.has("secret");
      } catch { return false; }
    }

    async function scanQrFrame(detector) {
      if (!qrScannerBackdrop.classList.contains("active")) return;
      if (!qrScanBusy && qrCamera.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
        qrScanBusy = true;
        try {
          const codes = await detector.detect(qrCamera);
          const rawValue = codes.find(code => code.rawValue)?.rawValue || "";
          if (rawValue && isAceQrLoginUrl(rawValue)) {
            stopQrScanner();
            qrScannerStatus.textContent = "QR sign-in found. Opening approval…";
            location.assign(new URL(rawValue, location.origin).href);
            return;
          }
          if (rawValue) {
            qrScannerStatus.textContent = "That QR code is not an Ace ID sign-in request.";
            qrScannerStatus.classList.add("error");
          }
        } catch {}
        finally { qrScanBusy = false; }
      }
      qrScanFrame = requestAnimationFrame(() => setTimeout(() => { void scanQrFrame(detector); }, 100));
    }

    async function openQrScanner() {
      qrScannerBackdrop.classList.add("active");
      qrScannerBackdrop.setAttribute("aria-hidden", "false");
      qrScannerStatus.classList.remove("error");
      qrScannerStatus.textContent = "Starting camera…";
      if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
        qrScannerStatus.classList.add("error");
        qrScannerStatus.textContent = "Camera scanning requires a secure HTTPS connection.";
        return;
      }
      if (!globalThis.BarcodeDetector) {
        qrScannerStatus.classList.add("error");
        qrScannerStatus.textContent = "QR scanning is not supported by this browser.";
        return;
      }
      try {
        const formats = await BarcodeDetector.getSupportedFormats();
        if (!formats.includes("qr_code")) throw new Error("qr_unsupported");
        const detector = new BarcodeDetector({ formats: ["qr_code"] });
        qrCameraStream = await navigator.mediaDevices.getUserMedia({ audio:false, video:{ facingMode:{ideal:"environment"}, width:{ideal:1280}, height:{ideal:720} } });
        qrCamera.srcObject = qrCameraStream;
        await qrCamera.play();
        qrScannerStatus.textContent = "Point the camera at the QR code.";
        void scanQrFrame(detector);
      } catch (error) {
        stopQrScanner();
        qrScannerStatus.classList.add("error");
        qrScannerStatus.textContent = error?.name === "NotAllowedError" ? "Camera permission was denied. Allow camera access and try again." : error?.name === "NotFoundError" ? "No usable camera was found on this device." : "Unable to start QR scanning on this browser.";
      }
    }

    async function loadAccount() {
      const loadError = "Unable to load your Ace ID.";

      for (let attempt = 0; attempt < 3; attempt += 1) {
        try {
          const response = await fetch("/api/account", {
            method: "GET",
            credentials: "same-origin",
            cache: "no-store",
            headers: {
              "Accept": "application/json",
              "Cache-Control": "no-cache"
            }
          });

          const data = await readApiPayload(response);

          if (response.status === 401 || response.status === 403) {
            location.replace("/login?return=" + encodeURIComponent(location.pathname + location.search));
            return;
          }

          if (!response.ok) {
            const message = apiErrorMessage(data, "");

            // A transient database/deployment failure should not strand the
            // account screen. Retry briefly before showing the error state.
            if (attempt < 2 && response.status >= 500) {
              await new Promise(resolve => setTimeout(resolve, 350 * (attempt + 1)));
              continue;
            }

            throw new Error(message || loadError);
          }

          renderAccount(data);

          if (data.onboarding_required && accountPage === "profile") {
            setTimeout(openOnboarding, 220);
          }

          loading.classList.add("hidden");
          content.classList.remove("hidden");

          if (new URLSearchParams(location.search).get("verified") === "1") {
            showSnackbar("Your email has been verified.");
            history.replaceState({}, document.title, "/account/profile");
          }

          return;
        } catch (error) {
          if (attempt < 2 && !(error instanceof TypeError)) {
            await new Promise(resolve => setTimeout(resolve, 350 * (attempt + 1)));
            continue;
          }

          const message = error instanceof TypeError
            ? "Ace ID is temporarily unavailable. Check your connection and retry."
            : (error.message || loadError);

          loading.innerHTML =
            '<div class="account-load-error" role="alert">' +
              '<strong>Unable to load Ace ID.</strong>' +
              '<span>' + message.replace(/[&<>"]/g, char => ({
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                "\"": "&quot;"
              }[char])) + '</span>' +
              '<button type="button" id="retryAccountLoad">Retry</button>' +
            '</div>';

          document.getElementById("retryAccountLoad")?.addEventListener("click", () => {
            loading.innerHTML = '<span class="ace-loading">Loading your account…</span>';
            void loadAccount();
          }, { once: true });

          showSnackbar(message);
          return;
        }
      }
    }

    async function checkUsernameAvailability() {
      const username = usernameInput.value.trim().toLowerCase();
      const sequence = ++usernameCheckSequence;

      if (!/^[a-z0-9-]{3,20}$/.test(username)) {
        usernameStatus.innerHTML = username
          ? `<span class="taken">Use 3–20 letters, numbers, or hyphens.</span>`
          : "";
        return;
      }

      if (username === String(account?.username || "").toLowerCase()) {
        usernameStatus.innerHTML = `
          <span class="available">
            <iconify-icon icon="hugeicons:checkmark-circle-02"></iconify-icon>
            This is your current username.
          </span>
        `;
        return;
      }

      usernameStatus.innerHTML = `
        <span class="checking">
          <iconify-icon icon="hugeicons:loading-03"></iconify-icon>
          Checking availability…
        </span>
      `;

      try {
        const response = await fetch(
          "/api/username-availability?username=" +
          encodeURIComponent(username),
          {
            method: "GET",
            credentials: "same-origin",
            headers: { "Accept": "application/json" }
          }
        );

        const data = await readApiPayload(response);

        if (sequence !== usernameCheckSequence) return;

        if (!response.ok) {
          usernameStatus.textContent =
            apiErrorMessage(data, "Unable to check username.");
          return;
        }

        if (!data.valid) {
          usernameStatus.innerHTML = `<span class="taken">Invalid username.</span>`;
          return;
        }

        usernameStatus.innerHTML = data.available
          ? `
            <span class="available">
              <iconify-icon icon="hugeicons:checkmark-circle-02"></iconify-icon>
              Username is available.
            </span>
          `
          : `
            <span class="taken">
              <iconify-icon icon="hugeicons:cancel-circle"></iconify-icon>
              Username is already taken.
            </span>
          `;
      } catch {
        if (sequence === usernameCheckSequence) {
          usernameStatus.textContent = "Unable to check username.";
        }
      }
    }

    function scheduleUsernameCheck() {
      clearTimeout(usernameCheckTimer);
      usernameCheckTimer = setTimeout(checkUsernameAvailability, 350);
    }

    async function saveAccount() {
      if (!account) return;

      const displayName = displayNameInput.value.trim();
      const username = usernameInput.value.trim().toLowerCase();
      const email = emailInput.value.trim().toLowerCase();
      const avatar = avatarUrl.value.trim();

      if (!displayName) {
        showSnackbar("Enter your display name.");
        displayNameInput.focus();
        return;
      }

      if (!/^[A-Za-z0-9-]{3,20}$/.test(username)) {
        showSnackbar(
          "Username must be 3–20 characters and use only A–Z, 0–9, or hyphens."
        );
        usernameInput.focus();
        return;
      }

      if (!emailInput.validity.valid) {
        showSnackbar("Enter a valid email address.");
        emailInput.focus();
        return;
      }

      if (avatar && !isHttpUrl(avatar)) {
        showSnackbar("Profile picture must be a valid HTTP or HTTPS URL.");
        avatarUrl.focus();
        return;
      }

      saveButton.disabled = true;
      cancelButton.disabled = true;
      saveButton.setAttribute("aria-busy", "true");
      saveButton.dataset.originalText = saveButton.textContent.trim();
      saveButton.textContent = "Saving…";

      try {
        const response = await fetch("/api/account", {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            displayName,
            username,
            email,
            avatarUrl: avatar
          })
        });

        const data = await readApiPayload(response);

        if (!response.ok) {
          if (data.error === "username_change_cooldown") {
            const next = data.nextAllowedAt
              ? new Date(data.nextAllowedAt).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })
              : "later";
            throw new Error("Base users can change their username once every 30 days. Next change: " + next + ".");
          }
          throw new Error(
            apiErrorMessage(data, "Unable to update your account.")
          );
        }

        const emailChanged =
          String(account.email || "").toLowerCase() !== email;

        renderAccount(data);
        closeEditor();

        showSnackbar(
          emailChanged
            ? "Ace ID updated. Verify your new email address."
            : "Your account was updated."
        );
      } catch (error) {
        showSnackbar(
          error.message || "Unable to update your account."
        );
      } finally {
        saveButton.disabled = false;
        cancelButton.disabled = false;
        saveButton.removeAttribute("aria-busy");
        saveButton.textContent = saveButton.dataset.originalText || "Save changes";
      }
    }

    async function sendVerificationEmail() {
      if (emailVerificationBusy || account?.email_verified) return;

      emailVerificationBusy = true;

      const button = document.getElementById("verifyEmailButton");
      if (button) {
        button.disabled = true;
        button.textContent = "Sending…";
      }

      try {
        const response = await fetch(
          "/api/email-verification/send",
          {
            method: "POST",
            credentials: "same-origin",
            headers: { "Accept": "application/json" }
          }
        );

        const data = await readApiPayload(response);

        if (!response.ok) {
          if (response.status === 429) {
            const seconds = Number(data.retry_after) || 60;
            throw new Error(
              `Please wait ${seconds} seconds before requesting another email.`
            );
          }

          throw new Error(
            apiErrorMessage(data, "Unable to send verification email.")
          );
        }

        if (data.status === "already_verified") {
          account.email_verified = true;
          renderEmailStatus();
          showSnackbar("Your email is already verified.");
          return;
        }

        showSnackbar("Verification email sent. Check your inbox.");
      } catch (error) {
        showSnackbar(
          error.message || "Unable to send verification email."
        );
      } finally {
        emailVerificationBusy = false;

        const nextButton =
          document.getElementById("verifyEmailButton");

        if (nextButton) {
          nextButton.disabled = false;
          nextButton.textContent = "Verify email";
        }
      }
    }


    async function changeAccountPassword(event) {
      event.preventDefault();

      if (passwordChangeBusy || !account?.email_verified) return;

      const currentPassword = currentPasswordInput.value;
      const newPassword = newPasswordInput.value;
      const confirmPassword = confirmPasswordInput.value;

      if (!currentPassword) {
        passwordStatus.textContent = "Enter your current password.";
        currentPasswordInput.focus();
        return;
      }

      if (newPassword.length < 8 || newPassword.length > 30) {
        passwordStatus.textContent = "Password must be 8–30 characters.";
        newPasswordInput.focus();
        return;
      }

      if (newPassword !== confirmPassword) {
        passwordStatus.textContent = "New passwords do not match.";
        confirmPasswordInput.focus();
        return;
      }

      passwordChangeBusy = true;
      changePasswordButton.disabled = true;
      changePasswordButton.setAttribute("aria-busy", "true");
      changePasswordButton.textContent = "Changing password…";
      passwordStatus.textContent = "";

      try {
        const response = await fetch("/api/account/password", {
          method: "POST",
          credentials: "same-origin",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({
            currentPassword,
            newPassword
          })
        });

        const data = await readApiPayload(response);

        if (!response.ok) {
          if (response.status === 401) {
            location.replace("/login");
            return;
          }

          throw new Error(
            apiErrorMessage(data, "Unable to change your password.")
          );
        }

        passwordForm.reset();
        showSnackbar("Password changed. Sign in again with your new password.");

        setTimeout(() => {
          location.replace("/login");
        }, 700);
      } catch (error) {
        passwordStatus.textContent =
          error.message || "Unable to change your password.";
      } finally {
        passwordChangeBusy = false;
        changePasswordButton.disabled = false;
        changePasswordButton.removeAttribute("aria-busy");
        changePasswordButton.textContent = "Change password";
      }
    }

    function openDeleteModal() {
      deleteConfirmation.value = "";
      confirmDelete.disabled = true;
      deleteModal.classList.add("active");
      deleteModal.setAttribute("aria-hidden", "false");

      setTimeout(() => {
        deleteConfirmation.focus();
      }, 30);
    }

    function closeDeleteDialog() {
      deleteModal.classList.remove("active");
      deleteModal.setAttribute("aria-hidden", "true");
      deleteConfirmation.value = "";
      confirmDelete.disabled = true;
    }

    async function deleteAccount() {
      if (deleteConfirmation.value !== "DELETE") return;

      confirmDelete.disabled = true;
      cancelDelete.disabled = true;
      confirmDelete.setAttribute("aria-busy", "true");
      confirmDelete.textContent = "Deleting…";

      try {
        const response = await fetch("/api/account", {
          method: "DELETE",
          credentials: "same-origin",
          headers: { "Accept": "application/json" }
        });

        const data = await readApiPayload(response);

        if (!response.ok) {
          throw new Error(
            apiErrorMessage(data, "Unable to delete your account.")
          );
        }

        location.replace("/");
      } catch (error) {
        showSnackbar(
          error.message || "Unable to delete your account."
        );

        confirmDelete.disabled = false;
        cancelDelete.disabled = false;
        confirmDelete.removeAttribute("aria-busy");
        confirmDelete.textContent = "Permanently delete";
      }
    }

    let logoutBusy = false;

    async function logout() {
      if (logoutBusy) return;
      logoutBusy = true;
      logoutButton.disabled = true;
      logoutButton.setAttribute("aria-busy", "true");

      try {
        await fetch("/logout", {
          method: "POST",
          credentials: "same-origin",
          headers: { "Accept": "application/json" },
          cache: "no-store"
        });
      } catch {
        // The server clears the session when reachable. Never strand the user on this page.
      } finally {
        location.replace("/");
      }
    }

    avatarUrl.addEventListener("input", () => {
      setAvatar(
        editAvatarImage,
        editAvatarFallback,
        avatarUrl.value.trim(),
        displayNameInput.value.trim()
      );
    });

    displayNameInput.addEventListener("input", () => {
      editAvatarFallback.textContent =
        getInitial(displayNameInput.value);
    });

    usernameInput.addEventListener(
      "input",
      scheduleUsernameCheck
    );

    deleteConfirmation.addEventListener("input", () => {
      confirmDelete.disabled =
        deleteConfirmation.value !== "DELETE";
    });

    switchAccountButton.addEventListener("click", openSwitcher);
    closeSwitcher.addEventListener("click", closeSwitcherDialog);
    addAccountButton.addEventListener("click", () => { haptic("medium"); location.replace("/login?switch=1&return=" + encodeURIComponent("/account")); });
    switcherBackdrop.addEventListener("click", event => { if (event.target === switcherBackdrop) closeSwitcherDialog(); });

    editButton.addEventListener("click", () => { haptic("light"); openEditor(); });
    cancelButton.addEventListener("click", closeEditor);
    saveButton.addEventListener("click", () => { haptic("medium"); saveAccount(); });
    document.getElementById("copyUsernameButton")?.addEventListener("click", () => {
      const value = usernameValue.textContent.trim();
      if (!value || value === "Not set") {
        showSnackbar("Username is not available.");
        return;
      }
      void copyText(value, "Username copied.");
    });
    document.getElementById("copyAccountIdButton")?.addEventListener("click", () => {
      const value = accountIdValue.textContent.trim();
      if (!value || value === "Not available") {
        showSnackbar("Ace ID is not available.");
        return;
      }
      void copyText(value, "Ace ID copied.");
    });
    deleteButton.addEventListener("click", () => { haptic("medium"); openDeleteModal(); });
    qrScanFab.addEventListener("click", () => { haptic("medium"); void openQrApprovalScanner(); });
    closeQrScanner.addEventListener("click", closeQrScannerDialog);
    qrScannerBackdrop.addEventListener("click", event => { if (event.target === qrScannerBackdrop) closeQrScannerDialog(); });
    window.addEventListener("keydown", event => { if (event.key === "Escape" && qrScannerBackdrop.classList.contains("active")) closeQrScannerDialog(); });
    closeDeleteModal.addEventListener("click", closeDeleteDialog);
    cancelDelete.addEventListener("click", closeDeleteDialog);
    confirmDelete.addEventListener("click", deleteAccount);
    logoutButton.addEventListener("click", () => { haptic("medium"); logout(); });
    passwordForm.addEventListener("submit", changeAccountPassword);
    deviceActionForm?.addEventListener("submit", submitDeviceActionForm);
    closeDeviceActionModal?.addEventListener("click", () => closeDeviceActionDialog());
    cancelDeviceAction?.addEventListener("click", () => closeDeviceActionDialog());
    deviceActionModal?.addEventListener("click", event => {
      if (event.target === deviceActionModal) closeDeviceActionDialog();
    });

    const passkeyAccordion = document.getElementById("passkeyAccordion");
    const passkeyPanel = document.getElementById("passkeyPanel");
    const addPasskeyButton = document.getElementById("addPasskeyButton");
    const passkeyAccountList = document.getElementById("passkeyAccountList");
    const passkeyAccountMessage = document.getElementById("passkeyAccountMessage");
    const passkeyAccountStatus = document.getElementById("passkeyAccountStatus");

    async function loadPasskeys() {
      try {
        const response = await fetch("/api/account/passkeys", {
          credentials: "same-origin",
          cache: "no-store",
          headers: { Accept: "application/json" }
        });

        const data = await readApiPayload(response);

        if (!response.ok) {
          throw new Error(apiErrorMessage(data, "Unable to load passkeys."));
        }

        passkeyAccountList.innerHTML = "";

        if (!data.passkeys?.length) {
          const empty = document.createElement("div");
          empty.textContent = "No passkeys registered yet.";
          empty.style.cssText = "padding:12px;border:1px solid var(--line);color:var(--muted);font-size:12px;";
          passkeyAccountList.appendChild(empty);
          return;
        }

        for (const passkey of data.passkeys) {
          const row = document.createElement("div");
          row.style.cssText = "display:flex;align-items:center;justify-content:space-between;gap:12px;padding:12px;border:1px solid var(--line);background:#fff;";

          const copy = document.createElement("div");
          copy.style.cssText = "min-width:0;";
          const title = document.createElement("strong");
          title.textContent = passkey.name || "Passkey";
          title.style.cssText = "display:block;font-size:12px;";
          const meta = document.createElement("span");
          meta.textContent = passkey.last_used_at
            ? "Last used " + new Date(passkey.last_used_at).toLocaleString()
            : "Added " + new Date(passkey.created_at).toLocaleString();
          meta.style.cssText = "display:block;margin-top:3px;color:var(--muted);font-size:11px;";
          copy.append(title, meta);

          const actions = document.createElement("div");
          actions.style.cssText = "display:flex;align-items:center;gap:6px;flex:0 0 auto;";

          const rename = document.createElement("button");
          rename.type = "button";
          rename.textContent = "Rename";
          rename.style.cssText = "min-height:34px;padding:0 10px;border:1px solid var(--line);background:#fff;color:#111;font:inherit;font-size:11px;font-weight:700;cursor:pointer;";
          rename.addEventListener("click", async () => {
            const name = prompt("Name this passkey", passkey.name || "Passkey");
            if (name === null) return;
            rename.disabled = true;
            try {
              const result = await fetch("/api/account/passkeys/" + encodeURIComponent(passkey.id), {
                method: "PATCH", credentials: "same-origin",
                headers: { "Content-Type": "application/json", "Accept": "application/json" },
                body: JSON.stringify({ name })
              });
              const body = await readApiPayload(result);
              if (!result.ok) throw new Error(apiErrorMessage(body, "Unable to rename passkey."));
              passkeyAccountMessage.textContent = "Passkey renamed."; await loadPasskeys();
            } catch (error) {
              passkeyAccountMessage.textContent = error.message || "Unable to rename passkey.";
            } finally { rename.disabled = false; }
          });

          const remove = document.createElement("button");
          remove.type = "button";
          remove.textContent = "Remove";
          remove.style.cssText = "flex:0 0 auto;min-height:34px;padding:0 10px;border:1px solid var(--line);background:#fff;color:#111;font:inherit;font-size:11px;font-weight:700;cursor:pointer;";
          remove.addEventListener("click", async () => {
            if (!confirm("Remove this passkey from your Ace ID?")) return;

            remove.disabled = true;

            try {
              const result = await fetch("/api/account/passkeys/" + encodeURIComponent(passkey.id), {
                method: "DELETE",
                credentials: "same-origin",
                headers: { Accept: "application/json" }
              });

              const body = await readApiPayload(result);

              if (!result.ok) {
                throw new Error(apiErrorMessage(body, "Unable to remove passkey."));
              }

              passkeyAccountMessage.textContent = "Passkey removed.";
              await loadPasskeys();
            } catch (error) {
              remove.disabled = false;
              passkeyAccountMessage.textContent = error.message || "Unable to remove passkey.";
            }
          });

          actions.append(rename, remove);
          row.append(copy, actions);
          passkeyAccountList.appendChild(row);
        }
      } catch (error) {
        passkeyAccountStatus.textContent = error.message || "Unable to load passkeys.";
      }
    }

    async function addPasskey() {
      if (!window.isSecureContext || !window.PublicKeyCredential) {
        passkeyAccountMessage.textContent = "Passkeys are not available in this browser.";
        return;
      }

      addPasskeyButton.disabled = true;
      addPasskeyButton.setAttribute("aria-busy", "true");
      passkeyAccountMessage.textContent = "Waiting for your passkey…";

      try {
        const optionsResponse = await fetch("/api/account/passkeys/options", {
          method: "POST",
          credentials: "same-origin",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          }
        });

        const options = await optionsResponse.json().catch(() => ({}));

        if (!optionsResponse.ok) {
          if (options.error === "reauthentication_required") {
            location.replace("/login?return=" + encodeURIComponent("/account"));
            return;
          }

          throw new Error(apiErrorMessage(options, "Unable to start passkey registration."));
        }

        const passkeyName = prompt("Name this passkey", "Passkey") || "Passkey";

        const registration = await window.passkeyClient.register({
          challenge: options.challenge,
          user: options.user.name,
          userHandle: options.user.id,
          userVerification: "required",
          discoverable: "required",
          timeout: 210000,
          domain: options.rpId
        });

        const verifyResponse = await fetch("/api/account/passkeys", {
          method: "POST",
          credentials: "same-origin",
          cache: "no-store",
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
          body: JSON.stringify({ registration, name: passkeyName })
        });

        const result = await verifyResponse.json().catch(() => ({}));

        if (!verifyResponse.ok) {
          throw new Error(apiErrorMessage(result, "Unable to register passkey."));
        }

        passkeyAccountMessage.textContent = "Passkey added.";
        await loadPasskeys();
      } catch (error) {
        passkeyAccountMessage.textContent =
          error?.name === "NotAllowedError"
            ? "Passkey registration was cancelled."
            : error?.message || "Unable to register passkey.";
      } finally {
        addPasskeyButton.disabled = false;
        addPasskeyButton.removeAttribute("aria-busy");
      }
    }

    passkeyAccordion.addEventListener("click", () => {
      const expanded = passkeyAccordion.getAttribute("aria-expanded") === "true";
      setAccordion(passkeyAccordion, passkeyPanel, !expanded);
      if (!expanded) void loadPasskeys();
    });

    addPasskeyButton.addEventListener("click", () => {
      void addPasskey();
    });

    mfaAccordion.addEventListener("click", () => {
      const expanded = mfaAccordion.getAttribute("aria-expanded") === "true";
      setAccordion(mfaAccordion, mfaPanel, !expanded);
      if (!expanded) void loadMfaStatus();
    });

    mfaRetryButton.addEventListener("click", () => {
      if (mfaRequiresReauth) {
        location.replace("/login?return=" + encodeURIComponent("/account"));
        return;
      }
      void loadMfaStatus();
    });

    mfaSetupButton.addEventListener("click", setupMfa);
    mfaChangeButton.addEventListener("click", () => openSecurityAction("change"));
    mfaConfirmButton.addEventListener("click", confirmMfaSetup);
    mfaCancelButton.addEventListener("click", resetMfaSetup);

    mfaCopyButton.addEventListener("click", () => {
      void copyText(mfaSecret.textContent, "Setup key copied.");
    });

    mfaCopyCodesButton.addEventListener("click", () => {
      void copyText(getRecoveryCodes().join("\n"), "Recovery codes copied.");
    });

    mfaDownloadCodesButton.addEventListener("click", downloadRecoveryCodes);

    mfaSetupCode.addEventListener("input", () => {
      mfaSetupCode.value = mfaSetupCode.value.replace(/\D/g, "").slice(0, 6);
    });
    securityActionCode.addEventListener("input", () => {
      securityActionCode.value = securityActionCodeMode === "recovery"
        ? securityActionCode.value.replace(/[^a-z0-9-]/gi, "").slice(0, 39).toUpperCase()
        : securityActionCode.value.replace(/\D/g, "").slice(0, 6);
    });
    securityUseRecoveryCode?.addEventListener("click", () => {
      if (securityActionKind !== "disable") return;
      securityActionCodeMode = securityActionCodeMode === "recovery" ? "totp" : "recovery";
      const recoveryMode = securityActionCodeMode === "recovery";
      securityActionCode.value = "";
      securityActionCodeLabel.textContent = recoveryMode ? "Recovery code" : "Authenticator code";
      securityUseRecoveryCode.textContent = recoveryMode ? "Use authenticator code instead" : "Use a recovery code instead";
      securityActionCode.inputMode = recoveryMode ? "text" : "numeric";
      securityActionCode.autocomplete = recoveryMode ? "off" : "one-time-code";
      securityActionCode.pattern = recoveryMode ? "[A-Fa-f0-9-]{39}" : "[0-9]{6}";
      securityActionCode.maxLength = recoveryMode ? 39 : 6;
      securityActionCode.placeholder = recoveryMode ? "XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX-XXXX" : "000000";
      securityActionStatus.textContent = "";
      securityActionCode.focus();
    });
    mfaRecoveryButton.addEventListener("click", regenerateMfaCodes);
    mfaDisableButton.addEventListener("click", disableMfa);
    securityActionForm.addEventListener("submit", submitSecurityActionForm);
    securityPasskeyButton?.addEventListener("click", () => {
      void verifyMfaDisableWithPasskey();
    });
    closeSecurityActionModal.addEventListener("click", closeSecurityActionDialog);
    cancelSecurityAction.addEventListener("click", closeSecurityActionDialog);
    securityActionModal.addEventListener("click", event => {
      if (event.target === securityActionModal) closeSecurityActionDialog();
    });

    passwordAccordion.addEventListener(
      "click",
      () => {
        const expanded =
          passwordAccordion.getAttribute("aria-expanded") === "true";
        setAccordion(
          passwordAccordion,
          passwordPanel,
          !expanded
        );
      }
    );

    document
      .querySelectorAll(".password-reveal")
      .forEach(button => {
        button.addEventListener("click", () => {
          const input =
            document.getElementById(
              button.dataset.passwordTarget
            );

          if (!input) return;

          const visible =
            input.type === "text";

          input.type =
            visible ? "password" : "text";

          button.setAttribute(
            "aria-label",
            visible
              ? "Show password"
              : "Hide password"
          );

          const icon =
            button.querySelector("iconify-icon");

          if (icon) {
            icon.setAttribute(
              "icon",
              visible
                ? "hugeicons:view"
                : "hugeicons:view-off"
            );
          }
        });
      });

    deleteModal.addEventListener("click", event => {
      if (event.target === deleteModal) {
        closeDeleteDialog();
      }
    });

    document.addEventListener("keydown", event => {
      if (
        event.key === "Escape" &&
        deleteModal.classList.contains("active")
      ) {
        closeDeleteDialog();
        return;
      }

      if (
        event.key === "Escape" &&
        securityActionModal.classList.contains("active")
      ) {
        closeSecurityActionDialog();
        return;
      }

      if (
        event.key === "Escape" &&
        deviceActionModal?.classList.contains("active")
      ) {
        closeDeviceActionDialog();
        return;
      }

    });

    onboardingViewport.addEventListener("pointerdown", beginOnboardingSwipe);
    onboardingViewport.addEventListener("pointermove", moveOnboardingSwipe);
    onboardingViewport.addEventListener("pointerup", endOnboardingSwipe);
    onboardingViewport.addEventListener("pointercancel", endOnboardingSwipe);
    onboardingViewport.addEventListener("pointerleave", event => {
      if (onboardingDragging && event.pointerType === "mouse") endOnboardingSwipe(event);
    });

    onboardingNext.addEventListener("click", () => {
      if (onboardingIndex >= onboardingSteps.length - 1) {
        void completeOnboarding();
        return;
      }
      setOnboardingIndex(onboardingIndex + 1);
    });

    onboardingBack.addEventListener("click", () => {
      if (onboardingIndex === 0 || onboardingBusy) return;
      setOnboardingIndex(onboardingIndex - 1);
    });

    onboardingSkip.addEventListener("click", () => {
      void completeOnboarding();
    });

    onboardingBackdrop.addEventListener("click", (event) => {
      if (event.target === onboardingBackdrop && !onboardingBusy) {
        void completeOnboarding();
      }
    });

    document.addEventListener("keydown", (event) => {
      if (!onboardingBackdrop.classList.contains("active") || onboardingBusy) return;
      if (event.key === "Escape") void completeOnboarding();
      if (event.key === "ArrowRight") onboardingNext.click();
      if (event.key === "ArrowLeft") onboardingBack.click();
    });

    const qrApprovalModal = document.getElementById("qrApprovalModal");
    const qrApprovalVideo = document.getElementById("qrApprovalVideo");
    const qrApprovalStatus = document.getElementById("qrApprovalStatus");
    const qrApprovalCode = document.getElementById("qrApprovalCode");
    const qrApprovalConfirm = document.getElementById("qrApprovalConfirm");
    const qrApprovalScanAgain = document.getElementById("qrApprovalScanAgain");
    const qrApprovalGalleryButton = document.getElementById("qrApprovalGalleryButton");
    const qrApprovalCloseButton = document.getElementById("qrApprovalCloseButton");
    const closeQrApprovalModal = document.getElementById("closeQrApprovalModal");
    const qrApprovalFab = document.getElementById("qrApprovalFab");
    const qrApprovalGalleryInput = document.getElementById("qrApprovalGalleryInput");
    let qrApprovalStream = null;
    let qrApprovalFrame = 0;
    let qrApprovalUrl = "";

    function stopQrApprovalScanner() {
      if (qrApprovalFrame) cancelAnimationFrame(qrApprovalFrame);
      qrApprovalFrame = 0;
      if (qrApprovalStream) {
        qrApprovalStream.getTracks().forEach(track => track.stop());
        qrApprovalStream = null;
      }
      if (qrApprovalVideo) qrApprovalVideo.srcObject = null;
    }

    function closeQrApprovalScanner() {
      stopQrApprovalScanner();
      qrApprovalUrl = "";
      if (qrApprovalModal) {
        qrApprovalModal.classList.remove("active");
        qrApprovalModal.setAttribute("aria-hidden", "true");
      }
      qrApprovalFab?.classList.remove("qr-fab-hidden");
      document.body.style.overflow = "";
    }

    function openQrApprovalScanner() {
      if (!qrApprovalModal) return;
      qrApprovalModal.classList.add("active");
      qrApprovalModal.setAttribute("aria-hidden", "false");
      qrApprovalFab?.classList.add("qr-fab-hidden");
      document.body.style.overflow = "hidden";
      qrApprovalStatus.textContent = "Starting camera…";
      qrApprovalCode.value = "";
      qrApprovalUrl = "";
      void startQrApprovalScanner();
    }

    function parseQrApprovalUrl(rawValue) {
      try {
        const url = new URL(String(rawValue || ""));
        if (url.origin !== location.origin || url.pathname !== "/login/qr/approve") return null;
        const request = url.searchParams.get("request") || "";
        const secret = url.searchParams.get("secret") || "";
        if (!/^[A-Za-z0-9_-]{20,128}$/.test(request) || secret.length < 32 || secret.length > 256) return null;
        return url.toString();
      } catch {
        return null;
      }
    }

    async function createQrDetector() {
      if (!("BarcodeDetector" in window)) {
        throw new Error("This browser does not provide QR scanning.");
      }

      const formats = await BarcodeDetector.getSupportedFormats();
      if (!formats.includes("qr_code")) {
        throw new Error("This browser cannot scan QR codes.");
      }

      return new BarcodeDetector({ formats: ["qr_code"] });
    }

    async function startQrApprovalScanner() {
      stopQrApprovalScanner();

      if (!window.isSecureContext || !navigator.mediaDevices?.getUserMedia) {
        qrApprovalStatus.textContent = "Camera scanning is unavailable here. Choose a QR image from your gallery instead.";
        return;
      }

      try {
        const detector = await createQrDetector();
        qrApprovalStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: { ideal: "environment" }, width: { ideal: 1280 }, height: { ideal: 1280 } },
          audio: false
        });
        qrApprovalVideo.srcObject = qrApprovalStream;
        await qrApprovalVideo.play();
        qrApprovalStatus.textContent = "Point your camera at the QR code…";

        const scan = async () => {
          if (!qrApprovalStream || qrApprovalModal?.getAttribute("aria-hidden") === "true") return;
          try {
            const codes = await detector.detect(qrApprovalVideo);
            const match = codes.find(code => parseQrApprovalUrl(code.rawValue));
            if (match) {
              qrApprovalUrl = parseQrApprovalUrl(match.rawValue);
              stopQrApprovalScanner();
              qrApprovalStatus.textContent = "QR detected. Enter the matching 2-digit number shown on the other device.";
              qrApprovalCode.focus({ preventScroll: true });
              return;
            }
          } catch {
            // Keep scanning. Camera frames can fail transiently.
          }
          qrApprovalFrame = requestAnimationFrame(scan);
        };

        qrApprovalFrame = requestAnimationFrame(scan);
      } catch (error) {
        qrApprovalStatus.textContent =
          error?.name === "NotAllowedError"
            ? "Camera permission was denied. Allow camera access and scan again."
            : "Unable to start the camera. Use the QR link manually on this device.";
      }
    }

    async function scanQrApprovalImage(file) {
      if (!file || !file.type.startsWith("image/")) {
        qrApprovalStatus.textContent = "Choose an image containing a QR code.";
        return;
      }

      try {
        qrApprovalStatus.textContent = "Reading the QR image…";
        const detector = await createQrDetector();
        let source = null;
        let objectUrl = "";

        try {
          if (window.createImageBitmap) {
            source = await createImageBitmap(file);
          } else {
            objectUrl = URL.createObjectURL(file);
            source = await new Promise((resolve, reject) => {
              const image = new Image();
              image.onload = () => resolve(image);
              image.onerror = () => reject(new Error("Unable to read that image."));
              image.src = objectUrl;
            });
          }

          const codes = await detector.detect(source);
          const match = codes.find(code => parseQrApprovalUrl(code.rawValue));
          if (!match) {
            qrApprovalUrl = "";
            qrApprovalStatus.textContent = "No valid Ace ID sign-in QR code was found in that image.";
            return;
          }

          qrApprovalUrl = parseQrApprovalUrl(match.rawValue);
          stopQrApprovalScanner();
          qrApprovalStatus.textContent = "QR detected. Enter the matching 2-digit number shown on the other device.";
          qrApprovalCode.focus({ preventScroll: true });
        } finally {
          if (source && typeof source.close === "function") source.close();
          if (objectUrl) URL.revokeObjectURL(objectUrl);
        }
      } catch (error) {
        qrApprovalUrl = "";
        qrApprovalStatus.textContent = error?.message || "Unable to read that image. Choose a clearer QR screenshot.";
      } finally {
        qrApprovalGalleryInput.value = "";
      }
    }

    function submitQrApproval() {
      if (!qrApprovalUrl) {
        qrApprovalStatus.textContent = "Scan the QR code first.";
        return;
      }

      const url = new URL(qrApprovalUrl);
      const request = url.searchParams.get("request") || "";
      const secret = url.searchParams.get("secret") || "";
      const code = qrApprovalCode.value.replace(/[^0-9]/g, "").slice(0, 2);
      if (code.length !== 2) {
        qrApprovalStatus.textContent = "Enter the 2-digit matching number.";
        qrApprovalCode.focus();
        return;
      }

      qrApprovalConfirm.disabled = true;
      qrApprovalStatus.textContent = "Checking the matching number…";
      fetch("/api/login/qr/approve", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          request,
          secret,
          approval_code: code
        })
      })
        .then(async response => {
          const data = await readApiPayload(response);
          if (!response.ok) {
            throw new Error(
              data.error === "request_not_found_or_number_mismatch"
                ? "That number does not match. Check the QR screen and try again."
                : apiErrorMessage(data, "Unable to approve this sign-in.")
            );
          }
          qrApprovalStatus.textContent = "Approved. The other device will finish signing in.";
          qrApprovalCode.value = "";
          qrApprovalUrl = "";
          qrApprovalConfirm.disabled = false;
          setTimeout(closeQrApprovalScanner, 900);
          void loadLoginApprovalSettings();
        })
        .catch(error => {
          qrApprovalStatus.textContent = error.message || "Unable to approve this sign-in.";
          qrApprovalConfirm.disabled = false;
        });
    }

        let loginApprovalPollBusy = false;

    async function pollLoginApprovalRequests() {
      if (loginApprovalPollBusy) return;
      loginApprovalPollBusy = true;

      try {
        const response = await fetch("/api/account/login-approvals", {
          credentials: "same-origin",
          cache: "no-store",
          headers: { Accept: "application/json" }
        });

        const data = await readApiPayload(response);
        if (!response.ok || !Array.isArray(data.requests)) return;

        const request = data.requests[0];
        let modal = document.getElementById("loginApprovalPrompt");

        if (!request) {
          if (modal) modal.remove();
          return;
        }

        if (!modal) {
          modal = document.createElement("div");
          modal.id = "loginApprovalPrompt";
          modal.style.cssText = "position:fixed;inset:0;z-index:9999;background:rgba(0,0,0,.42);display:grid;place-items:center;padding:20px;";
          document.body.appendChild(modal);
        }

        modal.innerHTML =
          '<div style="width:min(440px,100%);background:#fff;border:1px solid #111;padding:28px;box-sizing:border-box;box-shadow:0 20px 60px rgba(0,0,0,.22);">' +
            '<div style="font-size:11px;font-weight:800;letter-spacing:.12em;text-transform:uppercase;color:var(--muted);">Ace ID · Sign-in approval</div>' +
            '<h2 style="font:400 38px/1 Georgia,serif;margin:12px 0 8px;">Is this you?</h2>' +
            '<p style="margin:0;color:var(--muted);font-size:13px;line-height:1.5;">A new device is trying to sign in to your account.</p>' +
            '<div style="margin:24px 0;padding:18px;background:#f5f5f2;border:1px solid var(--line);text-align:center;">' +
              '<div style="font-size:10px;text-transform:uppercase;letter-spacing:.12em;color:var(--muted);">Match this number</div>' +
              '<div id="loginApprovalNumber" style="font-size:58px;font-weight:900;letter-spacing:.16em;margin:6px 0 4px;"></div>' +
              '<div id="loginApprovalDevice" style="font-size:11px;color:var(--muted);word-break:break-word;"></div>' +
            '</div>' +
            '<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;">' +
              '<button id="loginApprovalReject" type="button" style="min-height:46px;border:1px solid var(--line);background:#fff;color:#111;font:inherit;font-weight:800;cursor:pointer;">No, deny</button>' +
              '<button id="loginApprovalApprove" type="button" style="min-height:46px;border:1px solid #111;background:#111;color:#fff;font:inherit;font-weight:800;cursor:pointer;">Yes, approve</button>' +
            '</div>' +
          '</div>';
        modal.querySelector("#loginApprovalNumber").textContent = String(request.approval_code || "--");
        modal.querySelector("#loginApprovalDevice").textContent = String(request.user_agent || "Unknown device");

        modal.querySelector("#loginApprovalApprove").onclick = async () => {
          const button = modal.querySelector("#loginApprovalApprove");
          button.disabled = true;
          const result = await fetch("/api/account/login-approvals/" + encodeURIComponent(request.id) + "/approve", {
            method: "POST",
            credentials: "same-origin",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify({ approval_code: String(request.approval_code || "") })
          });
          if (result.ok) modal.remove();
          else button.disabled = false;
        };

        modal.querySelector("#loginApprovalReject").onclick = async () => {
          const button = modal.querySelector("#loginApprovalReject");
          button.disabled = true;
          const result = await fetch("/api/account/login-approvals/" + encodeURIComponent(request.id) + "/reject", {
            method: "POST",
            credentials: "same-origin",
            headers: { Accept: "application/json" }
          });
          if (result.ok) modal.remove();
          else button.disabled = false;
        };
      } finally {
        loginApprovalPollBusy = false;
      }
    }

    let qrTouchStartX = 0;
    let qrTouchStartY = 0;
    let qrTouchTracking = false;

    qrApprovalModal?.addEventListener("touchstart", event => {
      if (!qrApprovalModal.classList.contains("active")) return;
      const touch = event.touches[0];
      if (!touch) return;
      qrTouchStartX = touch.clientX;
      qrTouchStartY = touch.clientY;
      qrTouchTracking = true;
    }, { passive: true });

    qrApprovalModal?.addEventListener("touchend", event => {
      if (!qrTouchTracking) return;
      qrTouchTracking = false;
      const touch = event.changedTouches[0];
      if (!touch) return;
      const dx = touch.clientX - qrTouchStartX;
      const dy = touch.clientY - qrTouchStartY;
      if (Math.abs(dy) > 90 && Math.abs(dy) > Math.abs(dx) * 1.25 && dy > 0) {
        closeQrApprovalScanner();
      }
    }, { passive: true });

    qrApprovalFab?.addEventListener("click", openQrApprovalScanner);
    qrApprovalCloseButton?.addEventListener("click", closeQrApprovalScanner);
    qrApprovalGalleryButton?.addEventListener("click", () => qrApprovalGalleryInput?.click());
    qrApprovalGalleryInput?.addEventListener("change", event => {
      const file = event.target.files?.[0];
      if (!file) return;
      stopQrApprovalScanner();
      void scanQrApprovalImage(file);
    });
    closeQrApprovalModal?.addEventListener("click", closeQrApprovalScanner);
    qrApprovalScanAgain?.addEventListener("click", () => { void startQrApprovalScanner(); });
    qrApprovalConfirm?.addEventListener("click", submitQrApproval);
    qrApprovalCode?.addEventListener("input", () => {
      qrApprovalCode.value = qrApprovalCode.value.replace(/[^0-9]/g, "").slice(0, 2);
    });
    qrApprovalModal?.addEventListener("click", event => {
      if (event.target === qrApprovalModal) closeQrApprovalScanner();
    });

    async function loadLoginApprovalSettings() {
      const settings = document.getElementById("loginApprovalSettings");
      const list = document.getElementById("loginApprovalList");
      const freezeButton = document.getElementById("freezeAccountButton");
      const unfreezeButton = document.getElementById("unfreezeAccountButton");
      const freezeStatus = document.getElementById("accountFreezeStatus");

      try {
        const response = await fetch("/api/account/login-approval-settings", { credentials: "same-origin", cache: "no-store" });
        const data = await readApiPayload(response);
        if (!response.ok) throw new Error(apiErrorMessage(data, "Unable to load login approval settings."));

        settings.innerHTML = '<label style="display:flex;align-items:center;gap:10px;font-size:13px;font-weight:700;"><input id="loginApprovalToggle" type="checkbox" style="width:18px;height:18px;" ' + (data.enabled ? "checked" : "") + '> Require approval for password sign-ins</label>';
        settings.insertAdjacentHTML("beforeend", '<div class="qr-approval-actions"><button id="openQrApprovalScanner" class="mfa-button secondary" type="button">Scan QR to approve sign-in</button></div>');
        document.getElementById("openQrApprovalScanner").addEventListener("click", openQrApprovalScanner);

        document.getElementById("loginApprovalToggle").addEventListener("change", async event => {
          const response = await fetch("/api/account/login-approval-settings", {
            method: "PATCH",
            credentials: "same-origin",
            headers: { "Content-Type": "application/json", "Accept": "application/json" },
            body: JSON.stringify({ enabled: event.target.checked })
          });
          if (!response.ok) event.target.checked = !event.target.checked;
        });

        freezeButton.style.display = data.frozen ? "none" : "";
        unfreezeButton.style.display = data.frozen ? "" : "none";
        freezeStatus.textContent = data.frozen ? "Ace ID is frozen. New sign-ins are blocked." : "";

        const pending = await fetch("/api/account/login-approvals", { credentials: "same-origin", cache: "no-store" }).then(r => readApiPayload(r));
        list.innerHTML = "";
        for (const request of pending.requests || []) {
          const row = document.createElement("div");
          row.style.cssText = "display:flex;align-items:center;justify-content:space-between;gap:10px;padding:12px;border:1px solid var(--line);background:#fff;";
          const copy = document.createElement("div");
          const title = document.createElement("strong");
          title.style.fontSize = "12px";
          title.textContent = "New sign-in";
          const meta = document.createElement("div");
          meta.style.cssText = "margin-top:3px;color:var(--muted);font-size:11px;";
          meta.textContent = request.user_agent || "Unknown device";
          copy.append(title, meta);
          const approve = document.createElement("button");
          approve.type = "button";
          approve.textContent = "Approve";
          approve.style.cssText = "padding:8px 10px;border:1px solid #111;background:#111;color:#fff;font:inherit;font-size:11px;font-weight:700;cursor:pointer;";
          approve.onclick = async () => {
            await fetch("/api/account/login-approvals/" + encodeURIComponent(request.id) + "/approve", { method:"POST", credentials:"same-origin" });
            loadLoginApprovalSettings();
          };
          const reject = document.createElement("button");
          reject.type = "button";
          reject.textContent = "Reject";
          reject.style.cssText = "padding:8px 10px;border:1px solid var(--line);background:#fff;color:#111;font:inherit;font-size:11px;font-weight:700;cursor:pointer;";
          reject.onclick = async () => {
            await fetch("/api/account/login-approvals/" + encodeURIComponent(request.id) + "/reject", { method:"POST", credentials:"same-origin" });
            loadLoginApprovalSettings();
          };
          const actions=document.createElement("div"); actions.style.cssText="display:flex;gap:6px;flex:0 0 auto;"; actions.append(approve,reject);
          row.append(copy,actions); list.appendChild(row);
        }
      } catch (error) {
        settings.textContent = error.message || "Unable to load login approvals.";
      }
    }

    document.getElementById("freezeAccountButton").addEventListener("click", async () => {
      const password = prompt("Enter your password to freeze this account.");
      if (!password) return;
      const response = await fetch("/api/account/freeze", { method:"POST", credentials:"same-origin", headers:{"Content-Type":"application/json"}, body:JSON.stringify({password}) });
      const data = await readApiPayload(response);
      document.getElementById("accountFreezeStatus").textContent = response.ok ? "Ace ID frozen." : (apiErrorMessage(data, "Unable to freeze account."));
      if (response.ok) loadLoginApprovalSettings();
    });

    function enableSheetSwipeUp(sheet) {
      if (!sheet || sheet.dataset.sheetDragBound === "true") return;
      sheet.dataset.sheetDragBound = "true";

      let startY = 0;
      let startX = 0;
      let tracking = false;

      const mobile = () => window.matchMedia("(max-width: 650px)").matches;

      const clearDrag = () => {
        sheet.classList.remove("sheet-dragging");
        sheet.style.removeProperty("transform");
      };

      sheet.addEventListener("touchstart", event => {
        if (!mobile() || event.touches.length !== 1) return;
        const touch = event.touches[0];
        startY = touch.clientY;
        startX = touch.clientX;
        tracking = true;
        sheet.classList.add("sheet-dragging");
      }, { passive: true });

      sheet.addEventListener("touchmove", event => {
        if (!tracking || event.touches.length !== 1) return;

        const touch = event.touches[0];
        const dy = touch.clientY - startY;
        const dx = touch.clientX - startX;

        if (Math.abs(dx) > Math.abs(dy) * 1.2) {
          tracking = false;
          clearDrag();
          return;
        }

        sheet.style.transform = `translate3d(0, ${Math.max(0, dy)}px, 0)`;
      }, { passive: true });

      sheet.addEventListener("touchend", event => {
        if (!tracking) return;
        tracking = false;

        const touch = event.changedTouches[0];
        clearDrag();
        if (!touch) return;

        const dy = touch.clientY - startY;
        const dx = touch.clientX - startX;
        if (Math.abs(dy) <= Math.abs(dx) * 1.2) return;

        const fullscreen = sheet.classList.contains("sheet-fullscreen");

        if (!fullscreen && dy < -70) {
          sheet.classList.add("sheet-fullscreen");
          return;
        }

        if (fullscreen && dy > 110) {
          const backdrop = sheet.closest(
            ".modal-backdrop, .switcher-backdrop, .login-log-sheet-backdrop, .qr-sheet-backdrop, .onboarding-backdrop"
          );
          const close = backdrop?.querySelector(
            ".modal-close, .switcher-close, .login-log-sheet-close"
          );
          if (close instanceof HTMLElement) close.click();
          return;
        }

        if (fullscreen && dy > 70) {
          sheet.classList.remove("sheet-fullscreen");
        }
      }, { passive: true });

      sheet.addEventListener("touchcancel", () => {
        tracking = false;
        clearDrag();
      }, { passive: true });
    }

    [
      document.getElementById("securityActionModal")?.querySelector(".modal"),
      document.getElementById("deviceActionModal")?.querySelector(".modal"),
      document.getElementById("deleteModal")?.querySelector(".modal"),
      document.getElementById("switcherBackdrop")?.querySelector(".switcher"),
      document.getElementById("qrApprovalModal")?.querySelector(".qr-sheet"),
      document.getElementById("onboardingBackdrop")?.querySelector(".onboarding-modal")
    ].forEach(enableSheetSwipeUp);

    const accountTabs = [...document.querySelectorAll(".account-tab")];
    let accountSwipeStartX = 0;
    let accountSwipeStartY = 0;

    content?.addEventListener("touchstart", event => {
      if (document.getElementById("qrApprovalModal")?.classList.contains("active")) return;
      const touch = event.touches[0];
      if (!touch) return;
      accountSwipeStartX = touch.clientX;
      accountSwipeStartY = touch.clientY;
    }, { passive: true });

    content?.addEventListener("touchend", event => {
      if (document.getElementById("qrApprovalModal")?.classList.contains("active")) return;
      const touch = event.changedTouches[0];
      if (!touch) return;
      const dx = touch.clientX - accountSwipeStartX;
      const dy = touch.clientY - accountSwipeStartY;
      if (Math.abs(dx) < 70 || Math.abs(dx) < Math.abs(dy) * 1.35) return;

      const activeIndex = Math.max(0, accountTabs.findIndex(tab => tab.classList.contains("active")));
      const nextIndex = dx < 0 ? activeIndex + 1 : activeIndex - 1;
      const nextTab = accountTabs[nextIndex];
      if (nextTab) nextTab.click();
    }, { passive: true });

    let accountPage =
      location.pathname.match(/^\/account\/(profile|security|devices|danger)\/?$/)?.[1] ||
      "profile";
    let accountPageModule = null;
    let loginApprovalPollTimer = 0;

    const accountPageMeta = {
      profile: {
        title: "Profile — Ace ID",
        heading: "Your profile.",
        subtitle: "Manage the identity connected to your Ace ID."
      },
      security: {
        title: "Security — Ace ID",
        heading: "Security.",
        subtitle: "Protect your Ace ID and control sign-in security."
      },
      devices: {
        title: "Devices — Ace ID",
        heading: "Your devices.",
        subtitle: "Review the devices and sessions connected to your Ace ID."
      },
      danger: {
        title: "Danger — Ace ID",
        heading: "Danger zone.",
        subtitle: "Manage destructive account actions."
      }
    };

    function setAccountTabState(page) {
      document.querySelectorAll(".account-tab[data-account-page-link]").forEach(link => {
        const active = link.dataset.accountPageLink === page;
        link.classList.toggle("active", active);
        if (active) link.setAttribute("aria-current", "page");
        else link.removeAttribute("aria-current");
      });
    }

    function startLoginApprovalPolling() {
      if (loginApprovalPollTimer) return;
      void pollLoginApprovalRequests();
      loginApprovalPollTimer = window.setInterval(() => {
        void pollLoginApprovalRequests();
      }, 2000);
    }

    function stopLoginApprovalPolling() {
      if (!loginApprovalPollTimer) return;
      window.clearInterval(loginApprovalPollTimer);
      loginApprovalPollTimer = 0;
    }

    async function loadAccountPageModule(page) {
      const module = await import("/js/account/pages/" + page + ".js");
      if (!module || typeof module.mount !== "function") {
        throw new Error("Unable to load the " + page + " Ace ID page.");
      }
      return module;
    }

    async function mountAccountPage(page, { push = false } = {}) {
      const nextPage = Object.prototype.hasOwnProperty.call(accountPageMeta, page) ? page : "profile";

      if (nextPage === accountPage && accountPageModule) return;

      if (accountPageModule?.unmount) {
        await accountPageModule.unmount({
          stopLoginApprovalPolling,
          closeSecurityActionDialog: window.__aceSecurity?.close || (() => {})
        });
      }

      const module = await loadAccountPageModule(nextPage);
      const meta = { ...accountPageMeta[nextPage], ...(module.meta || {}) };

      accountPage = nextPage;
      accountPageModule = module;
      document.body.dataset.accountPage = nextPage;
      const sectionDivider = document.querySelector(".account-section-divider");
      if (sectionDivider) {
        sectionDivider.textContent = nextPage === "devices"
          ? "Devices"
          : nextPage === "security"
            ? "Security"
            : nextPage === "danger"
              ? "Danger"
              : "Profile";
      }
      document.title = meta.title;
      const heading = document.querySelector(".header h1");
      const subtitle = document.querySelector(".header .subtitle");
      if (heading) heading.textContent = meta.heading;
      if (subtitle) subtitle.textContent = meta.subtitle;
      setAccountTabState(nextPage);

      if (push) {
        history.pushState({ accountPage: nextPage }, "", "/account/" + nextPage);
      }

      await module.mount({
        page: nextPage,
        root: content,
        startLoginApprovalPolling,
        stopLoginApprovalPolling,
        loadLoginApprovalSettings,
        pollLoginApprovalRequests,
        loadAccount,
        showSnackbar,
        closeQrApprovalScanner,
        closeQrScannerDialog
      });
    }

    document.addEventListener("click", event => {
      const link = event.target.closest?.(".account-tab[data-account-page-link]");
      if (!link) return;
      const href = new URL(link.href, location.origin);
      const match = href.pathname.match(/^\/account\/(profile|security|devices|danger)\/?$/);
      if (!match || href.origin !== location.origin) return;
      event.preventDefault();
      void mountAccountPage(match[1], { push: true }).catch(error => {
        console.error("Account SPA navigation error:", error);
        location.assign(href.href);
      });
    });

    window.addEventListener("popstate", () => {
      const page = location.pathname.match(/^\/account\/(profile|security|devices|danger)\/?$/)?.[1];
      if (!page) return;
      void mountAccountPage(page).catch(error => {
        console.error("Account SPA history navigation error:", error);
        location.reload();
      });
    });

    window.__aceAccount = {
      navigate: page => mountAccountPage(page, { push: true }),
      currentPage: () => accountPage
    };

    loadAccount()
      .then(() => mountAccountPage(accountPage))
      .catch(() => {});

    prewarmAccountSwitcher();
  