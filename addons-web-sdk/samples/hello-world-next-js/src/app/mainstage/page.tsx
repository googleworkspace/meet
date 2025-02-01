'use client';

import {
  meet,
  MeetMainStageClient,
} from '@googleworkspace/meet-addons/meet.addons';
import { useEffect, useState } from 'react';
import { CLOUD_PROJECT_NUMBER } from '../../constants';

type ApiResponse = {
  data: {
    bullet_points: string[];
    action_items: string[];
  };
};

/**
 * See: https://developers.google.com/meet/add-ons/guides/overview#main-stage
 */
export default function Page() {
  const [mainStageClient, setMainStageClient] = useState<MeetMainStageClient>();
  const [currentTime, setCurrentTime] = useState<string>('');
  const [summary, setSummary] = useState<ApiResponse['data'] | null>(null);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);

  // 現在時刻を更新する関数
  const updateTime = () => {
    const now = new Date();
    setCurrentTime(now.toLocaleTimeString('ja-JP'));
  };

  // APIからデータを取得
  const fetchSummary = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://zenn-hackathon-2025-backend-666593730950.asia-northeast1.run.app/summarize_meeting');
      if (!response.ok) {
        throw new Error('APIの呼び出しに失敗しました');
      }
      const data: ApiResponse = await response.json();
      setSummary(data.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : '予期せぬエラーが発生しました');
    } finally {
      setIsLoading(false);
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
      <h1 className="text-3xl font-bold mb-6">Meet アドオン - 会議サマリー</h1>
      <div className="text-6xl font-mono mb-8">{currentTime}</div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {isLoading ? (
        <div className="mb-6 flex flex-col items-center">
          <div className="animate-pulse flex flex-col items-center space-y-4 max-w-2xl">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="text-gray-600">AIが前回のミーティングの要約を作成中です...</div>
            <div className="h-2 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      ) : summary && (
        <div className="mb-6 text-left max-w-2xl mx-auto">
          <div className="mb-6">
            <h2 className="text-2xl font-bold mb-3">会議の要点</h2>
            <ul className="list-disc pl-5 space-y-2">
              {summary.bullet_points.map((point, index) => (
                <li key={index}>{point}</li>
              ))}
            </ul>
          </div>

          <div className="mb-4">
            <h2 className="text-2xl font-bold mb-3">アクションアイテム</h2>
            <ul className="list-disc pl-5 space-y-2">
              {summary.action_items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      )}

      <p className="text-gray-600">このページは全ての参加者に表示されています</p>
    </div>
  );
}
