import React, { useState, useEffect } from "react";
import "./style.css";

export default function App() {
  const [dutch, setDutch] = useState("");
  const [english, setEnglish] = useState("");

  useEffect(() => {
    let observer: MutationObserver | null = null;
    let pollInterval: NodeJS.Timeout | null = null;

    const checkText = () => {
      // 1. Try JWPlayer (Kijk)
      let cueElement = document.querySelector(".jw-text-track-cue");

      // 2. Try Bitmovin (NPO)
      if (!cueElement) {
        cueElement = document.querySelector(".bmpui-ui-subtitle-label");
      }

      const currentText = cueElement?.textContent?.trim() || "";

      if (currentText && currentText !== dutch) {
        setDutch(currentText);
        translateText(currentText);
      } else if (!currentText && dutch !== "") {
        setDutch("");
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
  }, [dutch]);

  // 2. Google Translate API (Free Endpoint)
  const translateText = async (text: string) => {
    try {
      const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=nl&tl=en&dt=t&q=${encodeURIComponent(text)}`;
      const response = await fetch(url);
      const data = await response.json();
      const translated = data[0].map((item: any) => item[0]).join(" ");

      setEnglish(translated);
    } catch (err) {
      console.error("DEBUG: Translation Error:", err);
    }
  };

  const [showEn, setShowEn] = useState(true);
  const [showNl, setShowNl] = useState(true);
  const [globalOn, setGlobalOn] = useState(true);

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

  if (!globalOn || !dutch) return null;

  return (
    <div className="dual-sub-wrapper">
      {showNl && <div className="sub-box nl">{dutch}</div>}
      {showEn && <div className="sub-box en">{english}</div>}
    </div>
  );
}
