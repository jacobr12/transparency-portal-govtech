import './globals.css'

export const metadata = {
  title: 'Transparency Portal for Public Algorithms',
  description: 'Explore and understand the algorithmic systems used in public services',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

