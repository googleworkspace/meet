// Copyright 2024 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import { meet } from '@googleworkspace/meet-addons/meet.addons';

// TODO: Make sure that you modify these constants, if you fork this!
const CLOUD_PROJECT_NUMBER = "12345678910";
const MAIN_STAGE_URL = "https://googleworkspace.github.io/meet/samples/hello-world/MainStage.html"

/**
 * Prepares the Add-on Side Panel Client, and adds an event to launch the main
 * stage when the main button is clicked.
 */
async function setUpAddon() {
  const session = await meet.addon.createAddonSession({
    cloudProjectNumber: CLOUD_PROJECT_NUMBER,
  });
  sidePanelClient = await session.createSidePanelClient();
  document.getElementById('start-activity').addEventListener('click', async () => {
    await sidePanelClient.startCollaboration({ mainStageUrl: MAIN_STAGE_URL });
  });
}

export {
  setUpAddon,
};
