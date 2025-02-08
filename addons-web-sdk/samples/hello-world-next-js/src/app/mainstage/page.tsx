'use client';

import {
  Alert,
  AlertIcon,
  Box,
  Container,
  Divider,
  Flex,
  Heading,
  Icon,
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

  const bgColor = useColorModeValue('gray.50', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  return (
    <Container maxW="container.lg" py={8}>
      <VStack spacing={8} align="center">
        <Box textAlign="center">
          <Heading as="h1" size="xl" mb={4}>
            Meet アドオン - 会議サマリー
          </Heading>
          <Text fontSize="6xl" fontFamily="mono" color="blue.500" fontWeight="bold">
            {currentTime}
          </Text>
        </Box>

        {error && (
          <Alert status="error" borderRadius="lg" width="full">
            <AlertIcon />
            {error}
          </Alert>
        )}

        {isLoading ? (
          <Box p={6} bg={bgColor} borderRadius="xl" borderWidth="1px" borderColor={borderColor} width="full">
            <VStack spacing={6} align="stretch">
              <Skeleton height="40px" />
              <SkeletonText noOfLines={6} spacing={4} />
              <Text color="gray.500" textAlign="center" fontSize="lg">
                AIが前回のミーティングの要約を作成中です...
              </Text>
            </VStack>
          </Box>
        ) : summary && (
          <Flex direction="column" gap={6} width="full">
            <Box p={6} bg={bgColor} borderRadius="xl" borderWidth="1px" borderColor={borderColor}>
              <Heading size="lg" mb={4} display="flex" alignItems="center">
                <Icon as={() => <span>💡</span>} mr={2} />
                会議の要点
              </Heading>
              <List spacing={3}>
                {summary.bullet_points.map((point, index) => (
                  <ListItem key={index} display="flex" alignItems="start">
                    <Text as="span" mr={3} color="blue.500">•</Text>
                    <Text>{point}</Text>
                  </ListItem>
                ))}
              </List>
            </Box>

            <Box p={6} bg={bgColor} borderRadius="xl" borderWidth="1px" borderColor={borderColor}>
              <Heading size="lg" mb={4} display="flex" alignItems="center">
                <Icon as={() => <span>✅</span>} mr={2} />
                アクションアイテム
              </Heading>
              <List spacing={3}>
                {summary.action_items.map((item, index) => (
                  <ListItem key={index} display="flex" alignItems="start">
                    <Text as="span" mr={3} color="green.500">•</Text>
                    <Text>{item}</Text>
                  </ListItem>
                ))}
              </List>
            </Box>
          </Flex>
        )}

        <Divider />
        
        <Text color="gray.500" fontSize="md">
          このページは全ての参加者に表示されています
        </Text>
      </VStack>
    </Container>
  );
}
