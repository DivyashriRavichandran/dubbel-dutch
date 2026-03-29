import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./style.css";

export default defineContentScript({
  matches: ["*://*.kijk.nl/*", "*://*.npo.nl/*"],
  cssInjectionMode: "ui",
  async main(ctx) {
    let ui: any = null;

    // Switch ON/OFF
    const updateNativeSubVisibility = (enabled: boolean) => {
      let styleEl = document.getElementById("dubbel-dutch-hide-style");

      if (!enabled) {
        styleEl?.remove(); // Show native subs again
        return;
      }

      if (!styleEl) {
        styleEl = document.createElement("style");
        styleEl.id = "dubbel-dutch-hide-style";
        styleEl.textContent = `
          .jw-text-track-container, .jw-text-track-display, .jw-text-track-cue,
          .bmpui-ui-subtitle-overlay, .bmpui-ui-subtitle-label {
            display: none !important;
            visibility: hidden !important;
          }
        `;
        document.head.append(styleEl);
      }
    };

    const settings = await browser.storage.local.get("enabled");
    updateNativeSubVisibility((settings.enabled as boolean) ?? true);

    browser.storage.onChanged.addListener((changes) => {
      if (changes.enabled) {
        updateNativeSubVisibility(changes.enabled.newValue as boolean);
      }
    });

    browser.storage.onChanged.addListener((changes) => {
      if (changes.enabled) {
        updateNativeSubVisibility(!!changes.enabled.newValue);
      }
    });

    const mountToPlayer = async () => {
      const anchorElement =
        document.querySelector(".jw-wrapper") ||
        document.querySelector(".jwplayer") ||
        document.querySelector(".bitmovinplayer-container") ||
        document.querySelector(".bmpui-ui-uicontainer");

      if (!anchorElement || ui) return false;

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
