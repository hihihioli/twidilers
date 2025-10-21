import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Script from "next/script";

export const metadata: Metadata = {
  title: "Twidilers",
  description: "A wonderful website",
  authors: [
    { name: "dereena" },
    { name: "hihihioli" },
    { name: "wall03" }
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <link rel="stylesheet" href="/styles/base.css" />
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
        <Script 
          src="https://kit.fontawesome.com/3881932ce2.js" 
          crossOrigin="anonymous"
          strategy="beforeInteractive"
        />
      </head>
      <body className="flex vert">
        <Navbar user={null} />
        
        {/* Flashes container */}
        <div id="flashes"></div>
        
        {/* Main content */}
        <div id="content">{children}</div>
        
        {/* Footer */}
        <div id="footer-div">
          <section id="footer" style={{width:'100%'}}>
            <b>
              <p style={{marginTop: 0}}>
                This work is licensed under MIT by Twidilers Incorporated. &copy; Copyright{' '}
                <span suppressHydrationWarning>{new Date().getFullYear()}</span>
              </p>
            </b>
          </section>
        </div>
      </body>
    </html>
  );
}
