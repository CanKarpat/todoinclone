import { Box, Flex, Heading, Text } from '@chakra-ui/react'
import { ProgressRoot, ProgressBar } from '../ui/progress'
import { xpProgress } from '../../gamification/xp'

export function PlayerProfileCard({ profile }) {
  if (!profile) return null
  const { level, xpIntoLevel, xpForNextLevel, percent } = xpProgress(profile.total_xp)

  return (
    <Box bg="bg.panel" borderWidth="1px" borderColor="border" borderRadius="xl" p={6} mb={6}>
      <Flex align="center" gap={4} wrap="wrap">
        <Flex
          w="56px"
          h="56px"
          borderRadius="full"
          align="center"
          justify="center"
          fontSize="24px"
          color="white"
          flexShrink={0}
          css={{ background: 'linear-gradient(135deg, {colors.brand.500}, {colors.brand.300})' }}
        >
          ⚔️
        </Flex>
        <Box flex="1" minW="160px">
          <Heading size="sm" mb="1">Quest Master</Heading>
          <Text fontSize="sm" color="fg.muted">Maceran devam ediyor...</Text>
        </Box>
        <Box textAlign="center">
          <Text fontSize="xs" color="fg.muted" textTransform="uppercase" letterSpacing="wide" mb="1">
            Seviye
          </Text>
          <Text fontSize="2xl" fontWeight="medium" color="textAccent">{level}</Text>
        </Box>
        <Box textAlign="center">
          <Text fontSize="xs" color="fg.muted" textTransform="uppercase" letterSpacing="wide" mb="1">
            Seri
          </Text>
          <Text fontSize="2xl" fontWeight="medium" color="coral.600">🔥 {profile.daily_streak}</Text>
        </Box>
      </Flex>

      <Box mt={4} pt={4} borderTopWidth="1px" borderColor="border">
        <Flex justify="space-between" mb="2">
          <Text fontSize="xs" color="fg.muted">Seviye {level + 1}&apos;e ilerleme</Text>
          <Text fontSize="xs" color="fg.subtle">{xpIntoLevel} / {xpForNextLevel} XP</Text>
        </Flex>
        <ProgressRoot value={percent} colorPalette="brand" size="sm" borderRadius="full">
          <ProgressBar />
        </ProgressRoot>
      </Box>
    </Box>
  )
}
