export const meta = {
  title: "Security — Ace ID",
  heading: "Security.",
  subtitle: "Protect your Ace ID and control sign-in security."
};

export function mount({ startLoginApprovalPolling, loadLoginApprovalSettings }) {
  void loadLoginApprovalSettings();
  startLoginApprovalPolling();
}

export function unmount({ stopLoginApprovalPolling, closeQrApprovalScanner, closeQrScannerDialog }) {
  stopLoginApprovalPolling();
  closeQrApprovalScanner?.();
  closeQrScannerDialog?.();
  document.getElementById("loginApprovalPrompt")?.remove();
}
