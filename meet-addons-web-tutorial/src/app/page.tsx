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

import { ProjectList } from "@/components/ProjectList";
import { firebaseApp } from "@/firebase/config";
import { getAuth } from "firebase/auth";
import { DocumentReference } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { useAuthState, useSignInWithGoogle } from "react-firebase-hooks/auth";
import GoogleButton from "react-google-button";

const auth = getAuth(firebaseApp);

/**
 * Main application home page.
 */
export default function Home() {
  const router = useRouter();
  const [signInWithGoogle] = useSignInWithGoogle(auth);
  const [user, isUserLoading] = useAuthState(auth);
  const handleProjectSelect = (ref: DocumentReference) => {
    router.push(`/project/${ref.id}`);
  };
  if (isUserLoading) {
    return null;
  }
  if (!user) {
    return <GoogleButton onClick={() => signInWithGoogle()}></GoogleButton>;
  }
  return (
    <div className="px-4">
      <ProjectList onSelect={handleProjectSelect} />
    </div>
  );
}
