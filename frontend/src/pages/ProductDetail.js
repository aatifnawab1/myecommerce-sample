import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, ArrowLeft, Package, Shield, Truck } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import { allProducts } from '../data/mock';
import { toast } from 'sonner';

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { addToCart, getCartCount } = useCart();
  const [quantity, setQuantity] = useState(1);

  const product = allProducts.find(p => p.id === id);

  if (!product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Product not found</h2>
          <Button onClick={() => navigate('/shop')} className="bg-amber-500 hover:bg-amber-600 text-black">
            Return to Shop
          </Button>
        </div>
      </div>
    );
  }

  const productName = language === 'ar' ? product.name_ar : product.name_en;
  const productDescription = language === 'ar' ? product.description_ar : product.description_en;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${quantity}x ${productName} added to cart!`);
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="container mx-auto">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6 text-gray-400 hover:text-amber-500 hover:bg-transparent"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Image */}
          <div className="relative">
            <div className="aspect-square rounded-lg overflow-hidden bg-zinc-900">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {discount > 0 && (
              <Badge className="absolute top-4 right-4 bg-amber-500 text-black hover:bg-amber-600 text-lg px-4 py-2">
                -{discount}% OFF
              </Badge>
            )}
          </div>

          {/* Details */}
          <div>
            <div className="mb-4">
              <Badge className="bg-zinc-800 text-amber-500 hover:bg-zinc-800">
                {product.category === 'perfume' ? t('perfumes') : t('drones')}
              </Badge>
            </div>

            <h1 className="text-4xl font-bold text-white mb-4">{productName}</h1>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-5 w-5 ${
                      i < Math.floor(product.rating)
                        ? 'fill-amber-500 text-amber-500'
                        : 'text-gray-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-gray-400">
                {product.rating} ({product.reviews} {t('reviews')})
              </span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-amber-500">
                {product.price} {t('sar')}
              </span>
              {product.originalPrice && (
                <span className="text-2xl text-gray-500 line-through">
                  {product.originalPrice} {t('sar')}
                </span>
              )}
            </div>

            <p className="text-gray-300 mb-8 text-lg leading-relaxed">{productDescription}</p>

            {/* Specifications for Drones */}
            {product.specs && (
              <Card className="bg-zinc-900 border-zinc-800 mb-8">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">{t('specifications')}</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(product.specs).map(([key, value]) => (
                      <div key={key}>
                        <span className="text-gray-400 text-sm capitalize">{key}:</span>
                        <p className="text-white font-medium">{value}</p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quantity and Add to Cart */}
            <div className="flex gap-4 mb-8">
              <div className="flex items-center border border-zinc-800 rounded-md">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-3 text-white hover:bg-zinc-800 transition-colors"
                >
                  -
                </button>
                <span className="px-6 py-3 text-white font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-3 text-white hover:bg-zinc-800 transition-colors"
                >
                  +
                </button>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-bold text-lg py-6 transition-all hover:scale-[1.02]"
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                {product.inStock ? t('addToCart') : t('outOfStock')}
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-4 text-center">
                  <Truck className="h-6 w-6 text-amber-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Fast Delivery</p>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-4 text-center">
                  <Shield className="h-6 w-6 text-amber-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Authentic Product</p>
                </CardContent>
              </Card>

              <Card className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-4 text-center">
                  <Package className="h-6 w-6 text-amber-500 mx-auto mb-2" />
                  <p className="text-sm text-gray-400">Cash on Delivery</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
