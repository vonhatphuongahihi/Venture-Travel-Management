// Backend có thể trả về: pending, completed, canceled, cancelled, processing
// Frontend chỉ dùng: pending, confirmed, cancelled
type BackendStatus = "pending" | "completed" | "canceled" | "cancelled" | "processing";
type FrontendStatus = "pending" | "confirmed" | "cancelled";

function normalizeStatus(status: string): FrontendStatus {
  if (status === "completed") return "confirmed";
  if (status === "canceled" || status === "cancelled") return "cancelled";
  if (status === "processing") return "pending";
  return status as FrontendStatus;
}

export function StatusPill({ status }: { status: BackendStatus | string }) {
  const normalizedStatus = normalizeStatus(status);
  
  const label =
    normalizedStatus === 'confirmed'
      ? 'Hoàn tất'
      : normalizedStatus === 'pending'
      ? 'Đang xử lý'
      : 'Huỷ'

  return (
    <span
      className={
        `inline-flex h-7 w-28 items-center justify-center rounded-full text-sm font-semibold ` +
        (normalizedStatus === 'confirmed'
          ? 'bg-[#00B69B] text-white'
          : normalizedStatus === 'pending'
          ? 'bg-[#FCBE2D] text-white'
          : 'bg-[#FD5454] text-white')
      }
    >
      {label}
    </span>
  )
}
