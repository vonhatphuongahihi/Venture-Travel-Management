import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import UserSidebar from "@/components/UserSidebar";
import TourCard from "@/components/tour/TourCard";
import { useAuth } from "@/contexts/AuthContext";
import UserAPI from "@/services/userAPI";
import { useToast } from "@/contexts/ToastContext";
import { Button } from "@/components/ui/button";
import { Heart, Loader2 } from "lucide-react";
import { tourService } from "@/services/tour.service";
import { useTranslation } from "react-i18next";

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
    const { t } = useTranslation();
    const { user, token, logout } = useAuth();
    const { showToast } = useToast();
    const navigate = useNavigate();
    const [favoriteTours, setFavoriteTours] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // State quản lý đóng mở sidebar trên mobile
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    useEffect(() => {
        if (!user || !token) {
            showToast(t('favoriteTours.pleaseLogin'), 'error');
            navigate('/login');
            return;
        }

        fetchFavoriteTours();
    }, [user, token, navigate, showToast, t]);

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
                showToast(t('favoriteTours.removedFromFavorites'), 'success');
                // Remove from local state
                setFavoriteTours((prev) => prev.filter((tour) => tour.id !== tourId));
            } else {
                showToast(response.message || t('favoriteTours.saveFailed'), 'error');
            }
        } catch (error) {
            console.error('Error removing favorite tour:', error);
            showToast(t('favoriteTours.saveFailed'), 'error');
        }
    };

    const handleLogout = () => {
        logout();
        showToast(t('settings.logout.success'), 'success');
        navigate('/login');
    };

    if (!user || !token) {
        return null; // Will redirect in useEffect
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="text-center mt-8 md:mt-12 mb-8 md:mb-12 px-4">
                <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold mb-4">
                    <span className="text-gradient">{t('favoriteTours.title')}</span>
                </h2>
            </div>

            <main className="container mx-auto px-4 py-6 md:py-12">
                {/* RESPONSIVE: flex-col trên mobile, flex-row trên desktop (lg) */}
                <div className="flex flex-col lg:flex-row gap-6 md:gap-8">

                    {/* Sidebar */}
                    <UserSidebar user={user} isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} handleLogout={handleLogout} activeLink="favorite-tours" />

                    {/* Main card */}
                    <section className="flex-1 min-w-0">
                        <div className="bg-white/90 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 p-4 md:p-8">
                            <h2 className="text-lg font-medium mb-3">{t('favoriteTours.myFavorites')}</h2>
                            <p className="text-sm text-slate-600 mb-6">
                                {t('favoriteTours.viewAllSaved')}
                            </p>

                            {/* Stats Card */}
                            <div className="mb-6 flex flex-col gap-3 bg-white rounded-2xl shadow-xl shadow-primary/10 px-6 py-4 border border-primary/10 max-w-xs">
                                <span className="text-xs uppercase tracking-widest text-gray-400">{t('favoriteTours.saving')}</span>
                                <div className="text-3xl font-bold text-primary">{favoriteTours.length}</div>
                                <p className="text-sm text-gray-500">{t('favoriteTours.favoriteCount')}</p>
                                <Button
                                    className="w-full bg-primary hover:bg-primary/90 text-white"
                                    onClick={() => navigate('/tour')}
                                >
                                    {t('favoriteTours.discoverNew')}
                                </Button>
                            </div>

                            {/* Loading State */}
                            {loading && (
                                <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                                    {[...Array(6)].map((_, index) => (
                                        <div key={index} className="animate-pulse rounded-2xl bg-white/80 p-6 border border-slate-100 shadow">
                                            <div className="h-40 bg-slate-200 rounded-xl mb-4" />
                                            <div className="h-4 bg-slate-200 rounded w-3/4 mb-2" />
                                            <div className="h-4 bg-slate-200 rounded w-1/2 mb-4" />
                                            <div className="space-y-2">
                                                <div className="h-3 bg-slate-100 rounded" />
                                                <div className="h-3 bg-slate-100 rounded w-2/3" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* Error State */}
                            {error && !loading && (
                                <div className="max-w-xl mx-auto bg-white border border-red-100 rounded-3xl p-10 text-center shadow-lg">
                                    <Heart className="w-12 h-12 text-red-400 mb-4 mx-auto" />
                                    <p className="text-red-500 text-lg mb-4">{error}</p>
                                    <Button onClick={fetchFavoriteTours} className="bg-primary text-white">
                                        {t('favoriteTours.retryLoad')}
                                    </Button>
                                </div>
                            )}

                            {/* Empty State */}
                            {!loading && !error && favoriteTours.length === 0 && (
                                <div className="max-w-3xl mx-auto text-center bg-white/90 backdrop-blur rounded-[32px] border border-slate-100 py-16 px-8 shadow-2xl shadow-primary/10">
                                    <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
                                        <Heart className="w-10 h-10 text-primary fill-primary/30" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-800 mb-3">
                                        {t('favoriteTours.noFavoritesYet')}
                                    </h2>
                                    <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                        {t('favoriteTours.noFavoritesDesc')}
                                    </p>
                                    <Button
                                        onClick={() => navigate('/tour')}
                                        className="bg-primary hover:bg-primary/90 text-white px-8"
                                    >
                                        {t('favoriteTours.startExploring')}
                                    </Button>
                                </div>
                            )}

                            {/* Tours Grid */}
                            {!loading && !error && favoriteTours.length > 0 && (
                                <>
                                    <div className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                                        <p className="text-gray-600 text-lg">
                                            {t('favoriteTours.youAreSaving')} <span className="font-semibold text-primary">{favoriteTours.length}</span> {t('favoriteTours.favoriteCount')}
                                        </p>
                                        <span className="text-sm text-gray-500">
                                            {t('favoriteTours.latestFirst')}
                                        </span>
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
                                                    <div className="absolute top-4 right-4 z-10">
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                handleRemoveFavorite(tour.id);
                                                            }}
                                                            className="p-2.5 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-red-50 hover:scale-110 transition-all duration-200 border border-white"
                                                            title={t('favoriteTours.removeFromFavorites')}
                                                        >
                                                            <Heart className="w-5 h-5 text-red-500 fill-red-500" />
                                                        </button>
                                                    </div>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </>
                            )}
                        </div>
                    </section>
                </div>
            </main>

            <Footer />
        </div>
    );
};

export default FavoriteTourPage;

