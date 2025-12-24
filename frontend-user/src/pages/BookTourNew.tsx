import { useLocation, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import exampleImage from "@/assets/saigon.jpg";
import { Card, CardTitle } from "@/components/ui/card";
import TourDetailDialog from "@/components/booking/TourDetailDialog";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar, DollarSign, Ticket, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/contexts/ToastContext";
import PickupAddressSelector from "@/components/booking/PickupAddressSelector";
import { bookingService } from "@/services/booking.service";
import { PriceCategories } from "@/types/tourDetailType";
import { useTranslation } from "react-i18next";

interface PriceCategoryWithQuantity extends PriceCategories {
  quantity: number;
}

export default function BookTourNew() {
  const { t } = useTranslation();
  const { state } = useLocation();
  const tour = state?.tour;
  const ticketPrices = state?.ticketPrices;
  const userTicket = state?.userTicket;
  const totalPrice = state?.totalPrice;
  const selectedDate = state?.selectedDate;
  const navigate = useNavigate();
  const { showToast } = useToast()
  const { user } = useAuth();
  const [fullname, setFullname] = useState<string>("");
  const [email, setEmail] = useState<string>(user.email || "");
  const [phone, setPhone] = useState<string>(user.phone || "");
  const [pickUpPoint, setPickup] = useState("");
  const [note, setNote] = useState<string>("");
  const [isBooking, setIsBooking] = useState(false);

  const handleCheckAvailability = () => {
    console.log("Checking availability...");
  };

  const handleBook = async () => {
    if (fullname === "" || email === "" || phone === "" || pickUpPoint === "") {
      showToast(t("bookTour.fillAllFields"), "error")
      return;
    }

    setIsBooking(true);

    try {
      const priceCategories = userTicket.priceCategories.filter((pc: PriceCategoryWithQuantity) => pc.quantity > 0).map((pc: PriceCategoryWithQuantity) => ({
        categoryId: pc.categoryId,
        quantity: pc.quantity
      }));

      const bookingData = {
        user_id: user.userId,
        ticket_type_id: userTicket.currentType.ticketTypeId,
        pickup_address: pickUpPoint,
        departure_date: selectedDate.toISOString(),
        name: fullname,
        phone: phone,
        email: email,
        total_price: totalPrice,
        special_requests: note || undefined,
        priceCategories: priceCategories,
      };

      const response = await bookingService.createBooking(bookingData);

      showToast(t("bookTour.bookingSuccess"), "success");

      navigate("/booking-history", {
        state: { newBooking: response },
        replace: true
      });

    } catch (error: unknown) {
      console.error("Booking error:", error);
      const axiosError = error as { response?: { data?: { message?: string } } };
      const errorMessage = axiosError.response?.data?.message || t("bookTour.bookingError");
      showToast(errorMessage, "error");
    } finally {
      setIsBooking(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="max-w-6xl mx-auto my-10 pt-10 pb-6 shadow-[0px_4px_48px_12px_rgba(0,0,0,0.09)] bg-card px-10 border border-border">
        <div className="flex gap-4 justify-between">
          <Card className="p-4 w-full lg:w-1/2">
            <CardTitle>{t("bookTour.bookTicket")}</CardTitle>
            <div className="flex flex-col mt-4 space-y-4">
              <Label>
                {t("bookTour.fullName")} <span className="text-red-500">*</span>
                <Input
                  required
                  type="text"
                  placeholder={t("bookTour.fullName")}
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  className="mt-2"
                />
              </Label>
              <Label>
                {t("bookTour.email")} <span className="text-red-500">*</span>
                <Input
                  required
                  type="text"
                  placeholder={t("bookTour.email")}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2"
                />
              </Label>
              <Label>
                {t("bookTour.phone")} <span className="text-red-500">*</span>
                <Input
                  required
                  type="text"
                  placeholder={t("bookTour.phone")}
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="mt-2"
                />
              </Label>
              {tour?.pickUpAreaGeom && tour.pickUpAreaGeom.length > 0 ? (
                <PickupAddressSelector
                  pickupAreaGeom={tour.pickUpAreaGeom}
                  pickupPointGeom={tour.pickUpPointGeom || [0, 0]}
                  value={pickUpPoint}
                  onChange={setPickup}
                />
              ) : (
                <Label>
                  {t("bookTour.selectPickupPoint")} <span className="text-red-500">*</span>
                  <Input
                    required
                    type="text"
                    placeholder={t("bookTour.enterPickupAddress")}
                    value={pickUpPoint}
                    onChange={(e) => setPickup(e.target.value)}
                    className="mt-2"
                  />
                </Label>
              )}
              <Label>
                {t("bookTour.note")}
                <Textarea
                  placeholder={t("bookTour.note")}
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  className="h-[60px] resize-none mt-2"
                />
              </Label>
            </div>
          </Card>
          <Card className="p-4 w-full lg:w-1/2 flex flex-col gap-2">
            <img
              src={tour.images[0] ? tour?.images[0] : exampleImage}
              alt={tour.title}
              className="w-full h-[200px] object-cover"
            />
            <p className="text-xl font-semibold truncate">{tour?.title}</p>
            <TourDetailDialog tour={tour} />
            <div className={`flex items-center gap-4 w-full px-4 py-2 border`}>
              <div className="flex gap-2 items-center">
                <Calendar />
                <p className="font-semibold text-lg">{t("bookTour.departureDate")}:</p>
              </div>

              <p className="text-sm">
                {selectedDate.toLocaleDateString("vi-vn")}
              </p>
            </div>
            <div className={`flex flex-col w-full px-4 py-2 border`}>
              <div className="flex gap-2 items-center">
                <Ticket />
                <p className="font-semibold text-lg">{t("bookTour.ticketInfo")}:</p>
              </div>
              <p className="text-base font-semibold">
                {userTicket.currentType.name}
                {" - "}
                <span className="text-sm font-normal">
                  {userTicket.currentType?.notes}
                </span>
              </p>
              {userTicket.priceCategories.map((pc, idx) => {
                const matchedPrice = ticketPrices.find(
                  (tp) =>
                    tp.ticketTypeId === userTicket.currentType.ticketTypeId &&
                    tp.categoryId === pc.categoryId
                );
                return (
                  <div>
                    {pc.quantity > 0 && <div key={idx} className="flex justify-between items-center">
                      <p className="text-xs">
                        {pc.quantity} {pc.categoryName} x{" "}
                        {matchedPrice
                          ? matchedPrice.price.toLocaleString("vi-VN")
                          : 0}
                        ₫
                      </p>
                      <p className="text-sm">
                        {(
                          pc.quantity * (matchedPrice?.price || 0)
                        ).toLocaleString("vi-VN")}
                        ₫
                      </p>
                    </div>}
                  </div>
                );
              })}
            </div>
            <div className="p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border-2 border-primary/20">
              <div className="flex items-center justify-between">
                <span className="text-gray-700 font-semibold">{t("bookTour.total")}:</span>
                <span className="text-2xl font-bold text-primary">
                  {totalPrice.toLocaleString("vi-VN")} ₫
                </span>
              </div>
            </div>
          </Card>
        </div>
        <div className="w-full flex justify-center mt-4">
          <Button onClick={handleBook} disabled={isBooking}>
            {isBooking ? (
              <Loader2 className="animate-spin" />
            ) : (
              <DollarSign />
            )}
            <p>{isBooking ? t("bookTour.processing") : t("bookTour.payment")}</p>
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  );
}
