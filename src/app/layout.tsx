import type { Metadata } from "next";
import React from "react";
import "./globals.css";
import Widget from "./components/ai/Widget";

export const metadata: Metadata = {
  title: "Pilon Qubit Ventures",
  description:
    "Pilon Qubit Ventures: venture building, capital, and strategy for frontier founders.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white">
        {children}
        <Widget />
      </body>
    </html>
  );
}
