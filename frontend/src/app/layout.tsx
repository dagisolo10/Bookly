import "./globals.css";

import { cn } from "@/lib/utils";
import { defaultMetadata } from "@/lib/metadata";
import QueryProvider from "@/components/query-provider";
import { Inter, Manrope, Playfair_Display, Poppins } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-playfair" });
const manrope = Manrope({ subsets: ["latin"], variable: "--font-manrope", weight: "300" });
const poppins = Poppins({ subsets: ["latin"], variable: "--font-poppins", weight: "300" });

export const metadata = defaultMetadata;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={cn("font-sans antialiased", inter.variable, manrope.variable, playfair.variable, poppins.variable)}
        >
            <body className="min-h-screen">
                <QueryProvider>{children}</QueryProvider>
            </body>
        </html>
    );
}
