import { defineConfig } from "vite";

export default defineConfig({
  server: {
    headers: {
      "Content-Security-Policy":
        "form-action 'self'; img-src 'self' http://localhost:3000 ; style-src 'self' https://cdn.jsdelivr.net/ https://cdnjs.cloudflare.com 'nonce-abcdefgh'  'sha256-SOHhLX6uYgxUm6GqAfZoFtI6B+jag8IEw+xtCNel45E=' 'unsafe-inline'; script-src 'self' http://localhost:5173/ 'nonce-abcdefgh' 'unsafe-inline'; object-src 'none'; base-uri 'self'; report-uri http://localhost:3000/csp-report",
    },
  },
});
