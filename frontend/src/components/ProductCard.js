import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ShoppingCart } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { toast } from 'sonner';

const ProductCard = ({ product }) => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { addToCart } = useCart();

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (product.inStock) {
      addToCart(product);
      const productName = language === 'ar' ? product.name_ar : product.name_en;
      toast.success(`${productName} added to cart!`);
    }
  };

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const productName = language === 'ar' ? product.name_ar : product.name_en;
  const productDescription = language === 'ar' ? product.description_ar : product.description_en;

  return (
    <Card
      className="group cursor-pointer overflow-hidden bg-zinc-900 border-zinc-800 hover:border-amber-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10 hover:-translate-y-1"
      onClick={handleCardClick}
    >
      <div className="relative overflow-hidden aspect-square">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {discount > 0 && (
          <Badge className="absolute top-3 right-3 bg-amber-500 text-black hover:bg-amber-600">
            -{discount}%
          </Badge>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/70 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">{t('outOfStock')}</span>
          </div>
        )}
      </div>

      <CardContent className="p-4">
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-amber-500 transition-colors">
          {productName}
        </h3>

        <p className="text-sm text-gray-400 mb-3 line-clamp-2">{productDescription}</p>

        <div className="flex items-center gap-1 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`h-4 w-4 ${
                i < Math.floor(product.rating)
                  ? 'fill-amber-500 text-amber-500'
                  : 'text-gray-600'
              }`}
            />
          ))}
          <span className="text-xs text-gray-400 ml-1">
            ({product.reviews} {t('reviews')})
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold text-amber-500">
                {product.price} {t('sar')}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  {product.originalPrice}
                </span>
              )}
            </div>
          </div>

          <Button
            size="sm"
            disabled={!product.inStock}
            onClick={handleAddToCart}
            className="bg-amber-500 hover:bg-amber-600 text-black font-semibold transition-all"
          >
            <ShoppingCart className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
