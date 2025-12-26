import "./globals.css";
import { ReduxProvider } from "./ReduxProvider";
import LayoutClient from "../components/LayoutClient"; // Import LayoutClient
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

async function getSettings() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_FRONTEND_URL}/api/settings`,{
      cache: "no-store",
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
  };
}

export default async function RootLayout({ children }) {
  const settings = await getSettings();

  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <ReduxProvider>
          <LayoutClient settings={settings}>{children}</LayoutClient>
          <ToastContainer />
        </ReduxProvider>
      </body>
    </html>
  );
}