'use client';

import {
  meet,
  MeetMainStageClient,
} from '@googleworkspace/meet-addons/meet.addons';
import { useEffect, useState } from 'react';
import { CLOUD_PROJECT_NUMBER } from '../../constants';

/**
 * See: https://developers.google.com/meet/add-ons/guides/overview#main-stage
 */
export default function Page() {
  const [mainStageClient, setMainStageClient] = useState<MeetMainStageClient>();
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

  /**
   * Prepares the Add-on Main Stage Client, which signals that the add-on has
   * successfully launched in the main stage.
   */
  useEffect(() => {
    (async () => {
      const session = await meet.addon.createAddonSession({
        cloudProjectNumber: CLOUD_PROJECT_NUMBER,
      });
      setMainStageClient(await session.createMainStageClient());
    })();
  }, []);

  return (
    <div className="p-8 text-center">
      <h1 className="text-3xl font-bold mb-6">Meet アドオン - 時計</h1>
      <div className="text-6xl font-mono mb-8">{currentTime}</div>
      <p className="text-gray-600">このページは全ての参加者に表示されています</p>
    </div>
  );
}
