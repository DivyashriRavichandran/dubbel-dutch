import React, { useEffect, useState } from "react";
import "./style.css";

export default function App() {
  const [settings, setSettings] = useState({
    enabled: true,
    showDutch: true,
    showEnglish: true,
  });

  useEffect(() => {
    // Load saved settings on open
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
        <div className="logo">🇳🇱</div>
        <h1>DubbelDutch</h1>
      </header>

      <section className="main-toggle">
        <label className="switch">
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(e) => updateSetting("enabled", e.target.checked)}
          />
          <span className="slider round"></span>
        </label>
        <span>{settings.enabled ? "Extension ON" : "Extension OFF"}</span>
      </section>

      <div className="settings-grid">
        <div className="setting-item">
          <span>Show Dutch</span>
          <input
            type="checkbox"
            checked={settings.showDutch}
            onChange={(e) => updateSetting("showDutch", e.target.checked)}
          />
        </div>
        <div className="setting-item">
          <span>Show English</span>
          <input
            type="checkbox"
            checked={settings.showEnglish}
            onChange={(e) => updateSetting("showEnglish", e.target.checked)}
          />
        </div>
      </div>

      <footer>
        <p>Learning Dutch on Kijk & NPO</p>
      </footer>
    </div>
  );
}
