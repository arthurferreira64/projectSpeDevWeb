import { defineConfig } from "vite";

export default defineConfig({
  server: {
    headers: {
      "Content-Security-Policy":
        "form-action 'self'; img-src 'self' http://localhost:5173/public/assets/images; style-src https://cdn.jsdelivr.com/ 'nonce-your-nonce' 'sha256-SOHhLX6uYgxUm6GqAfZoFtI6B+jag8IEw+xtCNel45E='; script-src 'self' http://localhost:5173/ 'nonce-your-nonce' 'unsafe-inline'; object-src 'none'; base-uri 'self'; report-uri http://localhost:5000/csp-report",
    },
  },
});
