import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "ReUbuntu - Merchant Portal",
  description:
    "The only inventory portal designed specifically for deadstock and resale merchants.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} font-sans antialiased`}>
        <Providers>{children}</Providers>
        <script>
          var vapiInstance = null;
          var assistant = "30a93baf-5a56-4d11-99c0-fb8f82b2c7cb";
          var apiKey = "8b07b177-09e9-45c0-8e81-97623ca80d24";
          (function (d, t) {
            var g = document.createElement(t),
              s = d.getElementsByTagName(t)[0];
            g.src =
              "https://cdn.jsdelivr.net/gh/VapiAI/html-script-tag@latest/dist/assets/index.js";
            g.defer = true;
            g.async = true;
            s.parentNode.insertBefore(g, s);
            g.onload = function () {
              vapiInstance = window.vapiSDK.run({
                apiKey: apiKey,
                assistant: assistant,
                config: {
                  position: "bottom-right",
                  idle: {
                    color: "#1a73e8",
                    type: "pill",
                    label: "Chat with us",
                  },
                },
              });
            };
          })(document, "script");
        </script>
      </body>
    </html>
  );
}
