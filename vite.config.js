import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    server: {
      host: "0.0.0.0",
      port: "8080",
    },
    define: {
      "process.env.REACT_APP_PUBLIC_SUPABASE_URL": JSON.stringify(env.REACT_APP_PUBLIC_SUPABASE_URL),
      "process.env.REACT_APP_PUBLIC_SUPABASE_ANON_KEY": JSON.stringify(env.REACT_APP_PUBLIC_SUPABASE_ANON_KEY)
    },
    plugins: [react()],
    base: "",
  }
});
