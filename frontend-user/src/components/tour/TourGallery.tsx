interface TourGalleryProps {
  images: string[];
  description?: string;
}

export const TourGallery = ({ images, description }: TourGalleryProps) => {
  const [mainImage, ...galleryImages] = images;

  return (
    <div className="mb-8">
      <h2 className="text-[#26B8ED] text-[50px] font-bold mb-6">Hình ảnh</h2>
      
      {description && (
        <div className="mb-8">
          <p className="text-black text-[16px] leading-[26px]">{description}</p>
        </div>
      )}

      {mainImage && (
        <img
          src={mainImage}
          alt="Tour main"
          className="w-full h-auto rounded-lg mb-4 object-cover max-h-[420px]"
        />
      )}

      {galleryImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {galleryImages.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`Gallery ${index + 1}`}
              className="w-full h-[240px] object-cover rounded-lg hover:opacity-90 transition-opacity cursor-pointer"
            />
          ))}
        </div>
      )}
    </div>
  );
};
