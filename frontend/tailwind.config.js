/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2563eb',
        secondary: '#1e40af',
        accent: '#f59e0b',
      },
      backgroundImage: {
        'globe': "url('data:image/svg+xml;utf8,<svg xmlns=\"http://www.w3.org/2000/svg\" viewBox=\"0 0 1200 600\"><defs><style>.ocean{fill:%23e0f7ff}.land{fill:%2390ee90}.grid{stroke:%23d0d0d0;stroke-width:0.5}.water{fill:%23a8d8ff}</style></defs><rect class=\"ocean\" width=\"1200\" height=\"600\"/><circle class=\"water\" cx=\"600\" cy=\"300\" r=\"280\"/><path class=\"land\" d=\"M300,250 Q350,200 400,250 L400,350 Q350,400 300,350 Z\"/><path class=\"land\" d=\"M700,200 Q750,150 800,200 L800,350 Q750,400 700,350 Z\"/><circle class=\"grid\" cx=\"600\" cy=\"300\" r=\"280\" fill=\"none\"/></svg>')",
      }
    },
  },
  plugins: [],
}
