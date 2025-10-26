import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
} from "recharts";
import {
  Calendar as CalendarIcon,
  TrendingUp,
  Search,
  TrendingDown,
} from "lucide-react";
import { format, subMonths } from "date-fns";
import { vi } from "date-fns/locale";

const monthlyData = [
  { month: "Tháng 1", nội_địa: 2400, quốc_tế: 400, công_tác: 200 },
  { month: "Tháng 2", nội_địa: 1800, quốc_tế: 350, công_tác: 180 },
  { month: "Tháng 3", nội_địa: 3200, quốc_tế: 600, công_tác: 250 },
  { month: "Tháng 4", nội_địa: 2800, quốc_tế: 520, công_tác: 220 },
  { month: "Tháng 5", nội_địa: 4100, quốc_tế: 750, công_tác: 300 },
  { month: "Tháng 6", nội_địa: 3800, quốc_tế: 680, công_tác: 280 },
  { month: "Tháng 7", nội_địa: 4300, quốc_tế: 820, công_tác: 350 },
];

const destinationData = [
  { name: "Vịnh Hạ Long", visitors: 15230, revenue: 11520000, rating: 4.9 },
  { name: "Phố cổ Hội An", visitors: 12100, revenue: 3987000, rating: 4.8 },
  { name: "Nhà thờ Đức Bà Sài Gòn", visitors: 9800, revenue: 2756000, rating: 4.7 },
  { name: "Bán đảo Sơn Trà", visitors: 8700, revenue: 3689000, rating: 4.6 },
  { name: "Tháp Bà Ponagar", visitors: 7650, revenue: 8543000, rating: 4.5 },
];

const visitorTypeData = [
  { name: "Khách nội địa", value: 65, color: "#22c55e" },
  { name: "Khách quốc tế", value: 25, color: "#3b82f6" },
  { name: "Khách công tác", value: 10, color: "#06b6d4" },
];

const eventPerformance = [
  { event: "Vịnh Hạ Long", attendance: 45000, revenue: 2250000 },
  { event: "Hội An", attendance: 8500, revenue: 425000 },
  { event: "Nhà thờ Đức Bà Sài Gòn", attendance: 150, revenue: 7500 },
  { event: "Bán đảo Sơn Trà", attendance: 12000, revenue: 600000 },
];

export function TouristReports() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: subMonths(new Date(), 6),
    to: new Date(),
  });

  const [query, setQuery] = useState("");
  const [reportType, setReportType] = useState("overview");

  return (
    <div className="space-y-6 w-full">
      {/* Bộ lọc */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative flex-1">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                  <Search size={16} />
                </span>
                <input
                  type="text"
                  className="h-10 w-full rounded-md border border-gray-200 bg-gray-50 pl-9 pr-3 text-sm text-gray-700 placeholder:text-gray-400 focus:border-[#26B8ED] focus:ring-2 focus:ring-[#26B8ED]/50"
                  placeholder="Tìm kiếm ..."
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                />
              </div>
            </div>

            <div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(dateRange.from, "dd MMM", { locale: vi })} -{" "}
                    {format(dateRange.to, "dd MMM yyyy", { locale: vi })}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="range"
                    selected={{
                      from: dateRange.from,
                      to: dateRange.to,
                    }}
                    onSelect={(range) => {
                      if (range?.from && range?.to) {
                        setDateRange({ from: range.from, to: range.to });
                      }
                    }}
                    numberOfMonths={2}
                    locale={vi}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Tổng lượt khách */}
        <Card className="flex flex-col justify-between p-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
            <CardTitle className="text-lg font-medium text-[#777]">
              Tổng lượt khách
              <div className="text-2xl font-bold text-gray-900 mt-1">
                40,689
              </div>
            </CardTitle>
            <img src="/users-purple.svg" alt="Khách" width={80} height={80} />
          </CardHeader>
          <CardContent>
            <p className="mt-1 text-gray-500 flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-600 font-medium">+8.5%</span> so với
              năm trước
            </p>
          </CardContent>
        </Card>

        {/* Tổng đặt chỗ */}
        <Card className="flex flex-col justify-between p-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
            <CardTitle className="text-lg font-medium text-[#777]">
              Tổng đặt chỗ
              <div className="text-2xl font-bold text-gray-900 mt-1">
                10,293
              </div>
            </CardTitle>
            <img src="/box-yellow.svg" alt="Đặt chỗ" width={80} height={80} />
          </CardHeader>
          <CardContent>
            <p className="mt-1 text-gray-500 flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-emerald-500" />
              <span className="text-emerald-600 font-medium">+1.3%</span> so với
              năm trước
            </p>
          </CardContent>
        </Card>

        {/* Tổng doanh thu */}
        <Card className="flex flex-col justify-between p-4">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-0">
            <CardTitle className="text-lg font-medium text-[#777]">
              Tổng doanh thu
              <div className="text-2xl font-bold text-gray-900 mt-1">
                589,000,000 ₫
              </div>
            </CardTitle>
            <img src="/chart-green.svg" alt="Doanh thu" width={80} height={80} />
          </CardHeader>
          <CardContent>
            <p className="mt-1 text-gray-500 flex items-center gap-1">
              <TrendingDown className="w-4 h-4 text-rose-500" />
              <span className="text-rose-600 font-medium">-1.3%</span> so với
              năm trước
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Biểu đồ doanh thu & loại khách */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Doanh thu theo loại khách</CardTitle>
            <CardDescription>7 tháng gần nhất</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={monthlyData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip formatter={(v) => `${v.toLocaleString()} khách`} />
                <Area
                  type="monotone"
                  dataKey="nội_địa"
                  stackId="1"
                  stroke="#22c55e"
                  fill="#22c55e"
                  fillOpacity={0.6}
                  name="Nội địa"
                />
                <Area
                  type="monotone"
                  dataKey="quốc_tế"
                  stackId="1"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.6}
                  name="Quốc tế"
                />
                <Area
                  type="monotone"
                  dataKey="công_tác"
                  stackId="1"
                  stroke="#06b6d4"
                  fill="#06b6d4"
                  fillOpacity={0.6}
                  name="Công tác"
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tỷ lệ loại khách</CardTitle>
            <CardDescription>Phân bố theo nhóm khách</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={visitorTypeData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {visitorTypeData.map((entry, index) => (
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
              Các tour được truy cập và đặt nhiều nhất
            </CardDescription>
          </CardHeader>

          <div className="justify-end p-6">
            <Select value={reportType} onValueChange={setReportType}>
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
            {destinationData.map((destination, index) => (
              <div
                key={destination.name}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-semibold text-green-700">
                      {index + 1}
                    </span>
                  </div>
                  <div>
                    <h4 className="font-medium">{destination.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      {destination.visitors.toLocaleString()} khách trong tháng
                      này
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {destination.revenue.toLocaleString()} ₫
                    </p>
                    <p className="text-xs text-muted-foreground">Doanh thu</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">⭐ {destination.rating}</p>
                    <p className="text-xs text-muted-foreground">Đánh giá</p>
                  </div>
                  <Badge variant="secondary" className="text-green-600 bg-green-50">
                    +{Math.floor(Math.random() * 20 + 5)}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Biểu đồ đặt tour */}
      <Card>
        <CardHeader>
          <CardTitle>Số lượt đặt tour theo điểm đến</CardTitle>
          <CardDescription>
            So sánh lượt đặt và doanh thu các điểm du lịch gần đây
          </CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={eventPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="event" />
              <YAxis yAxisId="left" />
              <YAxis yAxisId="right" orientation="right" />
              <Tooltip
                formatter={(v, n) =>
                  n === "attendance"
                    ? [`${v.toLocaleString()} lượt`, "Lượt đặt"]
                    : [`${v.toLocaleString()} ₫`, "Doanh thu"]
                }
              />
              <Bar
                yAxisId="left"
                dataKey="attendance"
                fill="#22c55e"
                name="Lượt đặt"
              />
              <Bar
                yAxisId="right"
                dataKey="revenue"
                fill="#3b82f6"
                name="Doanh thu"
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
          <Button variant="outline" className="flex items-center gap-2 text-sm">
            <img src="/pdf.svg" alt="PDF" width={16} height={16} />
            Xuất PDF
          </Button>
          <Button variant="outline" className="flex items-center gap-2 text-sm">
            <img src="/excel.svg" alt="Excel" width={16} height={16} />
            Xuất Excel
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
