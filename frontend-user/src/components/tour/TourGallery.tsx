interface TourGalleryProps {
  images: string[];
  description?: string;
}

export const TourGallery = ({ images, description }: TourGalleryProps) => {
  const [mainImage, ...galleryImages] = images;

  return (
    <div className="mb-10 rounded-3xl bg-gradient-to-br from-slate-50 via-white to-slate-50 p-6 shadow-xl shadow-primary/5 border border-primary/5">
      <h2 className="text-[#26B8ED] text-[40px] font-bold mb-6">Hình ảnh</h2>
      
      {description && (
        <div className="mb-8">
          <p className="text-black text-[16px] leading-[26px]">{description}</p>
        </div>
      )}

      {mainImage && (
        <div className="overflow-hidden rounded-3xl mb-6 border border-white shadow-lg">
          <img
            src={mainImage}
            alt="Tour main"
            className="w-full h-auto object-cover max-h-[420px] transition-transform duration-700 hover:scale-[1.02]"
          />
        </div>
      )}

      {galleryImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          {galleryImages.map((image, index) => (
            <div key={index} className="relative overflow-hidden rounded-2xl group border border-white/60 shadow">
              <img
                src={image}
                alt={`Gallery ${index + 1}`}
                className="w-full h-[220px] object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
