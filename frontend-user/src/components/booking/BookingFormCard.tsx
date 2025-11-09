import { ReactNode } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useBookingForm } from '@/hooks/useBookingForm';
import { TICKET_TYPES } from '@/constants/tour.constants';
import { User, Mail, MailCheck, Phone, Calendar, Ticket, FileText } from 'lucide-react';

interface BookingFormCardProps {
  title: string;
  description: string;
  onCheckAvailability?: () => void;
  onBook?: () => void;
}

export const BookingFormCard = ({
  title,
  description,
  onCheckAvailability,
  onBook,
}: BookingFormCardProps) => {
  const { formData, errors, isSubmitting, handleChange, handleSubmit } = useBookingForm();

  const handleBookNow = () => {
    handleSubmit((data) => {
      console.log('Booking data:', data);
      onBook?.();
    });
  };

  return (
    <div className="bg-[#EDEDED] p-8 rounded-lg sticky top-4">
      <h2 className="text-[#54C6EE] text-[42px] font-bold text-center mb-4">
        {title}
      </h2>
      <p className="text-center text-black text-[16px] mb-8">{description}</p>

      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <FormField
          icon={<User className="w-5 h-5" />}
          error={errors.name}
        >
          <Input
            placeholder="Tên"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            className={`bg-white h-[76px] pl-12 ${errors.name ? 'border-red-500' : ''}`}
          />
        </FormField>

        <FormField
          icon={<Mail className="w-5 h-5" />}
          error={errors.email}
        >
          <Input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => handleChange('email', e.target.value)}
            className={`bg-white h-[76px] pl-12 ${errors.email ? 'border-red-500' : ''}`}
          />
        </FormField>

        <FormField
          icon={<MailCheck className="w-5 h-5" />}
          error={errors.confirmEmail}
        >
          <Input
            type="email"
            placeholder="Xác nhận email"
            value={formData.confirmEmail}
            onChange={(e) => handleChange('confirmEmail', e.target.value)}
            className={`bg-white h-[76px] pl-12 ${errors.confirmEmail ? 'border-red-500' : ''}`}
          />
        </FormField>

        <FormField
          icon={<Phone className="w-5 h-5" />}
          error={errors.phone}
        >
          <Input
            type="tel"
            placeholder="Điện thoại"
            value={formData.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            className={`bg-white h-[76px] pl-12 ${errors.phone ? 'border-red-500' : ''}`}
          />
        </FormField>

        <FormField
          icon={<Calendar className="w-5 h-5" />}
          error={errors.date}
        >
          <Input
            type="date"
            placeholder="Chọn ngày"
            value={formData.date}
            onChange={(e) => handleChange('date', e.target.value)}
            className={`bg-white h-[76px] pl-12 ${errors.date ? 'border-red-500' : ''}`}
          />
        </FormField>

        <FormField
          icon={<Ticket className="w-5 h-5" />}
          error={errors.tickets}
        >
          <Input
            type="number"
            min="1"
            placeholder="Số vé"
            value={formData.tickets}
            onChange={(e) => handleChange('tickets', parseInt(e.target.value) || 0)}
            className={`bg-white h-[76px] pl-12 ${errors.tickets ? 'border-red-500' : ''}`}
          />
        </FormField>

        <FormField error={errors.ticketType}>
          <Select
            value={formData.ticketType}
            onValueChange={(value) => handleChange('ticketType', value)}
          >
            <SelectTrigger className={`bg-white h-[76px] ${errors.ticketType ? 'border-red-500' : ''}`}>
              <SelectValue placeholder="Loại vé" />
            </SelectTrigger>
            <SelectContent>
              {TICKET_TYPES.map((type) => (
                <SelectItem key={type.value} value={type.value}>
                  {type.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </FormField>

        <FormField icon={<FileText className="w-5 h-5" />}>
          <textarea
            placeholder="Ghi chú"
            value={formData.note}
            onChange={(e) => handleChange('note', e.target.value)}
            className="w-full bg-white h-[76px] px-4 pl-12 py-2 rounded-md border resize-none"
          />
        </FormField>

        <Button
          type="button"
          onClick={onCheckAvailability}
          className="w-full bg-[#DF6951] hover:bg-[#DF6951]/90 text-white h-[56px] rounded-lg"
        >
          Kiểm tra chỗ trống
        </Button>

        <Button
          type="button"
          onClick={handleBookNow}
          disabled={isSubmitting}
          className="w-full bg-[#DF6951] hover:bg-[#DF6951]/90 text-white h-[56px] rounded-lg"
        >
          {isSubmitting ? 'Đang xử lý...' : 'Đặt ngay'}
        </Button>
      </form>
    </div>
  );
};

interface FormFieldProps {
  icon?: ReactNode;
  error?: string;
  children: ReactNode;
}

const FormField = ({ icon, error, children }: FormFieldProps) => (
  <div className="relative">
    {icon && (
      <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
        {icon}
      </div>
    )}
    {children}
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);
