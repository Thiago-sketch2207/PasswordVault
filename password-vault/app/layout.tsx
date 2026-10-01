import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = { title:'Password Vault', description:'Personal encrypted password vault' }
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="pt-BR"><body>{children}</body></html> }
