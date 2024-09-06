import { type Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Pretty Colors',
  description: 'Google Meet Add-on that shows an animation',
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
