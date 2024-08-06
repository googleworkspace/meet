"use client";

import Script from "next/script";
import { useState } from "react";

type LayoutProps = {
  children: React.ReactNode;
};

/**
 * Layout for the add-on pages. Injects the Meet SDK script.
 */
export default function RootLayout({ children }: LayoutProps) {
  const [sdkAvailable, setSdkAvailable] = useState(false);
  return (
    <>
      <Script
        src="https://www.gstatic.com/meetjs/addons/0.1.0/meet.addons.js"
        onReady={() => setSdkAvailable(true)}
      />
      {sdkAvailable ? children : <div>Loading...</div>}
    </>
  );
}
