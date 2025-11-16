import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { X, Check, ChevronDown } from "lucide-react";
import FormTextArea from "./FormTextArea";
import FormInput from "./FormInput";

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

type TicketFormModalProps = {
    open: boolean;
    onClose: () => void;
    onAddTicket?: (ticket: TicketData) => void;
    onUpdateTicket?: (ticket: TicketData) => void;
    onCancelEdit: () => void,
    editingTicket?: TicketData | null;
};

const CATEGORY_OPTIONS = [
    { name: "Người lớn", categoryId: "adult", description: "Từ 18 đến 60 tuổi" },
    { name: "Trẻ em", categoryId: "child", description: "Dưới 18 tuổi" },
    { name: "Người cao tuổi", categoryId: "senior", description: "Trên 60 tuổi" },
];

const TicketFormModal = ({
    open,
    onClose,
    onAddTicket,
    onUpdateTicket,
    editingTicket,
    onCancelEdit
}: TicketFormModalProps) => {
    const {
        register,
        handleSubmit,
        reset,
        control,
        formState: { errors },
    } = useForm<TicketData>({
        defaultValues: {
            name: "",
            quantity: 0,
            notes: "",
            prices: [],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "prices",
    });

    const handleToggleCategory = (cat: { name: string; categoryId: string; description?: string }) => {
        const existingIndex = fields.findIndex((field) => field.categoryId === cat.categoryId);
        if (existingIndex !== -1) {
            remove(existingIndex);
        } else {
            append({ ...cat, price: 0, quantity: 0 });
        }
    };
    useEffect(() => {
        if (editingTicket) {
            reset({
                name: editingTicket.name,
                quantity: editingTicket.quantity,
                notes: editingTicket.notes,
                prices: editingTicket.prices,
            });
        } else {
            reset({
                name: "",
                quantity: 0,
                notes: "",
                prices: [],
            });
        }
    }, [editingTicket, reset]);

    const onSubmit = (data: TicketData) => {
        const finalTicket: TicketData = {
            ...data,
        };

        if (editingTicket) {
            if (onUpdateTicket) onUpdateTicket({ ...finalTicket, id: editingTicket.id });
        } else {
            if (onAddTicket) onAddTicket(finalTicket);
        }
        reset();

        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="min-w-[650px] max-h-[550px] overflow-auto">
                <DialogHeader>
                    <DialogTitle>
                        {editingTicket ? "Cập nhật loại vé" : "Thêm loại vé mới"}
                    </DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <FormInput
                        label="Tên loại vé"
                        name="name"
                        register={register}
                        errors={errors}
                        placeholder="Nhập tên loại vé"
                        validationRules={{
                            required: "Vui lòng nhập tên loại vé",
                        }}
                    ></FormInput>

                    <FormInput
                        label="Số lượng"
                        type="number"
                        name="quantity"
                        register={register}
                        errors={errors}
                        validationRules={{
                            required: "Vui lòng nhập số lượng",
                            min: { value: 1, message: "Số lượng phải > 0" },
                        }}
                        placeholder="Nhập số lượng vé"
                    ></FormInput>

                    <FormTextArea
                        label="Ghi chú"
                        name="notes"
                        register={register}
                        errors={errors}
                        placeholder="Nhập ghi chú"
                    ></FormTextArea>

                    <div>
                        <div className="flex items-center justify-between">
                            <p className="font-medium">Thiết lập giá theo danh mục</p>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <button className="gap-2 bg-primary flex items-center px-2 rounded text-white py-1 justify-between">
                                        Chọn danh mục giá
                                        <ChevronDown size={14} />
                                    </button>
                                </PopoverTrigger>
                                <PopoverContent className="w-[300px] p-0" align="start">
                                    <div>
                                        {CATEGORY_OPTIONS.map((cate) => {
                                            return (
                                                <div
                                                    key={cate.categoryId}
                                                    className="px-2 py-1 cursor-pointer hover:bg-gray-100 flex items-center justify-between"
                                                    onClick={() => handleToggleCategory(cate)}
                                                >
                                                    <div className="flex items-baseline gap-1">
                                                        <span className="font-semibold">
                                                            {cate.name}
                                                        </span>
                                                        <span className="text-sm">({cate.description})</span>
                                                    </div>
                                                    {fields
                                                        .map((p) => p.categoryId)
                                                        .includes(cate.categoryId) && (
                                                        <Check className="ml-auto w-[14px]" />
                                                    )}
                                                </div>
                                            );
                                        })}
                                    </div>
                                </PopoverContent>
                            </Popover>
                        </div>

                        <div className="space-y-3 mt-3">
                            {fields.map((field, index) => (
                                <div
                                    key={field.categoryId}
                                    className="relative border-primary border-l-2 rounded"
                                >
                                    <button
                                        type="button"
                                        onClick={() => remove(index)}
                                        className="absolute top-2 right-2 text-red-500"
                                    >
                                        <X size={16} />
                                    </button>
                                    <div className="py-4 pl-[24px] pr-4 border-t border-r border-b space-y-4 rounded ">
                                        <div className="">
                                            <p className="font-semibold">{field.name}</p>
                                            <p className="text-sm text-gray-500 mb-2">
                                                {field.description}
                                            </p>

                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <label className="text-sm">
                                                        Giá <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        className="w-full mt-1 border placeholder:text-gray-500 rounded p-1"
                                                        type="number"
                                                        {...register(`prices.${index}.price`, {
                                                            valueAsNumber: true,
                                                        })}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="text-sm">
                                                        Số lượng{" "}
                                                        <span className="text-red-500">*</span>
                                                    </label>
                                                    <input
                                                        className="w-full mt-1 border placeholder:text-gray-500 rounded p-1"
                                                        type="number"
                                                        {...register(`prices.${index}.quantity`, {
                                                            valueAsNumber: true,
                                                        })}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Nút hành động */}
                    <div className="flex justify-end space-x-2 pt-3">
                        <button onClick={()=> {
                            onCancelEdit()
                            onClose()
                        }} className="px-2 py-1 border rounded">
                            Hủy
                        </button>
                        <button type="submit" className="px-2 py-1 bg-primary text-white rounded">
                            {editingTicket ? "Cập nhật vé" : "Thêm loại vé"}
                        </button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default TicketFormModal;
