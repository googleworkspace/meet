"use client";

import { firebaseApp } from "@/firebase/config";
import { getAuth } from "firebase/auth";
import { ProjectList } from "@/components/ProjectList";
import { createAddonSession } from "@/meet/utils";
import { DocumentReference } from "firebase/firestore";
import { useSearchParams } from "next/navigation";
import { useAuthState, useSignInWithGoogle } from "react-firebase-hooks/auth";
import GoogleButton from "react-google-button";

const auth = getAuth(firebaseApp);

async function startCollaboration(ref: DocumentReference) {
  const url = new URL(window.location.href);

  // Initializing starting state w/URLs and sharing token
  const session = await createAddonSession();
  const client = await session.createSidePanelClient();

  client.setCollaborationStartingState({
    mainStageUrl: `${url.protocol}//${url.host}/meet/project/${ref.id}`,
    sidePanelUrl: `${url.protocol}//${url.host}/meet/sidepanel?participant=true`,
  });
}

export default function Home() {
  const params = useSearchParams();
  const [user] = useAuthState(auth);
  const [signInWithGoogle] = useSignInWithGoogle(auth);

  const handleProjectSelect = async (ref: DocumentReference) => {
    // Before navigating, make sure project selection is saved
    // for when a shared activity is started.
    await startCollaboration(ref);
  };

  if (!user) {
    return (
      <GoogleButton
        onClick={() => signInWithGoogle()}
      ></GoogleButton>
    );
  }

  if (params.get("participant")) {
    return <div>You may now close this panel.</div>;
  }

  return (
    <div className="px-4">
      <ProjectList onSelect={handleProjectSelect} />
    </div>
  );
}
