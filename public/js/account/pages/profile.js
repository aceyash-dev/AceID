export const meta = {
  title: "Profile — Ace ID",
  heading: "Your profile.",
  subtitle: "Manage the identity connected to your Ace ID."
};

export function mount() {
  document.body.dataset.accountPage = "profile";
}

export function unmount() {}
