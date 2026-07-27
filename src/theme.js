import { createSystem, defaultConfig, defineConfig } from '@chakra-ui/react'

const config = defineConfig({
  theme: {
    tokens: {
      colors: {
        brand: {
          50: { value: '#f5f2ff' },
          100: { value: '#e6ddff' },
          200: { value: '#cdb8ff' },
          300: { value: '#ab8bff' },
          400: { value: '#8c5cff' },
          500: { value: '#6d31f2' },
          600: { value: '#5722c9' },
          700: { value: '#43199e' },
          800: { value: '#301273' },
          900: { value: '#1e0a4d' },
        },
        coral: {
          50: { value: '#fff1ee' },
          100: { value: '#ffdbd2' },
          200: { value: '#ffb6a3' },
          300: { value: '#ff8f74' },
          400: { value: '#ff6f4f' },
          500: { value: '#f5502c' },
          600: { value: '#d13a1a' },
          700: { value: '#a52c14' },
          800: { value: '#791f0d' },
          900: { value: '#4d1408' },
        },
        amber: {
          50: { value: '#fff8e6' },
          100: { value: '#ffecb3' },
          200: { value: '#ffdd80' },
          300: { value: '#ffcc4d' },
          400: { value: '#ffbb26' },
          500: { value: '#f0a500' },
          600: { value: '#c88700' },
          700: { value: '#996600' },
          800: { value: '#6b4700' },
          900: { value: '#402a00' },
        },
      },
    },
    semanticTokens: {
      colors: {
        brand: {
          contrast: { value: { _light: 'white', _dark: 'white' } },
          fg: { value: { _light: '{colors.brand.700}', _dark: '{colors.brand.300}' } },
          subtle: { value: { _light: '{colors.brand.100}', _dark: '{colors.brand.900}' } },
          muted: { value: { _light: '{colors.brand.200}', _dark: '{colors.brand.800}' } },
          emphasized: { value: { _light: '{colors.brand.300}', _dark: '{colors.brand.700}' } },
          solid: { value: { _light: '{colors.brand.500}', _dark: '{colors.brand.500}' } },
          focusRing: { value: { _light: '{colors.brand.500}', _dark: '{colors.brand.500}' } },
          border: { value: { _light: '{colors.brand.500}', _dark: '{colors.brand.400}' } },
        },
        coral: {
          contrast: { value: { _light: 'white', _dark: 'white' } },
          fg: { value: { _light: '{colors.coral.700}', _dark: '{colors.coral.300}' } },
          subtle: { value: { _light: '{colors.coral.100}', _dark: '{colors.coral.900}' } },
          muted: { value: { _light: '{colors.coral.200}', _dark: '{colors.coral.800}' } },
          emphasized: { value: { _light: '{colors.coral.300}', _dark: '{colors.coral.700}' } },
          solid: { value: { _light: '{colors.coral.500}', _dark: '{colors.coral.500}' } },
          focusRing: { value: { _light: '{colors.coral.500}', _dark: '{colors.coral.500}' } },
          border: { value: { _light: '{colors.coral.500}', _dark: '{colors.coral.400}' } },
        },
        amber: {
          contrast: { value: { _light: 'white', _dark: 'black' } },
          fg: { value: { _light: '{colors.amber.700}', _dark: '{colors.amber.300}' } },
          subtle: { value: { _light: '{colors.amber.100}', _dark: '{colors.amber.900}' } },
          muted: { value: { _light: '{colors.amber.200}', _dark: '{colors.amber.800}' } },
          emphasized: { value: { _light: '{colors.amber.300}', _dark: '{colors.amber.700}' } },
          solid: { value: { _light: '{colors.amber.500}', _dark: '{colors.amber.500}' } },
          focusRing: { value: { _light: '{colors.amber.500}', _dark: '{colors.amber.500}' } },
          border: { value: { _light: '{colors.amber.500}', _dark: '{colors.amber.400}' } },
        },
        difficultyEasy: {
          value: { _light: '{colors.blue.600}', _dark: '{colors.blue.300}' },
        },
        difficultyEasyBg: {
          value: { _light: '{colors.blue.50}', _dark: '{colors.blue.900}' },
        },
        difficultyMedium: {
          value: { _light: '{colors.amber.700}', _dark: '{colors.amber.300}' },
        },
        difficultyMediumBg: {
          value: { _light: '{colors.amber.50}', _dark: '{colors.amber.900}' },
        },
        difficultyHard: {
          value: { _light: '{colors.red.600}', _dark: '{colors.red.300}' },
        },
        difficultyHardBg: {
          value: { _light: '{colors.red.50}', _dark: '{colors.red.900}' },
        },
        difficultyBoss: {
          value: { _light: '{colors.brand.600}', _dark: '{colors.brand.300}' },
        },
        difficultyBossBg: {
          value: { _light: '{colors.brand.50}', _dark: '{colors.brand.900}' },
        },
        bgAccent: {
          value: { _light: '{colors.brand.100}', _dark: '{colors.brand.900}' },
        },
        textAccent: {
          value: { _light: '{colors.brand.700}', _dark: '{colors.brand.200}' },
        },
        todayBg: {
          value: { _light: '{colors.yellow.50}', _dark: '{colors.yellow.900}' },
        },
      },
    },
  },
})

export const system = createSystem(defaultConfig, config)
