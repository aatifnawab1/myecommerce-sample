import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Package, MapPin, Calendar, ShoppingBag, CheckCircle, Truck, Clock, XCircle, AlertCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { useLanguage } from '../context/LanguageContext';
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

const TrackOrder = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    orderId: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState(null);
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.orderId || !formData.phone) {
      toast.error(language === 'ar' ? 'يرجى ملء جميع الحقول' : 'Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);
    setOrderData(null);

    try {
      const data = await publicAPI.trackOrder(formData.orderId, formData.phone);
      setOrderData(data);
    } catch (err) {
      setError(err.response?.data?.detail || t('orderNotFound'));
      toast.error(err.response?.data?.detail || t('orderNotFound'));
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'Pending':
        return <Clock className="h-6 w-6 text-yellow-500" />;
      case 'Confirmed':
        return <CheckCircle className="h-6 w-6 text-blue-500" />;
      case 'Shipped':
        return <Truck className="h-6 w-6 text-purple-500" />;
      case 'Delivered':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'Cancelled':
        return <XCircle className="h-6 w-6 text-red-500" />;
      default:
        return <AlertCircle className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/30';
      case 'Confirmed':
        return 'bg-blue-500/10 text-blue-500 border-blue-500/30';
      case 'Shipped':
        return 'bg-purple-500/10 text-purple-500 border-purple-500/30';
      case 'Delivered':
        return 'bg-green-500/10 text-green-500 border-green-500/30';
      case 'Cancelled':
        return 'bg-red-500/10 text-red-500 border-red-500/30';
      default:
        return 'bg-gray-500/10 text-gray-500 border-gray-500/30';
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString(language === 'ar' ? 'ar-SA' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            {t('orderTracking')}
          </h1>
          <p className="text-gray-400">
            {t('trackOrderSubtitle')}
          </p>
        </div>

        {/* Track Order Form */}
        <Card className="bg-zinc-900 border-zinc-800 mb-8">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="orderId" className="text-white flex items-center gap-2 mb-2">
                    <Package className="h-4 w-4 text-amber-500" />
                    {t('orderId')}
                  </Label>
                  <Input
                    id="orderId"
                    name="orderId"
                    value={formData.orderId}
                    onChange={handleInputChange}
                    placeholder={t('orderIdPlaceholder')}
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500 uppercase"
                  />
                </div>
                <div>
                  <Label htmlFor="phone" className="text-white flex items-center gap-2 mb-2">
                    <MapPin className="h-4 w-4 text-amber-500" />
                    {t('phoneNumber')}
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder={t('phonePlaceholder')}
                    className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
                  />
                </div>
              </div>
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold"
              >
                <Search className="h-4 w-4 mr-2" />
                {loading ? (language === 'ar' ? 'جاري البحث...' : 'Searching...') : t('trackOrder')}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && !orderData && (
          <Card className="bg-red-500/10 border-red-500/30 mb-8">
            <CardContent className="p-6 text-center">
              <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-400">{error}</p>
            </CardContent>
          </Card>
        )}

        {/* Order Details */}
        {orderData && (
          <div className="space-y-6">
            {/* Order Header */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <p className="text-gray-400 text-sm">{t('orderId')}</p>
                    <p className="text-2xl font-bold text-amber-500">{orderData.public_order_id}</p>
                    <p className="text-gray-400 text-sm mt-1">
                      {orderData.customer_name}
                    </p>
                  </div>
                  <div className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${getStatusColor(orderData.status)}`}>
                    {getStatusIcon(orderData.status)}
                    <div>
                      <p className="font-semibold">
                        {language === 'ar' ? orderData.status_ar : orderData.status}
                      </p>
                      <p className="text-xs opacity-70">{t('orderStatus')}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Order Date */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-amber-500" />
                  <div>
                    <p className="text-gray-400 text-sm">{t('orderDate')}</p>
                    <p className="text-white font-medium">{formatDate(orderData.order_date)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ordered Items */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                  <ShoppingBag className="h-5 w-5 text-amber-500" />
                  {t('orderedItems')}
                </h3>
                <div className="space-y-4">
                  {orderData.items.map((item, index) => (
                    <div key={index} className="flex gap-4 pb-4 border-b border-zinc-800 last:border-0 last:pb-0">
                      <div className="w-16 h-16 rounded-md overflow-hidden bg-zinc-800 flex-shrink-0">
                        <img
                          src={getImageUrl(item.image)}
                          alt={language === 'ar' ? item.name_ar : item.name_en}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-white font-medium">
                          {language === 'ar' ? item.name_ar : item.name_en}
                        </h4>
                        <p className="text-gray-400 text-sm">
                          {t('quantity')}: {item.quantity}
                        </p>
                        <p className="text-amber-500 font-semibold">
                          {item.price * item.quantity} {t('sar')}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Order Total */}
            <Card className="bg-zinc-900 border-zinc-800">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex justify-between text-gray-400">
                    <span>{t('subtotal')}</span>
                    <span>{orderData.subtotal.toFixed(2)} {t('sar')}</span>
                  </div>
                  {orderData.discount > 0 && (
                    <div className="flex justify-between text-green-500">
                      <span>{language === 'ar' ? 'الخصم' : 'Discount'}</span>
                      <span>-{orderData.discount.toFixed(2)} {t('sar')}</span>
                    </div>
                  )}
                  <div className="border-t border-zinc-700 pt-3 flex justify-between">
                    <span className="text-xl font-bold text-white">{t('total')}</span>
                    <span className="text-xl font-bold text-amber-500">
                      {orderData.total.toFixed(2)} {t('sar')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Back Button */}
            <div className="flex gap-4">
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="flex-1 border-zinc-700 text-gray-400 hover:text-white hover:bg-zinc-800"
              >
                {t('backToHome')}
              </Button>
              <Button
                onClick={() => navigate('/shop')}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-black font-semibold"
              >
                {t('continueShopping')}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackOrder;
