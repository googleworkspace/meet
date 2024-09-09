'use client';

import { useEffect, useState } from 'react';
import {
  meet,
  FrameToFrameMessage,
  MeetMainStageClient,
} from '@googleworkspace/meet-addons/meet.addons';
import { CLOUD_PROJECT_NUMBER } from '../../shared/constants';
import PrettyColors from '@/components/prettyColors';

/**
 * @see {@link https://developers.google.com/meet/add-ons/guides/overview#main-stage}
 */
export default function Page() {
  const [color, setColor] = useState('#00ff00');

  /**
   * Creates a MeetMainStageClient to control the main stage of the add-on.
   * https://developers.google.com/meet/add-ons/reference/websdk/addon_sdk.meetmainstageclient
   */
  async function initializeMainStageClient(): Promise<MeetMainStageClient> {
    const session = await meet.addon.createAddonSession({
      cloudProjectNumber: CLOUD_PROJECT_NUMBER,
    });
    return await session.createMainStageClient();
  }

  /**
   * Parses the collaboration starting state from the side panel, and updates
   * the color used for the main animation.
   */
  async function setStartingState(mainStageClient: MeetMainStageClient) {
    const startingState = await mainStageClient.getActivityStartingState();
    const additionalData = JSON.parse(startingState.additionalData ?? '{}');
    setColor(additionalData.startingColor);
  }

  /**
   * Listens for new frame-to-frame messages from the side panel that update
   * the color used for the main animation.
   */
  function awaitNewColor(mainStageClient: MeetMainStageClient) {
    mainStageClient.on(
      'frameToFrameMessage',
      (message: FrameToFrameMessage) => {
        setColor(message.payload);
      }
    );
  }

  useEffect(() => {
    /**
     * Initialize the main stage by initializing the client, then using that
     * client to get the starting state (color), and observe any new colors
     * passed from the Side Panel.
     */
    async function initializeMainStage() {
      const client = await initializeMainStageClient();
      setStartingState(client);
      awaitNewColor(client);
    }
    initializeMainStage();
  }, []);

  return (
    <>
      <PrettyColors baseColor={color}></PrettyColors>
    </>
  );
}
