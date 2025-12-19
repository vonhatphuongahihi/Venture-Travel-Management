import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Download,
  FileText,
  TrendingDown,
  TrendingUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  AdminReportAPI,
  type AdminReportsStats,
  type BookingByAttractionData,
  type MonthlyBookingData,
  type TopTourData,
  type TourByStatusData,
} from "../services/adminReportAPI";
import { Skeleton } from "./ui/skeleton";



export function TouristReports() {
  const [reportType, setReportType] = useState<'popularity' | 'rating' | 'revenue'>('popularity');
  const [loading, setLoading] = useState(true);
  
  // State cho dữ liệu
  const [stats, setStats] = useState<AdminReportsStats | null>(null);
  const [monthlyData, setMonthlyData] = useState<MonthlyBookingData[]>([]);
  const [tourStatusData, setTourStatusData] = useState<TourByStatusData[]>([]);
  const [topTours, setTopTours] = useState<TopTourData[]>([]);
  const [attractionData, setAttractionData] = useState<BookingByAttractionData[]>([]);

  // Fetch dữ liệu ban đầu
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        setLoading(true);
        const [statsData, monthlyData, statusData, toursData, attractionData] = await Promise.all([
          AdminReportAPI.getReportsStats(),
          AdminReportAPI.getMonthlyData(),
          AdminReportAPI.getTourByStatus(),
          AdminReportAPI.getTopTours('popularity'),
          AdminReportAPI.getBookingsByAttraction(),
        ]);
        
        setStats(statsData);
        setMonthlyData(monthlyData);
        setTourStatusData(statusData);
        setTopTours(toursData);
        setAttractionData(attractionData);
      } catch (error) {
        console.error('Error fetching initial data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, []);

  // Fetch lại Top Tours khi thay đổi reportType
  useEffect(() => {
    const fetchTopTours = async () => {
      try {
        const toursData = await AdminReportAPI.getTopTours(reportType);
        setTopTours(toursData);
      } catch (error) {
        console.error('Error fetching top tours:', error);
      }
    };

    // Chỉ fetch khi không phải lần đầu load (tránh duplicate request)
    if (!loading) {
      fetchTopTours();
    }
  }, [reportType, loading]);

  // Chuyển đổi reportType string thành enum
  const handleReportTypeChange = (value: string) => {
    if (value === 'overview' || value === 'destinations' || value === 'visitors') {
      const mapping = {
        'overview': 'popularity' as const,
        'destinations': 'rating' as const,
        'visitors': 'revenue' as const,
      };
      setReportType(mapping[value]);
    }
  };

  // Hàm chuyển đổi tiếng Việt sang ASCII
  const convertVietnameseToAscii = (text: string) => {
    return text
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .replace(/ă/g, 'a')
      .replace(/Ă/g, 'A')
      .replace(/â/g, 'a')
      .replace(/Â/g, 'A')
      .replace(/ê/g, 'e')
      .replace(/Ê/g, 'E')
      .replace(/ô/g, 'o')
      .replace(/Ô/g, 'O')
      .replace(/ơ/g, 'o')
      .replace(/Ơ/g, 'O')
      .replace(/ư/g, 'u')
      .replace(/Ư/g, 'U');
  };

  // Hàm xuất PDF với toàn bộ nội dung trang báo cáo
  const exportToPDF = async () => {
    try {
      const jsPDFModule = await import('jspdf');
      const jsPDF = jsPDFModule.default;
      const pdf = new jsPDF();
      
      // Tiêu đề chính
      pdf.setFontSize(18);
      pdf.setFont('helvetica', 'bold');
      pdf.text(convertVietnameseToAscii('BAO CAO THONG KE DU LICH'), 105, 20, { align: 'center' });
      
      // Ngày tạo báo cáo
      const currentDate = new Date().toLocaleDateString('vi-VN');
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'normal');
      pdf.text(convertVietnameseToAscii(`Bao cao duoc tao ngay: ${currentDate}`), 105, 30, { align: 'center' });
      
      let yPosition = 50;
      
      // 1. THỐNG KÊ TỔNG QUAN
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(convertVietnameseToAscii('1. THONG KE TONG QUAN'), 20, yPosition);
      yPosition += 15;
      
      if (stats) {
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        
        // Tổng lượt khách
        pdf.text(convertVietnameseToAscii(`• Tong luot khach: ${stats.totalTickets.toLocaleString()}`), 25, yPosition);
        yPosition += 8;
        pdf.text(convertVietnameseToAscii(`  Tang truong: ${stats.ticketGrowth >= 0 ? '+' : ''}${stats.ticketGrowth.toFixed(1)}% so voi thang truoc`), 25, yPosition);
        yPosition += 12;
        
        // Tổng đặt chỗ  
        pdf.text(convertVietnameseToAscii(`• Tong dat cho: ${stats.totalBookings.toLocaleString()}`), 25, yPosition);
        yPosition += 8;
        pdf.text(convertVietnameseToAscii(`  Tang truong: ${stats.bookingGrowth >= 0 ? '+' : ''}${stats.bookingGrowth.toFixed(1)}% so voi thang truoc`), 25, yPosition);
        yPosition += 12;
        
        // Tổng doanh thu
        pdf.text(convertVietnameseToAscii(`• Tong doanh thu: ${stats.totalRevenue.toLocaleString()} VND`), 25, yPosition);
        yPosition += 8;
        pdf.text(convertVietnameseToAscii(`  Tang truong: ${stats.revenueGrowth >= 0 ? '+' : ''}${stats.revenueGrowth.toFixed(1)}% so voi thang truoc`), 25, yPosition);
        yPosition += 20;
      }
      
      // 2. DU LIEU THEO THANG
      if (yPosition > 220) {
        pdf.addPage();
        yPosition = 20;
      }
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(convertVietnameseToAscii('2. DU LIEU THEO THANG (7 thang gan nhat)'), 20, yPosition);
      yPosition += 15;
      
      if (monthlyData.length > 0) {
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        
        monthlyData.forEach((data) => {
          if (yPosition > 270) {
            pdf.addPage();
            yPosition = 20;
          }
          const monthText = convertVietnameseToAscii(`• ${data.month}: ${data.bookings} dat cho, ${data.revenue.toLocaleString()} VND`);
          pdf.text(monthText, 25, yPosition);
          yPosition += 10;
        });
        yPosition += 10;
      }
      
      // 3. TY LE TRANG THAI DAT TOUR
      if (yPosition > 200) {
        pdf.addPage();
        yPosition = 20;
      }
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(convertVietnameseToAscii('3. TY LE TRANG THAI DAT TOUR'), 20, yPosition);
      yPosition += 15;
      
      if (tourStatusData.length > 0) {
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        
        tourStatusData.forEach((status) => {
          pdf.text(convertVietnameseToAscii(`• ${status.name}: ${status.value}%`), 25, yPosition);
          yPosition += 10;
        });
        yPosition += 10;
      }
      
      // 4. TOP TOURS PHO BIEN NHAT
      if (yPosition > 150) {
        pdf.addPage();
        yPosition = 20;
      }
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      const sortTypeText = reportType === 'popularity' ? 'Pho bien nhat' : 
                          reportType === 'rating' ? 'Danh gia cao' : 'Doanh thu cao';
      pdf.text(convertVietnameseToAscii(`4. TOP TOURS (${sortTypeText})`), 20, yPosition);
      yPosition += 15;
      
      if (topTours.length > 0) {
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        
        topTours.forEach((tour, index) => {
          if (yPosition > 250) {
            pdf.addPage();
            yPosition = 20;
          }
          
          const tourText = convertVietnameseToAscii(`${index + 1}. ${tour.tourName}`);
          pdf.text(tourText, 25, yPosition);
          yPosition += 8;
          
          pdf.text(convertVietnameseToAscii(`   - Luot dat: ${tour.bookings}`), 25, yPosition);
          yPosition += 6;
          pdf.text(convertVietnameseToAscii(`   - Doanh thu: ${tour.revenue.toLocaleString()} VND`), 25, yPosition);
          yPosition += 6;
          pdf.text(convertVietnameseToAscii(`   - Danh gia: ${tour.avgRating} sao`), 25, yPosition);
          yPosition += 6;
          pdf.text(convertVietnameseToAscii(`   - Tang truong: ${tour.growthRate >= 0 ? '+' : ''}${tour.growthRate}%`), 25, yPosition);
          yPosition += 12;
        });
      }
      
      // 5. DIEM DEN PHO BIEN
      if (yPosition > 150) {
        pdf.addPage();
        yPosition = 20;
      }
      
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text(convertVietnameseToAscii('5. DIEM DEN PHO BIEN NHAT'), 20, yPosition);
      yPosition += 15;
      
      if (attractionData.length > 0) {
        pdf.setFontSize(11);
        pdf.setFont('helvetica', 'normal');
        
        attractionData.slice(0, 10).forEach((attraction, index) => {
          if (yPosition > 260) {
            pdf.addPage();
            yPosition = 20;
          }
          
          const attractionText = convertVietnameseToAscii(`${index + 1}. ${attraction.attractionName}`);
          pdf.text(attractionText, 25, yPosition);
          yPosition += 8;
          pdf.text(convertVietnameseToAscii(`   - Luot dat tour: ${attraction.bookings}`), 25, yPosition);
          yPosition += 6;
          pdf.text(convertVietnameseToAscii(`   - Tong doanh thu: ${attraction.revenue.toLocaleString()} VND`), 25, yPosition);
          yPosition += 12;
        });
      }
      
      pdf.save('Bao_cao_thong_ke_du_lich.pdf');
    } catch (error) {
      console.error('Lỗi xuất PDF:', error);
      alert('Có lỗi xảy ra khi xuất PDF');
    }
  };

  // Hàm xuất Excel với toàn bộ nội dung trang báo cáo
  const exportToExcel = async () => {
    try {
      const XLSX = await import('xlsx');
      
      // Tạo workbook mới
      const wb = XLSX.utils.book_new();
      
      // Sheet 1: Thống kê tổng quan
      const statsData = [[
        'Chỉ số', 'Giá trị', 'Tăng trưởng (%)', 'So với tháng trước'
      ]];
      
      if (stats) {
        statsData.push(
          ['Tổng lượt khách', stats.totalTickets.toString(), stats.ticketGrowth.toFixed(1), stats.ticketGrowth >= 0 ? 'Tăng' : 'Giảm'],
          ['Tổng đặt chỗ', stats.totalBookings.toString(), stats.bookingGrowth.toFixed(1), stats.bookingGrowth >= 0 ? 'Tăng' : 'Giảm'],
          ['Tổng doanh thu (VND)', stats.totalRevenue.toString(), stats.revenueGrowth.toFixed(1), stats.revenueGrowth >= 0 ? 'Tăng' : 'Giảm']
        );
      }
      
      const statsSheet = XLSX.utils.aoa_to_sheet(statsData);
      XLSX.utils.book_append_sheet(wb, statsSheet, 'Thống kê tổng quan');
      
      // Sheet 2: Dữ liệu theo tháng (7 tháng gần nhất)
      const monthlyDataArray = [[
        'Tháng', 'Số đặt chỗ', 'Doanh thu (VND)', 'Ghi chú'
      ]];
      
      monthlyData.forEach((data, index) => {
        const note = index === monthlyData.length - 1 ? 'Tháng hiện tại' : '';
        monthlyDataArray.push([
          data.month,
          data.bookings.toString(),
          data.revenue.toString(),
          note
        ]);
      });
      
      const monthlySheet = XLSX.utils.aoa_to_sheet(monthlyDataArray);
      XLSX.utils.book_append_sheet(wb, monthlySheet, 'Dữ liệu theo tháng');
      
      // Sheet 3: Tỷ lệ trạng thái đặt tour
      const statusData = [[
        'Trạng thái', 'Tỷ lệ (%)', 'Màu hiển thị'
      ]];
      
      tourStatusData.forEach((status) => {
        statusData.push([
          status.name,
          status.value.toString(),
          status.color
        ]);
      });
      
      const statusSheet = XLSX.utils.aoa_to_sheet(statusData);
      XLSX.utils.book_append_sheet(wb, statusSheet, 'Trạng thái đặt tour');
      
      // Sheet 4: Top Tours (theo tiêu chí hiện tại)
      const sortTypeText = reportType === 'popularity' ? 'Phổ biến nhất' : 
                          reportType === 'rating' ? 'Đánh giá cao' : 'Doanh thu cao';
      
      const toursData = [[
        'STT', 'Tên Tour', 'Số đặt chỗ', 'Doanh thu (VND)', 'Đánh giá (Sao)', 'Tăng trưởng (%)', `Sắp xếp theo: ${sortTypeText}`
      ]];
      
      topTours.forEach((tour, index) => {
        toursData.push([
          (index + 1).toString(),
          tour.tourName,
          tour.bookings.toString(),
          tour.revenue.toString(),
          tour.avgRating.toString(),
          tour.growthRate.toString(),
          tour.growthRate >= 0 ? 'Tăng' : 'Giảm'
        ]);
      });
      
      const toursSheet = XLSX.utils.aoa_to_sheet(toursData);
      XLSX.utils.book_append_sheet(wb, toursSheet, 'Top Tours');
      
      // Sheet 5: Điểm đến phổ biến nhất
      const attractionDataArray = [[
        'STT', 'Tên điểm đến', 'Lượt đặt tour', 'Doanh thu (VND)', 'Tỷ lệ (%)'
      ]];
      
      const totalAttractionBookings = attractionData.reduce((sum, item) => sum + item.bookings, 0);
      
      attractionData.slice(0, 10).forEach((attraction, index) => {
        const percentage = totalAttractionBookings > 0 ? ((attraction.bookings / totalAttractionBookings) * 100).toFixed(1) : '0';
        attractionDataArray.push([
          (index + 1).toString(),
          attraction.attractionName,
          attraction.bookings.toString(),
          attraction.revenue.toString(),
          percentage
        ]);
      });
      
      const attractionSheet = XLSX.utils.aoa_to_sheet(attractionDataArray);
      XLSX.utils.book_append_sheet(wb, attractionSheet, 'Điểm đến phổ biến');
      
      // Sheet 6: Tóm tắt báo cáo
      const summaryData = [[
        'Thông tin báo cáo'
      ], [
        'Tên báo cáo', 'Báo cáo thống kê du lịch'
      ], [
        'Ngày tạo', new Date().toLocaleDateString('vi-VN')
      ], [
        'Thời gian tạo', new Date().toLocaleTimeString('vi-VN')
      ], [
        'Phạm vi dữ liệu', '7 tháng gần nhất'
      ], [
        'Tiêu chí sắp xếp tours', sortTypeText
      ], [
        'Tổng số tours trong top', topTours.length.toString()
      ], [
        'Tổng số điểm đến', attractionData.length.toString()
      ], [
        ''
      ], [
        'Ghi chú:'
      ], [
        '- Dữ liệu thống kê chỉ tính các đơn đặt đã xác nhận'
      ], [
        '- Tăng trưởng được tính so với tháng trước'
      ], [
        '- Doanh thu tính bằng VND'
      ], [
        '- Điểm đánh giá tính theo thang 5 sao'
      ]];
      
      const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
      XLSX.utils.book_append_sheet(wb, summarySheet, 'Tóm tắt báo cáo');
      
      XLSX.writeFile(wb, `Bao_cao_thong_ke_du_lich.xlsx`);
    } catch (error) {
      console.error('Lỗi xuất Excel:', error);
      alert('Có lỗi xảy ra khi xuất Excel');
    }
  };

  if (loading) {
    return (
      <div className="space-y-6 w-full">
        <Card>
          <CardContent className="pt-6">
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-20 w-full" />
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 w-full">
      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tổng lượt khách */}
        <Card className="flex flex-col justify-between p-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
            <CardTitle className="text-lg font-medium text-[#777]">
              Tổng lượt khách
              <div className="text-2xl font-bold text-gray-900 mt-1">
                {stats?.totalTickets.toLocaleString() || '0'}
              </div>
            </CardTitle>
            <img src="/users-purple.svg" alt="Vé" width={80} height={80} />
          </CardHeader>
          <CardContent>
            <p className="mt-1 text-gray-500 flex items-center gap-1">
              {(stats?.ticketGrowth || 0) >= 0 ? (
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-rose-500" />
              )}
              <span className={`font-medium ${
                (stats?.ticketGrowth || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'
              }`}>
                {(stats?.ticketGrowth || 0) >= 0 ? '+' : ''}{stats?.ticketGrowth.toFixed(1) || '0'}%
              </span> so với tháng trước
            </p>
          </CardContent>
        </Card>

        {/* Tổng đặt chỗ */}
        <Card className="flex flex-col justify-between p-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
            <CardTitle className="text-lg font-medium text-[#777]">
              Tổng đặt chỗ
              <div className="text-2xl font-bold text-gray-900 mt-1">
                {stats?.totalBookings.toLocaleString() || '0'}
              </div>
            </CardTitle>
            <img src="/box-yellow.svg" alt="Đặt chỗ" width={80} height={80} />
          </CardHeader>
          <CardContent>
            <p className="mt-1 text-gray-500 flex items-center gap-1">
              {(stats?.bookingGrowth || 0) >= 0 ? (
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-rose-500" />
              )}
              <span className={`font-medium ${
                (stats?.bookingGrowth || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'
              }`}>
                {(stats?.bookingGrowth || 0) >= 0 ? '+' : ''}{stats?.bookingGrowth.toFixed(1) || '0'}%
              </span> so với tháng trước
            </p>
          </CardContent>
        </Card>

        {/* Tổng doanh thu */}
        <Card className="flex flex-col justify-between p-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
            <CardTitle className="text-lg font-medium text-[#777]">
              Tổng doanh thu
              <div className="text-2xl font-bold text-gray-900 mt-1">
                {(stats?.totalRevenue || 0).toLocaleString()} ₫
              </div>
            </CardTitle>
            <img src="/chart-green.svg" alt="Doanh thu" width={80} height={80} />
          </CardHeader>
          <CardContent>
            <p className="mt-1 text-gray-500 flex items-center gap-1">
              {(stats?.revenueGrowth || 0) >= 0 ? (
                <TrendingUp className="w-4 h-4 text-emerald-500" />
              ) : (
                <TrendingDown className="w-4 h-4 text-rose-500" />
              )}
              <span className={`font-medium ${
                (stats?.revenueGrowth || 0) >= 0 ? 'text-emerald-600' : 'text-rose-600'
              }`}>
                {(stats?.revenueGrowth || 0) >= 0 ? '+' : ''}{stats?.revenueGrowth.toFixed(1) || '0'}%
              </span> so với tháng trước
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Biểu đồ đặt chỗ & trạng thái tour */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Đặt chỗ và doanh thu theo tháng</CardTitle>
            <CardDescription>7 tháng gần nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart 
                data={monthlyData}
                margin={{ right: 20}}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="bookings" />
                <YAxis yAxisId="revenue" orientation="right" />
                <Tooltip 
                  formatter={(value, name) => {
                    if (name === 'bookings') return [`${value.toLocaleString()} đặt chỗ`, 'Số đặt chỗ'];
                    if (name === 'revenue') return [`${value.toLocaleString()} ₫`, 'Doanh thu'];
                    return [value, name];
                  }}
                />
                <Area
                  yAxisId="bookings"
                  type="monotone"
                  dataKey="bookings"
                  stroke="#22c55e"
                  fill="#22c55e"
                  fillOpacity={0.6}
                  name="bookings"
                />
                <Area
                  yAxisId="revenue"
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.4}
                  name="revenue"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tỷ lệ trạng thái đặt tour</CardTitle>
            <CardDescription>Phân bố theo trạng thái đặt tour</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={tourStatusData.map(item => ({ ...item, [item.name]: item.value }))}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {tourStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(v, n) => [`${v}%`, n]} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tour phổ biến nhất */}
      <Card>
        <div className="flex items-center justify-between">
          <CardHeader>
            <CardTitle>Tour phổ biến nhất</CardTitle>
            <CardDescription>
              Các tour được đặt nhiều nhất
            </CardDescription>
          </CardHeader>

          <div className="justify-end p-6">
            <Select value={reportType === 'popularity' ? 'overview' : reportType === 'rating' ? 'destinations' : 'visitors'} onValueChange={handleReportTypeChange}>
              <SelectTrigger>
                <SelectValue placeholder="Sắp xếp theo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="overview">Phổ biến nhất</SelectItem>
                <SelectItem value="destinations">Đánh giá cao</SelectItem>
                <SelectItem value="visitors">Doanh thu cao</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <CardContent>
          <div className="space-y-4">
            {topTours.length === 0 ? (
              <p className="text-center text-gray-500 py-8">Không có dữ liệu tour</p>
            ) : (
              topTours.map((tour, index) => (
                <div
                  key={tour.tourId}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-semibold text-green-700">
                        {index + 1}
                      </span>
                    </div>
                    <div>
                      <h4 className="font-medium">{tour.tourName}</h4>
                      <p className="text-sm text-muted-foreground">
                        {tour.bookings} lượt đặt
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="text-sm font-medium">
                        {tour.revenue.toLocaleString()} ₫
                      </p>
                      <p className="text-xs text-muted-foreground">Doanh thu</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium">⭐ {tour.avgRating}</p>
                      <p className="text-xs text-muted-foreground">Đánh giá</p>
                    </div>
                    <Badge 
                      variant="secondary" 
                      className={`${tour.growthRate >= 0 ? 'text-green-600 bg-green-50' : 'text-red-600 bg-red-50'}`}
                    >
                      {tour.growthRate >= 0 ? '+' : ''}{tour.growthRate}%
                    </Badge>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Biểu đồ đặt tour theo điểm đến */}
      <Card>
        <CardHeader>
          <CardTitle>Số lượt đặt tour theo điểm đến</CardTitle>
          <CardDescription>
            So sánh lượt đặt và doanh thu các điểm du lịch
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={attractionData} margin={{ right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="attractionName" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip
                formatter={(v, n) =>
                  n === "bookings"
                    ? [`${v.toLocaleString()} lượt`, "Lượt đặt"]
                    : [`${v.toLocaleString()} ₫`, "Doanh thu"]
                }
              />
              <Bar
                yAxisId="left"
                dataKey="bookings"
                fill="#22c55e"
                name="bookings"
              />
              <Bar
                yAxisId="right"
                dataKey="revenue"
                fill="#3b82f6"
                name="revenue"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Xuất báo cáo */}
      <Card className="flex items-center justify-between p-4">
        <CardHeader className="p-0">
          <CardTitle className="text-sm font-medium">Xuất báo cáo</CardTitle>
        </CardHeader>

        <CardContent className="p-0 flex gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2 text-sm"
            onClick={exportToPDF}
            disabled={loading}
          >
            <FileText size={16} />
            Xuất PDF
          </Button>
          <Button 
            variant="outline" 
            className="flex items-center gap-2 text-sm"
            onClick={exportToExcel}
            disabled={loading}
          >
            <Download size={16} />
            Xuất Excel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
