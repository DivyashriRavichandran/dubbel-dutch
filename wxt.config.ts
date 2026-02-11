import { defineConfig } from "wxt";

export default defineConfig({
  modules: ["@wxt-dev/module-react"],
  manifest: {
    permissions: ["storage"],
    host_permissions: ["*://*.kijk.nl/*", "*://*.npo.nl/*"],
    name: "DubbelDutch",
    icons: {
      "16": "icon/128.png",
      "32": "icon/128.png",
      "48": "icon/128.png",
      "96": "icon/128.png",
      "128": "icon/128.png",
    },
  },
});
