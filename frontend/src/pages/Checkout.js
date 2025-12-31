import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Package, MapPin, Phone, User, CheckCircle, Copy, Search, Tag, Percent } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
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

const Checkout = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { cartItems, getCartTotal, clearCart } = useCart();
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    city: '',
    address: '',
    couponCode: ''
  });
  const [couponApplied, setCouponApplied] = useState(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [publicOrderId, setPublicOrderId] = useState(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);

  useEffect(() => {
    fetchAvailableCoupons();
  }, []);

  const fetchAvailableCoupons = async () => {
    try {
      const data = await publicAPI.getActiveCoupons();
      setAvailableCoupons(data);
    } catch (error) {
      console.error('Error fetching coupons:', error);
    }
  };

  if (cartItems.length === 0 && !orderPlaced) {
    navigate('/cart');
    return null;
  }

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleApplyCoupon = async (couponCode = null) => {
    const codeToApply = couponCode || formData.couponCode;
    
    if (!codeToApply.trim()) {
      toast.error(language === 'ar' ? 'يرجى إدخال رمز الكوبون' : 'Please enter a coupon code');
      return;
    }

    setValidatingCoupon(true);
    try {
      const response = await publicAPI.validateCoupon(codeToApply, getCartTotal());
      if (response.valid) {
        setCouponApplied(response);
        setFormData(prev => ({ ...prev, couponCode: codeToApply }));
        toast.success(language === 'ar' ? t('couponApplied') : response.message);
      } else {
        toast.error(response.message);
        setCouponApplied(null);
      }
    } catch (error) {
      toast.error(language === 'ar' ? 'فشل في التحقق من الكوبون' : 'Failed to validate coupon');
      setCouponApplied(null);
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form
    if (!formData.fullName || !formData.phoneNumber || !formData.city || !formData.address) {
      toast.error('Please fill in all fields');
      return;
    }

    const subtotal = getCartTotal();
    const discount = couponApplied ? couponApplied.discount_amount : 0;
    const total = subtotal - discount;

    // Prepare order data
    const orderData = {
      customer_name: formData.fullName,
      phone: formData.phoneNumber,
      city: formData.city,
      address: formData.address,
      items: cartItems.map(item => ({
        product_id: item.id,
        name_en: item.name_en,
        name_ar: item.name_ar,
        price: item.price,
        quantity: item.quantity,
        image: item.images?.[0] || item.image || ''
      })),
      subtotal: subtotal,
      discount: discount,
      total: total,
      coupon_code: couponApplied ? formData.couponCode : null
    };

    try {
      const response = await publicAPI.createOrder(orderData);
      setPublicOrderId(response.public_order_id);
      
      // Meta Pixel: Track Purchase
      if (window.fbq) {
        window.fbq('track', 'Purchase', {
          content_ids: cartItems.map(item => item.id),
          contents: cartItems.map(item => ({
            id: item.id,
            quantity: item.quantity
          })),
          content_type: 'product',
          num_items: cartItems.reduce((sum, item) => sum + item.quantity, 0),
          value: total,
          currency: 'SAR'
        });
      }
      
      toast.success(language === 'ar' ? 'تم تقديم الطلب بنجاح!' : 'Order placed successfully!');
      setOrderPlaced(true);
      clearCart();
    } catch (error) {
      toast.error(error.response?.data?.detail || 'Failed to place order');
    }
  };

  const subtotal = getCartTotal();
  const discount = couponApplied ? couponApplied.discount_amount : 0;
  const finalTotal = subtotal - discount;

  if (orderPlaced) {
    const copyOrderId = () => {
      navigator.clipboard.writeText(publicOrderId);
      toast.success(language === 'ar' ? 'تم نسخ رقم الطلب' : 'Order ID copied!');
    };

    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <Card className="bg-zinc-900 border-zinc-800 max-w-md w-full">
          <CardContent className="p-8 text-center">
            <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-10 w-10 text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">{t('orderPlacedSuccess')}</h2>
            <p className="text-gray-400 mb-6">
              {t('thankYouOrder')}
            </p>
            
            {/* Order ID Display */}
            {publicOrderId && (
              <div className="bg-zinc-800 rounded-lg p-4 mb-6">
                <p className="text-gray-400 text-sm mb-2">{t('yourOrderId')}</p>
                <div className="flex items-center justify-center gap-3">
                  <span className="text-2xl font-bold text-amber-500">{publicOrderId}</span>
                  <button 
                    onClick={copyOrderId}
                    className="p-2 hover:bg-zinc-700 rounded-md transition-colors"
                    title={language === 'ar' ? 'نسخ' : 'Copy'}
                  >
                    <Copy className="h-5 w-5 text-gray-400 hover:text-white" />
                  </button>
                </div>
                <p className="text-gray-500 text-xs mt-2">{t('saveOrderId')}</p>
              </div>
            )}
            
            <div className="space-y-3">
              <Button
                onClick={() => navigate('/track-order')}
                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold"
              >
                <Search className="h-4 w-4 mr-2" />
                {t('trackMyOrder')}
              </Button>
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="w-full border-zinc-700 text-gray-400 hover:text-white hover:bg-zinc-800"
              >
                {t('backToHome')}
              </Button>
              <Button
                onClick={() => navigate('/shop')}
                variant="ghost"
                className="w-full text-gray-400 hover:text-white"
              >
                {t('continueShopping')}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="container mx-auto max-w-5xl">
        <h1 className="text-4xl font-bold text-white mb-8">
          {t('checkout')} <span className="text-amber-500">- Cash on Delivery</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div>
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-white mb-6">{t('deliveryInformation')}</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="fullName" className="text-white flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-amber-500" />
                      {t('fullName')}
                    </Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="phoneNumber" className="text-white flex items-center gap-2 mb-2">
                      <Phone className="h-4 w-4 text-amber-500" />
                      {t('phoneNumber')}
                    </Label>
                    <Input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="+966 50 123 4567"
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="city" className="text-white flex items-center gap-2 mb-2">
                      <MapPin className="h-4 w-4 text-amber-500" />
                      {t('city')}
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="Riyadh, Jeddah, Dammam..."
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="address" className="text-white flex items-center gap-2 mb-2">
                      <Package className="h-4 w-4 text-amber-500" />
                      {t('deliveryAddress')}
                    </Label>
                    <Textarea
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Street address, building number, apartment..."
                      rows={4}
                      className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-6 text-lg transition-all hover:scale-[1.02]"
                  >
                    {t('placeOrder')}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="bg-zinc-900 border-zinc-800 sticky top-24">
              <CardContent className="p-6">
                <h2 className="text-xl font-bold text-white mb-6">{t('orderSummary')}</h2>

                <div className="space-y-4 mb-6">
                  {cartItems.map((item) => {
                    const itemName = language === 'ar' ? item.name_ar : item.name_en;
                    return (
                      <div key={item.id} className="flex gap-3">
                        <div className="w-16 h-16 rounded-md overflow-hidden bg-zinc-800 flex-shrink-0">
                          <img
                            src={getImageUrl(item.images?.[0] || item.image || '')}
                            alt={itemName}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-semibold text-white">{itemName}</h4>
                          <p className="text-xs text-gray-400">
                            {t('quantity')}: {item.quantity}
                          </p>
                          <p className="text-sm font-medium text-amber-500">
                            {item.price * item.quantity} {t('sar')}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-zinc-700 pt-4 space-y-2">
                  {/* Available Coupons */}
                  {availableCoupons.length > 0 && !couponApplied && (
                    <div className="mb-4 pb-4 border-b border-zinc-700">
                      <Label className="text-white mb-3 block flex items-center gap-2">
                        <Tag className="h-4 w-4 text-green-500" />
                        {t('availableCoupons')}
                      </Label>
                      <div className="space-y-2">
                        {availableCoupons.map((coupon, index) => {
                          const meetsMinOrder = !coupon.min_order_value || getCartTotal() >= coupon.min_order_value;
                          return (
                            <div 
                              key={index} 
                              className={`flex items-center justify-between p-3 rounded-lg border ${
                                meetsMinOrder 
                                  ? 'bg-green-500/5 border-green-500/30' 
                                  : 'bg-zinc-800/50 border-zinc-700 opacity-60'
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-500/20">
                                  <Percent className="h-5 w-5 text-green-500" />
                                </div>
                                <div>
                                  <span className="text-amber-500 font-mono font-bold">{coupon.code}</span>
                                  <p className="text-xs text-gray-400">
                                    {coupon.discount_percentage}{t('percentOff')}
                                    {coupon.min_order_value && (
                                      <span className="ml-2">
                                        ({t('minOrder')}: {coupon.min_order_value} {t('sar')})
                                      </span>
                                    )}
                                  </p>
                                </div>
                              </div>
                              <Button
                                type="button"
                                size="sm"
                                onClick={() => handleApplyCoupon(coupon.code)}
                                disabled={!meetsMinOrder || validatingCoupon}
                                className={`${
                                  meetsMinOrder 
                                    ? 'bg-green-600 hover:bg-green-700 text-white' 
                                    : 'bg-zinc-700 text-gray-400 cursor-not-allowed'
                                } font-semibold`}
                              >
                                {t('applyCoupon')}
                              </Button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Coupon Input */}
                  <div className="mb-4 pb-4 border-b border-zinc-700">
                    <Label className="text-white mb-2 block">
                      {language === 'ar' ? 'رمز الكوبون' : 'Coupon Code'}
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        name="couponCode"
                        value={formData.couponCode}
                        onChange={handleInputChange}
                        placeholder={language === 'ar' ? 'أدخل رمز الكوبون' : 'Enter coupon code'}
                        className={`bg-zinc-800 border-zinc-700 text-white uppercase ${
                          couponApplied ? 'border-green-500' : ''
                        }`}
                        disabled={couponApplied}
                      />
                      {couponApplied ? (
                        <Button
                          type="button"
                          onClick={() => {
                            setCouponApplied(null);
                            setFormData(prev => ({ ...prev, couponCode: '' }));
                          }}
                          className="bg-red-500 hover:bg-red-600 text-white font-semibold"
                        >
                          {language === 'ar' ? 'إزالة' : 'Remove'}
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          onClick={() => handleApplyCoupon()}
                          disabled={validatingCoupon}
                          className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
                        >
                          {validatingCoupon 
                            ? (language === 'ar' ? 'جاري التحقق...' : 'Validating...') 
                            : t('applyCoupon')}
                        </Button>
                      )}
                    </div>
                    {couponApplied && (
                      <div className="flex items-center gap-2 mt-2 text-green-500 text-sm">
                        <CheckCircle className="h-4 w-4" />
                        <span>
                          {t('couponApplied')} {couponApplied.discount_percentage}{t('percentOff')}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="flex justify-between text-gray-400">
                    <span>{t('subtotal')}</span>
                    <span>{subtotal} {t('sar')}</span>
                  </div>
                  {couponApplied && (
                    <div className="flex justify-between text-green-500">
                      <span>{language === 'ar' ? 'الخصم' : 'Discount'} ({couponApplied.discount_percentage}%)</span>
                      <span>-{discount.toFixed(2)} {t('sar')}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-gray-400">
                    <span>{language === 'ar' ? 'التوصيل' : 'Delivery'}</span>
                    <span className="text-green-500">{language === 'ar' ? 'مجاني' : 'FREE'}</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold pt-2">
                    <span className="text-white">{t('total')}</span>
                    <span className="text-amber-500">{finalTotal.toFixed(2)} {t('sar')}</span>
                  </div>
                </div>

                <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/30 rounded-md">
                  <p className="text-sm text-amber-500 font-medium">
                    {language === 'ar' 
                      ? 'طريقة الدفع: الدفع عند الاستلام' 
                      : 'Payment method: Cash on Delivery (COD)'}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
