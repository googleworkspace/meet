'use client';

import {
  meet,
  MeetSidePanelClient,
} from '@googleworkspace/meet-addons/meet.addons';
import { useEffect, useState } from 'react';
import { CLOUD_PROJECT_NUMBER, MAIN_STAGE_URL } from '../../constants';

/**
 * See: https://developers.google.com/meet/add-ons/guides/overview#side-panel
 */
export default function Page() {
  const [sidePanelClient, setSidePanelClient] = useState<MeetSidePanelClient>();
  const [currentTime, setCurrentTime] = useState<string>('');

  // 現在時刻を更新する関数
  const updateTime = () => {
    const now = new Date();
    setCurrentTime(now.toLocaleTimeString('ja-JP'));
  };

  // 1秒ごとに時刻を更新
  useEffect(() => {
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // Launches the main stage when the main button is clicked.
  async function startActivity(e: unknown) {
    if (!sidePanelClient) {
      throw new Error('Side Panel is not yet initialized!');
    }
    await sidePanelClient.startActivity({ mainStageUrl: MAIN_STAGE_URL });
  }

  /**
   * Prepares the Add-on Side Panel Client.
   */
  useEffect(() => {
    (async () => {
      const session = await meet.addon.createAddonSession({
        cloudProjectNumber: CLOUD_PROJECT_NUMBER,
      });
      setSidePanelClient(await session.createSidePanelClient());
    })();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">現在時刻</h1>
      <div className="text-4xl font-mono mb-6">{currentTime}</div>
      <div className="mb-4">このサイドパネルはあなたにのみ表示されています。</div>
      <button 
        onClick={startActivity}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        メインステージで表示
      </button>
    </div>
  );
}
