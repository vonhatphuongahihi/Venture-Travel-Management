import  { useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { Plus, Search } from "lucide-react";
import { FaSort } from "react-icons/fa";
import { MdKeyboardArrowDown } from "react-icons/md";
import { FiFilter } from "react-icons/fi";
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetFooter,
    SheetClose,
    SheetOverlay,
} from "@/components/ui/sheet";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";
import { cn } from "@/lib/utils";

const tours = [
    {
        id: "tour-1",
        name: "Tour Ninh Bình cả ngày từ Hà Nội đến Hoa Lư, Tam Cốc & Hang Múa",
        province: "Hà Nội",
        about: "Thoát khỏi không gian ồn ào của thành phố Hà Nội, và hít thở không khí trong lành trong chuyến tham",
        categories: ["Tour thiên nhiên", "Tour ngắm cảnh", "Tour lịch sử"],
        isActive: true,
        rating: 4.8,
    },
    {
        id: "tour-2",
        name: "Tour Ninh Bình cả ngày từ Hà Nội đến Hoa Lư, Tam Cốc & Hang Múa",
        province: "Hà Nội",
        about: "Thoát khỏi không gian ồn ào của thành phố Hà Nội, và hít thở không khí trong lành trong chuyến tham",
        categories: ["Tour thiên nhiên", "Tour ngắm cảnh", "Tour lịch sử"],
        isActive: true,
        rating: 4.8,
    },
    {
        id: "tour-3",
        name: "Tour Ninh Bình cả ngày từ Hà Nội đến Hoa Lư, Tam Cốc & Hang Múa",
        province: "Hà Nội",
        about: "Thoát khỏi không gian ồn ào của thành phố Hà Nội, và hít thở không khí trong lành trong chuyến tham",
        categories: ["Tour thiên nhiên", "Tour ngắm cảnh", "Tour lịch sử"],
        isActive: true,
        rating: 4.8,
    },
    {
        id: "tour-4",
        name: "Tour Ninh Bình cả ngày từ Hà Nội đến Hoa Lư, Tam Cốc & Hang Múa",
        province: "Hà Nội",
        about: "Thoát khỏi không gian ồn ào của thành phố Hà Nội, và hít thở không khí trong lành trong chuyến tham",
        categories: ["Tour thiên nhiên", "Tour ngắm cảnh", "Tour lịch sử"],
        isActive: true,
        rating: 4.8,
    },
    {
        id: "tour-5",
        name: "Tour Ninh Bình cả ngày từ Hà Nội đến Hoa Lư, Tam Cốc & Hang Múa",
        province: "Hà Nội",
        about: "Thoát khỏi không gian ồn ào của thành phố Hà Nội, và hít thở không khí trong lành trong chuyến tham",
        categories: ["Tour thiên nhiên", "Tour ngắm cảnh", "Tour lịch sử"],
        isActive: true,
        rating: 4.8,
    },
    {
        id: "tour-6",
        name: "Tour Ninh Bình cả ngày từ Hà Nội đến Hoa Lư, Tam Cốc & Hang Múa",
        province: "Hà Nội",
        about: "Thoát khỏi không gian ồn ào của thành phố Hà Nội, và hít thở không khí trong lành trong chuyến tham",
        categories: ["Tour thiên nhiên", "Tour ngắm cảnh", "Tour lịch sử"],
        isActive: true,
        rating: 4.8,
    },
];

import SelectItem from "@/components/tours-manage/SelectItem";
import TourCard from "@/components/tours-manage/TourCard";
const ToursManage = () => {
    const navigate = useNavigate();
    const sortOptionList = [
        { label: "Mới nhất", value: "newest" },
        { label: "Phổ biến nhất", value: "popular" },
        { label: "Đánh giá cao", value: "rating" },
        { label: "Giá tốt", value: "price" },
    ];

    const tourCategoryOptionList = [
        { label: "Tour Thiên nhiên", value: "100" },
        { label: "Tour Ngắm cảnh", value: "101" },
        { label: "Nghệ thuật & Văn hoá", value: "102" },
        { label: "Tour dưới nước", value: "103" },
        { label: "Tour trên đất liền", value: "104" },
        { label: "Tour ẩm thực", value: "105" },
        { label: "Tour theo chủ đề", value: "106" },
        { label: "Tour nửa ngày", value: "107" },
        { label: "Khám phá đảo", value: "108" },
        { label: "Tour bằng xe buýt", value: "109" },
    ];

    const [sort, setSort] = useState(sortOptionList[0].value);
    const [search, setSearch] = useState("");
    const [searched, setSearched] = useState(false);

    const handleSearch = () => {
        if (search.trim() === "") {
            setSearched(false);
        } else {
            setSearched(true);
        }
    };

    const [currentPage, setCurrentPage] = useState(1);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
    };
    return (
        <Layout title="Quản lý tour">
            <div className="p-4 mb-[50px]">
                <div className="flex items-center justify-between">
                    <p className="text-[18px] text-primary font-semibold">Danh sách tour</p>
                    <div
                        onClick={() => {
                            navigate("create-tour");
                        }}
                        className="px-3 py-2 bg-primary rounded-lg text-white flex items-center gap-1 cursor-pointer hover:opacity-80"
                    >
                        <Plus className=""></Plus>
                        Thêm tour
                    </div>
                </div>
                <div className="mt-4">
                    <div className="flex items-center justify-between gap-3 bg-white p-[6px] rounded-lg shadow-sm border">
                        <div className="flex bg-gray-100 items-center w-[65%] py-2 px-3 rounded-lg ">
                            <button>
                                <Search className="w-5 h-5 text-gray-400"></Search>
                            </button>
                            <input
                                type="text"
                                placeholder="Tìm tour"
                                className="text-[14px] outline-none flex-1 ml-2 bg-gray-100"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                    if (e.target.value.trim() === "") {
                                        setSearched(false);
                                    }
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter") {
                                        handleSearch();
                                    }
                                }}
                            />
                        </div>
                        <div className="flex gap-5">
                            <SelectItem
                                optionList={sortOptionList}
                                selected={sort}
                                setSelected={setSort}
                                IconComponent={<FaSort />}
                            ></SelectItem>
                            <Sheet>
                                {/* Nút mở sheet */}
                                <SheetTrigger asChild>
                                    <button className="px-2 py-[6px] rounded-lg h-full bg-gray-100 flex gap-2 items-center text-[14px] text-gray-500">
                                        <FiFilter />
                                        <span>Lọc</span>
                                        <MdKeyboardArrowDown className="ml-auto" />
                                    </button>
                                </SheetTrigger>

                                {/* Sheet từ bên phải */}
                                <SheetOverlay>
                                    <SheetContent side="right" className="w-80">
                                        <SheetHeader>
                                            <SheetTitle>Bộ lọc</SheetTitle>
                                            <SheetDescription>
                                                Chọn các yếu tố để lọc tour
                                            </SheetDescription>
                                        </SheetHeader>

                                        <div className="space-y-4">
                                            {/* Ô tìm kiếm */}
                                            <div className="space-y-2"></div>

                                            {/* Checkbox loại tour */}
                                            <div className="space-y-3">
                                                <Label>Loại tour</Label>
                                                {tourCategoryOptionList.map((cate, index) => (
                                                    <div
                                                        key={index}
                                                        className="flex items-center gap-2"
                                                    >
                                                        <Checkbox id={cate?.value} />
                                                        <Label htmlFor="international">
                                                            {cate?.label}
                                                        </Label>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <SheetFooter className="mt-4 flex items-center sm:justify-between flex-row">
                                            <button className=" bg-gray-100 rounded-md px-4 py-2">
                                                Áp dụng
                                            </button>
                                            <SheetClose asChild>
                                                <button className="bg-gray-100 rounded-md px-4 py-2">
                                                    Đóng
                                                </button>
                                            </SheetClose>
                                        </SheetFooter>
                                    </SheetContent>
                                </SheetOverlay>
                            </Sheet>
                        </div>
                    </div>
                </div>
                <div className="mt-5 grid grid-cols-3 gap-4">
                    {tours.map((tour, index) => (
                        <TourCard tour={tour} key={index}></TourCard>
                    ))}
                </div>
                <div className="mt-10">
                    <Pagination className="justify-end">
                        <PaginationContent>
                            <PaginationItem>
                                <PaginationPrevious
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (currentPage > 1) handlePageChange(currentPage - 1);
                                    }}
                                />
                            </PaginationItem>

                            {Array.from({ length: 3 }, (_, i) => i + 1).map((page) => (
                                <PaginationItem key={page}>
                                    <PaginationLink
                                        href="#"
                                        isActive={page === currentPage}
                                        onClick={(e) => {
                                            e.preventDefault();
                                            handlePageChange(page);
                                        }}
                                        className={cn(
                                            "rounded-md px-3 py-1 transition-colors text-primary border border-primary ",
                                            page === currentPage
                                                ? "bg-primary text-white hover:bg-primary/70 hover:text-white"
                                                : "bg-white hover:text-primary hover:bg-primary/10"
                                        )}
                                    >
                                        {page}
                                    </PaginationLink>
                                </PaginationItem>
                            ))}

                            {3 > 5 && <PaginationEllipsis />}

                            <PaginationItem>
                                <PaginationNext
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        if (currentPage < 3) handlePageChange(currentPage + 1);
                                    }}
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                </div>
            </div>
        </Layout>
    );
};

export default ToursManage;
