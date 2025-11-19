import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  base: "/americano/", // MUST MATCH YOUR REPO NAME
  plugins: [react()],
});
