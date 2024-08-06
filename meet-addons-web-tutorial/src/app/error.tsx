"use client";

import { firebaseApp } from "@/firebase/config";
import { getAuth } from "firebase/auth";
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
import { useAuthState, useSignInWithGoogle } from "react-firebase-hooks/auth";
import GoogleButton from "react-google-button";

const auth = getAuth(firebaseApp);

type ErrorPageProps = {
  error: any;
  reset: () => void;
};

/**
 * Error boundary for any runtime errors (typically auth related)
 */
export default function ErrorPage({ error, reset }: ErrorPageProps) {
  const [signInWithGoogle] = useSignInWithGoogle(auth);
  const [user, isUserLoading] = useAuthState(auth);

  if (isUserLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return (
      <GoogleButton
        onClick={() => signInWithGoogle().then(reset)}
      ></GoogleButton>
    );
  }

  return (
    <div>
      <p>
        An unexpected error occurred or you do not have access to that page.
      </p>
      <div>
        <button onClick={reset}>Click here to try again.</button>
      </div>
    </div>
  );
}
