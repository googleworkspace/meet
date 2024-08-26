"use client";

import { useEffect } from 'react';
import { meet } from '@googleworkspace/meet-addons/meet.addons';
import { CLOUD_PROJECT_NUMBER } from '../../constants';

/**
 * See: https://developers.google.com/meet/add-ons/guides/overview#main-stage
 */
export default function Page() {
  useEffect(() => {
    /**
     * Prepares the Add-on Main Stage Client, which signals that the add-on has
     * successfully launched in the main stage.
     */
    async function initializeMainStage() {
      const session = await meet.addon.createAddonSession({
        cloudProjectNumber: CLOUD_PROJECT_NUMBER,
      });
      await session.createMainStageClient();
    }
    initializeMainStage();
  }, []);


  return (
    <>
      <div>This is the Add-on Main Stage. Everyone in the call can see this.</div>
      <div>Hello, world!</div>
    </>
  )
}
