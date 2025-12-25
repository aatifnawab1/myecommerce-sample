import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Star, ShoppingCart, ArrowLeft, Package, Shield, Truck, Bell } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '../components/ui/dialog';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';
import publicAPI from '../services/publicAPI';
import { toast } from 'sonner';

// Helper to get full image URL
const getImageUrl = (imageUrl) => {
  if (!imageUrl) return '';
  if (imageUrl.startsWith('/api/')) {
    return `${process.env.REACT_APP_BACKEND_URL}${imageUrl}`;
  }
  return imageUrl;
};

const ProductDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { addToCart, getCartCount } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notifyDialogOpen, setNotifyDialogOpen] = useState(false);
  const [notifyData, setNotifyData] = useState({ phone: '', name: '' });

  useEffect(() => {
    fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const data = await publicAPI.getProduct(id);
      setProduct(data);
    } catch (error) {
      console.error('Error fetching product:', error);
      toast.error('Product not found');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

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
  const isInStock = product.quantity > 0;

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`${quantity}x ${productName} added to cart!`);
  };

  const handleNotifyMe = async (e) => {
    e.preventDefault();
    
    if (!notifyData.phone) {
      toast.error('Please enter your phone number');
      return;
    }

    try {
      await publicAPI.createNotifyRequest(product.id, notifyData.phone, notifyData.name);
      toast.success(language === 'ar' ? 'سنقوم بإعلامك عند توفر المنتج' : 'We will notify you when the product is available');
      setNotifyDialogOpen(false);
      setNotifyData({ phone: '', name: '' });
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to submit request');
    }
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
                src={product.images?.[0] || product.image || ''}
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

            {/* Quantity and Add to Cart / Notify Me */}
            <div className="space-y-4 mb-8">
              {isInStock ? (
                <>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <div className="flex items-center border border-zinc-800 rounded-md w-full sm:w-auto">
                      <button
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="px-4 py-3 text-white hover:bg-zinc-800 transition-colors flex-1 sm:flex-none"
                      >
                        -
                      </button>
                      <span className="px-6 py-3 text-white font-semibold text-center flex-1 sm:flex-none">{quantity}</span>
                      <button
                        onClick={() => setQuantity(quantity + 1)}
                        className="px-4 py-3 text-white hover:bg-zinc-800 transition-colors flex-1 sm:flex-none"
                      >
                        +
                      </button>
                    </div>

                    <Button
                      onClick={handleAddToCart}
                      className="w-full sm:flex-1 bg-amber-500 hover:bg-amber-600 text-black font-bold text-lg py-6 transition-all hover:scale-[1.02]"
                    >
                      <ShoppingCart className="mr-2 h-5 w-5" />
                      {t('addToCart')}
                    </Button>
                  </div>

                  {/* View Cart Button */}
                  {getCartCount() > 0 && (
                    <Button
                      onClick={() => navigate('/cart')}
                      variant="outline"
                      className="w-full border-2 border-amber-500 text-amber-500 hover:bg-amber-500 hover:text-black font-semibold text-lg py-6 transition-all"
                    >
                      {t('viewCart')} ({getCartCount()} {t('itemsInCart')})
                    </Button>
                  )}
                </>
              ) : (
                <div className="space-y-4">
                  <div className="bg-red-500/10 border border-red-500/30 rounded-md p-4">
                    <p className="text-red-500 font-semibold text-center">
                      {t('outOfStock')}
                    </p>
                  </div>
                  
                  <Button
                    onClick={() => setNotifyDialogOpen(true)}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold text-lg py-6 transition-all"
                  >
                    <Bell className="mr-2 h-5 w-5" />
                    {language === 'ar' ? 'أعلمني عند التوفر' : 'Notify Me'}
                  </Button>
                  
                  <p className="text-sm text-gray-400 text-center">
                    {language === 'ar' 
                      ? 'سنرسل لك إشعاراً عندما يتوفر هذا المنتج' 
                      : 'We\'ll notify you when this product is back in stock'}
                  </p>
                </div>
              )}
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

      {/* Notify Me Dialog */}
      <Dialog open={notifyDialogOpen} onOpenChange={setNotifyDialogOpen}>
        <DialogContent className="bg-zinc-900 border-zinc-800 text-white">
          <DialogHeader>
            <DialogTitle className="text-white">
              {language === 'ar' ? 'إشعار عند التوفر' : 'Notify Me'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleNotifyMe} className="space-y-4">
            <div>
              <Label htmlFor="phone" className="text-white">
                {language === 'ar' ? 'رقم الهاتف' : 'Phone Number'} *
              </Label>
              <Input
                id="phone"
                type="tel"
                value={notifyData.phone}
                onChange={(e) => setNotifyData({ ...notifyData, phone: e.target.value })}
                placeholder="+966 50 123 4567"
                className="bg-zinc-800 border-zinc-700 text-white"
                required
              />
            </div>

            <div>
              <Label htmlFor="name" className="text-white">
                {language === 'ar' ? 'الاسم (اختياري)' : 'Name (Optional)'}
              </Label>
              <Input
                id="name"
                type="text"
                value={notifyData.name}
                onChange={(e) => setNotifyData({ ...notifyData, name: e.target.value })}
                placeholder={language === 'ar' ? 'اسمك' : 'Your name'}
                className="bg-zinc-800 border-zinc-700 text-white"
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold"
            >
              {language === 'ar' ? 'تأكيد الطلب' : 'Submit Request'}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductDetail;
