import { MetadataRoute } from 'next'
 
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'ContractorOS',
    short_name: 'ContractorOS',
    description: 'The all-in-one platform for modern contractors.',
    start_url: '/',
    display: 'standalone',
    background_color: '#F5F5DC',
    theme_color: '#FF7F50',
    icons: [
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      }
    ],
  }
}
