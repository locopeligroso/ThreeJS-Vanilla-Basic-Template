// vite.config.js
import { defineConfig } from "vite";
import restart from "vite-plugin-restart";
import glsl from "vite-plugin-glsl";

export default defineConfig({
  root: "src/",
  publicDir: "../static/",
  server: {
    host: "127.0.0.1", // <— invece di true
    port: 5173,
    strictPort: true,
    hmr: { host: "127.0.0.1" }, // utile se Brave blocca l’HMR via IP
  },
  build: { outDir: "../dist", emptyOutDir: true, sourcemap: true },
  plugins: [glsl(), restart({ restart: ["../static/**"] })],
});
