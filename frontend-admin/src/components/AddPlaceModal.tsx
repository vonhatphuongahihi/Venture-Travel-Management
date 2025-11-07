"use client";

import { X, Image as ImageIcon } from "lucide-react";
import { useState } from "react";

interface AddPlaceModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
}

const CATEGORIES = ["Biển", "Nhà hàng", "Resort", "Rừng", "Bảo tàng", "Khách sạn"];
const PROVINCES = [
  "TP. Hồ Chí Minh",
  "Hà Nội",
  "Đà Nẵng",
  "Khánh Hòa",
  "Ninh Thuận",
  "Đồng Nai",
  "Bà Rịa - Vũng Tàu",
  "Lâm Đồng",
];

export default function AddPlaceModal({ open, onClose, onSubmit }: AddPlaceModalProps) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    province: "",
    address: "",
    lat: "",
    lng: "",
    category: "",
    images: [] as File[],
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      setForm((f) => ({
        ...f,
        images: [...f.images, ...Array.from(files)],
      }));
    }
  };

  const handleCategory = (cat: string) => setForm((f) => ({ ...f, category: cat }));

  const handleSubmit = () => {
    if (!form.title || !form.province || !form.category) {
      alert("Vui lòng nhập đầy đủ thông tin");
      return;
    }

    onSubmit({
      ...form,
      id: String(Date.now()),
      imageUrls: form.images.map((img) => URL.createObjectURL(img)),
    });

    // Reset
    setForm({
      title: "",
      description: "",
      province: "",
      address: "",
      lat: "",
      lng: "",
      category: "",
      images: [],
    });
    onClose();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-4xl rounded-xl bg-white p-6 shadow-lg">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X size={20} />
        </button>

        <h2 className="mb-4 text-lg font-semibold text-gray-800">Thêm điểm đến mới</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Form trái */}
          <div className="space-y-3">
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Tên địa điểm"
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
            />

            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Mô tả"
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
              rows={3}
            />

            <select
              name="province"
              value={form.province}
              onChange={handleChange}
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
            >
              <option value="">-- Chọn tỉnh --</option>
              {PROVINCES.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            <input
              name="address"
              value={form.address}
              onChange={handleChange}
              placeholder="Địa chỉ"
              className="w-full rounded-md border border-gray-300 p-2 text-sm"
            />

            <div className="grid grid-cols-2 gap-2">
              <input
                name="lat"
                value={form.lat}
                onChange={handleChange}
                placeholder="Vĩ độ"
                className="rounded border border-gray-300 p-2 text-sm"
              />
              <input
                name="lng"
                value={form.lng}
                onChange={handleChange}
                placeholder="Kinh độ"
                className="rounded border border-gray-300 p-2 text-sm"
              />
            </div>

            {/* Category buttons */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Loại địa điểm</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((c) => (
                  <button
                    key={c}
                    onClick={() => handleCategory(c)}
                    className={`rounded-lg border px-3 py-1.5 text-sm ${
                      form.category === c
                        ? "bg-sky-500 text-white border-sky-500"
                        : "border-gray-200 text-gray-600 hover:bg-gray-50"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cột phải: ảnh + map */}
          <div className="space-y-4">
            {/* Upload multiple images with "+" placeholder */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh địa điểm</label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 flex flex-col gap-2 max-h-[200px] overflow-y-auto relative">
                <div className="grid grid-cols-2 gap-2">
                  {form.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={URL.createObjectURL(img)}
                      alt={`Preview ${idx}`}
                      className="w-full h-[90px] object-cover rounded-md"
                    />
                  ))}

                  {/* Ô dấu + */}
                  <div
                    onClick={() => document.getElementById("file-input")?.click()}
                    className="flex items-center justify-center border-2 border-dashed border-gray-300 rounded-md h-[90px] cursor-pointer text-gray-400 hover:bg-gray-50"
                  >
                    <span className="text-2xl">+</span>
                  </div>
                </div>

                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFile}
                  className="hidden"
                />
              </div>
            </div>

            {/* Map placeholder */}
            <div className="rounded-lg bg-gray-50 border border-gray-200 h-[200px] w-full flex items-center justify-center text-sm text-gray-500">
              Interactive Google Maps integration
            </div>
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-md border border-gray-200 px-4 py-2 text-gray-600 hover:bg-gray-100"
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            className="rounded-md bg-sky-500 px-4 py-2 text-white hover:bg-sky-600"
          >
            Lưu
          </button>
        </div>
      </div>
    </div>
  );
}
