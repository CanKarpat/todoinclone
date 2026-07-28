import { NavLink } from 'react-router-dom'
import { Button, Flex, Text } from '@chakra-ui/react'
import { useAuth } from '../context/AuthContext'
import { ColorModeButton } from './ui/color-mode'

export function Nav() {
  const { signOut, profile } = useAuth()

  return (
    <Flex
      as="header"
      align="center"
      justify="space-between"
      px={6}
      py={3}
      borderBottomWidth="1px"
      borderColor="border"
      bg="bg.panel"
      wrap="wrap"
      gap={3}
    >
      <Flex as="nav" className="app-nav" gap={5}>
        <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')} end>
          Görevler
        </NavLink>
        <NavLink to="/meetings" className={({ isActive }) => (isActive ? 'active' : '')}>
          Toplantılar
        </NavLink>
      </Flex>
      <Flex align="center" gap={3}>
        {profile && (
          <Text fontSize="sm" color="fg.muted" whiteSpace="nowrap">
            Lv {profile.player_level} · {profile.total_xp} XP · 🔥 {profile.daily_streak}
            {profile.unlocked_achievements?.length > 0 &&
              ` · 🏆 ${profile.unlocked_achievements.length}`}
          </Text>
        )}
        <ColorModeButton />
        <Button size="sm" variant="outline" onClick={signOut}>Çıkış yap</Button>
      </Flex>
    </Flex>
  )
}
