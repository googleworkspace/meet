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

import { Project } from "@/components/Project";

type PageParams = {
  params: {
    id: string;
  };
};

/**
 * Page for an individual project/task list
 */
export default function Page({ params }: PageParams) {
  return (
    <div className="flex flex-col items-center w-full min-h-screen px-2">
      <Project id={params.id} />
    </div>
  );
}
