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
  DocumentSnapshot,
  DocumentReference,
  addDoc,
  collection,
  doc,
  updateDoc,
  getFirestore,
} from "firebase/firestore";
import { ChangeEvent, useState } from "react";
import { InlineEditable } from "./Editable";
import { firebaseApp } from "@/firebase/config";
import { useCollection, useDocument } from "react-firebase-hooks/firestore";

const db = getFirestore(firebaseApp);

type ProjectHeaderProps = {
  project: DocumentSnapshot;
};

/**
 * Render the project metadata
 */
function ProjectHeader({ project }: ProjectHeaderProps) {
  const data = project.data();
  if (!data) {
    return null;
  }
  const handleProjectRename = (value: string) => {
    updateDoc(project.ref, { name: value });
  };
  return (
    <div className="flex-1 min-w-0 border-b">
      <h3 className="font-bold">
        <InlineEditable
          reset={false}
          value={data.name}
          onValueChanged={handleProjectRename}
        />
      </h3>
    </div>
  );
}

/**
 * Render section for creating new tasks
 */
function NewTaskInput({ projectRef }: { projectRef: DocumentReference }) {
  const handleNewTask = async (value: string) => {
    if (!value) {
      return;
    }
    await addDoc(collection(projectRef, "tasks"), {
      text: value,
      completed: false,
    });
  };
  return (
    <div className="flex flex-col p-2">
      <div className="py-4">Add a task:</div>
      <InlineEditable
        className="w-full border-2"
        reset={true}
        placeholder="I'd like to..."
        value=""
        onValueChanged={handleNewTask}
      />
    </div>
  );
}

/**
 * Render an individual task
 */
function Task({ task }: { task: DocumentSnapshot }) {
  const data = task.data();
  if (!data) {
    return null;
  }
  const handleTextChange = (value: string) =>
    updateDoc(task.ref, { text: value });
  const handleStatusChange = (e: ChangeEvent<HTMLInputElement>) =>
    updateDoc(task.ref, { completed: e.target.checked });
  return (
    <li key={task.id} className="flex flex-row justify-between px-4 py-1">
      <div>
        <InlineEditable
          reset={false}
          className="w-full"
          value={data.text}
          onValueChanged={handleTextChange}
        ></InlineEditable>
      </div>
      <div>
        <input
          type="checkbox"
          checked={data.completed}
          onChange={handleStatusChange}
        />
      </div>
    </li>
  );
}

export type ProjectProps = {
  id: string;
};

/**
 * Render a project/task list
 */
export function Project({ id }: ProjectProps) {
  const [showCompleted, setShowCompleted] = useState(false);
  const [project, isProjectLoading, projectLoadError] = useDocument(
    doc(db, "projects", id),
  );
  const [tasks, areTasksLoading, tasksLoadError] = useCollection(
    collection(db, "projects", id, "tasks"),
  );

  if (isProjectLoading || areTasksLoading) {
    return <div>Loading...</div>;
  }

  if (projectLoadError) {
    throw projectLoadError;
  }

  if (tasksLoadError) {
    throw tasksLoadError;
  }

  const toggleShowAll = () => {
    setShowCompleted(!showCompleted);
  };

  const taskFilter = (t: DocumentSnapshot) =>
    showCompleted ? true : t.data()?.completed !== true;

  return (
    <div className="w-full">
      <ProjectHeader project={project!} />
      <NewTaskInput projectRef={project!.ref} />
      <div className="flex flex-row items-baseline flex-1 min-w-0">
        <h4 className="p-2 text-xl font-bold">Tasks</h4>
        <button className="text-sm" onClick={toggleShowAll}>
          [{showCompleted ? "Hide completed" : "Show all"}]
        </button>
      </div>
      <ul>
        {tasks!.docs.filter(taskFilter).map((t) => (
          <Task key={t.id} task={t} />
        ))}
      </ul>
    </div>
  );
}
