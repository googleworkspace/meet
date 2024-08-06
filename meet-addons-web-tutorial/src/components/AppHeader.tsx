"use client";
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

import { firebaseApp } from "@/firebase/config";
import { Popover } from "@headlessui/react";
import { getAuth } from "firebase/auth";
import { useAuthState } from "react-firebase-hooks/auth";

const auth = getAuth(firebaseApp);

type LetterAvatarProps = {
  text: string;
};

/**
 * Render a simple text avatar if user doesn't have a profile image.
 */
function LetterAvatar({ text }: LetterAvatarProps) {
  return (
    <svg
      className="w-8 rounded-full"
      width="32px"
      height="32px"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        width="32"
        height="32"
        style={{ stroke: "rgb(0, 0, 0)", fill: "rgb(120, 144, 156)" }}
      ></rect>
      <text
        style={{
          fill: "rgb(255, 255, 255)",
          fontFamily: "Inter, sans-serif",
          fontSize: "19px",
        }}
        dominantBaseline="middle"
        textAnchor="middle"
        x="50%"
        y="50%"
      >
        {text}
      </text>
    </svg>
  );
}

type ImageAvatarProps = {
  url: string;
};

/**
 * Render an image-based avatar
 */
function ImageAvatar({ url }: ImageAvatarProps) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img alt="Avatar image" src={url} className="w-8 rounded-full" />;
}

/**
 * Render the application title bar.
 */
export function AppHeader() {
  const [user, isUserLoading] = useAuthState(auth);
  let accountInfo = null;
  if (user) {
    let avatar = user.photoURL ? (
      <ImageAvatar url={user.photoURL} />
    ) : (
      <LetterAvatar text={user.displayName?.charAt(0) ?? "?"} />
    );

    //  w-screen max-w-sm px-4 mt-3 transform -translate-x-1/2 left-1/ sm:px-0 lg:max-w-3xl
    accountInfo = (
      <div className="flex flex-col gap-2 text-sm">
        <div className="flex flex-row items-center gap-2">
          <Popover className="relative">
            <Popover.Button className="border-none">{avatar}</Popover.Button>
            <Popover.Panel className="absolute z-10 -translate-x-full">
              <div className="flex flex-col gap-2 p-4 bg-white rounded-lg w-max ring-1">
                <div>{user.displayName}</div>
                <div>
                  <button onClick={() => void auth.signOut()}>Sign out</button>
                </div>
              </div>
            </Popover.Panel>
          </Popover>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-row items-center justify-between px-4 pt-4">
      <h3 className="py-4 text-2xl font-bold">Meet Codelab</h3>
      {accountInfo}
    </div>
  );
}
