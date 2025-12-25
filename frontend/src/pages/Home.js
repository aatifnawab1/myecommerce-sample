import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, Sparkles, Package, Shield, Truck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from '../components/ProductCard';
import { perfumes, drones, heroImage } from '../data/mock';

const Home = () => {
  const navigate = useNavigate();
  const { t } = useLanguage();

  const featuredProducts = [...perfumes.slice(0, 3), ...drones.slice(0, 1)];

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black z-10" />
          <img
            src={heroImage}
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
              <img
                src={perfumes[0].image}
                alt="Perfumes"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
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
              <img
                src={drones[0].image}
                alt="Drones"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
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
