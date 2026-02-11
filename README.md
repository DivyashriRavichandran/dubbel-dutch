# DubbelDutch

DubbelDutch is a Google Chrome extension that adds real-time English translations to NPO.nl and Kijk.nl. It’s a simple tool for expats and students that provides an immersive learning experience with dual subtitles displayed simultaneously.

## 🚀 Why I Built This

I’m moving to the Netherlands for my Master’s, so I've been learning Dutch to get ready. I wanted to watch Dutch shows on NPO and Kijk to increase my passive input and enjoy the content without the language barrier. Since these platforms only offer Dutch subtitles, I built DubbelDutch to provide real-time English translations in an immersive way to follow along and understand the content better.

## ✨ Features

**Dual Subtitles:** See the original Dutch text and the English translation simultaneously.

**Deep Integration:** Works directly inside the JWPlayer (Kijk) and Bitmovin (NPO) video containers.

**Instant Toggles:** Use the popup menu to switch the extension on/off, or hide specific languages to test your listening skills.

**Native Feel:** Automatically hides the original clunky player captions to provide a clean, modern subtitle UI.

## 📖 How to Use

**Install:** Load the extension into Chrome (via the Web Store or as an unpacked developer extension).

**Navigate:** Open any video on NPO.nl or Kijk.nl.

**Enable Native Subs:** Ensure the Dutch subtitles are turned ON in the video player settings (the extension uses these to generate the English translation).

**Customize:** Click the DubbelDutch logo in your toolbar to:

- Toggle the entire extension.

- Show/Hide Dutch or English individually.

**Learn:** Enjoy learning Dutch while watching your favorite shows!

## 🛠️ Built With

WXT - Next-gen Web Extension Framework.

React.js - UI components.

CSS3 - Styling.

Google Translate API - Providing real-time, context-aware English translations.

## 👨‍💻 Installation (For Developers)

If you want to run this locally using WXT:

```
# Install dependencies
npm install

# Start development mode (launches a new Chrome instance)
npm run dev

# Build for production
npm run build
```
