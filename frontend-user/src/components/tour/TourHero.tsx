import { ReactNode } from 'react';

interface TourHeroProps {
  backgroundImage?: string;
  title: string;
  children?: ReactNode;
}

export const TourHero = ({ 
  backgroundImage = 'https://placehold.co/1440x763', 
  title,
  children 
}: TourHeroProps) => {
  return (
    <div className="relative h-[520px] w-full overflow-hidden">
      <img
        src={backgroundImage}
        alt="Hero background"
        className="absolute inset-0 w-full h-full object-cover scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(84,198,238,0.35),_transparent_60%)]" />
      
      {children}

      <div className="absolute bottom-[180px] left-1/2 transform -translate-x-1/2 text-center w-full px-4">
        <h1 className="text-[46px] md:text-[54px] font-semibold text-white leading-tight max-w-[910px] mx-auto drop-shadow-2xl">
          {title}
        </h1>
      </div>
    </div>
  );
};
