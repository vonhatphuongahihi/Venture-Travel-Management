import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

interface CancelBookingDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    tourName?: string;
    isLoading?: boolean;
}

const CancelBookingDialog = ({
    open,
    onOpenChange,
    onConfirm,
    tourName,
    isLoading = false,
}: CancelBookingDialogProps) => {
    const { t } = useTranslation();

    const handleConfirm = () => {
        onConfirm();
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-red-600">
                        {t("bookingHistory.confirmCancelTitle")}
                    </DialogTitle>
                    <DialogDescription className="text-base mt-2">
                        {tourName && (
                            <div className="font-medium text-gray-900 mb-2">{tourName}</div>
                        )}
                        <div>{t("bookingHistory.confirmCancel")}</div>
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                    <Button
                        variant="outline"
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                    >
                        {t("bookingHistory.cancel")}
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleConfirm}
                        disabled={isLoading}
                        className="bg-red-600 hover:bg-red-700"
                    >
                        {isLoading
                            ? t("bookingHistory.cancelling")
                            : t("bookingHistory.confirm")}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default CancelBookingDialog;

