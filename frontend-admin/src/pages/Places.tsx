"use client";

import AddPlaceModal from "@/components/AddPlaceModal";
import Layout from "@/components/Layout";
import PlaceCard from "@/components/PlaceCard";
import { AttractionAPI, type Attraction, type Province } from "@/services/AttractionAPI";
import { ChevronDown,  Search } from "lucide-react";
import { useEffect, useState } from "react";

export default function Places() {
  const [query, setQuery] = useState("");
  const [province, setProvince] = useState<string | "Tất cả">("Tất cả");
  const [places, setPlaces] = useState<Attraction[]>([]);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState(false);

  // pagination
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const limit = 50;

  // Lấy danh sách địa điểm
  useEffect(() => {
    fetchPlaces(page);
  }, [page]);

  // Lấy danh sách tỉnh từ API
  useEffect(() => {
    fetchProvinces();
  }, []);

  const fetchPlaces = async (page: number) => {
    try {
      setLoading(true);
      const res = await AttractionAPI.getAttractions({ page, limit });
      if (res.success) {
        setPlaces(res.data.items);
        setTotal(res.data.total);
      } else console.error("Lỗi lấy dữ liệu:", res.message);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProvinces = async () => {
    try {
      const res = await AttractionAPI.getProvinces();
      if (res.success) setProvinces(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  // Filter theo search + province
  const filtered = places.filter((p) => {
    const matchQuery = p.name.toLowerCase().includes(query.toLowerCase());
    const matchProvince = province === "Tất cả" || p.provinceId === province;
    return matchQuery && matchProvince;
  });

  const handleDelete = async (id: string) => {
    try {
      const res = await AttractionAPI.deleteAttraction(id);
      if (res.success) setPlaces((prev) => prev.filter((p) => p.attractionId !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const totalPages = Math.ceil(total / limit);

  return (
    <Layout title="Điểm đến">
      <div className="rounded-[12.75px] border border-black/10 bg-white p-4">
        {/* Filter + Thêm điểm đến */}
        <div className="mb-6 grid grid-cols-1 gap-3 md:grid-cols-4">
          <div className="col-span-2">
            <div className="relative flex-1">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search size={16} />
              </span>
              <input
                type="text"
                placeholder="Tìm điểm đến"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="h-10 w-full rounded-md border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#26B8ED] focus:ring-2 focus:ring-[#26B8ED]/50"
              />
            </div>
          </div>

          <div className="relative">
           
            <select
              value={province}
              onChange={(e) => setProvince(e.target.value)}
              className="h-10 w-full appearance-none rounded-md border border-gray-200 bg-gray-50 pl-3 pr-8 text-sm text-gray-700 focus:border-[#26B8ED] focus:ring-2 focus:ring-[#26B8ED]/50"
            >
              <option value="Tất cả">- Tỉnh -</option>
              {provinces.map((p) => (
                <option key={p.provinceId} value={p.provinceId}>
                  {p.name}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-gray-400">
              <ChevronDown size={16} />
            </span>
          </div>

          <div className="flex items-center justify-end">
            <button
              onClick={() => setOpenModal(true)}
              className="inline-flex items-center gap-2 rounded-md bg-sky-500 px-4 py-2 text-white hover:bg-sky-600"
            >
              <span className="text-lg leading-none">+</span>
              <span>Thêm điểm đến</span>
            </button>
          </div>
        </div>

        {/* Cards */}
        {loading ? (
          <p>Đang tải dữ liệu...</p>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filtered.map((p) => (
                <PlaceCard
                  key={p.attractionId}
                  place={p}
                  onDelete={() => handleDelete(p.attractionId)}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="mt-4 flex justify-center items-center gap-3">
              <button
                disabled={page <= 1}
                onClick={() => setPage(page - 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Prev
              </button>
              <span>
                {page} / {totalPages}
              </span>
              <button
                disabled={page >= totalPages}
                onClick={() => setPage(page + 1)}
                className="px-3 py-1 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </>
        )}
      </div>

      <AddPlaceModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        onSubmit={async (data) => {
          try {
            const formData = new FormData();
            formData.append("name", data.title);
            formData.append("address", data.address);
            formData.append("description", data.description);
            formData.append("lat", data.lat);
            formData.append("lng", data.lng);
            formData.append("provinceId", data.province);
            formData.append("category", data.category);

            if (data.images && data.images.length > 0) {
              data.images.forEach((file: File) => formData.append("images", file));
            }

            const res = await AttractionAPI.createAttraction(formData);
            if (res.success) setPlaces((prev) => [...prev, res.data]);
          } catch (error) {
            console.error(error);
          }
        }}
      />
    </Layout>
  );
}
