import vinext from "vinext";
import { defineConfig } from "vite";

// The interactive page does not need Cloudflare, a database, or server bindings.
// Keep the Vinext development surface lightweight and reproducible in a public clone.
export default defineConfig({
  plugins: [vinext()],
});
