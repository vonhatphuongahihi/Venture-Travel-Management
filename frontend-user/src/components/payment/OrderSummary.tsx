import { OrderSummary as OrderSummaryType } from '@/types/tour.types';
import { formatCurrencySimple } from '@/utils/formatters';

interface OrderSummaryProps {
  order: OrderSummaryType;
}

export const OrderSummary = ({ order }: OrderSummaryProps) => {
  return (
    <div className="relative">
      {/* Decorative gradient background */}
      <div className="absolute -top-8 -right-8 w-64 h-64 bg-primary/10 rounded-full blur-3xl -z-10" />
      <div className="absolute -bottom-8 -left-8 w-48 h-48 bg-primary/5 rounded-full blur-2xl -z-10" />
      
      {/* Summary Card */}
      <div className="relative bg-gradient-to-br from-card via-card to-primary/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 shadow-xl border border-border/50 overflow-hidden">
        {/* Decorative top border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/50 to-transparent" />
        
        <div className="text-center mb-6 md:mb-8 pb-6 border-b border-border/50">
          <p className="text-muted-foreground text-xs md:text-sm mb-3 font-medium uppercase tracking-wider">
            Bạn đang thanh toán
          </p>
          <p className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent">
            {formatCurrencySimple(order.total)}
          </p>
        </div>

        <div className="space-y-5 md:space-y-6">
          {/* Tour Info */}
          <div className="bg-muted/30 rounded-xl p-4 border border-border/30">
            <div className="flex justify-between items-start gap-4">
              <div className="flex-1 min-w-0">
                <h3 className="text-foreground text-base md:text-lg font-semibold leading-tight">
                  {order.tourName}
                </h3>
              </div>
              <span className="text-foreground text-base md:text-lg font-bold whitespace-nowrap ml-2">
                {formatCurrencySimple(order.price)}
              </span>
            </div>
          </div>

          {/* Summary Details */}
          <div className="space-y-3 md:space-y-4 pt-2">
            <SummaryRow
              label="Giảm giá"
              value={order.discount}
              highlight={order.discount > 0}
            />
            <SummaryRow label="Thuế" value={order.tax} />
            
            {/* Total */}
            <div className="pt-4 mt-4 border-t-2 border-border/50">
              <div className="flex justify-between items-center bg-gradient-to-r from-primary/10 to-transparent rounded-lg p-3 -mx-3">
                <span className="text-foreground text-lg md:text-xl font-bold">Tổng</span>
                <span className="text-foreground text-lg md:text-xl font-bold">
                  {formatCurrencySimple(order.total)}
                </span>
              </div>
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
  <div className="flex justify-between items-center py-1">
    <span className="text-muted-foreground text-sm md:text-base font-medium">{label}</span>
    <span className={`text-sm md:text-base font-semibold ${
      highlight && value > 0 
        ? 'text-green-600' 
        : 'text-foreground'
    }`}>
      {highlight && value > 0 ? '-' : ''}
      {formatCurrencySimple(value)}
    </span>
  </div>
);
