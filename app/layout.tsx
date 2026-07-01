import "@/styles/globals.css";
import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import messages from "@/messages/en.json";

import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Moodio Browse — Coding Challenge",
  description: "Isolated browse page for the Safari performance challenge",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html suppressHydrationWarning lang="en">
      <head />
      <body className="min-h-[100dvh] md:min-h-screen text-foreground bg-background font-sans antialiased">
        <NextIntlClientProvider locale="en" messages={messages}>
          <Providers
            themeProps={{ attribute: "class", defaultTheme: "dark", enableSystem: true }}
          >
            {children}
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
