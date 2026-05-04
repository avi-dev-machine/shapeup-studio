'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import StatsCounter from '@/components/StatsCounter';
import OwnerSection from '@/components/OwnerSection';
import TrainerMarquee from '@/components/TrainerMarquee';
import CertificationsSection from '@/components/CertificationsSection';
import PricingSection from '@/components/PricingSection';
import Gallery from '@/components/Gallery';
import ReviewSection from '@/components/ReviewSection';
import BranchSection from '@/components/BranchSection';
import VideoSection from '@/components/VideoSection';
import ProgramsSection from '@/components/ProgramsSection';
import Footer from '@/components/Footer';

const LoaderScreen = dynamic(() => import('@/components/LoaderScreen'), { ssr: false });

export default function PageClient() {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && <LoaderScreen onComplete={() => setLoaded(true)} />}
      <div
        style={{
          opacity: loaded ? 1 : 0,
          transition: 'opacity 0.6s ease 0.2s',
        }}
      >
        <Navbar />
        <main>
          <Hero />
          <StatsCounter />
          <OwnerSection />
          <TrainerMarquee />
          <CertificationsSection />
          <ProgramsSection />
          <PricingSection />
          <VideoSection />
          <Gallery />
          <ReviewSection />
          <BranchSection />
        </main>
        <Footer />
      </div>
    </>
  );
}
