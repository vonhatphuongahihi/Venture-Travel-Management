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
    <div className="relative h-[763px] w-full">
      <img
        src={backgroundImage}
        alt="Hero background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/13" />
      
      {children}

      <div className="absolute bottom-[290px] left-1/2 transform -translate-x-1/2 text-center w-full px-4">
        <h1 className="text-[42px] font-[400] text-[#54C6EE] leading-[35px] max-w-[910px] mx-auto">
          {title}
        </h1>
      </div>
    </div>
  );
};
