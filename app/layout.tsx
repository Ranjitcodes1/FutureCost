import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'FutureCost | Carbon Liability Simulator',
  description: 'Simulate your 10-year carbon liability and see what your future self thinks.',
  openGraph: {
    title: 'FutureCost',
    description: 'What will your future self say about the carbon you lock in today?',
    url: 'https://futurecost.app',
    siteName: 'FutureCost',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FutureCost | Carbon Liability Simulator',
    description: 'What will your future self say about the carbon you lock in today?',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} font-sans bg-carbon-bg text-carbon-text antialiased min-h-screen selection:bg-carbon-accent/30 relative overflow-x-hidden`}>
        {/* Animated Background Orbs */}
        <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-carbon-accent/10 blur-[120px] animate-blob"></div>
          <div className="absolute top-[20%] right-[-10%] w-[35%] h-[35%] rounded-full bg-carbon-cyan/10 blur-[120px] animate-blob" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-[-20%] left-[20%] w-[50%] h-[50%] rounded-full bg-carbon-accent/5 blur-[150px] animate-blob" style={{ animationDelay: '4s' }}></div>
        </div>
        
        {/* Main Content */}
        <div className="relative z-10">
          {children}
        </div>
      </body>
    </html>
  );
}
