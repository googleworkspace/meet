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
