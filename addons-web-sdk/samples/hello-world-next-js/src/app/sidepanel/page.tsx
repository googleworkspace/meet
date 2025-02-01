'use client';

import {
  meet,
  MeetSidePanelClient,
} from '@googleworkspace/meet-addons/meet.addons';
import { useEffect, useState } from 'react';
import { CLOUD_PROJECT_NUMBER, MAIN_STAGE_URL } from '../../constants';

type ApiResponse = {
  data: {
    bullet_points: string[];
    action_items: string[];
  };
};

/**
 * See: https://developers.google.com/meet/add-ons/guides/overview#side-panel
 */
export default function Page() {
  const [sidePanelClient, setSidePanelClient] = useState<MeetSidePanelClient>();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [summary, setSummary] = useState<ApiResponse['data'] | null>(null);
  const [error, setError] = useState<string>('');

  // 現在時刻を更新する関数
  const updateTime = () => {
    const now = new Date();
    setCurrentTime(now.toLocaleTimeString('ja-JP'));
  };

  // APIからデータを取得
  const fetchSummary = async () => {
    try {
      const response = await fetch('https://zenn-hackathon-2025-backend-666593730950.asia-northeast1.run.app/summarize_meeting');
      if (!response.ok) {
        throw new Error('APIの呼び出しに失敗しました');
      }
      const data: ApiResponse = await response.json();
      setSummary(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    }
  };

  // 1秒ごとに時刻を更新
  useEffect(() => {
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  // 初回マウント時にAPIからデータを取得
  useEffect(() => {
    fetchSummary();
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

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {summary && (
        <div className="mb-6">
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">会議の要点</h2>
            <ul className="list-disc pl-5">
              {summary.bullet_points.map((point, index) => (
                <li key={index} className="mb-1">{point}</li>
              ))}
            </ul>
          </div>

          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">アクションアイテム</h2>
            <ul className="list-disc pl-5">
              {summary.action_items.map((item, index) => (
                <li key={index} className="mb-1">{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

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
