import { Box, Container, Heading, Link, Text, VStack } from '@chakra-ui/react';

export default function App() {
  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={6} align="center">
        <Heading as="h1" size="xl" textAlign="center">
          Google Meet Add-on Demo
        </Heading>
        <Text fontSize="lg" color="gray.600" textAlign="center">
          このデモアプリケーションには以下のページがあります：
        </Text>
        <Box p={6} bg="gray.50" borderRadius="lg" width="100%">
          <VStack spacing={4} align="stretch">
            <Link href="/sidepanel" color="blue.500" fontSize="md">
              /sidepanel - サイドパネルのデモ
            </Link>
            <Link href="/mainstage" color="blue.500" fontSize="md">
              /mainstage - メインステージのデモ
            </Link>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
}
