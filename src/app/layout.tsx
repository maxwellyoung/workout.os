import "./globals.css";
import { GeistMono } from "geist/font/mono";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth/auth-provider";
import { Toaster } from "sonner";

export const metadata = {
  title: "Workout Tracker",
  description: "A minimal, data-driven workout tracker",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body className={`${GeistMono.className} antialiased`}>
        <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black pixel-pattern" />
        <div className="relative">
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <AuthProvider>{children}</AuthProvider>
          </ThemeProvider>
        </div>
        <Toaster theme="dark" position="top-center" />
      </body>
    </html>
  );
}
