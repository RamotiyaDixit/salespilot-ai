import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "SalesPilot AI · Sales intelligence", description: "AI-assisted CRM analytics and proactive sales insights." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
