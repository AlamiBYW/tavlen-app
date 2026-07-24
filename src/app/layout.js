import './globals.css';

export const metadata = {
  title: "TAVLEN Solutions — L'IA au service de l'ingénierie industrielle",
  description: "Cabinet de conseil, services et formation en Intelligence Artificielle appliquée à l'ingénierie mécanique et industrielle. Fondé par Aymane El Alami, EMI Rabat.",
  keywords: 'TAVLEN Solutions, IA, Intelligence Artificielle, Ingénierie, Mécanique, Industrie, Maroc, Rabat, EMI, Conseil, Formation',
  openGraph: {
    title: "TAVLEN Solutions — L'IA au service de l'ingénierie industrielle",
    description: "Cabinet de conseil en IA appliquée à l'ingénierie industrielle",
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
