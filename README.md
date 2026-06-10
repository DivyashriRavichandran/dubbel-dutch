
<div align="center">
<img width="440" height="280" alt="promo-tile" src="https://github.com/user-attachments/assets/2fdcf6f0-0542-4b29-94d5-685c80f47be3" />
</div>

# DubbelDutch

A browser extension that provides real-time English translations for Dutch streaming sites. It integrates subtitles directly into the native video players of NPO Start and Kijk.nl.

## ✨ Features

- **Dual Subtitles:** Displays both Dutch and English simultaneously.
- **Toggle Control:** Easily enable/disable Dutch or English subs independently via the extension popup.
- **Responsive Design:** Subtitles scale perfectly from small laptop screens to 4K monitors.
- **Context-Aware UI:** Subtitles automatically slide up when player controls (seek bar/pause) are visible to prevent overlapping.

## 📖 How to Use

**Install:** Load the extension into Chrome (via the Web Store or as an unpacked developer extension).

**Navigate:** Open any video on NPO.nl or Kijk.nl.

**Enable Native Subs:** Ensure the Dutch subtitles are turned ON in the video player settings (the extension uses these to generate the English translation).

**Customize:** Click the DubbelDutch logo in your toolbar to:

- Toggle the entire extension.

- Show/Hide Dutch or English individually.

**Learn:** Enjoy learning Dutch while watching your favorite shows!

## 🛠️ Tech Stack

- **Framework:** [WXT](https://wxt.dev/) (Web Extension Toolbox)
- **Frontend:** React + TypeScript
- **Styling:** CSS
- **APIs:** Google Translate API (GTX)

## 👨‍💻 Installation (For Developers)

1. Clone the repo: `git clone https://github.com/divyashri-ravichandran/dubbel-dutch.git`
2. Install dependencies: `npm install`
3. Run in development mode: `npm run dev`
4. To build for production: `npm run build`
