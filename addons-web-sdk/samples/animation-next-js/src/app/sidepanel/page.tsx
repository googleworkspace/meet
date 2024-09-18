'use client';

import { useEffect, useState } from 'react';
import {
  meet,
  MeetSidePanelClient,
} from '@googleworkspace/meet-addons/meet.addons';
import {
  ACTIVITY_SIDE_PANEL_URL,
  CLOUD_PROJECT_NUMBER,
  MAIN_STAGE_URL,
} from '../../shared/constants';

/**
 * @see {@link https://developers.google.com/meet/add-ons/guides/overview#side-panel}
 */
export default function Page() {
  const [sidePanelClient, setSidePanelClient] = useState<MeetSidePanelClient>();

  /**
   * Starts the add-on activity and passes the selected color to the Main Stage,
   * as part of the activity starting state.
   */
  async function startCollaboration(e: unknown) {
    if (!sidePanelClient) {
      throw new Error('Side Panel is not yet initialized!');
    }

    const startingColor = (
      document.getElementById('starting-color')! as HTMLInputElement
    ).value;
    await sidePanelClient.startActivity({
      mainStageUrl: MAIN_STAGE_URL,
      sidePanelUrl: ACTIVITY_SIDE_PANEL_URL,
      // Pass the selected color to customize the initial display.
      additionalData: `{\"startingColor\": \"${startingColor}\"}`,
    });
    window.location.replace(ACTIVITY_SIDE_PANEL_URL + window.location.search);
  }

  useEffect(() => {
    /**
     * Initializes the Add-on Side Panel Client.
     * https://developers.google.com/meet/add-ons/reference/websdk/addon_sdk.meetsidepanelclient
     */
    async function initializeSidePanelClient() {
      const session = await meet.addon.createAddonSession({
        cloudProjectNumber: CLOUD_PROJECT_NUMBER,
      });
      const client = await session.createSidePanelClient();
      setSidePanelClient(client);
    }
    initializeSidePanelClient();
  }, []);

  return (
    <>
      <div>
        Welcome to Pretty Colors! This is a contrived demo add-on that lets you
        look at an animation involving your favorite color.
      </div>
      <label htmlFor="starting-color">
        Pick a color you like. Everyone will see this:
      </label>
      <input
        aria-label="Color picker for animation in main stage"
        type="color"
        id="starting-color"
        name="starting-color"
        defaultValue="#00ff00"
      />
      <br />
      <button
        aria-label="Launch activity for all participants"
        onClick={startCollaboration}
      >
        Start activity
      </button>
    </>
  );
}
