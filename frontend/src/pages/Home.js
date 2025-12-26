import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Package, Shield, Truck, Tag, Percent } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from '../components/ProductCard';
import publicAPI from '../services/publicAPI';

const Home = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [products, setProducts] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
    fetchCoupons();
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

  const featuredProducts = products.slice(0, 4);
  const perfumes = products.filter(p => p.category === 'perfume');
  const drones = products.filter(p => p.category === 'drone');

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black z-10" />
          <img
            src="https://images.unsplash.com/photo-1615540732776-ed0a2145e8f1?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NDQ2MzR8MHwxfHNlYXJjaHwyfHxwcmVtaXVtJTIwbGlmZXN0eWxlfGVufDB8fHx8MTc2NjY3MDAyMXww&ixlib=rb-4.1.0&q=85"
            alt="Luxury lifestyle"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="relative z-20 text-center px-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 rounded-full px-4 py-2 mb-6 backdrop-blur-sm">
            <Sparkles className="h-4 w-4 text-amber-500" />
            <span className="text-sm text-amber-500 font-medium">Premium Quality Guaranteed</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-amber-300 via-amber-500 to-amber-600 bg-clip-text text-transparent">
              {t('heroTitle')}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-2xl mx-auto">
            {t('heroSubtitle')}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => navigate('/shop')}
              className="bg-amber-500 hover:bg-amber-600 text-black font-bold text-lg px-8 transition-all hover:scale-105"
            >
              {t('shopNow')}
              <ArrowRight className="ml-2 h-5 w-5" />
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

      {/* Features */}
      <section className="py-16 px-4 border-y border-amber-500/20">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-zinc-900 border-zinc-800 hover:border-amber-500/50 transition-all">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 mb-4">
                  <Truck className="h-8 w-8 text-amber-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Cash on Delivery</h3>
                <p className="text-sm text-gray-400">Pay when you receive your order</p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800 hover:border-amber-500/50 transition-all">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 mb-4">
                  <Shield className="h-8 w-8 text-amber-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Authentic Products</h3>
                <p className="text-sm text-gray-400">100% genuine luxury items</p>
              </CardContent>
            </Card>

            <Card className="bg-zinc-900 border-zinc-800 hover:border-amber-500/50 transition-all">
              <CardContent className="p-6 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-amber-500/10 mb-4">
                  <Package className="h-8 w-8 text-amber-500" />
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">Fast Delivery</h3>
                <p className="text-sm text-gray-400">Express shipping across KSA</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Available Offers Section */}
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
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </div>
        </section>
      )}

      {/* Featured Products */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              Featured <span className="text-amber-500">Products</span>
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto">
              Discover our handpicked selection of premium perfumes and cutting-edge drones
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="text-center">
            <Button
              size="lg"
              onClick={() => navigate('/shop')}
              className="bg-transparent border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black font-semibold transition-all"
            >
              View All Products
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-20 px-4 bg-gradient-to-b from-black to-zinc-900">
        <div className="container mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div
              className="relative h-80 rounded-lg overflow-hidden group cursor-pointer"
              onClick={() => navigate('/perfumes')}
            >
              {perfumes[0] && (
                <img
                  src={perfumes[0].images?.[0] || perfumes[0].image}
                  alt="Perfumes"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-8">
                <h3 className="text-3xl font-bold text-white mb-2">{t('perfumes')}</h3>
                <p className="text-gray-300 mb-4">Explore luxury fragrances</p>
                <Button className="w-fit bg-amber-500 hover:bg-amber-600 text-black font-semibold">
                  Shop Perfumes
                </Button>
              </div>
            </div>

            <div
              className="relative h-80 rounded-lg overflow-hidden group cursor-pointer"
              onClick={() => navigate('/drones')}
            >
              {drones[0] && (
                <img
                  src={drones[0].images?.[0] || drones[0].image}
                  alt="Drones"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent flex flex-col justify-end p-8">
                <h3 className="text-3xl font-bold text-white mb-2">{t('drones')}</h3>
                <p className="text-gray-300 mb-4">Discover advanced technology</p>
                <Button className="w-fit bg-amber-500 hover:bg-amber-600 text-black font-semibold">
                  Shop Drones
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
