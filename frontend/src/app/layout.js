import './globals.css';

export const metadata = {
  title: 'SHAPE UP — Premium Fitness Studio | Kolkata',
  description: 'Your transformation starts here. SHAPE UP is a premium, high-energy fitness studio with 25+ years of excellence, 1500+ active members, and 4 branches across Kolkata. Join today!',
  keywords: 'gym, fitness, Kolkata, personal training, weight loss, SHAPE UP, premium gym',
  openGraph: {
    title: 'SHAPE UP — Premium Fitness Studio',
    description: 'Transform your body. Transform your life. 25+ years of building champions.',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Montserrat:wght@300;400;500;600;700;800&family=Orbitron:wght@400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
