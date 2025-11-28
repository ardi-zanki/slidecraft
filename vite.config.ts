import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import devtoolsJson from 'vite-plugin-devtools-json'
import tsconfigPaths from 'vite-tsconfig-paths'

export default defineConfig(({ isSsrBuild }) => ({
  plugins: [devtoolsJson(), tailwindcss(), reactRouter(), tsconfigPaths()],
  ssr: {
    external: ['@prisma/client/runtime/client'],
  },
  build: {
    rollupOptions: isSsrBuild ? { input: './server/app.ts' } : undefined,
  },
}))
