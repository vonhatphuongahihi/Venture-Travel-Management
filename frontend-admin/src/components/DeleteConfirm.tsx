"use client";

interface DeleteConfirmProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  itemName: string;
}

export default function DeleteConfirm({ open, onClose, onConfirm, itemName }: DeleteConfirmProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="w-[500px] rounded-lg bg-white p-4 shadow-lg">
        <h3 className="text-xl font-semibold">Xác nhận xóa</h3>
        <p className="mt-4  text-gray-600">
          Bạn có chắc chắn muốn xóa <span className="font-medium">{itemName}</span> không?
        </p>
        <div className="mt-8 flex justify-end gap-2">
          <button onClick={onClose} className="px-3 py-1 rounded border hover:bg-gray-100">Hủy</button>
          <button onClick={() => { onConfirm(); onClose(); }} className="px-3 py-1 rounded bg-red-500 text-white hover:bg-red-600">
            Xóa
          </button>
        </div>
      </div>
    </div>
  );
}
