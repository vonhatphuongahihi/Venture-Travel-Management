import Layout from "@/components/Layout";
import FormInput from "@/components/tour-create/FormInput";
import FormMutilpeSelect from "@/components/tour-create/FormMultipleSelect";
import FormTextArea from "@/components/tour-create/FormTextArea";
import ImageUploader from "@/components/tour-create/ImageUploader";
import { SearchableSelect } from "@/components/tour-create/SearchableSelect";
import TextEditor from "@/components/tour-create/TextEditor";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { Plus, X } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

import { useNavigate } from "react-router-dom";
import TicketFormModal from "@/components/tour-create/TicketFormModal";
import {
    useCreateTour,
    useGetTourFormMetadata,
    useUploadTourImages,
} from "@/services/tours/tourHook";
import { Spinner } from "@/components/ui/spinner";
import type { CreateTourRequest } from "@/types/tour";
import { AttractionSelect } from "@/components/tour-create/AttractionSelect";
import { useToast } from "@/contexts/ToastContext";

const MAPBOX_TOKEN =
    "pk.eyJ1Ijoibmd1eWVuMDk4MyIsImEiOiJjbWZoaDU5MWYwYnY0Mmlwd28zZm5ha2Z5In0.YXBPUe4baagMkZD2NpbRGA";

type TourStop = {
    attractionId: string;
    notes: string;
    details: string;
};

type TourFormValues = {
    provinceId: string;
    name: string;
    about: string;
    ageRange: string;
    maxGroupSize: number;
    duration: string;
    languages: string[];
    categories: string[];
    highlights?: string;
    inclusions: string;
    exclusions: string;
    expectations: string;
    cancellationPolicy: string;
    additionalInfomation: string;
    pickupPoint: string;
    pickupDetails: string;
    pickupAreaRadius: number;
    endPoint: string;
    tourStops: TourStop[];
};

type PriceCategory = {
    name: string;
    categoryId: string;
    description?: string;
    price: number;
    quantity: number;
};

type TicketData = {
    id?: string;
    name: string;
    quantity: number;
    notes: string;
    prices: PriceCategory[];
};

type MapboxGeocodingFeature = {
    id: string;
    type: "Feature";
    geometry: {
        type: "Point";
        coordinates: [number, number]; // [longitude, latitude]
    };
    properties: {
        name: string;
        full_address?: string;
        place_formatted?: string;
        coordinates: {
            longitude: number;
            latitude: number;
        };
        context?: {
            country?: { name: string; country_code: string };
            region?: { name: string; region_code: string };
            place?: { name: string };
            locality?: { name: string };
        };
    };
};

type Option<T = any> = {
    label: string;
    value: string | number;
    data?: T; // dữ liệu gốc
};

const tourCategoryOptionList = [
    { label: "Tour Thiên nhiên", value: "Tour Thiên nhiên" },
    { label: "Tour Ngắm cảnh", value: "Tour Ngắm cảnh" },
    { label: "Nghệ thuật & Văn hoá", value: "Nghệ thuật & Văn hoá" },
    { label: "Tour dưới nước", value: "Tour dưới nước" },
    { label: "Tour trên đất liền", value: "Tour trên đất liền" },
    { label: "Tour ẩm thực", value: "Tour ẩm thực" },
    { label: "Tour theo chủ đề", value: "Tour theo chủ đề" },
    { label: "Tour nửa ngày", value: "Tour nửa ngày" },
    { label: "Khám phá đảo", value: "Khám phá đảo" },
    { label: "Tour bằng xe buýt", value: "Tour bằng xe buýt" },
];

const languagesOptionList = [
    { label: "Tiếng Việt", value: "Tiếng Việt" },
    { label: "Tiếng Anh", value: "Tiếng Anh" },
    { label: "Tiếng Nhật", value: "Tiếng Nhật" },
    { label: "Tiếng Trung", value: "Tiếng Trung" },
];

const freePickupScopes = ["500", "1000", "1500"];

const TourCreate = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
        setValue,
        getValues,
    } = useForm<TourFormValues>({
        defaultValues: {
            cancellationPolicy: `<p><span style="background-color: oklch(1 0 0); color: oklch(0 0 0);">Để được hoàn đủ tiền, bạn phải hủy ít nhất 24 giờ trước thời gian trải nghiệm bắt đầu.</span></p><ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="background-color: oklch(1 0 0); color: oklch(0 0 0);">Nếu bạn hủy ít hơn 24 giờ trước thời gian bắt đầu trải nghiệm, số tiền bạn đã thanh toán sẽ không được hoàn lại.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="background-color: oklch(1 0 0); color: oklch(0 0 0);">Mọi thay đổi được thực hiện ít hơn 24 giờ trước thời gian bắt đầu trải nghiệm sẽ không được chấp nhận.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="background-color: oklch(1 0 0); color: oklch(0 0 0);">Thời gian giới hạn dựa trên giờ địa phương của trải nghiệm.</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="background-color: oklch(1 0 0); color: oklch(0 0 0);">Trải nghiệm này đòi hỏi thời tiết tốt. Nếu nó bị hủy do thời tiết xấu, bạn sẽ được chọn một ngày khác hoặc được hoàn tiền đầy đủ.</span></li></ol>`,
            additionalInfomation: `<ol><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="background-color: oklch(1 0 0); color: oklch(0 0 0);">Xác nhận sẽ được nhận tại thời điểm đặt phòng</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="background-color: oklch(1 0 0); color: oklch(0 0 0);">Không khuyến khích cho du khách mang thai</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="background-color: oklch(1 0 0); color: oklch(0 0 0);">Không có vấn đề về tim hoặc các tình trạng bệnh lý nghiêm trọng khác</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="background-color: oklch(1 0 0); color: oklch(0 0 0);">Hầu hết du khách có thể tham gia</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="background-color: oklch(1 0 0); color: oklch(0 0 0);">Trải nghiệm này đòi hỏi thời tiết tốt. Nếu bị hủy do thời tiết xấu, bạn sẽ được chọn vào ngày khác hoặc được hoàn đủ tiền</span></li><li data-list="bullet"><span class="ql-ui" contenteditable="false"></span><span style="background-color: oklch(1 0 0); color: oklch(0 0 0);">Chuyến tham quan/hoạt động này sẽ có tối đa 15 khách du lịch</span></li></ol>`,
            tourStops: [
                {
                    attractionId: "",
                    notes: "",
                    details: ""
                },
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "tourStops", // ✅ đây là tên field array
    });

    const navigate = useNavigate();

    const [step, setStep] = useState<number | null>(1);

    const [tourData, setTourData] = useState<TourFormValues | null>(null);

    const [selectedPickUpAddress, setSelectedPickUpAddress] =
        useState<Option<MapboxGeocodingFeature> | null>(null);

    const [selectedEndPointAddress, setSelectedEndPointAddress] =
        useState<Option<MapboxGeocodingFeature> | null>(null);

    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

    const [isCreatingTour, setIsCreatingTour] = useState(false);
    const {
        data: metadata,
        isLoading: loadingMetadata,
        error: _metadataError,
    } = useGetTourFormMetadata();

    // Create tour hook
    const { mutateAsync: createTour } = useCreateTour();

    const { mutateAsync: uploadTourImages } = useUploadTourImages();

    const onSubmitTour = async (data: TourFormValues) => {
        try {
            setStep(2);
            setTourData(data);
            console.log(data);
            console.log(selectedPickUpAddress);
            console.log(selectedEndPointAddress);
        } catch (error) {
            console.log(error);
        }
    };

    const [isTicketModalOpen, setIsTicketModalOpen] = useState(false);

    const [tickets, setTickets] = useState<TicketData[]>([]);
    const [editingTicket, setEditingTicket] = useState<TicketData | null>(null);
    const [editingIndex, setEditingIndex] = useState<number | null>(null);
    const [formKey, setFormKey] = useState(0);

    const { showToast } = useToast()
    const nevigate = useNavigate()

    const handleAddTicket = (ticket: TicketData) => {
        setTickets([...tickets, ticket]);
    };

    const handleUpdateTicket = (updatedTicket: TicketData) => {
        if (editingIndex === null) {
            return;
        }
        const updatedTickets = [...tickets];
        updatedTickets[editingIndex] = updatedTicket;
        setTickets(updatedTickets);
    };

    const handleEditTicket = (ticket: TicketData, index: number) => {
        setEditingTicket(ticket);
        setEditingIndex(index);
        setFormKey((prev) => prev + 1);
        setIsTicketModalOpen(true);
    };

    const handleDeleteTicket = (index: number) => {
        const newTickets = [...tickets];
        newTickets.splice(index, 1);
        setTickets(newTickets);

        if (editingIndex === null) {
            return;
        }

        if (editingIndex === index) {
            setEditingIndex(null);
            setEditingTicket(null);
        } else if (editingIndex > index) {
            setEditingIndex(editingIndex - 1);
        }
    };

    const handleCancelEdit = () => {
        setEditingTicket(null);
        setEditingIndex(null);
    };

    // console.log(metadata);

    const finishTour = async () => {
        try {
            console.log(tourData);
            console.log(tickets);
            setIsCreatingTour(true);
            setStep(null)
            const uploadedImages = await uploadTourImages(selectedFiles);

            const imgUrls = uploadedImages.images.map((img) => img.url);

            if (tourData && tickets && selectedPickUpAddress?.data?.properties.coordinates) {
                const payload: CreateTourRequest = {
                    name: tourData.name,
                    about: tourData.about,
                    ageRange: tourData.ageRange,
                    maxGroupSize: Number(tourData.maxGroupSize),
                    duration: tourData.duration,
                    languages: tourData.languages,
                    categories: tourData.categories,
                    highlights: tourData.highlights?.split("\n"),
                    inclusions: tourData.inclusions.split("\n"),
                    exclusions: tourData.exclusions.split("\n"),
                    expectations: tourData.expectations,
                    cancellationPolicy: tourData.cancellationPolicy,
                    pickupPoint: tourData.pickupPoint,
                    pickupPointCoordinates: selectedPickUpAddress?.data?.properties.coordinates,
                    pickupDetails: tourData.pickupDetails,
                    pickupAreaRadius: tourData.pickupAreaRadius,
                    endPoint: tourData.endPoint,
                    endPointCoordinates: selectedEndPointAddress?.data?.properties.coordinates,
                    startDate: new Date("2025-01-01"),
                    endDate: new Date("2025-12-31"),
                    images: imgUrls,
                    tourStops: tourData.tourStops,
                    ticketTypes: tickets,
                    additionalInformation: tourData.additionalInfomation,
                };

                await createTour(payload);

                showToast("Tạo tour thành công", "success")

                nevigate("/tours")
            }
        } catch (error) {
            setStep(1)
            showToast("Tạo tour thất bại", "error")
            console.log(error);
        } finally {
            setIsCreatingTour(false);
        }
    };

    const TourCreateStep1 = () => {
        const fetchMapboxPlaces = async (query: string): Promise<MapboxGeocodingFeature[]> => {
            if (!query || query.trim().length < 3) return [];

            try {
                const response = await fetch(
                    `https://api.mapbox.com/search/geocode/v6/forward?` +
                    new URLSearchParams({
                        q: query,
                        access_token: MAPBOX_TOKEN,
                        country: "vn",
                    })
                );

                if (!response.ok) {
                    throw new Error("Mapbox API v6 error");
                }

                const data = await response.json();
                return data.features || [];
            } catch (error) {
                console.error("Error fetching Mapbox places:", error);
                return [];
            }
        };

        const mapMapboxToOption = (
            feature: MapboxGeocodingFeature
        ): Option<MapboxGeocodingFeature> => ({
            label:
                feature.properties.full_address ||
                feature.properties.place_formatted ||
                feature.properties.name,
            value: feature.id,
            data: feature,
        });

        // Custom render option
        const renderMapboxOption = (option: Option<MapboxGeocodingFeature>) => {
            const props = option.data?.properties;
            return (
                <div className="flex flex-col">
                    <span className="font-medium">{props?.name}</span>
                    {props?.place_formatted && (
                        <span className="text-sm text-gray-500">{props.place_formatted}</span>
                    )}
                </div>
            );
        };

        // const handleSelect = (option: Option<MapboxGeocodingFeature>) => {
        //     setSelectedPickUpAddress(option);
        //     console.log("Selected:", {
        //         name: option.label,
        //         coordinates: option.data?.geometry.coordinates, // [lng, lat]
        //         fullAddress: option.data?.properties.full_address,
        //     });
        // };

        if (loadingMetadata) {
            return (
                <div className="flex min-h-[70vh] items-center justify-center">
                    <Spinner className="size-10 text-primary"></Spinner>
                </div>
            );
        }
        return (
            <div>
                <div className="flex items-center justify-between">
                    <h3 className="text-[18px] font-semibold text-primary">Thêm thông tin tour</h3>
                    <div className="flex gap-2">
                        <button
                            onClick={() => navigate("/tours")}
                            className="px-4 py-1 border text-lg rounded-md hover:bg-gray-200"
                        >
                            Hủy
                        </button>
                    </div>
                </div>
                <form onSubmit={handleSubmit(onSubmitTour)} className="space-y-6">
                    <div>
                        <div className="bg-white rounded-lg shadow-md mt-6">
                            <h2 className="font-semibold text-lg px-6 py-4 border-b">
                                Thông tin tour
                            </h2>
                            <div className="space-y-4 p-6">
                                <div className="flex gap-2">
                                    <FormInput
                                        label={"Tên tour"}
                                        name={"name"}
                                        register={register}
                                        errors={errors}
                                        // validationRules={{
                                        //     required: "Tên là bắt buộc",
                                        // }}
                                        placeholder={"Tên tour"}
                                        className="flex-1"
                                    ></FormInput>
                                </div>
                                <FormTextArea
                                    label="Tổng quan"
                                    name="about"
                                    placeholder="Nhập tổng quan"
                                    errors={errors}
                                    register={register}
                                    // validationRules={{
                                    //     required: "Tổng quan là bắt buộc",
                                    // }}
                                    row={4}
                                ></FormTextArea>
                                <div className="flex gap gap-2">
                                    <FormInput
                                        label={"Độ tuổi"}
                                        name={"ageRange"}
                                        register={register}
                                        errors={errors}
                                        // validationRules={{
                                        //     required: "Độ tuổi là bắt buộc",
                                        // }}
                                        placeholder={"VD: 1-80 tuổi"}
                                        className="flex-1"
                                    ></FormInput>
                                    <FormInput
                                        label={"Số lượng người tối đa"}
                                        name={"maxGroupSize"}
                                        register={register}
                                        type="number"
                                        errors={errors}
                                        // validationRules={{
                                        //     required: "Số lượng người tối đa là bắt buộc",
                                        // }}
                                        placeholder={"Nhập số lượng người tối đa"}
                                        className="flex-1"
                                    ></FormInput>
                                    <FormInput
                                        label={"Thời lượng tour"}
                                        name={"duration"}
                                        register={register}
                                        errors={errors}
                                        // validationRules={{
                                        //     required: "Thời lượng tour là bắt buộc",
                                        // }}
                                        placeholder={"VD: 12-13 tiếng, 2 ngày 3 đêm,..."}
                                        className="flex-1"
                                    ></FormInput>
                                </div>
                                <FormMutilpeSelect
                                    control={control}
                                    label="Dịch vụ ngôn ngữ"
                                    name="languages"
                                    placeholder="Chọn dịch vụ ngôn ngữ"
                                    options={languagesOptionList}
                                // validationRules={{
                                //     required: "Cần chọn ít nhất một dịch vụ ngôn ngữ",
                                // }}
                                ></FormMutilpeSelect>
                                <FormMutilpeSelect
                                    control={control}
                                    label="Danh mục tour"
                                    name="categories"
                                    placeholder="Chọn danh mục tour"
                                    options={tourCategoryOptionList}
                                // validationRules={{
                                //     required: "Cần chọn ít nhất một danh mục tour",
                                // }}
                                ></FormMutilpeSelect>
                                <FormTextArea
                                    label="Các điểm nổi bật"
                                    name="highlights"
                                    placeholder="Nhập các điểm nổi bật, xuống dòng để thêm mới..."
                                    errors={errors}
                                    register={register}
                                    row={4}
                                ></FormTextArea>
                                <div className="flex gap-2">
                                    <FormTextArea
                                        label="Tour bao gồm"
                                        name="inclusions"
                                        placeholder="Nhập các dịch vụ bao gồm, xuống dòng để thêm mới..."
                                        errors={errors}
                                        register={register}
                                        row={5}
                                    // validationRules={{
                                    //     required: "Cần nhập các dịch vụ tour bao gồm",
                                    // }}
                                    ></FormTextArea>
                                    <FormTextArea
                                        label="Tour không bao gồm"
                                        name="exclusions"
                                        placeholder="Nhập các dịch vụ không bao gồm, xuống dòng để thêm mới..."
                                        errors={errors}
                                        register={register}
                                        row={5}
                                    // validationRules={{
                                    //     required: "Cần nhập các dịch vụ tour không bao gồm",
                                    // }}
                                    ></FormTextArea>
                                </div>
                                <TextEditor
                                    label={"Những điều đáng mong đợi"}
                                    name="expectations"
                                    placeholder="Những điều đáng mong đợi..."
                                    // validationRules={{
                                    //     required: "Lịch trình tour là bắt buộc",
                                    //     validate: (value) =>
                                    //         (value &&
                                    //             typeof value === "string" &&
                                    //             value.replace(/<(.|\n)*?>/g, "").trim().length >
                                    //                 0) ||
                                    //         "Không được để trống",
                                    // }}
                                    control={control}
                                ></TextEditor>
                                <TextEditor
                                    label={"Chính sách hủy vé"}
                                    name="cancellationPolicy"
                                    placeholder="Chính sách hủy vé..."
                                    // validationRules={{
                                    //     required: "Chính sách hủy vé là bắt buộc",
                                    //     validate: (value) =>
                                    //         (value &&
                                    //             typeof value === "string" &&
                                    //             value.replace(/<(.|\n)*?>/g, "").trim().length >
                                    //                 0) ||
                                    //         "Không được để trống",
                                    // }}
                                    control={control}
                                ></TextEditor>
                                <TextEditor
                                    label={"Thông tin bổ sung"}
                                    name="additionalInfomation"
                                    placeholder="Thông tin bổ sung..."
                                    control={control}
                                ></TextEditor>
                                <ImageUploader
                                    label="Ảnh tour"
                                    maxFiles={10}
                                    maxSizeMB={5}
                                    value={selectedFiles}
                                    onChange={setSelectedFiles}
                                ></ImageUploader>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="bg-white rounded-lg shadow-md mt-6">
                            <h2 className="font-semibold text-lg px-6 py-4 border-b">
                                Thông tin tập trung đón khách
                            </h2>
                            <div className="space-y-4 p-6">
                                <div>
                                    <label
                                        className={`mb-2
                                            block font-medium`}
                                    >
                                        Điểm tập trung khả dụng
                                        <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <Controller
                                        control={control}
                                        name={`pickupPoint`}
                                        // rules={{ required: "Điểm đến là bắt buộc" }}
                                        render={({ field: formField, fieldState: { error } }) => {
                                            return (
                                                <SearchableSelect<MapboxGeocodingFeature>
                                                    placeholder="Tìm kiếm địa điểm"
                                                    fetchOptions={fetchMapboxPlaces}
                                                    mapOption={mapMapboxToOption}
                                                    renderOption={renderMapboxOption}
                                                    value={formField.value}
                                                    onChange={(value) => {
                                                        formField.onChange(value);
                                                    }}
                                                    onSelect={(option) => {
                                                        // ✅ Lưu cả name
                                                        setSelectedPickUpAddress(option);
                                                        setValue(`pickupPoint`, option.label);
                                                    }}
                                                    error={error?.message}
                                                />
                                            );
                                        }}
                                    />
                                </div>
                                <div>
                                    <div className="flex items-center gap-5">
                                        <p className="font-medium">
                                            Đón khách miễn phí trong phạm vi:
                                        </p>
                                        <div>
                                            <label className={`block mb-2 font-medium`}></label>
                                            <Controller
                                                control={control}
                                                name={"pickupAreaRadius"}
                                                defaultValue={parseInt(freePickupScopes[1])}
                                                render={({ field }) => (
                                                    <div>
                                                        <Select
                                                            value={field.value.toString()}
                                                            onValueChange={(value) => {
                                                                const finalValue = parseInt(value);
                                                                field.onChange(finalValue);
                                                            }}
                                                            defaultValue={freePickupScopes[1]}
                                                        >
                                                            <SelectTrigger
                                                                className={` w-[100px]
                                            border rounded border-gray-300 py-2 text-base outline-none`}
                                                            >
                                                                <SelectValue />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {freePickupScopes.map((scope) => (
                                                                    <SelectItem
                                                                        key={scope}
                                                                        value={scope}
                                                                    >
                                                                        {scope}
                                                                    </SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    </div>
                                                )}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <FormTextArea
                                    label="Thông tin chi tiết khi đón khách"
                                    name="pickupDetails"
                                    placeholder="Thông tin chi tiết"
                                    errors={errors}
                                    register={register}
                                    // validationRules={{
                                    //     required: "Thông tin chi tiết khi đón khách là bắt buộc",
                                    // }}
                                    row={4}
                                ></FormTextArea>
                                <div>
                                    <p className=" mb-2 font-medium">
                                        Nơi trả khách{" "}
                                        <span className="font-normal">
                                            (để trống nếu trả khách tại nơi đón)
                                        </span>
                                    </p>
                                    <Controller
                                        control={control}
                                        name={`endPoint`}
                                        render={({ field: formField, fieldState: { error } }) => {
                                            return (
                                                <SearchableSelect<MapboxGeocodingFeature>
                                                    placeholder="Tìm kiếm địa điểm"
                                                    fetchOptions={fetchMapboxPlaces}
                                                    mapOption={mapMapboxToOption}
                                                    renderOption={renderMapboxOption}
                                                    value={formField.value}
                                                    onChange={(value) => {
                                                        formField.onChange(value);
                                                    }}
                                                    onSelect={(option) => {
                                                        // ✅ Lưu cả name
                                                        setSelectedEndPointAddress(option);
                                                        setValue(`endPoint`, option.label);
                                                    }}
                                                    error={error?.message}
                                                />
                                            );
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="bg-white rounded-lg shadow-md mt-6">
                            <h2 className="font-semibold text-lg px-6 py-4 border-b">
                                Các điểm đến trong tour
                            </h2>
                            <div className="space-y-4 p-6 overflow-auto">
                                {fields.map((_, index) => (
                                    <div
                                        key={index}
                                        className="border-primary border-l-2 rounded relative"
                                    >
                                        <div className="py-4 pl-[32px] pr-4 border-t border-r border-b space-y-4 rounded ">
                                            <p className="font-semibold">Điểm đến {index + 1}</p>
                                            <div className="space-y-4">
                                                <div>
                                                    <label
                                                        className={`mb-2
                                            block font-medium`}
                                                    >
                                                        Điểm đến
                                                    </label>
                                                    <AttractionSelect
                                                        control={control}
                                                        name={`tourStops.${index}.attractionId`}
                                                        index={index}
                                                        attractions={metadata?.attractions}
                                                        getValues={getValues}
                                                    ></AttractionSelect>
                                                </div>
                                                <FormInput
                                                    label="Chú thích"
                                                    name={`tourStops.${index}.notes`}
                                                    register={register}
                                                    errors={errors}
                                                    // validationRules={{
                                                    //     required: "Chú thích là bắt buộc",
                                                    // }}
                                                    placeholder="Nhập chú thích"
                                                ></FormInput>
                                                <FormTextArea
                                                    label="Mô tả"
                                                    name={`tourStops.${index}.details`}
                                                    register={register}
                                                    errors={errors}
                                                    // validationRules={{
                                                    //     required: "Mô tả là bắt buộc",
                                                    // }}
                                                    placeholder="Nhập mô tả"
                                                ></FormTextArea>
                                            </div>
                                        </div>
                                        {fields.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => remove(index)}
                                                className="inline-flex items-center gap-2 text-sm text-red-500 hover:bg-red-100 rounded-full absolute right-4 top-3"
                                            >
                                                <X className="w-[18px] h-[18px]"></X>
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="bg-primary text-white px-2 gap-2 py-1 rounded flex items-center"
                                    onClick={() =>
                                        append({ attractionId: "", notes: "", details: "" })
                                    }
                                >
                                    <Plus className="w-[16px]"></Plus>
                                    Thêm địa điểm
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="flex justify-end">
                        <button
                            type="submit"
                            className="ml-auto inline-flex justify-center py-2 px-4 border border-transparent shadow-sm font-medium rounded-md text-white bg-primary"
                        >
                            Thêm loại vé
                        </button>
                    </div>
                </form>
            </div>
        );
    };

    const TourCreateStep2 = () => {
        return (
            <div>
                <h3 className="text-[18px] font-semibold text-primary">Thêm thông tin vé</h3>
                <div className="bg-white rounded-lg shadow-md mt-6">
                    <div className="border-b flex px-6 py-4 items-center justify-between">
                        <h2 className="font-semibold text-lg  ">Thêm loại vé</h2>
                        <button
                            onClick={() => {
                                setIsTicketModalOpen(true);
                                console.log(1);
                            }}
                            className="px-3 py-2 bg-primary rounded-lg text-white flex items-center gap-1 cursor-pointer hover:opacity-80"
                        >
                            <Plus className=""></Plus>
                            Thêm loại vé
                        </button>
                    </div>
                    {tickets.length === 0 ? (
                        <div className="min-h-[80px] flex items-center justify-center">
                            <p className="font-semibold">
                                Chưa có loại vé được thêm. Nhấn "Thêm loại vé" đế bắt đầu
                            </p>
                        </div>
                    ) : (
                        <div className="p-6 flex flex-col gap-4">
                            {tickets.map((ticket, index) => (
                                <div
                                    key={index}
                                    className="border rounded-lg bg-white shadow-sm max-w-4xl"
                                >
                                    {/* Header */}
                                    <div className="relative rounded-t-lg p-4 bg-gray-100">
                                        <div className="w-[62%]">
                                            <h3 className="text-md font-semibold text-gray-900 line-clamp-1">
                                                {ticket.name}
                                            </h3>
                                            <p className="text-sm text-gray-600 leading-relaxed line-clamp-2">
                                                {ticket.notes}
                                            </p>
                                        </div>
                                        <div className="absolute top-4 right-4 flex items-center gap-2">
                                            <button
                                                onClick={() => handleDeleteTicket(index)}
                                                className="px-4 py-1.5 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                                            >
                                                Xóa
                                            </button>
                                            <button
                                                onClick={() => handleEditTicket(ticket, index)}
                                                className="px-4 py-1.5 bg-cyan-500 text-white text-sm rounded hover:bg-cyan-600 transition-colors"
                                            >
                                                Sửa
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-4">
                                        <p className="text-sm font-medium mb-3">
                                            Bảng giá theo danh mục
                                        </p>

                                        {/* Price Categories Grid */}
                                        <div className="flex flex-wrap gap-3">
                                            {ticket.prices.map((category, index) => (
                                                <div
                                                    key={index}
                                                    className="bg-gray-50 border border-gray-200 rounded p-3"
                                                >
                                                    <p className="text-sm font-medium text-gray-700 mb-1">
                                                        {category.name}
                                                    </p>
                                                    <p className="text-lg font-semibold text-primary mb-1">
                                                        {category.price.toLocaleString("vi-VN")} VNĐ
                                                    </p>
                                                    <p className="text-xs text-gray-500">
                                                        {category.quantity} vé
                                                    </p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                <TicketFormModal
                    key={formKey}
                    priceCategories={metadata?.priceCategories}
                    open={isTicketModalOpen}
                    onClose={() => {
                        setIsTicketModalOpen(false);
                        setFormKey((prev) => prev + 1);
                    }}
                    onAddTicket={(ticket) => handleAddTicket(ticket)}
                    onUpdateTicket={(ticket) => handleUpdateTicket(ticket)}
                    editingTicket={editingTicket}
                    onCancelEdit={handleCancelEdit}
                ></TicketFormModal>
                <div className="flex gap-4 mt-4 justify-end">
                    <button
                        onClick={() => setStep(1)}
                        className="text-gray-600 text-base bg-white px-6 py-2 rounded border border-1 border-gray-500"
                    >
                        Quay lại
                    </button>
                    <button
                        onClick={finishTour}
                        className="bg-primary text-base text-white px-4 py-2 rounded"
                    >
                        Tạo tour
                    </button>
                </div>
            </div>
        );
    };

    return (
        <Layout title="Quản lý tour">
            <div className="px-[60px] py-2">
                {step === 1 && <TourCreateStep1></TourCreateStep1>}
                {step === 2 && <TourCreateStep2></TourCreateStep2>}
                {isCreatingTour && (
                    <div className="flex min-h-[70vh] items-center justify-center">
                        <Spinner className="size-10 text-primary"></Spinner>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default TourCreate;
