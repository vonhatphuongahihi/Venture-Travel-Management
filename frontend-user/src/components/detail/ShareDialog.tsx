import { useState } from "react";
import {
    Dialog,
    DialogContent,
    DialogTitle,
} from "@/components/ui/dialog";
import { Facebook, Twitter, Instagram, Link2, Check } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { useToast } from "@/contexts/ToastContext";

interface ShareDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    tourId: string;
    tourName: string;
    tourImage?: string;
}

const ShareDialog = ({ open, setOpen, tourId, tourName, tourImage }: ShareDialogProps) => {
    const { showToast } = useToast();
    const [copied, setCopied] = useState(false);

    // Get current page URL
    const shareUrl = `${window.location.origin}/tour/${tourId}`;
    const shareText = `Khám phá tour: ${tourName}`;

    // Share to Facebook
    const handleShareFacebook = () => {
        const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
        window.open(url, "_blank", "width=600,height=400");
    };

    const handleShareX = () => {
        const url = `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`;
        window.open(url, "_blank", "width=600,height=400");
    };

    const handleShareInstagram = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        showToast("Đã sao chép link! Bạn có thể dán vào Instagram", "success");
        setTimeout(() => setCopied(false), 2000);
    };

    // Copy link to clipboard
    const handleCopyLink = () => {
        navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        showToast("Đã sao chép đường liên kết!", "success");
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent className="max-w-2xl bg-white text-gray-900 border-gray-200">
                <DialogTitle className="text-xl font-bold mb-4 text-[#26B8ED]">Chia sẻ tour</DialogTitle>

                {/* Share Options */}
                <div className="flex justify-center gap-6 mb-6">
                    {/* Facebook */}
                    <button
                        onClick={handleShareFacebook}
                        className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-primary/5 transition-colors group"
                    >
                        <div className="w-14 h-14 rounded-full bg-[#1877F2] flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                            <Facebook className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Facebook</span>
                    </button>

                    {/* X (Twitter) */}
                    <button
                        onClick={handleShareX}
                        className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-primary/5 transition-colors group"
                    >
                        <div className="w-14 h-14 rounded-full bg-black flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                            <Twitter className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">X</span>
                    </button>

                    {/* Instagram */}
                    <button
                        onClick={handleShareInstagram}
                        className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-primary/5 transition-colors group"
                    >
                        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                            <Instagram className="w-7 h-7 text-white" />
                        </div>
                        <span className="text-sm font-medium text-gray-700">Instagram</span>
                    </button>

                    {/* Copy Link */}
                    <button
                        onClick={handleCopyLink}
                        className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-primary/5 transition-colors group"
                    >
                        <div className="w-14 h-14 rounded-full bg-primary flex items-center justify-center group-hover:scale-110 transition-transform shadow-md">
                            {copied ? (
                                <Check className="w-7 h-7 text-white" />
                            ) : (
                                <Link2 className="w-7 h-7 text-white" />
                            )}
                        </div>
                        <span className="text-sm font-medium text-gray-700">Sao chép</span>
                    </button>
                </div>

                {/* Tour Preview and QR Code */}
                <div className="flex gap-6 items-start">
                    {/* Tour Preview */}
                    <div className="flex-1">
                        {tourImage && (
                            <div className="relative rounded-lg overflow-hidden shadow-md h-[244px]">
                                <img
                                    src={tourImage}
                                    alt={tourName}
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                                    <h3 className="text-white font-bold text-lg">{tourName}</h3>
                                </div>
                            </div>
                        )}

                    </div>

                    {/* QR Code */}
                    <div className="flex flex-col items-center">
                        <div className="bg-white p-4 rounded-lg mb-3 border border-gray-200 shadow-md">
                            <QRCodeSVG
                                value={shareUrl}
                                size={180}
                                level="H"
                                includeMargin={true}
                            />
                        </div>
                        <p className="text-sm text-gray-600 text-center">
                            Quét mã để mở trên điện thoại
                        </p>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default ShareDialog;

