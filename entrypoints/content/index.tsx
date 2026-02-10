import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./style.css";

export default defineContentScript({
  matches: ["*://www.kijk.nl/*", "*://www.npo.nl/*"],
  cssInjectionMode: "ui",
  async main(ctx) {
    let ui: any = null;

    // 1. Define the helper function here
    const hideNativeSubs = () => {
      // Check if we've already added the style to avoid duplicates
      if (document.getElementById("dubbel-dutch-hide-style")) return;

      const style = document.createElement("style");
      style.id = "dubbel-dutch-hide-style";
      style.textContent = `
        .jw-text-track-container, 
        .jw-text-track-display, 
        .jw-text-track-cue,
        .tp-caption { 
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
        }
      `;
      document.head.append(style);
    };

    const mountToPlayer = async () => {
      const anchorElement =
        document.querySelector(".jw-wrapper") ||
        document.querySelector(".jwplayer") ||
        document.querySelector(".npo-player-container");

      if (!anchorElement || ui) return false;

      // 2. Call it right before mounting
      hideNativeSubs();

      ui = await createShadowRootUi(ctx, {
        name: "dubbel-dutch-ui",
        position: "inline",
        anchor: anchorElement,
        append: "last",
        onMount: (container) => {
          const root = ReactDOM.createRoot(container);
          root.render(<App />);
          return root;
        },
        onRemove: (root) => {
          root?.unmount();
        },
      });

      ui.mount();
      return true;
    };

    const checkInterval = setInterval(async () => {
      const success = await mountToPlayer();
      if (success) clearInterval(checkInterval);
    }, 100);
  },
});
