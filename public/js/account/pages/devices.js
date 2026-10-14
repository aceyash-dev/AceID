export const meta = {
  title: "Devices — Ace ID",
  heading: "Your devices.",
  subtitle: "Review the active sessions connected to your Ace ID."
};

export async function mount() {
  document.body.dataset.accountPage = "devices";
  if (!window.__aceDevices?.load) throw new Error("Device session controller is unavailable.");
  await window.__aceDevices.load();
}

export function unmount() {}
