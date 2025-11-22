import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import TourCard from "@/components/tour/TourCard";
import { useAuth } from "@/contexts/AuthContext";
import UserAPI from "@/services/userAPI";
import { useToast } from "@/contexts/ToastContext";
import { Button } from "@/components/ui/button";
import { Heart, Loader2 } from "lucide-react";
import { tourService } from "@/services/tour.service";

interface FavoriteTourItem {
    tourId: string;
    name: string;
    images: string[];
    about: string;
    provinceId: string;
    duration: string;
    categories: string[];
    createdAt: string;
}

const FavoriteTourPage = () => {
    const { user, token } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [favoriteTours, setFavoriteTours] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!user || !token) {
            showToast('Vui lòng đăng nhập để xem tour yêu thích', 'error');
            navigate('/login');
            return;
        }

        fetchFavoriteTours();
    }, [user, token, navigate, showToast]);

    const fetchFavoriteTours = async () => {
        if (!token) return;

        setLoading(true);
        setError(null);

        try {
            const response = await UserAPI.getFavoriteTours(token);

            if (response.success && response.data) {
                // Response.data is already an array of tour objects with details
                const tours = response.data.map((tour: FavoriteTourItem) => {
                    // Map the API response to TourCard format
                    return {
                        id: tour.tourId,
                        title: tour.name,
                        description: tour.about,
                        images: tour.images || [],
                        duration: tour.duration,
                        provinceId: tour.provinceId,
                        categories: tour.categories || [],
                        // These will be fetched if needed
                        ticketPrices: [],
                        reviews: [],
                        maxGroup: 0,
                    };
                });

                // Fetch full tour details for better display
                const tourDetailsPromises = tours.map(async (tour: any) => {
                    try {
                        const fullTour = await tourService.getTourById(tour.id);
                        return fullTour;
                    } catch (err) {
                        console.error(`Error fetching tour ${tour.id}:`, err);
                        return tour; // Return basic tour if fetch fails
                    }
                });

                const tourDetails = await Promise.all(tourDetailsPromises);
                setFavoriteTours(tourDetails);
            } else {
                setError(response.message || 'Không thể tải danh sách tour yêu thích');
                setFavoriteTours([]);
            }
        } catch (error) {
            console.error('Error fetching favorite tours:', error);
            setError('Không thể kết nối đến server');
            setFavoriteTours([]);
        } finally {
            setLoading(false);
        }
    };

    const handleRemoveFavorite = async (tourId: string) => {
        if (!token) return;

        try {
            const response = await UserAPI.toggleFavoriteTour(token, tourId);

            if (response.success) {
                showToast('Đã xóa khỏi danh sách yêu thích', 'success');
                // Remove from local state
                setFavoriteTours((prev) => prev.filter((tour) => tour.id !== tourId));
            } else {
                showToast(response.message || 'Thất bại khi xóa tour', 'error');
            }
        } catch (error) {
            console.error('Error removing favorite tour:', error);
            showToast('Thất bại khi xóa tour', 'error');
        }
    };

    if (!user || !token) {
        return null; // Will redirect in useEffect
    }

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8 md:py-12">
                {/* Header Section */}
                <div className="mb-8 md:mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <Heart className="w-8 h-8 text-primary fill-primary" />
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-900">
                            Tour Yêu Thích
                        </h1>
                    </div>
                    <p className="text-gray-600 text-lg">
                        Danh sách các tour bạn đã lưu để xem lại sau
                    </p>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <Loader2 className="w-12 h-12 text-primary animate-spin mb-4" />
                        <p className="text-gray-600">Đang tải danh sách tour yêu thích...</p>
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <div className="flex flex-col items-center justify-center py-20">
                        <p className="text-red-500 text-lg mb-4">{error}</p>
                        <Button onClick={fetchFavoriteTours} variant="outline">
                            Thử lại
                        </Button>
                    </div>
                )}

                {/* Empty State */}
                {!loading && !error && favoriteTours.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 text-center">
                        <Heart className="w-24 h-24 text-gray-300 mb-6" />
                        <h2 className="text-2xl font-bold text-gray-700 mb-2">
                            Chưa có tour yêu thích nào
                        </h2>
                        <p className="text-gray-500 mb-6 max-w-md">
                            Hãy khám phá các tour và lưu những tour bạn quan tâm để xem lại sau nhé!
                        </p>
                        <Button
                            onClick={() => navigate('/tour')}
                            className="bg-primary hover:bg-primary/90 text-white"
                        >
                            Khám phá tour
                        </Button>
                    </div>
                )}

                {/* Tours Grid */}
                {!loading && !error && favoriteTours.length > 0 && (
                    <>
                        <div className="mb-6 flex items-center justify-between">
                            <p className="text-gray-600">
                                Bạn có <span className="font-semibold text-primary">{favoriteTours.length}</span> tour yêu thích
                            </p>
                        </div>

                        <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                            {favoriteTours.map((tour) => {
                                if (!tour) return null;

                                // Calculate average rating
                                const avgRating = tour.reviews && tour.reviews.length > 0
                                    ? tour.reviews.reduce((sum: number, r: any) => sum + (r.rate || 0), 0) / tour.reviews.length
                                    : 0;

                                // Get minimum price from ticket prices
                                const minPrice = tour.ticketPrices && tour.ticketPrices.length > 0
                                    ? Math.min(...tour.ticketPrices.map((tp: any) => tp.price || 0))
                                    : 0;

                                return (
                                    <div key={tour.id} className="relative group">
                                        <TourCard
                                            id={tour.id}
                                            title={tour.title || tour.name || 'Tour'}
                                            description={tour.description || tour.about || ''}
                                            image={tour.images?.[0] || '/placeholder-tour.jpg'}
                                            price={minPrice}
                                            duration={tour.duration || 'N/A'}
                                            location={tour.provinceId || tour.region || 'Việt Nam'}
                                            rating={avgRating}
                                            reviewCount={tour.reviews?.length || 0}
                                            category={tour.categories?.[0] || 'Tour du lịch'}
                                            status="upcoming"
                                            maxParticipants={tour.maxGroup || 20}
                                            availableSpots={tour.maxGroup || 20}
                                        />
                                        {/* Remove Favorite Button */}
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleRemoveFavorite(tour.id);
                                            }}
                                            className="absolute top-4 right-4 z-10 p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-red-50 hover:scale-110 transition-all duration-200"
                                            title="Xóa khỏi danh sách yêu thích"
                                        >
                                            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </main>

            <Footer />
        </div>
    );
};

export default FavoriteTourPage;

