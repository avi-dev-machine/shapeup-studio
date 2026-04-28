import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import StatsCounter from '@/components/StatsCounter';
import OwnerSection from '@/components/OwnerSection';
import TrainerMarquee from '@/components/TrainerMarquee';
import PricingSection from '@/components/PricingSection';
import Gallery from '@/components/Gallery';
import ReviewSection from '@/components/ReviewSection';
import BranchSection from '@/components/BranchSection';
import VideoSection from '@/components/VideoSection';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <StatsCounter />
        <OwnerSection />
        <TrainerMarquee />
        <PricingSection />
        <VideoSection />
        <Gallery />
        <ReviewSection />
        <BranchSection />
      </main>
      <Footer />
    </>
  );
}
