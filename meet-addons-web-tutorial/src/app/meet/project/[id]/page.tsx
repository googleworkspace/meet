"use client";

import { Project } from "@/components/Project";
import { createAddonSession } from "@/meet/utils";
import { firebaseApp } from "@/firebase/config";
import { getAuth, User } from "firebase/auth";
import { useRouter } from "next/navigation";
import { useAuthState, useSignInWithGoogle } from "react-firebase-hooks/auth";
import GoogleButton from "react-google-button";

const auth = getAuth(firebaseApp);

// Monitor auth state changes.
if (typeof window !== "undefined") {
  auth.onAuthStateChanged(() => {
    onAuthStateSettled(auth.currentUser);
  });

  auth.authStateReady().then(() => {
    onAuthStateSettled(auth.currentUser);
  });
}

/**
 * Check for auth & doc access when auth state changes.
 *
 */
async function onAuthStateSettled(user: User | null | undefined) {
  const session = await createAddonSession();
  const client = await session.createMainStageClient();

  // For participants, side panel should be closed after authentication
  await client.unloadSidePanel();
}

type PageParams = {
  params: {
    id: string;
  };
};
export default function Page({ params }: PageParams) {
  const router = useRouter();
  const [user, isUserLoading] = useAuthState(auth);
  const [signInWithGoogle] = useSignInWithGoogle(auth);

  if (window.meet.addon.getFrameType() === "MAIN_STAGE") {
    if (isUserLoading) {
      return <div>Loading...</div>;
    }
  }

  if (!user) {
    return (
        <GoogleButton
          onClick={() => signInWithGoogle()}
        ></GoogleButton>
      );
  }

  let backButton = null;
  if (window.meet.addon.getFrameType() === "SIDE_PANEL") {
    backButton = (
      <div className="px-2 pb-2 -my-2">
        <button className="flex flex-row" onClick={() => router.back()}>
          <span className="material-icons">arrow_back</span>previous screen
          <div className="sr-only">navigate back</div>
        </button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen px-2">
      {backButton}
      <div className="flex flex-col min-h-screeen">
        <Project id={params.id} />
      </div>
    </div>
  );
}
