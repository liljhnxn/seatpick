import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";

export const metadata: Metadata = {
  title: "SeatPick | Web3 Seat Reservation",
  description: "Pick your spot. Make it yours. Decentralized seat reservations on Botchain Testnet.",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-charcoal-950 text-gray-100 antialiased selection:bg-brand-purple/30 selection:text-brand-purple-light min-h-screen flex flex-col">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}

