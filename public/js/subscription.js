(() => {
  "use strict";

  const currentRoot = document.getElementById("current");
  const plansRoot = document.getElementById("plans");
  const status = document.getElementById("status");

  let plans = [];
  let subscription = null;
  let paymentConfigured = false;
  let checkoutBusy = false;

  function escapeHtml(value) {
    return String(value ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }

  function setStatus(message, kind = "") {
    status.textContent = message || "";
    status.className = "status" + (kind ? " " + kind : "");
  }

  function formatPrice(value) {
    const amount = Number(value) || 0;
    if (amount === 0) return "Free";
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      maximumFractionDigits: 0
    }).format(amount) + "/month";
  }

  function formatNumber(value) {
    return new Intl.NumberFormat("en-IN").format(Number(value) || 0);
  }

  function currentPlanId() {
    return String(subscription?.plan || "base").toLowerCase();
  }

  function formatDate(value) {
    const date = value ? new Date(value) : null;
    return date && !Number.isNaN(date.getTime())
      ? date.toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" })
      : "";
  }

  function formatPaymentMethod(value, planId = "base") {
    const method = String(value || "").trim().toLowerCase();
    const labels = {
      card: "Card",
      upi: "UPI",
      netbanking: "Netbanking",
      wallet: "Wallet",
      emi: "EMI",
      bank_transfer: "Bank transfer"
    };
    if (labels[method]) return labels[method];
    if (method) return method.replaceAll("_", " ");
    return String(planId).toLowerCase() === "base"
      ? "Not required on Base"
      : "Not recorded by the payment provider yet";
  }

  const FEATURE_GROUPS = [
    {
      app: "Ace ID",
      features: [
        ["mfa", "Multi-factor authentication"],
        ["passkeys", "Passkeys"],
        ["sessionManagement", "Session and device management"]
      ]
    },
    {
      app: "AIDC",
      features: [
        ["oauthOidc", "OAuth 2.0 / OpenID Connect"],
        ["pkce", "PKCE authorization flow"],
        ["developerConsole", "Developer console"],
        ["apiAccess", "API access"],
        ["customDomain", "Custom domains"]
      ]
    }
  ];

  function featureGroups(features = {}, plan = {}) {
    return FEATURE_GROUPS.map(group => {
      const items = group.features
        .filter(([key]) => features[key] === true)
        .map(([, label]) => label);
      if (group.app === "Ace ID") {
        items.push(plan.usernameChangeCooldownDays
          ? "Username changes every " + plan.usernameChangeCooldownDays + " days"
          : "Username changes without a cooldown");
      }
      return { app: group.app, items };
    }).filter(group => group.items.length > 0);
  }

  function renderFeatureGroups(features, plan, mode = "benefit") {
    const groupClass = mode === "plan" ? "plan-feature-group" : "feature-group";
    const titleClass = mode === "plan" ? "plan-feature-title" : "feature-group-title";
    const itemsClass = mode === "plan" ? "plan-feature-items" : "feature-items";
    const itemClass = mode === "plan" ? "plan-feature-item" : "feature-item";
    return '<div class="' + (mode === "plan" ? "plan-features" : "feature-groups") + '">' +
      featureGroups(features || {}, plan || {}).map(group =>
        '<section class="' + groupClass + '" aria-label="' + escapeHtml(group.app) + ' features">' +
          '<h3 class="' + titleClass + '">' + escapeHtml(group.app) + '</h3>' +
          '<div class="' + itemsClass + '">' +
            group.items.map(label =>
              '<div class="' + itemClass + '"><iconify-icon icon="hugeicons:checkmark-circle-02" aria-hidden="true"></iconify-icon><span>' + escapeHtml(label) + '</span></div>'
            ).join("") +
          '</div>' +
        '</section>'
      ).join("") +
    '</div>';
  }

  function renderCurrent() {
    const plan = plans.find(item => item.id === currentPlanId()) || {
      id: currentPlanId(),
      name: currentPlanId() === "base" ? "Base" : currentPlanId()
    };

    const sub = subscription?.subscription;
    const startDate = formatDate(sub?.billingPeriodStart);
    const endDate = formatDate(sub?.billingPeriodEnd);
    const statusValue = String(subscription?.status || "active").toLowerCase();
    let validity = "Included with your Ace ID account.";
    if (endDate) {
      validity = startDate
        ? `Valid from ${startDate} to ${endDate}.`
        : `Valid through ${endDate}.`;
      if (sub?.cancelAtPeriodEnd && statusValue === "cancelled") {
        validity += " Cancellation is scheduled at the end of this period.";
      }
    } else if (plan.id !== "base") {
      validity = "Validity is managed by the active subscription provider.";
    }

    const groupedFeatures = renderFeatureGroups(subscription?.features || {}, plan, "benefit");

    currentRoot.innerHTML =
      '<div class="current-head">' +
        '<div><div id="current-title" class="eyebrow">Current plan</div>' +
        '<div class="current-name">' + escapeHtml(plan.name) + '</div>' +
        '<div class="current-meta">' + escapeHtml(validity) + '</div></div>' +
        '<span class="badge">' + escapeHtml(statusValue) + '</span>' +
      '</div>' +
      '<div class="usage">' +
        '<div class="usage-item"><div class="usage-label">Applications</div><div class="usage-value">' +
          formatNumber(subscription?.usage?.applications || 0) + " / " + formatNumber(plan.applications) +
        '</div><div class="usage-sub">Used this account</div></div>' +
        '<div class="usage-item"><div class="usage-label">Monthly active users</div><div class="usage-value">' +
          formatNumber(plan.mau) +
        '</div><div class="usage-sub">Monthly limit</div></div>' +
      '</div>' +
      '<div class="payment-method">' +
        '<span class="payment-method-label">Payment method</span>' +
        '<span class="payment-method-value">' + escapeHtml(formatPaymentMethod(sub?.paymentMethod, plan.id)) + '</span>' +
      '</div>' +
      '<div class="current-benefits">' +
        '<div class="benefits-head"><div><div class="usage-label">Included capabilities</div><div class="benefits-title">Grouped by product.</div></div></div>' +
        groupedFeatures +
      '</div>';
  }

  function actionFor(plan) {
    const current = currentPlanId();

    if (plan.id === current) {
      return { label: "Current plan", disabled: true, secondary: true };
    }

    if (plan.id === "base") {
      return { label: "Included", disabled: true, secondary: true };
    }

    if (!paymentConfigured) {
      return { label: "Payments unavailable", disabled: true, secondary: true };
    }

    if (subscription?.status === "active" && current !== "base") {
      return { label: "Already subscribed", disabled: true, secondary: true };
    }

    return { label: "Buy " + plan.name, disabled: checkoutBusy, secondary: false };
  }

  function renderPlans() {
    plansRoot.innerHTML = plans.map(plan => {
      const action = actionFor(plan);
      const current = plan.id === currentPlanId();
      const audience = {
        base: "For personal projects",
        core: "For growing applications",
        apex: "For higher-scale applications"
      }[plan.id] || "For your application";
      return '<article class="plan' + (current ? ' current-plan' : '') + '">' +
        '<div class="plan-topline"><span class="plan-kicker">' + escapeHtml(audience) + '</span>' +
        (current ? '<span class="current-pill">Current</span>' : '') + '</div>' +
        '<div class="plan-name">' + escapeHtml(plan.name) + '</div>' +
        '<div class="price">' + escapeHtml(formatPrice(plan.priceInrMonthly)) + '</div>' +
        '<div class="plan-capacity">' +
          '<div><strong>' + formatNumber(plan.applications) + '</strong><span>applications</span></div>' +
          '<div><strong>' + formatNumber(plan.mau) + '</strong><span>monthly active users</span></div>' +
        '</div>' +
        renderFeatureGroups(plan.features || subscription?.features || {}, plan, "plan") +
        '<button class="plan-action' + (action.secondary ? ' secondary' : '') + '" type="button" data-plan="' + escapeHtml(plan.id) + '"' +
          (action.disabled ? ' disabled' : '') + '>' + escapeHtml(action.label) + '</button>' +
      '</article>';
    }).join("");

    plansRoot.querySelectorAll("[data-plan]").forEach(button => {
      button.addEventListener("click", () => startCheckout(button.dataset.plan));
    });
  }

  async function getJson(url, options) {
    const response = await fetch(url, {
      credentials: "same-origin",
      headers: { "Accept": "application/json", ...(options?.headers || {}) },
      ...options
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      throw new Error(data.error || "request_failed");
    }
    return data;
  }

  async function startCheckout(planId) {
    if (checkoutBusy || !["core", "apex"].includes(planId)) return;

    checkoutBusy = true;
    setStatus("Creating secure checkout…");
    renderPlans();

    try {
      const data = await getJson("/api/subscription/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId })
      });

      const shortUrl = String(data.shortUrl || "").trim();
      let checkoutUrl;
      try {
        checkoutUrl = new URL(shortUrl);
      } catch {
        throw new Error("checkout_url_missing");
      }
      if (!["http:", "https:"].includes(checkoutUrl.protocol)) {
        throw new Error("checkout_url_missing");
      }

      setStatus("Redirecting to Razorpay…", "success");
      location.assign(shortUrl);
    } catch (error) {
      console.error("Subscription checkout failed:", error);
      const messages = {
  checkout_plan_mismatch: "A checkout is already open for another plan. Finish that checkout or wait for it to expire.",
        razorpay_not_configured: "Payments are not configured on Ace ID yet.",
        razorpay_plan_not_configured: "This plan is not configured for checkout yet.",
        subscription_already_active: "That plan is already active.",
        checkout_in_progress: "A checkout is already in progress. Complete the existing payment first.",
        checkout_url_missing: "Checkout could not be started."
      };
      setStatus(messages[error.message] || "Unable to start checkout. Your account was not changed.", "error");
      checkoutBusy = false;
      renderPlans();
    }
  }

  async function load() {
    try {
      const [planData, subscriptionData] = await Promise.all([
        getJson("/api/subscription/plans"),
        getJson("/api/subscription")
      ]);

      plans = Array.isArray(planData.plans) ? planData.plans : [];
      paymentConfigured = Boolean(planData.payments?.razorpayConfigured);
      subscription = subscriptionData || { plan: "base", status: "active" };

      renderCurrent();
      renderPlans();

      if (!paymentConfigured) {
        setStatus("Paid checkout is not configured on this deployment.", "error");
      }
    } catch (error) {
      console.error("Subscription page load failed:", error);
      currentRoot.innerHTML = '<div class="loading">Unable to load your subscription.</div>';
      plansRoot.innerHTML = '<div class="loading">Unable to load plans.</div>';
      setStatus(error.message === "not_authenticated" ? "Your session has expired. Sign in again." : "Unable to load subscription details.", "error");
    }
  }

  load();
})();
