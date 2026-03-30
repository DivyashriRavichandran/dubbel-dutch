import { useState, useEffect } from "react";
import "./style.css";

export default function App() {
  const [dutch, setDutch] = useState("");
  const [english, setEnglish] = useState("");
  const [showEn, setShowEn] = useState(true);
  const [showNl, setShowNl] = useState(true);
  const [globalOn, setGlobalOn] = useState(true);
  const [isControlsVisible, setIsControlsVisible] = useState(false);

  useEffect(() => {
    let observer: MutationObserver | null = null;
    let pollInterval: NodeJS.Timeout | null = null;

    const checkText = () => {
      if (!globalOn) return;

      let cueElement =
        document.querySelector(".jw-text-track-cue") || // JWPlayer (Kijk)
        document.querySelector(".bmpui-ui-subtitle-label"); // Bitmovin (NPO)

      let rawText = cueElement?.textContent?.trim() || "";

      if (rawText) {
        const formattedText = rawText.replace(/([.,!?])([a-zA-Z])/g, "$1 $2");

        if (formattedText !== dutch) {
          translateAndSet(formattedText);
        }
      } else if (dutch !== "") {
        setDutch("");
        setEnglish("");
      }
    };

    // Translate AND update Dutch after translation
    const translateAndSet = async (text: string) => {
      try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=nl&tl=en&dt=t&q=${encodeURIComponent(text)}`;
        const response = await fetch(url);
        const data = await response.json();
        const translated = data[0].map((item: any) => item[0]).join(" ");

        // Update BOTH at the same time
        setDutch(text);
        setEnglish(translated);
      } catch (err) {
        console.error("Translation error:", err);
        // Even on error, show Dutch to avoid blank
        setDutch(text);
        setEnglish("");
      }
    };

    const startObserving = () => {
      // Target containers for both sites
      const targetNode =
        document.querySelector(".jw-text-track-container") ||
        document.querySelector(".bmpui-ui-subtitle-overlay") ||
        document.querySelector(".bitmovinplayer-container");

      if (!targetNode) {
        setTimeout(startObserving, 1000);
        return;
      }

      pollInterval = setInterval(checkText, 500);

      observer = new MutationObserver(checkText);
      observer.observe(targetNode, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    };

    startObserving();

    return () => {
      if (observer) observer.disconnect();
      if (pollInterval) clearInterval(pollInterval);
    };
  }, []);

  useEffect(() => {
    const syncSettings = async () => {
      const res = await browser.storage.local.get([
        "enabled",
        "showDutch",
        "showEnglish",
      ]);
      setGlobalOn((res.enabled as boolean) ?? true);
      setShowNl((res.showDutch as boolean) ?? true);
      setShowEn((res.showEnglish as boolean) ?? true);
    };

    syncSettings();

    // Listen for changes while the video is playing
    const listener = (changes: any) => {
      if (changes.enabled) setGlobalOn(changes.enabled.newValue);
      if (changes.showDutch) setShowNl(changes.showDutch.newValue);
      if (changes.showEnglish) setShowEn(changes.showEnglish.newValue);
    };

    browser.storage.onChanged.addListener(listener);
    return () => browser.storage.onChanged.removeListener(listener);
  }, []);

  useEffect(() => {
    // 1. More robust selectors for the containers that hold the "shown/hidden" classes
    const getPlayerUI = () =>
      document.querySelector(".bmpui-ui-uicontainer") ||
      document.querySelector(".jwplayer");

    const checkVisibility = (el: Element) => {
      // NPO: Check for the 'shown' class
      const npoShown = el.classList.contains("bmpui-controls-shown");

      // Kijk: Check for 'inactive' or 'idle'
      const jwHidden =
        el.classList.contains("jw-flag-user-inactive") ||
        el.classList.contains("jw-state-idle");

      const isJW = el.classList.contains("jwplayer");

      // Logic: If NPO is shown OR (if it's JW and not hidden)
      setIsControlsVisible(npoShown || (isJW && !jwHidden));
    };

    const playerUI = getPlayerUI();
    if (!playerUI) {
      // If player isn't ready, try again in a bit
      const retryTimeout = setTimeout(() => {
        const retryUI = getPlayerUI();
        if (retryUI) checkVisibility(retryUI);
      }, 2000);
      return () => clearTimeout(retryTimeout);
    }

    // 2. Run immediately to set initial state correctly
    checkVisibility(playerUI);

    // 3. Observe for changes
    const observer = new MutationObserver(() => checkVisibility(playerUI));

    observer.observe(playerUI, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  if (!globalOn || !dutch) return null;

  return (
    <div
      className={`dual-sub-wrapper ${isControlsVisible ? "controls-up" : ""}`}
    >
      <div className="bg-subtitles">
        {showNl && <div className="subtitles nl">{dutch}</div>}
        {showEn && <div className="subtitles en">{english}</div>}
      </div>
    </div>
  );
}
