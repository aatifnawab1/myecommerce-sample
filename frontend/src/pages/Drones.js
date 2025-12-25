import React, { useState, useMemo } from 'react';
import { Search, SlidersHorizontal } from 'lucide-react';
import { Input } from '../components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { useLanguage } from '../context/LanguageContext';
import ProductCard from '../components/ProductCard';
import { drones } from '../data/mock';

const Drones = () => {
  const { t } = useLanguage();
  const [searchQuery, setSearchQuery] = useState('');
  const [priceFilter, setPriceFilter] = useState('all');
  const [sortBy, setSortBy] = useState('featured');

  const filteredAndSortedProducts = useMemo(() => {
    let products = [...drones];

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
      case 'priceLowHigh':
        products.sort((a, b) => a.price - b.price);
        break;
      case 'priceHighLow':
        products.sort((a, b) => b.price - a.price);
        break;
      default:
        break;
    }

    return products;
  }, [searchQuery, priceFilter, sortBy]);

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="container mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Premium <span className="text-amber-500">{t('drones')}</span>
          </h1>
          <p className="text-gray-400">Cutting-edge technology for aerial photography and videography</p>
        </div>

        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              type="text"
              placeholder={t('searchProducts')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-zinc-900 border-zinc-800 text-white placeholder:text-gray-500 focus:border-amber-500"
            />
          </div>

          <Select value={priceFilter} onValueChange={setPriceFilter}>
            <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white focus:border-amber-500">
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              <SelectValue placeholder={t('filterByPrice')} />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              <SelectItem value="all">{t('allPrices')}</SelectItem>
              <SelectItem value="under500">{t('under500')}</SelectItem>
              <SelectItem value="under1000">{t('under1000')}</SelectItem>
              <SelectItem value="under3000">{t('under3000')}</SelectItem>
              <SelectItem value="over3000">{t('over3000')}</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="bg-zinc-900 border-zinc-800 text-white focus:border-amber-500">
              <SelectValue placeholder={t('sortBy')} />
            </SelectTrigger>
            <SelectContent className="bg-zinc-900 border-zinc-800">
              <SelectItem value="featured">{t('featured')}</SelectItem>
              <SelectItem value="priceLowHigh">{t('priceLowHigh')}</SelectItem>
              <SelectItem value="priceHighLow">{t('priceHighLow')}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredAndSortedProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">No drones found matching your criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Drones;
