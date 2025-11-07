import AddPlaceModal from "@/components/AddPlaceModal";
import Layout from "@/components/Layout";
import { ChevronDown, Funnel, MapPin, Search, Trash } from "lucide-react";
import { useState } from "react";

type Place = {
  id: string;
  title: string;
  province: string;
  tag: string;
  description: string;
  imageUrl: string;
  locked?: boolean;
  rating: number;
  reviews: number;
};

const MOCK_PLACES: Place[] = [
  {
    id: "1",
    title: "Dinh Độc Lập",
    province: "TP. Hồ Chí Minh",
    tag: "Di tích lịch sử",
    description:
      "Dinh Độc Lập là công trình kiến trúc biểu tượng lịch sử quan trọng của Sài Gòn.",
    imageUrl:
      "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?q=80&w=1200&auto=format&fit=crop",
    rating: 4.8,
    reviews: 1267,
  },
  {
    id: "2",
    title: "Bãi biển Nha Trang",
    province: "Khánh Hòa",
    tag: "Bãi biển",
    description:
      "Bãi biển trung tâm dài hơn 7km dọc Trần Phú là nơi nổi tiếng với sóng êm.",
    imageUrl:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1200&auto=format&fit=crop",
    rating: 4.6,
    reviews: 8201,
  },
  {
    id: "3",
    title: "Resort Vĩnh Hy",
    province: "Ninh Thuận",
    tag: "Resort",
    description:
      "Khu nghỉ dưỡng tuyệt đẹp nằm cách thành phố Phan Rang 36 km về phía đông.",
    imageUrl:
      "https://dynamic-media-cdn.tripadvisor.com/media/photo-o/12/0c/8d/55/sol-beach-house-phu-quoc.jpg?w=900&h=500&s=1",
    rating: 4.4,
    reviews: 3231,
  },
  {
    id: "4",
    title: "Vườn quốc gia Cát Tiên",
    province: "Đồng Nai",
    tag: "Rừng",
    description:
      "Vườn quốc gia Cát Tiên có tổng diện tích hơn 70.000 ha, là khu bảo tồn thiên nhiên.",
    imageUrl:
      "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?q=80&w=1200&auto=format&fit=crop",
    rating: 4.2,
    reviews: 6524,
  },
];

function Star({
  className = "w-3.5 h-3.5 text-amber-500",
}: {
  className?: string;
}) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      fill="currentColor"
      className={className}
    >
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.802 2.036a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.802-2.036a1 1 0 00-1.175 0l-2.802 2.036c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

function TagBadge({ label }: { label: string }) {
  return (
    <span className="absolute left-2 top-2 rounded bg-white/90 px-2 py-0.5 text-xs font-medium text-sky-600 shadow-sm">
      {label}
    </span>
  );
}

export default function Places() {
  const [query, setQuery] = useState("");
  const [province, setProvince] = useState<string | "Tất cả">("Tất cả");
  const [sort, setSort] = useState<"Mới nhất" | "Đánh giá cao">("Mới nhất");
  const [places, setPlaces] = useState(MOCK_PLACES);
  const [openModal, setOpenModal] = useState(false);

  const filtered = places
    .filter((p) => {
      const matchQuery = p.title.toLowerCase().includes(query.toLowerCase());
      const matchProvince = province === "Tất cả" || p.province === province;
      return matchQuery && matchProvince;
    })
    .sort((a, b) => {
      if (sort === "Đánh giá cao") return b.rating - a.rating;
      return a.id.localeCompare(b.id);
    });

  const provinces = Array.from(new Set(MOCK_PLACES.map((p) => p.province)));

  const handleDelete = (id: string) => {
    setPlaces((prev) => prev.filter((p) => p.id !== id));
  };

  return (
  <Layout title="Điểm đến">
    

     <div className="rounded-[12.75px] border border-black/10 bg-white p-4">
       {/* Filter bar + Thêm điểm đến */}
        <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-5">
          {/* Ô tìm kiếm */}
          <div className="col-span-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={16} />
              </span>
              <input
                type="text"
                className="h-10 w-full rounded-md border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#26B8ED] focus:ring-2 focus:ring-[#26B8ED]/50"
                placeholder="Tìm điểm đến"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Province */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <MapPin size={16} />
            </span>
            <select
              value={province}
              onChange={(e) => setProvince(e.target.value as any)}
              className="h-10 w-full appearance-none rounded-md border border-gray-200 bg-gray-50 pl-9 pr-8 text-sm text-gray-700 focus:border-[#26B8ED] focus:ring-2 focus:ring-[#26B8ED]/50"
            >
              <option value="Tất cả">- Tỉnh -</option>
              {provinces.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
              <ChevronDown size={16} />
            </span>
          </div>

          {/* Sort */}
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
              <Funnel size={16} />
            </span>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as any)}
              className="h-10 w-full appearance-none rounded-md border border-gray-200 bg-gray-50 pl-9 pr-8 text-sm text-gray-700 focus:border-[#26B8ED] focus:ring-2 focus:ring-[#26B8ED]/50"
            >
              <option value="Mới nhất">Lọc</option>
              <option value="Đánh giá cao">Đánh giá cao</option>
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
              <ChevronDown size={16} />
            </span>
          </div>

          {/* Thêm điểm đến */}
          <div className="flex items-center justify-end">
            <button  onClick={() => setOpenModal(true)} className="inline-flex items-center gap-2 rounded-md bg-sky-500 px-4 py-2 text-white hover:bg-sky-600">
              <span className="text-lg leading-none">+</span>
              <span>Thêm điểm đến</span>
            </button>
          </div>
        </div>

        {/* Cards */}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filtered.map((p) => (
          <div
            key={p.id}
            className="relative rounded-xl border border-gray-200 bg-white shadow-sm"
          >
            <div className="relative">
              <img
                src={p.imageUrl}
                alt={p.title}
                className="h-44 w-full rounded-t-xl object-cover"
              />
              <TagBadge label={p.tag} />

              {/* Nút delete góc phải */}
              <button
                onClick={() => handleDelete(p.id)}
                className="absolute right-2 top-2 inline-flex items-center rounded bg-rose-500 p-1 shadow hover:bg-rose-600"
              >
                <Trash size={16} />
              </button>
            </div>

            <div className="space-y-2 px-4 py-3">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="font-medium">{p.title}</div>
                  <div className="mt-0.5 flex items-center gap-1 text-xs text-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="h-3.5 w-3.5 text-sky-600"
                    >
                      <path d="M12 2C8.134 2 5 5.134 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.866-3.134-7-7-7zm0 9.5a2.5 2.5 0 110-5 2.5 2.5 0 010 5z" />
                    </svg>
                    <span>{p.province}</span>
                  </div>
                </div>
              </div>

              <p className="line-clamp-2 text-sm text-gray-600">
                {p.description}
              </p>

              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Star />
                <span className="font-medium text-gray-700">
                  {p.rating.toFixed(1)}
                </span>
                <span>({p.reviews.toLocaleString()})</span>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <button className="inline-flex items-center gap-1 rounded border border-gray-200 px-2.5 py-1.5 text-xs font-medium hover:bg-gray-50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-3.5 w-3.5"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4 12.5-12.5z" />
                  </svg>
                  Chỉnh sửa
                </button>
                <button className="inline-flex items-center gap-1 rounded border border-gray-200 px-2.5 py-1.5 text-xs font-medium hover:bg-gray-50">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-3.5 w-3.5"
                  >
                    <path d="M10 3h4l1 7H9l1-7z" />
                    <path d="M5 21h14v-2a4 4 0 00-4-4H9a4 4 0 00-4 4v2z" />
                  </svg>
                  Virtual Tour
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
      <AddPlaceModal
  open={openModal}
  onClose={() => setOpenModal(false)}
  onSubmit={(data) => {
    setPlaces((prev) => [
      ...prev,
      {
        id: String(prev.length + 1),
        title: data.title,
        province: data.province,
        tag: data.category,
        description: data.description,
        imageUrl:
          data.image
            ? URL.createObjectURL(data.image)
            : "https://via.placeholder.com/400x200",
        rating: 0,
        reviews: 0,
      },
    ]);
  }}
/>
    </Layout>
  );
}
