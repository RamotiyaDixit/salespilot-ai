import type { Config } from "tailwindcss";
const config: Config = { content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"], theme: { extend: { colors: { ink: "#172033", mint: "#c8f5db", canvas: "#f6f8fb" }, boxShadow: { soft: "0 10px 35px rgba(25, 38, 67, .06)" } } }, plugins: [] };
export default config;
