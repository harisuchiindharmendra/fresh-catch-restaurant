import Hero from '@/components/hero/Hero';
import SignatureDishes from '@/components/dishes/SignatureDishes';
import ChefStory from '@/components/chef/ChefStory';
import DiningExperience from '@/components/dining/DiningExperience';
import Gallery from '@/components/gallery/Gallery';
import Reservation from '@/components/cta/Reservation';
import SideInfoPanel from '@/components/ui/SideInfoPanel';

export default function Home() {
  return (
    <main className="relative">
      <SideInfoPanel />
      <Hero />
      <SignatureDishes />
      <ChefStory />
      <DiningExperience />
      <Gallery />
      <Reservation />
    </main>
  );
}
