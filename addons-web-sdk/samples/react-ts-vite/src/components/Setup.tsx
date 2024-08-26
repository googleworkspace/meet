import { useEffect, useState } from 'react';
import { meet } from '@googleworkspace/meet-addons/meet.addons';
import { CLOUD_PROJECT_NUMBER, MAIN_STAGE_URL } from '../constants';

function Setup() {
  const [sidePanelClient, setSidePanelClient] = useState(null);

  async function startCollaboration(e) {
    if (!sidePanelClient) {
      throw new Error("Side Panel is not yet initialized!");
    }
    await sidePanelClient.startCollaboration({ mainStageUrl: MAIN_STAGE_URL });
  }

  useEffect(() => {
    async function setUpAddon() {
      const session = await meet.addon.createAddonSession({
        cloudProjectNumber: CLOUD_PROJECT_NUMBER,
      });
      setSidePanelClient(await session.createSidePanelClient());
    }
    setUpAddon();
  }, []);

  return (
    <>
      <div>This is the Add-on Side Panel. Only you can see this.</div>
      <button onClick={startCollaboration}>Launch Activity in Main Stage.</button>
    </>
  )
}

export default Setup;
