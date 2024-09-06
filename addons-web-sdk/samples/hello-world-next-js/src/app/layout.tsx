import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Hello World!',
  description: 'Google Meet Add-on build in Next.js',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
