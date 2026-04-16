import type { Metadata } from 'next';
import './globals.css';
import { ScenarioProvider } from './ScenarioProvider';

export const metadata: Metadata = {
  title: 'Hybrid Agent Mesh — Smart Venue Management',
  description: 'Multi-agent cooperative platform for real-time crowd management, queue optimization, staff coordination, and fan experience at large sporting venues.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
        <ScenarioProvider />
      </body>
    </html>
  );
}
