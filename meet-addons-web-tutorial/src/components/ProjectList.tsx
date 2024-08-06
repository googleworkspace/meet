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

import {
  addDoc,
  collection,
  deleteDoc,
  DocumentReference,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { useState } from "react";
import { DocumentSnapshot } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { firebaseApp } from "@/firebase/config";
import { useCollection } from "react-firebase-hooks/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

const db = getFirestore(firebaseApp);
const auth = getAuth(firebaseApp);

type ProjectProps = {
  project: DocumentSnapshot;
  onSelect: (ref: DocumentReference) => void;
  onDelete: (ref: DocumentReference) => void;
  selected: boolean;
};

/**
 * Renders an individual project in the list
 */
export function Project({
  project,
  selected,
  onSelect,
  onDelete,
}: ProjectProps) {
  const data = project.data();
  if (!data) {
    return null;
  }
  let additionalClasses = "";
  if (selected) {
    additionalClasses = "border rounded border-1 border-gray-500 bg-gray-200";
  }
  return (
    <div
      key={project.id}
      className={`flex flex-row justify-between p-4 ${additionalClasses}`}
    >
      <button className="block" onClick={() => onSelect(project.ref)}>
        {data.name}
      </button>
      <button onClick={() => onDelete(project.ref)} type="button">
        <span className="material-icons">delete</span>
        <span className="sr-only">Delete project</span>
      </button>
    </div>
  );
}

export type ProjectListProps = {
  onSelect: (ref: DocumentReference) => void;
};

/**
 * Renders the list of projects a user can see.
 */
export function ProjectList({ onSelect }: ProjectListProps) {
  const [selected, setSelected] = useState("");
  const [user, isUserLoading] = useAuthState(auth);
  const [projects, isProjectListLoading, projectLoadError] = useCollection(
    query(
      collection(db, "projects"),
      where(`roles.${user?.uid ?? "anonymous"}`, "in", [
        "owner",
        "reader",
        "writer",
      ]),
    ),
  );

  if (isProjectListLoading || isUserLoading) {
    return <div>Loading...</div>;
  }

  if (projectLoadError) {
    throw projectLoadError;
  }

  const handleProjectCreate = async () => {
    const ref = await addDoc(collection(db, "projects"), {
      name: "Untitled Project",
      roles: {
        [user!.uid]: "owner",
      },
    });
    setSelected(ref.id);
    onSelect(ref);
  };

  const handleProjectDelete = (ref: DocumentReference) => {
    void deleteDoc(ref);
  };

  const handleProjectSelect = (ref: DocumentReference) => {
    setSelected(ref ? ref.id : "");
    onSelect(ref);
  };

  const children = projects?.docs.map((p) => (
    <Project
      key={p.ref.id}
      project={p}
      selected={p.ref.id === selected}
      onDelete={handleProjectDelete}
      onSelect={handleProjectSelect}
    />
  ));

  return (
    <div className="flex flex-col w-full max-w-2xl">
      <p className="py-2">
        Select a project below or create a new one to get started.
      </p>
      <div className="flex flex-row items-center flex-1 gap-4">
        <h3 className="py-4 text-xl font-bold">Projects</h3>
        <button
          onClick={handleProjectCreate}
          type="button"
          className="inline-flex items-center justify-center gap-2 px-3 py-2 text-sm font-semibold text-white transition-all bg-blue-500 border border-transparent rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
        >
          New project
        </button>
      </div>
      <div className="flex flex-col">{children}</div>
    </div>
  );
}
