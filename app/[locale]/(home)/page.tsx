'use client';

import { useTranslations } from 'next-intl';
import dynamic from 'next/dynamic';

const HeroSection = dynamic(() => import('@/app/components/Home/HeroSection'), {
  ssr: true,
});

export default function HomePage() {
  const t = useTranslations();

  return (
    <div className="space-y-8 md:space-y-12">
      <HeroSection />
    </div>
  );
}
