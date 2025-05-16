import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // 👈 rất quan trọng: cho phép mọi IP truy cập
    port: 5173,
  },
});
