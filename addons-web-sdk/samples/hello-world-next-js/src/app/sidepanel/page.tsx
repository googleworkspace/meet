'use client';

import {
  Alert,
  AlertIcon,
  Badge,
  Box,
  Button,
  Container,
  Divider,
  Heading,
  List,
  ListItem,
  Skeleton,
  SkeletonText,
  Text,
  useColorModeValue,
  VStack,
} from '@chakra-ui/react';
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
  const [isLoading, setIsLoading] = useState(true);
  const [meetingCode, setMeetingCode] = useState<string>('');

  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

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
      const client = await session.createSidePanelClient();
      setSidePanelClient(client);

      // Get meeting info
      const meetingInfo = await client.getMeetingInfo();
      setMeetingCode(meetingInfo.meetingCode);
    })();
  }, []);

  return (
    <Container maxW="container.sm" py={4}>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading size="md" mb={2}>現在時刻</Heading>
          <Text fontSize="3xl" fontFamily="mono" color="blue.500">
            {currentTime}
          </Text>
        </Box>

        <Box>
          <Heading size="md" mb={2}>会議コード</Heading>
          <Badge fontSize="md" p={2} borderRadius="md">
            {meetingCode}
          </Badge>
        </Box>

        {error && (
          <Alert status="error" borderRadius="md">
            <AlertIcon />
            {error}
          </Alert>
        )}

        {isLoading ? (
          <Box p={4} bg={bgColor} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
            <VStack spacing={4} align="stretch">
              <Skeleton height="20px" width="200px" />
              <SkeletonText noOfLines={4} spacing={4} />
              <Text color="gray.500" textAlign="center">
                AIが前回のミーティングの要約を作成中です...
              </Text>
            </VStack>
          </Box>
        ) : summary && (
          <VStack spacing={4} align="stretch">
            <Box p={4} bg={bgColor} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
              <Heading size="md" mb={3}>会議の要点</Heading>
              <List spacing={2}>
                {summary.bullet_points.map((point, index) => (
                  <ListItem key={index} display="flex" alignItems="start">
                    <Text as="span" mr={2}>•</Text>
                    <Text>{point}</Text>
                  </ListItem>
                ))}
              </List>
            </Box>

            <Box p={4} bg={bgColor} borderRadius="lg" borderWidth="1px" borderColor={borderColor}>
              <Heading size="md" mb={3}>アクションアイテム</Heading>
              <List spacing={2}>
                {summary.action_items.map((item, index) => (
                  <ListItem key={index} display="flex" alignItems="start">
                    <Text as="span" mr={2}>•</Text>
                    <Text>{item}</Text>
                  </ListItem>
                ))}
              </List>
            </Box>
          </VStack>
        )}

        <Divider />

        <VStack spacing={4}>
          <Text color="gray.500" fontSize="sm">
            このサイドパネルはあなたにのみ表示されています。
          </Text>
          <Button
            colorScheme="blue"
            size="lg"
            width="full"
            onClick={startActivity}
            leftIcon={<span>📺</span>}
          >
            メインステージで表示
          </Button>
        </VStack>
      </VStack>
    </Container>
  );
}
