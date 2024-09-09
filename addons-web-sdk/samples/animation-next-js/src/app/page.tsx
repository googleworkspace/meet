'use client';

import { useEffect } from 'react';
import { meet } from '@googleworkspace/meet-addons/meet.addons.screenshare';
import { CLOUD_PROJECT_NUMBER, SIDE_PANEL_URL } from '../shared/constants';

export default function App() {
  /**
   * Screensharing this page will prompt you to install/open this add-on.
   * When it is opened, it will prompt you to set up the add-on in the side
   * panel before starting the activity for everyone.
   * @see {@link https://developers.google.com/meet/add-ons/guides/screen-sharing}
   */
  useEffect(() => {
    meet.addon.screensharing.exposeToMeetWhenScreensharing({
      cloudProjectNumber: CLOUD_PROJECT_NUMBER,
      // Will open the Side Panel for the activity initiator to set the
      // activity starting state. Activity won't start for other participants.
      sidePanelUrl: SIDE_PANEL_URL,
      startActivityOnOpen: false,
    });
  }, []);

  return (
    <>
      <div>Screenshare this page to promote an add-on.</div>
    </>
  );
}
