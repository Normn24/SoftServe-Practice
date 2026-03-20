import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React + ReactDOM — 1 чанк
          "react-vendor": ["react", "react-dom"],

          // Redux + RTK + RTK Query — 1 чанк
          "redux-vendor": [
            "@reduxjs/toolkit",
            "react-redux",
          ],

          // React Router — 1 чанк
          "router-vendor": ["react-router-dom"],

          // Форми — завантажується тільки на PaymentPage та AuthForm
          "vendor-forms": ["formik", "yup", "card-validator"],

          // UI + animations
          "ui-vendor": [
            "clsx",
            "framer-motion",
            "lucide-react",
            "react-spinners",
            "react-icons",
          ],

          // Відео + медіа
          "media-vendor": ["react-player", "react-youtube"],

          // Інше
          "other-vendor": [
            "axios",
            "date-fns",
            "lodash",
            "swiper",
          ],
        },
      },
    },
  },
});
