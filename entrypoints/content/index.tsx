import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./style.css";

export default defineContentScript({
  matches: ["*://*.kijk.nl/*", "*://*.npo.nl/*"],
  cssInjectionMode: "ui",
  async main(ctx) {
    let ui: any = null;

    // 1. Define the helper function here
    const hideNativeSubs = () => {
      if (document.getElementById("dubbel-dutch-hide-style")) return;

      const style = document.createElement("style");
      style.id = "dubbel-dutch-hide-style";
      style.textContent = `
    /* JWPlayer (Kijk) */
    .jw-text-track-container, .jw-text-track-display, .jw-text-track-cue {
      display: none !important;
    }
    /* Bitmovin (NPO) */
    .bmpui-ui-subtitle-overlay, .bmpui-ui-subtitle-label {
      display: none !important;
      visibility: hidden !important;
    }
  `;
      document.head.append(style);
    };

    const mountToPlayer = async () => {
      const anchorElement =
        document.querySelector(".jw-wrapper") ||
        document.querySelector(".jwplayer") ||
        document.querySelector(".bitmovinplayer-container") ||
        document.querySelector(".bmpui-ui-uicontainer");

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
