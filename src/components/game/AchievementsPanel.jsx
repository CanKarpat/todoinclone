import { Box, Grid, Heading, Text } from '@chakra-ui/react'
import { ACHIEVEMENTS } from '../../gamification/achievements'

export function AchievementsPanel({ unlockedIds = [] }) {
  return (
    <Box bg="bg.panel" borderWidth="1px" borderColor="border" borderRadius="xl" p={6} mt={6}>
      <Heading size="sm" mb={4}>🏆 Başarımların</Heading>
      <Grid templateColumns="repeat(auto-fit, minmax(120px, 1fr))" gap={3}>
        {ACHIEVEMENTS.map((a) => {
          const unlocked = unlockedIds.includes(a.id)
          return (
            <Box
              key={a.id}
              borderWidth="1px"
              borderColor={unlocked ? 'border.success' : 'border'}
              bg={unlocked ? undefined : 'bg.subtle'}
              borderRadius="xl"
              p={4}
              textAlign="center"
              opacity={unlocked ? 1 : 0.5}
              title={a.description}
              css={
                unlocked
                  ? {
                      background: 'linear-gradient(135deg, {colors.green.50}, {colors.green.200})',
                      _dark: {
                        background: 'linear-gradient(135deg, {colors.green.900}, {colors.green.800})',
                      },
                    }
                  : undefined
              }
            >
              <Text fontSize="32px" mb="1" css={!unlocked ? { filter: 'grayscale(1)' } : undefined}>
                {a.icon}
              </Text>
              <Text fontSize="xs" fontWeight="medium" color={unlocked ? 'green.700' : 'fg.subtle'}>
                {a.title}
              </Text>
            </Box>
          )
        })}
      </Grid>
    </Box>
  )
}
