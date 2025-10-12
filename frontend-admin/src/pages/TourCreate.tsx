import Layout from "@/components/Layout";
import FormInput from "@/components/tour-create/FormInput";
import FormMutilpeSelect from "@/components/tour-create/FormMultipleSelect";
import FormSelect from "@/components/tour-create/FormSelect";
import FormTextArea from "@/components/tour-create/FormTextArea";
import ImageUploader from "@/components/tour-create/ImageUploader";
import { SearchableSelect } from "@/components/tour-create/SearchableSelect";
import TextEditor from "@/components/tour-create/TextEditor";
import { useForm, useFieldArray } from "react-hook-form";
import { Plus, X } from "lucide-react";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

import { useNavigate } from "react-router-dom";
type TourStop = {
    attrationId: string;
    notes: string;
    details: string;
};

type FormValues = {
    provinceId: string;
    name: string;
    about: string;
    ageRange: string;
    maxGroupSize: number;
    duration: string;
    languages: string[];
    categories: string[];
    highlights?: string;
    inclusions: string[];
    exclusions: string[];
    expectations: string;
    cancellationPolicy: string;
    additionalInfomation: string;
    pickupPoint: string;
    pickupDetails: string;
    tourStops: TourStop[];
};

const provinceOptions = [
    {
        label: "Thành phố Hồ Chí Minh",
        value: "001",
    },
    {
        label: "Hà Nội",
        value: "002",
    },
    {
        label: "Đà Nẵng",
        value: "003",
    },
    {
        label: "Ninh Bình",
        value: "004",
    },
    {
        label: "Cà Mau",
        value: "005",
    },
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

const languagesOptionList = [
    { label: "Tiếng Việt", value: "200" },
    { label: "Tiếng Anh", value: "201" },
    { label: "Tiếng Nhật", value: "202" },
    { label: "Tiếng Trung", value: "203" },
];

const freePickupScopes = ["500", "1000", "1500"];
const TourCreate = () => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<FormValues>({
        defaultValues: {
            cancellationPolicy: "",
            expectations: "",
            tourStops: [
                {
                    attrationId: "",
                    notes: "",
                    details: "",
                },
            ],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "tourStops", // ✅ đây là tên field array
    });

    const navigate = useNavigate();
    const onSubmitTour = (data: FormValues) => {
        console.log(data);
    };

    return (
        <Layout title="Quản lý tour">
            <div className="px-[60px] py-2 mb-[100px]">
                <div className="flex items-center justify-between">
                    <h3 className="text-[18px] font-semibold text-primary">Thêm thông tin tour</h3>
                    <div className="flex gap-2">
                        <button
                            onClick={() => navigate("/tours")}
                            className="px-4 py-1 border rounded-md hover:bg-gray-200"
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleSubmit(onSubmitTour)}
                            className="px-4 py-1 border rounded-md bg-primary hover:bg-primary/70 text-white"
                        >
                            Lưu
                        </button>
                    </div>
                </div>
                <form onSubmit={handleSubmit(onSubmitTour)} className="space-y-6">
                    <div>
                        <div className="bg-white rounded-lg shadow-md mt-6">
                            <h2 className="font-semibold text-lg px-6 py-4 border-b">
                                Thông tin tour
                            </h2>
                            <div className="space-y-4 p-6 overflow-auto">
                                <div className="flex gap-2">
                                    <FormInput
                                        label={"Tên tour"}
                                        name={"name"}
                                        register={register}
                                        errors={errors}
                                        validationRules={{
                                            required: "Tên là bắt buộc",
                                        }}
                                        placeholder={"Tên tour"}
                                        className="flex-1"
                                    ></FormInput>
                                    <FormSelect
                                        label="Tỉnh/thành phố"
                                        name={"provinceId"}
                                        control={control}
                                        placeholder={"Chọn thành phố"}
                                        validationRules={{
                                            required: "Thành phố là bắt buộc",
                                        }}
                                        options={provinceOptions}
                                        className="flex-1 flex flex-col"
                                    ></FormSelect>
                                </div>
                                <FormTextArea
                                    label="Tổng quan"
                                    name="about"
                                    placeholder="Nhập tổng quan"
                                    errors={errors}
                                    register={register}
                                    validationRules={{
                                        required: "Tổng quan là bắt buộc",
                                    }}
                                    row={4}
                                ></FormTextArea>
                                <div className="flex gap gap-2">
                                    <FormInput
                                        label={"Độ tuổi"}
                                        name={"ageRange"}
                                        register={register}
                                        errors={errors}
                                        validationRules={{
                                            required: "Độ tuổi là bắt buộc",
                                        }}
                                        placeholder={"VD: 1-80 tuổi"}
                                        className="flex-1"
                                    ></FormInput>
                                    <FormInput
                                        label={"Số lượng người tối đa"}
                                        name={"maxGroupSize"}
                                        register={register}
                                        errors={errors}
                                        validationRules={{
                                            required: "Số lượng người tối đa là bắt buộc",
                                        }}
                                        placeholder={"Nhập số lượng người tối đa"}
                                        className="flex-1"
                                    ></FormInput>
                                    <FormInput
                                        label={"Thời lượng tour"}
                                        name={"name"}
                                        register={register}
                                        errors={errors}
                                        validationRules={{
                                            required: "Thời lượng tour là bắt buộc",
                                        }}
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
                                    validationRules={{
                                        required: "Cần chọn ít nhất một dịch vụ ngôn ngữ",
                                    }}
                                ></FormMutilpeSelect>
                                <FormMutilpeSelect
                                    control={control}
                                    label="Danh mục tour"
                                    name="categories"
                                    placeholder="Chọn danh mục tour"
                                    options={tourCategoryOptionList}
                                    validationRules={{
                                        required: "Cần chọn ít nhất một danh mục tour",
                                    }}
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
                                        validationRules={{
                                            required: "Cần nhập các dịch vụ tour bao gồm",
                                        }}
                                    ></FormTextArea>
                                    <FormTextArea
                                        label="Tour không bao gồm"
                                        name="exclusions"
                                        placeholder="Nhập các dịch vụ không bao gồm, xuống dòng để thêm mới..."
                                        errors={errors}
                                        register={register}
                                        row={5}
                                        validationRules={{
                                            required: "Cần nhập các dịch vụ tour không bao gồm",
                                        }}
                                    ></FormTextArea>
                                </div>
                                <TextEditor
                                    label={"Những điều đáng mong đợi"}
                                    name="expectations"
                                    placeholder="Những điều đáng mong đợi..."
                                    validationRules={{
                                        required: "Lịch trình tour là bắt buộc",
                                        validate: (value) =>
                                            (value &&
                                                typeof value === "string" &&
                                                value.replace(/<(.|\n)*?>/g, "").trim().length >
                                                    0) ||
                                            "Không được để trống",
                                    }}
                                    control={control}
                                ></TextEditor>
                                <TextEditor
                                    label={"Chính sách hủy vé"}
                                    name="cancellationPolicy"
                                    placeholder="Chính sách hủy vé..."
                                    validationRules={{
                                        required: "Chính sách hủy vé là bắt buộc",
                                        validate: (value) =>
                                            (value &&
                                                typeof value === "string" &&
                                                value.replace(/<(.|\n)*?>/g, "").trim().length >
                                                    0) ||
                                            "Không được để trống",
                                    }}
                                    control={control}
                                ></TextEditor>
                                <TextEditor
                                    label={"Thông tin bổ sung"}
                                    name="additionalInfomation"
                                    placeholder="Thông tin bổ sung..."
                                    control={control}
                                ></TextEditor>
                                <ImageUploader label="Ảnh tour"></ImageUploader>
                            </div>
                        </div>
                    </div>
                    <div>
                        <div className="bg-white rounded-lg shadow-md mt-6">
                            <h2 className="font-semibold text-lg px-6 py-4 border-b">
                                Thông tin tập trung đón khách
                            </h2>
                            <div className="space-y-4 p-6 overflow-auto">
                                <div>
                                    <label
                                        className={`mb-2
                                            block font-medium`}
                                    >
                                        Điểm tập trung khả dụng
                                        <span className="text-red-500 ml-1">*</span>
                                    </label>
                                    <SearchableSelect error={undefined}></SearchableSelect>
                                </div>
                                <div>
                                    <div className="flex items-center gap-5">
                                        <p className="font-medium">
                                            Đón khách miễn phí trong phạm vi:
                                        </p>
                                        <div>
                                            <label className={`block mb-2 font-medium`}></label>
                                            <Select defaultValue={freePickupScopes[1]}>
                                                <SelectTrigger
                                                    className={` w-[100px]
                                            border rounded border-gray-300 py-2 text-base outline-none`}
                                                >
                                                    <SelectValue />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {freePickupScopes.map((scope) => (
                                                        <SelectItem key={scope} value={scope}>
                                                            {scope}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>
                                </div>
                                <FormTextArea
                                    label="Thông tin chi tiết khi đón khách"
                                    name="pickupDetails"
                                    placeholder="Thông tin chi tiết"
                                    errors={errors}
                                    register={register}
                                    validationRules={{
                                        required: "Thông tin chi tiết khi đón khách là bắt buộc",
                                    }}
                                    row={4}
                                ></FormTextArea>
                                <div>
                                    <p className=" mb-2 font-medium">
                                        Nơi trả khách{" "}
                                        <span className="font-normal">
                                            (để trống nếu trả khách tại nơi đón)
                                        </span>
                                    </p>
                                    <SearchableSelect error={undefined}></SearchableSelect>
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
                                                    <SearchableSelect
                                                        error={undefined}
                                                    ></SearchableSelect>
                                                </div>
                                                <FormInput
                                                    label="Chú thích"
                                                    name={`tourStops.${index}.notes`}
                                                    register={register}
                                                    errors={errors}
                                                    validationRules={{
                                                        required: "Chú thích là bắt buộc",
                                                    }}
                                                    placeholder="Nhập chú thích"
                                                ></FormInput>
                                                <FormTextArea
                                                    label="Mô tả"
                                                    name={`tourStops.${index}.details`}
                                                    register={register}
                                                    errors={errors}
                                                    validationRules={{
                                                        required: "Mô tả là bắt buộc",
                                                    }}
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
                                        append({ attrationId: "", notes: "", details: "" })
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
                            Thêm tour
                        </button>
                    </div>
                </form>
            </div>
        </Layout>
    );
};

export default TourCreate;
