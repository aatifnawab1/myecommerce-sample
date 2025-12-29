import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Package, Shield, Truck, Tag, Percent, ShoppingCart, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import publicAPI from '../services/publicAPI';
import { toast } from 'sonner';

// Default promotional slides (fallback if no slides in database)
const defaultSlides = [
  {
    id: 'default-1',
    image_url: 'https://customer-assets.emergentagent.com/job_zaylux-launch/artifacts/0q8ux48h_ChatGPT%20Image%20Dec%2028%2C%202025%2C%2005_44_35%20PM.png',
    alt_text_en: 'Zaylux - Luxury Perfumes, Watches & Electronics',
    alt_text_ar: 'Zaylux - العطور والساعات والإلكترونيات الفاخرة'
  },
  {
    id: 'default-2',
    image_url: 'https://customer-assets.emergentagent.com/job_zaylux-launch/artifacts/rzp2bylj_ChatGPT%20Image%20Dec%2028%2C%202025%2C%2006_12_30%20PM.png',
    alt_text_en: 'Blue Laverne Bakhur - Special Offer',
    alt_text_ar: 'بخور بلو لافيرن - عرض خاص'
  },
  {
    id: 'default-3',
    image_url: 'https://customer-assets.emergentagent.com/job_zaylux-launch/artifacts/ksnusbvm_ChatGPT%20Image%20Dec%2028%2C%202025%2C%2006_12_20%20PM.png',
    alt_text_en: 'Professional Drone - Special Price',
    alt_text_ar: 'طائرة درون احترافية - سعر خاص'
  },
  {
    id: 'default-4',
    image_url: 'https://customer-assets.emergentagent.com/job_zaylux-launch/artifacts/nfw6kb2s_ChatGPT%20Image%20Dec%2028%2C%202025%2C%2006_12_16%20PM.png',
    alt_text_en: 'Casio Watch - Special Offer',
    alt_text_ar: 'ساعة كاسيو - عرض خاص'
  }
];

// Helper to get full image URL
const getImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  if (imageUrl.startsWith('/api/')) {
    return `${process.env.REACT_APP_BACKEND_URL}${imageUrl}`;
  }
  return imageUrl;
};

const Home = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [promoSlides, setPromoSlides] = useState(defaultSlides);
  const [loading, setLoading] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Auto-slide functionality
  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % promoSlides.length);
  }, [promoSlides.length]);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + promoSlides.length) % promoSlides.length);
  }, [promoSlides.length]);

  useEffect(() => {
    const timer = setInterval(nextSlide, 4000); // Auto-slide every 4 seconds
    return () => clearInterval(timer);
  }, [nextSlide]);

  useEffect(() => {
    fetchProducts();
    fetchCoupons();
    fetchSlides();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await publicAPI.getProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCoupons = async () => {
    try {
      const data = await publicAPI.getActiveCoupons();
      setCoupons(data);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  };

  const fetchSlides = async () => {
    try {
      const data = await publicAPI.getSlides();
      if (data && data.length > 0) {
        setPromoSlides(data);
      }
      // If no slides in DB, keep using default slides
    } catch (error) {
      console.error('Error fetching slides:', error);
      // Keep using default slides on error
    }
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    if (product.quantity > 0) {
      addToCart(product);
      const productName = language === 'ar' ? product.name_ar : product.name_en;
      toast.success(language === 'ar' ? `تمت إضافة ${productName} إلى السلة!` : `${productName} added to cart!`);
    }
  };

  const featuredProducts = products.slice(0, 4);
  const perfumes = products.filter(p => p.category === 'perfume');
  const drones = products.filter(p => p.category === 'drone');
  const watches = products.filter(p => p.category === 'watch');

  return (
    <div className="min-h-screen bg-black">
      {/* 1. Hero Section - Promotional Slider */}
      <section className="relative pt-8 pb-12 px-4 bg-gradient-to-b from-black via-zinc-900/50 to-black overflow-hidden">
        <div className="container mx-auto">
          {/* Header Text */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
              <Sparkles className="h-4 w-4 text-amber-500" />
              <span className="text-sm text-amber-500 font-medium">{t('premiumQuality')}</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              <span className="bg-gradient-to-r from-amber-300 via-amber-500 to-amber-600 bg-clip-text text-transparent">
                {t('heroTitle')}
              </span>
            </h1>

            <p className="text-lg md:text-xl text-gray-300 mb-6 max-w-2xl mx-auto">
              {t('heroSubtitle')}
            </p>
          </div>

          {/* Main Slider */}
          <div className="relative max-w-5xl mx-auto">
            {/* Slider Container */}
            <div className="relative overflow-hidden rounded-2xl shadow-2xl shadow-amber-500/20">
              {/* Slides */}
              <div className="relative w-full">
                {promoSlides.map((slide, index) => (
                  <div
                    key={slide.id}
                    className={`w-full transition-all duration-700 ease-out ${
                      currentSlide === index 
                        ? 'opacity-100 relative' 
                        : 'opacity-0 absolute inset-0'
                    }`}
                  >
                    <img
                      src={slide.image}
                      alt={slide.alt}
                      className="w-full h-auto object-contain"
                    />
                    {/* Floating glow effect */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
                  </div>
                ))}
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={prevSlide}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-amber-500 text-white hover:text-black p-3 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 z-10"
                aria-label="Previous slide"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-amber-500 text-white hover:text-black p-3 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-110 z-10"
                aria-label="Next slide"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </div>

            {/* Dot Indicators */}
            <div className="flex justify-center gap-3 mt-6">
              {promoSlides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentSlide === index 
                      ? 'bg-amber-500 w-8' 
                      : 'bg-zinc-600 hover:bg-zinc-500'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>

            {/* Floating decoration elements */}
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mt-10">
            <Button
              size="lg"
              onClick={() => navigate('/shop')}
              className="bg-amber-500 hover:bg-amber-600 text-black font-bold text-lg px-8 transition-all hover:scale-105"
            >
              {t('shopNow')}
              <ArrowRight className={`${language === 'ar' ? 'mr-2 rotate-180' : 'ml-2'} h-5 w-5`} />
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => navigate('/about')}
              className="border-amber-500 text-amber-500 hover:bg-amber-500/10 font-semibold text-lg px-8 transition-all"
            >
              {t('about')}
            </Button>
          </div>
        </div>
      </section>

      {/* 2. Featured Products Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              {language === 'ar' ? (
                <>{t('featuredProducts')}</>
              ) : (
                <>Featured <span className="text-amber-500">Products</span></>
              )}
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              {t('featuredProductsSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {featuredProducts.map((product) => {
              const productName = language === 'ar' ? product.name_ar : product.name_en;
              const productDescription = language === 'ar' ? product.description_ar : product.description_en;
              const productImage = product.images?.[0] || product.image || '';
              const isInStock = product.quantity > 0;
              const discount = product.originalPrice
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;

              return (
                <Card
                  key={product.id}
                  className="group cursor-pointer overflow-hidden bg-zinc-900 border-zinc-800 hover:border-amber-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10 hover:-translate-y-1"
                  onClick={() => navigate(`/product/${product.id}`)}
                >
                  <div className="relative overflow-hidden aspect-square">
                    <img
                      src={getImageUrl(productImage)}
                      alt={productName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    {discount > 0 && (
                      <Badge className="absolute top-3 right-3 bg-amber-500 text-black hover:bg-amber-600">
                        -{discount}%
                      </Badge>
                    )}
                    {!isInStock && (
                      <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
                        <span className="text-white font-semibold text-lg">{t('outOfStock')}</span>
                      </div>
                    )}
                  </div>

                  <CardContent className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-amber-500 transition-colors line-clamp-1">
                      {productName}
                    </h3>

                    <p className="text-sm text-gray-400 mb-3 line-clamp-2">{productDescription}</p>

                    <div className="flex items-center gap-1 mb-3">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating || 4)
                              ? 'fill-amber-500 text-amber-500'
                              : 'text-gray-600'
                          }`}
                        />
                      ))}
                      <span className="text-xs text-gray-400 ml-1">
                        ({product.reviews || 0} {t('reviews')})
                      </span>
                    </div>

                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-xl font-bold text-amber-500">
                        {product.price} {t('sar')}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          {product.originalPrice}
                        </span>
                      )}
                    </div>

                    {/* Full-width Add to Cart Button */}
                    <Button
                      className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold transition-all"
                      disabled={!isInStock}
                      onClick={(e) => handleAddToCart(product, e)}
                    >
                      <ShoppingCart className={`h-4 w-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                      {t('addToCart')}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          <div className="text-center">
            <Button
              size="lg"
              onClick={() => navigate('/shop')}
              className="bg-transparent border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black font-semibold transition-all"
            >
              {t('viewAllProducts')}
              <ArrowRight className={`${language === 'ar' ? 'mr-2 rotate-180' : 'ml-2'} h-5 w-5`} />
            </Button>
          </div>
        </div>
      </section>

      {/* 3. Categories Section - Mobile Friendly Grid */}
      <section className="py-12 md:py-20 px-4 bg-gradient-to-b from-black to-zinc-900">
        <div className="container mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
              {language === 'ar' ? 'تسوق حسب الفئة' : 'Shop by Category'}
            </h2>
            <p className="text-gray-400 text-sm md:text-base">
              {language === 'ar' ? 'اختر من مجموعاتنا المميزة' : 'Choose from our exclusive collections'}
            </p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-3 gap-3 md:gap-8">
            <div
              className="relative h-32 sm:h-48 md:h-80 rounded-lg overflow-hidden group cursor-pointer"
              onClick={() => navigate('/perfumes')}
            >
              {perfumes[0] ? (
                <img
                  src={getImageUrl(perfumes[0].images?.[0] || perfumes[0].image)}
                  alt="Perfumes"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-amber-900/50 to-zinc-900" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-2 sm:p-4 md:p-6">
                <h3 className="text-sm sm:text-lg md:text-2xl font-bold text-white mb-0 sm:mb-1 md:mb-2">{t('perfumes')}</h3>
                <p className="text-gray-300 text-xs md:text-sm mb-1 md:mb-3 hidden sm:block">
                  {language === 'ar' ? 'اكتشف العطور الفاخرة' : 'Explore luxury fragrances'}
                </p>
                <Button className="w-fit bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs md:text-sm px-2 py-1 md:px-4 md:py-2 h-auto hidden md:flex">
                  {language === 'ar' ? 'تسوق العطور' : 'Shop Perfumes'}
                </Button>
              </div>
            </div>

            <div
              className="relative h-32 sm:h-48 md:h-80 rounded-lg overflow-hidden group cursor-pointer"
              onClick={() => navigate('/drones')}
            >
              {drones[0] ? (
                <img
                  src={getImageUrl(drones[0].images?.[0] || drones[0].image)}
                  alt="Drones"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-blue-900/50 to-zinc-900" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-2 sm:p-4 md:p-6">
                <h3 className="text-sm sm:text-lg md:text-2xl font-bold text-white mb-0 sm:mb-1 md:mb-2">{t('drones')}</h3>
                <p className="text-gray-300 text-xs md:text-sm mb-1 md:mb-3 hidden sm:block">
                  {language === 'ar' ? 'اكتشف التكنولوجيا المتقدمة' : 'Discover advanced technology'}
                </p>
                <Button className="w-fit bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs md:text-sm px-2 py-1 md:px-4 md:py-2 h-auto hidden md:flex">
                  {language === 'ar' ? 'تسوق الطائرات' : 'Shop Drones'}
                </Button>
              </div>
            </div>

            <div
              className="relative h-32 sm:h-48 md:h-80 rounded-lg overflow-hidden group cursor-pointer"
              onClick={() => navigate('/watches')}
            >
              {watches[0] ? (
                <img
                  src={getImageUrl(watches[0].images?.[0] || watches[0].image)}
                  alt="Watches"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-zinc-700/50 to-zinc-900 flex items-center justify-center">
                  <span className="text-3xl md:text-6xl">⌚</span>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-2 sm:p-4 md:p-6">
                <h3 className="text-sm sm:text-lg md:text-2xl font-bold text-white mb-0 sm:mb-1 md:mb-2">{t('watches')}</h3>
                <p className="text-gray-300 text-xs md:text-sm mb-1 md:mb-3 hidden sm:block">
                  {language === 'ar' ? 'اكتشف الساعات الفاخرة' : 'Discover luxury timepieces'}
                </p>
                <Button className="w-fit bg-amber-500 hover:bg-amber-600 text-black font-semibold text-xs md:text-sm px-2 py-1 md:px-4 md:py-2 h-auto hidden md:flex">
                  {language === 'ar' ? 'تسوق الساعات' : 'Shop Watches'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Available Offers Section */}
      {coupons.length > 0 && (
        <section className="py-16 px-4 bg-gradient-to-b from-black to-zinc-900/50">
          <div className="container mx-auto">
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 bg-green-500/10 border border-green-500/30 rounded-full px-4 py-2 mb-4">
                <Tag className="h-4 w-4 text-green-500" />
                <span className="text-sm text-green-500 font-medium">
                  {language === 'ar' ? 'وفّر المزيد' : 'Save More'}
                </span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                {t('availableOffers')}
              </h2>
              <p className="text-gray-400 max-w-xl mx-auto">
                {language === 'ar' 
                  ? 'استخدم هذه الكوبونات للحصول على خصومات على طلبك'
                  : 'Use these coupon codes to get discounts on your order'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {coupons.map((coupon, index) => (
                <Card 
                  key={index} 
                  className="bg-zinc-900 border-zinc-800 hover:border-green-500/50 transition-all overflow-hidden"
                >
                  <div className="bg-gradient-to-r from-green-600 to-green-500 py-3 px-4">
                    <div className="flex items-center justify-between">
                      <span className="text-white font-bold text-xl">
                        {coupon.discount_percentage}{t('percentOff')}
                      </span>
                      <Percent className="h-6 w-6 text-white/80" />
                    </div>
                  </div>
                  <CardContent className="p-4">
                    <div className="bg-zinc-800 rounded-lg p-3 mb-3 text-center">
                      <span className="text-amber-500 font-mono font-bold text-lg tracking-wider">
                        {coupon.code}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm text-center">
                      {language === 'ar' 
                        ? `خصم ${coupon.discount_percentage}% باستخدام الرمز`
                        : `Get ${coupon.discount_percentage}% off your order`}
                    </p>
                    {coupon.min_order_value && (
                      <p className="text-gray-500 text-xs text-center mt-2">
                        {t('minOrder')}: {coupon.min_order_value} {t('sar')}
                      </p>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="text-center mt-8">
              <Button
                onClick={() => navigate('/shop')}
                className="bg-green-600 hover:bg-green-700 text-white font-semibold px-8"
              >
                {t('shopNow')}
                <ArrowRight className={`${language === 'ar' ? 'mr-2 rotate-180' : 'ml-2'} h-5 w-5`} />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* 4. Trust / Benefits Section */}
      <section className="py-16 px-4 border-y border-amber-500/20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Cash on Delivery */}
            <Card className="bg-zinc-900 border-zinc-800 hover:border-amber-500/50 transition-all">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 mb-4">
                  <Truck className="h-8 w-8 text-amber-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{t('cashOnDelivery')}</h3>
                <p className="text-sm text-gray-400">{t('cashOnDeliveryDesc')}</p>
              </CardContent>
            </Card>

            {/* Authentic Products */}
            <Card className="bg-zinc-900 border-zinc-800 hover:border-amber-500/50 transition-all">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 mb-4">
                  <Shield className="h-8 w-8 text-amber-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{t('authenticProducts')}</h3>
                <p className="text-sm text-gray-400">{t('authenticProductsDesc')}</p>
              </CardContent>
            </Card>

            {/* Fast Delivery */}
            <Card className="bg-zinc-900 border-zinc-800 hover:border-amber-500/50 transition-all">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 mb-4">
                  <Package className="h-8 w-8 text-amber-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{t('fastDelivery')}</h3>
                <p className="text-sm text-gray-400">{t('fastDeliveryDesc')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
