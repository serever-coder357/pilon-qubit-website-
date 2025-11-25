import AIWidget from "@/components/AIWidget";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <AIWidget />
      </body>
    </html>
  );
}
