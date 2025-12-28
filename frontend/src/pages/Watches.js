import React, { useState, useMemo, useEffect } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from '../components/ProductCard';
import publicAPI from '../services/publicAPI';

const Watches = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const [allProducts, setAllProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await publicAPI.getProducts();
      setAllProducts(data);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAndSortedProducts = useMemo(() => {
    let products = allProducts.filter(p => p.category === 'watch');

    if (searchQuery) {
      products = products.filter(product =>
        product.name_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.name_ar.includes(searchQuery) ||
        product.description_en.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description_ar.includes(searchQuery)
      );
    }

    if (priceFilter !== 'all') {
      products = products.filter(product => {
        switch (priceFilter) {
          case 'under500':
            return product.price < 500;
          case 'under1000':
            return product.price >= 500 && product.price < 1000;
          case 'under3000':
            return product.price >= 1000 && product.price < 3000;
          case 'over3000':
            return product.price >= 3000;
          default:
            return true;
        }
      });
    }

    switch (sortBy) {
      case 'priceLow':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'priceHigh':
        products.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    return products;
  }, [allProducts, searchQuery, priceFilter, sortBy]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-amber-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Banner */}
      <section className="relative py-16 bg-gradient-to-b from-zinc-900 to-black">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
            {t('watches')}
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            {t('watchesSubtitle')}
          </p>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b border-zinc-800">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder={t('searchProducts')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-zinc-900 border-zinc-700 text-white focus:border-amber-500"
              />
            </div>
            
            <div className="flex gap-4 w-full md:w-auto">
              <Select value={priceFilter} onValueChange={setPriceFilter}>
                <SelectTrigger className="w-full md:w-48 bg-zinc-900 border-zinc-700 text-white">
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  <SelectValue placeholder={t('filterByPrice')} />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700">
                  <SelectItem value="all">{t('allPrices')}</SelectItem>
                  <SelectItem value="under500">{t('under500')}</SelectItem>
                  <SelectItem value="under1000">{t('under1000')}</SelectItem>
                  <SelectItem value="under3000">{t('under3000')}</SelectItem>
                  <SelectItem value="over3000">{t('over3000')}</SelectItem>
                </SelectContent>
              </Select>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full md:w-48 bg-zinc-900 border-zinc-700 text-white">
                  <SelectValue placeholder={t('sortBy')} />
                </SelectTrigger>
                <SelectContent className="bg-zinc-900 border-zinc-700">
                  <SelectItem value="featured">{t('featured')}</SelectItem>
                  <SelectItem value="priceLow">{t('priceLowHigh')}</SelectItem>
                  <SelectItem value="priceHigh">{t('priceHighLow')}</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {filteredAndSortedProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-400 text-lg">{t('noProductsFound')}</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredAndSortedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Watches;
