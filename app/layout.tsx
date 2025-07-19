import { SidebarProvider } from "@/components/ui/sidebar";
import { UnlockGate } from "@/components/unlock-gate";
import type { Metadata } from "next";
import { JetBrains_Mono, Plus_Jakarta_Sans } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Troupe Activity Dashboard",
  description: "Analyze and visualize your group trip activity data",
};

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-sans",
  display: "swap",
});
const jetBrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-mono",
  display: "swap",
});

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Read sidebar_state cookie for persisted sidebar open/close
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <html
      lang="en"
      className={`${plusJakartaSans.variable} ${jetBrainsMono.variable}`}
    >
      <head>
        <meta name="apple-mobile-web-app-title" content="Trip Data" />
      </head>
      <body>
        <SidebarProvider defaultOpen={defaultOpen}>
          <UnlockGate>{children}</UnlockGate>
        </SidebarProvider>
      </body>
    </html>
  );
}
