import React, { useEffect, useState } from "react";
import "./style.css";

export default function App() {
  const [settings, setSettings] = useState({
    enabled: true,
    showDutch: true,
    showEnglish: true,
  });

  useEffect(() => {
    browser.storage.local
      .get(["enabled", "showDutch", "showEnglish"])
      .then((res) => {
        setSettings({
          enabled: (res.enabled as boolean) ?? true,
          showDutch: (res.showDutch as boolean) ?? true,
          showEnglish: (res.showEnglish as boolean) ?? true,
        });
      });
  }, []);

  const updateSetting = (key: string, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    browser.storage.local.set(newSettings);
  };

  return (
    <div className="popup-container">
      <header>
        <img src="/popup.svg" alt="logo" width={100} height={100} />
      </header>

      <section className={`hero-toggle ${settings.enabled ? "active" : ""}`}>
        <label className="switch">
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(e) => updateSetting("enabled", e.target.checked)}
          />
          <span className="slider round"></span>
        </label>
        <span className="status-text">
          {settings.enabled ? "Active" : "Inactive"}
        </span>
      </section>

      <div className="settings-list">
        <div className="setting-row">
          <div className="text-group">
            <span className="label">Dutch Subtitles</span>
            <span className="sublabel">Native text</span>
          </div>
          <input
            type="checkbox"
            className="small-check"
            checked={settings.showDutch}
            onChange={(e) => updateSetting("showDutch", e.target.checked)}
          />
        </div>

        <div className="setting-row">
          <div className="text-group">
            <span className="label">English Subtitles</span>
            <span className="sublabel">Real-time translation</span>
          </div>
          <input
            type="checkbox"
            className="small-check"
            checked={settings.showEnglish}
            onChange={(e) => updateSetting("showEnglish", e.target.checked)}
          />
        </div>
      </div>

      <footer>
        Compatible with <span>Kijk & NPO</span>
      </footer>
    </div>
  );
}
