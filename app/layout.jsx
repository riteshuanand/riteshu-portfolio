import './globals.css';

export const metadata = {
  title: 'Riteshu Anand — Associate Product Manager',
  description:
    'Associate Product Manager at Cashify. Previously PlatinumRx and Cult.fit. Case studies with real numbers, AI side projects, and product writing.',
  openGraph: {
    title: 'Riteshu Anand — Associate Product Manager',
    description:
      'APM at Cashify. Checkout, SEO, and retention case studies with real numbers, plus shipped AI side projects.',
    type: 'website',
    siteName: 'Riteshu Anand',
  },
  twitter: {
    card: 'summary',
    title: 'Riteshu Anand — Associate Product Manager',
    description:
      'APM at Cashify. Product case studies with real numbers and shipped AI side projects.',
  },
};

// applies the saved (or system) theme before first paint so dark mode never flashes
const themeInit = `
try {
  var t = localStorage.getItem('theme');
  if (t === 'dark' || (!t && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  }
} catch (e) {}
`;

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Instrument+Serif:ital@0;1&display=swap"
          rel="stylesheet"
        />
      </head>
      {/* no background on body — the fixed 3D scene sits at z-[-10] and an opaque
          body background would paint over it; the light bg lives on html instead */}
      <body className="text-ink font-body antialiased">{children}</body>
    </html>
  );
}
