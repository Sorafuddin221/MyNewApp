import SessionTimeout from '../components/SessionTimeout';
import "./globals.css";
import { ReduxProvider } from "./ReduxProvider";
import LayoutClient from "../components/LayoutClient"; // Import LayoutClient
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

async function getSettings() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/settings`,{
      next: { revalidate: 3600 },
    });
    if (!res.ok) {
      throw new Error('Failed to fetch settings');
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching settings:', error);
    return {
      siteTitle: "My E-Shop",
      siteLogoUrl: "",
      siteFaviconUrl: "",
      textIcon: "",
    };
  }
}

export async function generateMetadata() {
  const settings = await getSettings();
  return {
    title: {
      template: `%s | ${settings.siteTitle}`,
      default: settings.siteTitle,
    },
    description: "An e-commerce application built with Next.js and Redux.",
    icons: {
      icon: settings.siteFaviconUrl || "/favicon.ico",
      shortcut: settings.siteFaviconUrl || "/favicon.ico",
      apple: settings.siteFaviconUrl || "/apple-touch-icon.png",
      other: [
        { rel: 'apple-touch-icon-precomposed', url: settings.siteFaviconUrl || '/apple-touch-icon-precomposed.png' },
        { rel: 'icon', type: 'image/png', sizes: '16x16', url: settings.siteFaviconUrl || '/favicon-16x16.png' },
        { rel: 'icon', type: 'image/png', sizes: '32x32', url: settings.siteFaviconUrl || '/favicon-32x32.png' },
      ],
    },
  };
}

export default async function RootLayout({ children }) {
  const settings = await getSettings();

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <ReduxProvider>
          <SessionTimeout />
          <LayoutClient settings={settings}>{children}</LayoutClient>
          <ToastContainer />
        </ReduxProvider>
        <div id="portal-root"></div>
      </body>
    </html>
  );
}