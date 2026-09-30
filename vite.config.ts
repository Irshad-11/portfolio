import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    target: 'es2020',
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('@tiptap') || id.includes('prosemirror') || id.includes('orderedmap') || id.includes('rope-sequence') || id.includes('w3c-keyname') || id.includes('linkifyjs') || id.includes('tippy') || id.includes('@popperjs')) return 'editor'
          if (id.includes('recharts') || id.includes('d3-') || id.includes('victory-vendor')) return 'charts'
          if (id.includes('@supabase')) return 'supabase'
          if (id.includes('react-dom') || id.includes('react-router') || id.includes('/react/') || id.includes('scheduler')) return 'vendor'
        },
      },
    },
  },
})