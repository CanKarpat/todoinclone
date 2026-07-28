import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { Box, Button, Flex, Heading, Input, Stack, Text } from '@chakra-ui/react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { session, loading: authLoading, signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  if (authLoading) return null
  if (session) return <Navigate to="/" replace />

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const { error } = await signIn(email, password)
    setSubmitting(false)
    if (error) setError('Giriş başarısız. E-posta veya şifre hatalı.')
  }

  return (
    <Flex minH="100vh" align="center" justify="center" bg="bg.subtle" p={5}>
      <Box
        bg="bg.panel"
        borderWidth="1px"
        borderColor="border"
        borderRadius="xl"
        p={8}
        w="full"
        maxW="380px"
      >
        <Flex
          w="48px"
          h="48px"
          borderRadius="full"
          align="center"
          justify="center"
          fontSize="20px"
          color="white"
          mb={4}
          css={{ background: 'linear-gradient(135deg, {colors.brand.500}, {colors.brand.300})' }}
        >
          ⚔️
        </Flex>
        <Heading size="lg" mb={1}>Quest Master</Heading>
        <Text fontSize="sm" color="fg.muted" mb={6}>Maceranın devamı için giriş yap</Text>

        <form onSubmit={handleSubmit}>
          <Stack gap={4}>
            <Box>
              <Text as="label" htmlFor="email" fontSize="sm" color="fg.muted" mb={1} display="block">
                E-posta
              </Text>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </Box>
            <Box>
              <Text as="label" htmlFor="password" fontSize="sm" color="fg.muted" mb={1} display="block">
                Şifre
              </Text>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
              />
            </Box>
            {error && <Text color="red.500" fontSize="sm">{error}</Text>}
            <Button
              type="submit"
              colorPalette="brand"
              loading={submitting}
              loadingText="Giriş yapılıyor..."
            >
              Giriş yap
            </Button>
          </Stack>
        </form>
      </Box>
    </Flex>
  )
}
