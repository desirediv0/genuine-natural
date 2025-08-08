import localFont from "next/font/local";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { CartProvider } from "@/lib/cart-context";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Toaster } from "sonner";
import { RouteGuard } from "@/components/route-guard";
import { ClientOnly } from "@/components/client-only";

const jostFont = localFont({
  src: "./fonts/Jost-Regular.ttf",
  variable: "--font-jost",
  weight: "400",
  display: "swap",
});

const poppinsFont = localFont({
  src: "./fonts/Poppins-Regular.ttf",
  variable: "--font-poppins",
  weight: "400",
  display: "swap",
});

export const metadata = {
  title:
    "Being Genuine Nutrition - Premium Supplements for Your Fitness Journey",
  description:
    "Get high-quality supplements at the best prices. Enjoy a free scratch card with all orders above ₹999.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${jostFont.variable} ${poppinsFont.variable} font-jost antialiased`}
      >
        <ClientOnly
          fallback={
            <div className="flex min-h-screen flex-col">
              <div className="flex-1 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
              </div>
            </div>
          }
        >
          <AuthProvider>
            <CartProvider>
              <div className="flex min-h-screen flex-col">
                <Navbar />
                <main className="flex-1">
                  <RouteGuard>{children}</RouteGuard>
                </main>
                <Footer />
              </div>
              <Toaster position="top-center" richColors closeButton />
            </CartProvider>
          </AuthProvider>
        </ClientOnly>
      </body>
    </html>
  );
}
