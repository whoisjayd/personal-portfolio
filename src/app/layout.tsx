import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { Space_Grotesk } from 'next/font/google';
import { FlareCursor } from '@/components/flare-cursor';

const name = 'Jaydeep Solanki';
const title = `${name} | Backend Developer`;
const description =
  'A portfolio showcasing my projects, skills, and achievements in backend development.';
const url = 'https://jaydeepsolanki.me';

export const metadata: Metadata = {
  metadataBase: new URL(url),
  title,
  description,
  keywords: [
    'Jaydeep Solanki',
    'backend developer',
    'software engineer',
    'web developer',
    'portfolio',
    'Node.js',
    'Express',
    'Django',
    'Ruby on Rails',
    'PHP',
    'Laravel',
    'ASP.NET',
    'Java',
    'Spring',
    'Kotlin',
    'Go',
    'Rust',
    'SQL',
    'NoSQL',
    'MongoDB',
    'PostgreSQL',
    'MySQL',
    'Redis',
    'Docker',
    'Kubernetes',
    'AWS',
    'GCP',
    'Azure',
    'CI/CD',
    'Git',
    'Linux',
    'Nginx',
    'Apache',
    'Python',
    'Flask',
    'FastAPI',
  ],
  authors: [{ name: name, url: url }],
  creator: name,
  openGraph: {
    title,
    description,
    url,
    type: 'website',
    siteName: name,
    images: [
      {
        url: '/banner.png',
        width: 1200,
        height: 630,
        alt: title,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
    images: ['/banner.png'],
  },
  icons: {
    icon: '/intials_logo.png',
  },
  manifest: '/manifest.json',
};

const spaceGrotesk = Space_Grotesk({ subsets: ['latin'], variable: '--font-space-grotesk' })

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${spaceGrotesk.variable} font-sans antialiased`}>
        <FlareCursor />
        {children}
        <Toaster />
      </body>
    </html>
  );
}
