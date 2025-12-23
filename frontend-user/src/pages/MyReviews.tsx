import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UserSidebar from "@/components/UserSidebar";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import { Button } from "@/components/ui/button";
import { MessageSquare, Loader2 } from "lucide-react";
import { reviewService, ReviewResponse } from "@/services/review.service";
import { useTranslation } from "react-i18next";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ReviewCard } from "@/components/MyReviews/ReviewCard";
import { ReviewEditDialog } from "@/components/MyReviews/ReviewEditDialog";

interface UserReview extends ReviewResponse {
  tour?: {
    tourId: string;
    name: string;
    images: string[];
  };
  attraction?: {
    attractionId: string;
    name: string;
    images: string[];
  };
}

const MyReviewsPage = () => {
  const { t } = useTranslation();
  const { user, token, logout } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [tourReviews, setTourReviews] = useState<UserReview[]>([]);
  const [attractionReviews, setAttractionReviews] = useState<UserReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [reviewToDelete, setReviewToDelete] = useState<{
    id: string;
    type: "tour" | "attraction";
  } | null>(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [reviewToEdit, setReviewToEdit] = useState<{
    reviewId: string;
    rate: number;
    content: string;
    images: string[];
    type: "tour" | "attraction";
  } | null>(null);

  // State quản lý đóng mở sidebar trên mobile - mặc định mở để hiển thị trên mobile
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    if (!user || !token) {
      showToast(t("myReviews.pleaseLogin"), "error");
      navigate("/login");
      return;
    }

    fetchReviews();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, token, navigate, showToast]);

  const fetchReviews = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const [tourReviewsResponse, attractionReviewsResponse] =
        await Promise.all([
          reviewService.getUserTourReviews(),
          reviewService.getUserAttractionReviews(),
        ]);

      setTourReviews(tourReviewsResponse || []);
      setAttractionReviews(attractionReviewsResponse || []);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      setError(t("myReviews.loadError"));
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (reviewId: string, type: "tour" | "attraction") => {
    const review =
      type === "tour"
        ? tourReviews.find((r) => r.reviewId === reviewId)
        : attractionReviews.find((r) => r.reviewId === reviewId);

    if (!review) return;

    setReviewToEdit({
      reviewId: review.reviewId,
      rate: review.rating,
      content: review.content,
      images: review.images,
      type,
    });
    setEditDialogOpen(true);
  };

  const handleEditSave = async (
    reviewId: string,
    data: { rate: number; content: string; images: string[] }
  ) => {
    if (!reviewToEdit) return;

    try {
      const updatedReview =
        reviewToEdit.type === "tour"
          ? await reviewService.updateTourReview(reviewId, data)
          : await reviewService.updateAttractionReview(reviewId, data);

      // Update local state
      if (reviewToEdit.type === "tour") {
        setTourReviews((prev) =>
          prev.map((r) =>
            r.reviewId === reviewId ? { ...r, ...updatedReview } : r
          )
        );
      } else {
        setAttractionReviews((prev) =>
          prev.map((r) =>
            r.reviewId === reviewId ? { ...r, ...updatedReview } : r
          )
        );
      }

      showToast(t("myReviews.updateSuccess"), "success");
    } catch (error) {
      console.error("Error updating review:", error);
      showToast(t("myReviews.updateFailed"), "error");
      throw error;
    }
  };

  const handleDeleteClick = (reviewId: string, type: "tour" | "attraction") => {
    setReviewToDelete({ id: reviewId, type });
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!reviewToDelete || !token) return;

    try {
      if (reviewToDelete.type === "tour") {
        await reviewService.deleteTourReview(reviewToDelete.id);
      } else {
        await reviewService.deleteAttractionReview(reviewToDelete.id);
      }

      showToast(t("myReviews.deleteSuccess"), "success");

      // Remove from local state
      if (reviewToDelete.type === "tour") {
        setTourReviews((prev) =>
          prev.filter((r) => r.reviewId !== reviewToDelete.id)
        );
      } else {
        setAttractionReviews((prev) =>
          prev.filter((r) => r.reviewId !== reviewToDelete.id)
        );
      }
    } catch (error) {
      console.error("Error deleting review:", error);
      showToast(t("myReviews.deleteFailed"), "error");
    } finally {
      setDeleteDialogOpen(false);
      setReviewToDelete(null);
    }
  };

  const handleLogout = () => {
    logout();
    showToast(t("settings.logout.success"), "success");
    navigate("/login");
  };

  if (!user || !token) {
    return null;
  }

  const totalReviews = tourReviews.length + attractionReviews.length;

  const filterOptions = [
    { value: "all", label: t("myReviews.all"), count: totalReviews },
    { value: "tours", label: t("myReviews.tours"), count: tourReviews.length },
    {
      value: "attractions",
      label: t("myReviews.attractions"),
      count: attractionReviews.length,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="text-center mt-8 md:mt-12 mb-8 md:mb-12 px-4">
        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
          <span className="text-gradient">{t("myReviews.title")}</span>
        </h2>
      </div>

      <main className="container mx-auto px-4 py-6 md:py-12">
        {/* RESPONSIVE: flex-col trên mobile, flex-row trên desktop (lg) */}
        <div className="flex flex-col lg:flex-row gap-6 md:gap-8">
          {/* Sidebar */}
          {/* RESPONSIVE: Width full trên mobile, fixed width trên desktop */}
          <UserSidebar
            user={user}
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            handleLogout={handleLogout}
            activeLink="my-reviews"
          />

          {/* Main card */}
          <section className="flex-1 min-w-0">
            <div className="bg-white/90 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 p-4 md:p-8">
              <h2 className="text-lg font-medium mb-3">
                {t("myReviews.manageReviews")}
              </h2>
              <p className="text-sm text-slate-600 mb-6">
                {t("myReviews.viewAllReviews")}
              </p>

              {/* Filter tabs - Responsive: Scroll ngang trên mobile */}
              <div className="flex gap-4 md:gap-6 mb-6 border-b border-gray-200 overflow-x-auto scrollbar-hide">
                {filterOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedFilter(option.value)}
                    className={`pb-3 px-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                      selectedFilter === option.value
                        ? "border-primary text-primary"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    {option.label} ({option.count})
                  </button>
                ))}
              </div>

              {/* Reviews content */}
              {loading ? (
                <div className="flex justify-center items-center py-20">
                  <Loader2 className="animate-spin text-primary" size={48} />
                </div>
              ) : error ? (
                <div className="text-center py-10 text-red-500">{error}</div>
              ) : totalReviews === 0 ? (
                <div className="text-center py-10 text-gray-500">
                  <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                    <MessageSquare className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">
                    {t("myReviews.noReviewsYet")}
                  </h3>
                  <p className="text-gray-500 mb-6">
                    {t("myReviews.noReviewsDesc")}
                  </p>
                  <Button
                    onClick={() => navigate("/booking-history")}
                    className="bg-primary hover:bg-primary/90 text-white px-8"
                  >
                    {t("myReviews.viewBookingHistory")}
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {selectedFilter === "all" &&
                    [
                      ...tourReviews.map((r) => ({
                        ...r,
                        type: "tour" as const,
                      })),
                      ...attractionReviews.map((r) => ({
                        ...r,
                        type: "attraction" as const,
                      })),
                    ]
                      .sort(
                        (a, b) =>
                          new Date(b.date).getTime() -
                          new Date(a.date).getTime()
                      )
                      .map((review) => (
                        <ReviewCard
                          key={review.reviewId}
                          review={review}
                          type={review.type}
                          onEdit={(id) => handleEditClick(id, review.type)}
                          onDelete={(id) => handleDeleteClick(id, review.type)}
                        />
                      ))}

                  {selectedFilter === "tours" &&
                    (tourReviews.length > 0 ? (
                      tourReviews.map((review) => (
                        <ReviewCard
                          key={review.reviewId}
                          review={review}
                          type="tour"
                          onEdit={(id) => handleEditClick(id, "tour")}
                          onDelete={(id) => handleDeleteClick(id, "tour")}
                        />
                      ))
                    ) : (
                      <div className="text-center py-10 text-gray-500">
                        {t("myReviews.noTourReviews")}
                      </div>
                    ))}

                  {selectedFilter === "attractions" &&
                    (attractionReviews.length > 0 ? (
                      attractionReviews.map((review) => (
                        <ReviewCard
                          key={review.reviewId}
                          review={review}
                          type="attraction"
                          onEdit={(id) => handleEditClick(id, "attraction")}
                          onDelete={(id) => handleDeleteClick(id, "attraction")}
                        />
                      ))
                    ) : (
                      <div className="text-center py-10 text-gray-500">
                        {t("myReviews.noAttractionReviews")}
                      </div>
                    ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>

      {/* Edit Review Dialog */}
      <ReviewEditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        reviewData={reviewToEdit}
        type={reviewToEdit?.type || "tour"}
        onSave={handleEditSave}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("myReviews.confirmDelete")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("myReviews.confirmDeleteDesc")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("myReviews.cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              {t("myReviews.delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Footer />
    </div>
  );
};

export default MyReviewsPage;
