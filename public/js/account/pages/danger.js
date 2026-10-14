export const meta = {
  title: "Danger — Ace ID",
  heading: "Danger zone.",
  subtitle: "Manage destructive account actions."
};

export function mount() {
  document.body.dataset.accountPage = "danger";
}

export function unmount() {}
