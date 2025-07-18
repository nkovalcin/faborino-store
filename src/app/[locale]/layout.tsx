import type { Metadata } from "next";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { LiveChat } from '@/components/chat/live-chat';
import { CartSidebar } from '@/components/cart/cart-sidebar';
import { Toaster } from 'react-hot-toast';
import "../globals.css";

const locales = ['sk', 'cz', 'de', 'fr', 'en', 'en-gb', 'en-ca', 'en-au', 'en-ie', 'en-nz', 'en-za', 'en-sg', 'en-in'];

export const metadata: Metadata = {
  title: "Faborino - Montessori nábytok pre deti",
  description: "Prémiový európsky Montessori nábytok a hračky pre podporu prirodzeného vývoja detí.",
};

export default async function LocaleLayout({
  children,
  params: { locale }
}: {
  children: React.ReactNode;
  params: { locale: string };
}) {
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale as any)) {
    notFound();
  }

  // Get messages with fallback
  let messages;
  try {
    messages = await getMessages();
  } catch (error) {
    console.error('Error loading messages:', error);
    // Fallback basic messages
    messages = {
      navigation: {
        home: "Domov",
        products: "Produkty",
        categories: "Kategórie",
        about: "O nás",
        contact: "Kontakt"
      }
    };
  }

  return (
    <NextIntlClientProvider messages={messages}>
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <CartSidebar />
        <LiveChat />
        <Toaster 
          position="bottom-center"
          toastOptions={{
            duration: 2000,
            style: {
              background: '#3A3A3A',
              color: '#fff',
              borderRadius: '24px',
              padding: '16px 24px',
              fontSize: '14px',
              boxShadow: '0 10px 25px -3px rgba(0, 0, 0, 0.3)',
            },
            success: {
              iconTheme: {
                primary: '#D4A574',
                secondary: '#fff',
              },
            },
          }}
        />
      </div>
    </NextIntlClientProvider>
  );
}