import { OrderSummary as OrderSummaryType } from '@/types/tour.types';
import { formatCurrencySimple } from '@/utils/formatters';

interface OrderSummaryProps {
  order: OrderSummaryType;
}

export const OrderSummary = ({ order }: OrderSummaryProps) => {
  return (
    <div className="relative">
      {/* Decorative Circles */}
      <div className="absolute top-0 right-0 w-[236px] h-[236px] bg-[#54C6EE] rounded-full -z-10" />
      <div className="absolute top-0 right-[-50px] w-[244px] h-[244px] bg-[#54C6EE]/50 rounded-full -z-10" />

      {/* Summary Card */}
      <div className="relative bg-[#F0F0F0] backdrop-blur-sm rounded-lg p-8 mt-8">
        <div className="text-center mb-8">
          <p className="text-[#575757] text-[24px] mb-2">Bạn đang thanh toán:</p>
          <p className="text-black text-[50px] font-bold">
            {formatCurrencySimple(order.total)}
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-start gap-4">
            <div className="flex-1">
              <h3 className="text-black text-[26px] font-bold">
                {order.tourName}
              </h3>
            </div>
            <span className="text-black text-[24px] whitespace-nowrap">
              {formatCurrencySimple(order.price)}
            </span>
          </div>

          <div className="border-t border-gray-300 pt-6 space-y-4">
            <SummaryRow
              label="Giảm giá"
              value={order.discount}
              highlight={order.discount > 0}
            />
            <SummaryRow label="Thuế" value={order.tax} />
            
            <div className="flex justify-between border-t border-gray-300 pt-4">
              <span className="text-black text-[26px] font-bold">Tổng</span>
              <span className="text-black text-[24px] font-bold">
                {formatCurrencySimple(order.total)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SummaryRowProps {
  label: string;
  value: number;
  highlight?: boolean;
}

const SummaryRow = ({ label, value, highlight }: SummaryRowProps) => (
  <div className="flex justify-between">
    <span className="text-black text-[26px] font-bold">{label}</span>
    <span className={`text-[24px] ${highlight ? 'text-green-600' : 'text-black'}`}>
      {highlight && value > 0 ? '-' : ''}
      {formatCurrencySimple(value)}
    </span>
  </div>
);
