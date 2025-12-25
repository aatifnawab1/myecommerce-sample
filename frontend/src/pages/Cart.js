import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { useLanguage } from '../context/LanguageContext';
import { useCart } from '../context/CartContext';

const Cart = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const { cartItems, updateQuantity, removeFromCart, getCartTotal } = useCart();

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center px-4">
        <div className="text-center">
          <ShoppingBag className="h-20 w-20 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">{t('emptyCart')}</h2>
          <p className="text-gray-400 mb-6">Start adding products to your cart</p>
          <Button
            onClick={() => navigate('/shop')}
            className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
          >
            {t('continueShopping')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-8 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-white mb-8">
          {t('yourCart')} <span className="text-amber-500">({cartItems.length})</span>
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map((item) => (
              <Card key={item.id} className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-4">
                  <div className="flex gap-4">
                    {/* Image */}
                    <div className="w-24 h-24 rounded-md overflow-hidden bg-zinc-800 flex-shrink-0">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Details */}
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white mb-1">{item.name}</h3>
                      <p className="text-sm text-gray-400 mb-2 line-clamp-1">{item.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-bold text-amber-500">
                          {item.price} {t('sar')}
                        </span>
                        {item.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            {item.originalPrice}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity Controls */}
                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>

                      <div className="flex items-center border border-zinc-700 rounded-md">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="px-3 py-1 text-white hover:bg-zinc-800 transition-colors"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="px-4 py-1 text-white font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="px-3 py-1 text-white hover:bg-zinc-800 transition-colors"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card className="bg-zinc-900 border-zinc-800 sticky top-24">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-white mb-6">Order Summary</h3>

                <div className="space-y-3 mb-6">
                  {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-gray-400">
                        {item.name} x {item.quantity}
                      </span>
                      <span className="text-white">{item.price * item.quantity} {t('sar')}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-zinc-700 pt-4 mb-6">
                  <div className="flex justify-between text-lg font-bold">
                    <span className="text-white">{t('total')}</span>
                    <span className="text-amber-500">{getCartTotal()} {t('sar')}</span>
                  </div>
                </div>

                <Button
                  onClick={() => navigate('/checkout')}
                  className="w-full bg-amber-500 hover:bg-amber-600 text-black font-bold py-6 text-lg transition-all hover:scale-[1.02]"
                >
                  {t('proceedToCheckout')}
                </Button>

                <Button
                  onClick={() => navigate('/shop')}
                  variant="outline"
                  className="w-full mt-3 border-zinc-700 text-gray-400 hover:text-white hover:bg-zinc-800"
                >
                  {t('continueShopping')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
