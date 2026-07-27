import { Box, Flex, Text } from '@chakra-ui/react'

export function QuestColumn({
  emoji,
  title,
  subtitle,
  gradientLight,
  gradientDark,
  titleColorLight,
  titleColorDark,
  children,
}) {
  return (
    <Box bg="bg.subtle" borderRadius="xl" overflow="hidden">
      <Box
        p={4}
        borderBottomWidth="1px"
        borderColor="border"
        css={{
          background: gradientLight,
          _dark: { background: gradientDark },
        }}
      >
        <Text
          fontSize="sm"
          fontWeight="medium"
          css={{ color: titleColorLight, _dark: { color: titleColorDark } }}
        >
          {emoji} {title}
        </Text>
        {subtitle && (
          <Text fontSize="xs" color="fg.muted" mt="1">{subtitle}</Text>
        )}
      </Box>
      <Flex direction="column" gap={2} p={3}>
        {children}
      </Flex>
    </Box>
  )
}
