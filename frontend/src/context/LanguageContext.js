import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    // Header
    home: 'Home',
    shop: 'Shop',
    perfumes: 'Perfumes',
    drones: 'Drones',
    about: 'About Us',
    contact: 'Contact',
    cart: 'Cart',
    
    // Hero
    heroTitle: 'Luxury Redefined',
    heroSubtitle: 'Discover premium perfumes and cutting-edge drones',
    shopNow: 'Shop Now',
    
    // Products
    addToCart: 'Add to Cart',
    outOfStock: 'Out of Stock',
    sar: 'SAR',
    inStock: 'In Stock',
    reviews: 'Reviews',
    
    // Cart
    yourCart: 'Your Cart',
    emptyCart: 'Your cart is empty',
    continueShopping: 'Continue Shopping',
    quantity: 'Quantity',
    remove: 'Remove',
    subtotal: 'Subtotal',
    proceedToCheckout: 'Proceed to Checkout',
    viewCart: 'View Cart',
    itemsInCart: 'items in cart',
    
    // Checkout
    checkout: 'Checkout',
    deliveryInformation: 'Delivery Information',
    fullName: 'Full Name',
    phoneNumber: 'Phone Number',
    city: 'City',
    deliveryAddress: 'Full Delivery Address',
    orderSummary: 'Order Summary',
    total: 'Total',
    placeOrder: 'Place Order (Cash on Delivery)',
    
    // Search & Filter
    searchProducts: 'Search products...',
    filterByPrice: 'Filter by Price',
    allPrices: 'All Prices',
    under500: 'Under 500 SAR',
    under1000: '500 - 1000 SAR',
    under3000: '1000 - 3000 SAR',
    over3000: 'Over 3000 SAR',
    sortBy: 'Sort By',
    featured: 'Featured',
    priceLowHigh: 'Price: Low to High',
    priceHighLow: 'Price: High to Low',
    
    // Footer
    quickLinks: 'Quick Links',
    customerService: 'Customer Service',
    privacyPolicy: 'Privacy Policy',
    termsConditions: 'Terms & Conditions',
    returnRefund: 'Return & Refund Policy',
    allRightsReserved: 'All rights reserved',
    
    // Product Detail
    productDetails: 'Product Details',
    specifications: 'Specifications',
    
    // Static Pages
    aboutUs: 'About Us',
    contactUs: 'Contact Us',
    getInTouch: 'Get in Touch',
    email: 'Email',
    phone: 'Phone',
    address: 'Address',
    sendMessage: 'Send Message',
    yourMessage: 'Your Message',
    
    // About Us Content
    aboutTitle: 'Your premier destination for luxury perfumes and premium drones in Saudi Arabia',
    aboutPara1: 'Welcome to Zaylux Store, where luxury meets innovation. We are a Saudi-based premium e-commerce platform dedicated to bringing you the finest selection of luxury perfumes and cutting-edge drones.',
    aboutPara2: 'Founded with a vision to redefine online shopping in the Kingdom, we curate only the best products that embody elegance, quality, and technological excellence. Our commitment is to provide an exceptional shopping experience that reflects the sophistication and modern lifestyle of our customers.',
    aboutPara3: 'At Zaylux, we believe in authentic products, transparent pricing, and customer satisfaction. Every item in our collection is carefully selected to meet the highest standards of quality and luxury.',
    ourMission: 'Our Mission',
    missionText: 'To deliver luxury and innovation to every doorstep in Saudi Arabia with excellence and authenticity.',
    ourQuality: 'Our Quality',
    qualityText: '100% authentic products sourced from authorized distributors and trusted brands worldwide.',
    ourPromise: 'Our Promise',
    promiseText: 'Customer satisfaction is our priority. Fast delivery, secure payment, and exceptional service.',
    whyChoose: 'Why Choose Zaylux?',
    whyReason1: 'Authentic luxury products guaranteed',
    whyReason2: 'Cash on Delivery across KSA',
    whyReason3: 'Fast and secure delivery',
    whyReason4: 'Competitive pricing and exclusive deals',
    whyReason5: 'Bilingual customer support (EN/AR)'
  },
  ar: {
    // Header
    home: 'الرئيسية',
    shop: 'المتجر',
    perfumes: 'العطور',
    drones: 'الطائرات',
    about: 'من نحن',
    contact: 'اتصل بنا',
    cart: 'السلة',
    
    // Hero
    heroTitle: 'الفخامة بأسلوب جديد',
    heroSubtitle: 'اكتشف العطور الفاخرة والطائرات المتطورة',
    shopNow: 'تسوق الآن',
    
    // Products
    addToCart: 'أضف إلى السلة',
    outOfStock: 'غير متوفر',
    sar: 'ريال',
    inStock: 'متوفر',
    reviews: 'تقييم',
    
    // Cart
    yourCart: 'سلة التسوق',
    emptyCart: 'سلة التسوق فارغة',
    continueShopping: 'متابعة التسوق',
    quantity: 'الكمية',
    remove: 'إزالة',
    subtotal: 'المجموع الفرعي',
    proceedToCheckout: 'إتمام الطلب',
    viewCart: 'عرض السلة',
    itemsInCart: 'منتجات في السلة',
    
    // Checkout
    checkout: 'إتمام الطلب',
    deliveryInformation: 'معلومات التوصيل',
    fullName: 'الاسم الكامل',
    phoneNumber: 'رقم الهاتف',
    city: 'المدينة',
    deliveryAddress: 'عنوان التوصيل الكامل',
    orderSummary: 'ملخص الطلب',
    total: 'المجموع',
    placeOrder: 'تأكيد الطلب (الدفع عند الاستلام)',
    
    // Search & Filter
    searchProducts: 'البحث عن المنتجات...',
    filterByPrice: 'تصفية حسب السعر',
    allPrices: 'جميع الأسعار',
    under500: 'أقل من 500 ريال',
    under1000: '500 - 1000 ريال',
    under3000: '1000 - 3000 ريال',
    over3000: 'أكثر من 3000 ريال',
    sortBy: 'ترتيب حسب',
    featured: 'مميز',
    priceLowHigh: 'السعر: من الأقل للأعلى',
    priceHighLow: 'السعر: من الأعلى للأقل',
    
    // Footer
    quickLinks: 'روابط سريعة',
    customerService: 'خدمة العملاء',
    privacyPolicy: 'سياسة الخصوصية',
    termsConditions: 'الشروط والأحكام',
    returnRefund: 'سياسة الإرجاع والاسترداد',
    allRightsReserved: 'جميع الحقوق محفوظة',
    
    // Product Detail
    productDetails: 'تفاصيل المنتج',
    specifications: 'المواصفات',
    
    // Static Pages
    aboutUs: 'من نحن',
    contactUs: 'اتصل بنا',
    getInTouch: 'تواصل معنا',
    email: 'البريد الإلكتروني',
    phone: 'الهاتف',
    address: 'العنوان',
    sendMessage: 'إرسال رسالة',
    yourMessage: 'رسالتك'
  }
};

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState('en');

  useEffect(() => {
    const savedLanguage = localStorage.getItem('zaylux-language');
    if (savedLanguage) {
      setLanguage(savedLanguage);
      document.documentElement.dir = savedLanguage === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = savedLanguage;
    }
  }, []);

  const toggleLanguage = () => {
    const newLanguage = language === 'en' ? 'ar' : 'en';
    setLanguage(newLanguage);
    localStorage.setItem('zaylux-language', newLanguage);
    document.documentElement.dir = newLanguage === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLanguage;
  };

  const t = (key) => translations[language][key] || key;

  return (
    <LanguageContext.Provider value={{ language, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
};
