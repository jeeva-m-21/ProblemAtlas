import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AppShell } from "@/components/layout/AppShell";
import { PageTransition } from "@/components/system/PageTransition";
import { GlobalCommandBar } from "@/components/system/GlobalCommandBar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "ProblemAtlas",
    template: "%s · ProblemAtlas",
  },
  description:
    "Discover deeply validated research and engineering problems. Form solution spaces and collaborate through external artifacts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full bg-background text-foreground">
        <AppShell>
          <PageTransition>{children}</PageTransition>
        </AppShell>

        <GlobalCommandBar />
      </body>
    </html>
  );
}
