/*
 * Copyright 2023 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import "./globals.css";
import { Inter } from "next/font/google";
import { AppHeader } from "@/components/AppHeader";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

type LayoutProps = {
  children: React.ReactNode;
};

/**
 * Root layout for the application
 */
export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body
        className={`bg-white dark:bg-slate-800 text-black dark:text-white ${inter.className}`}
      >
        <Script src="https://www.gstatic.com/meetjs/addons/latest/meet.addons.screenshare.js"></Script>
        <AppHeader />
        <main className="flex flex-col items-center w-full min-h-screen dark:text-slate-200">
          {children}
        </main>
      </body>
    </html>
  );
}
