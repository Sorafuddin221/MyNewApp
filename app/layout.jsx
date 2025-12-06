import "./globals.css";
import { ReduxProvider } from './ReduxProvider';
import LayoutClient from '../components/LayoutClient'; // Import LayoutClient

export default function RootLayout({
  children,
}) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <ReduxProvider>
          <LayoutClient>{children}</LayoutClient>
        </ReduxProvider>
      </body>
    </html>
  );
}