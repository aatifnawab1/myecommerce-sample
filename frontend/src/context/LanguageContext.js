import React, { createContext, useContext, useState, useEffect } from 'react';

const LanguageContext = createContext();

export const translations = {
  en: {
    // Header
    home: 'Home',
    shop: 'Shop',
    perfumes: 'Perfumes',
    drones: 'Drones',
    watches: 'Watches',
    about: 'About Us',
    contact: 'Contact',
    cart: 'Cart',
    trackMyOrder: 'Track My Order',
    
    // Hero
    heroTitle: 'Luxury Redefined',
    heroSubtitle: 'Discover premium perfumes and cutting-edge drones',
    shopNow: 'Shop Now',
    premiumQuality: 'Premium Quality Guaranteed',
    watchesSubtitle: 'Discover our collection of premium luxury watches',
    noProductsFound: 'No products found',
    
    // Products
    addToCart: 'Add to Cart',
    outOfStock: 'Out of Stock',
    sar: 'SAR',
    inStock: 'In Stock',
    reviews: 'Reviews',
    featuredProducts: 'Featured Products',
    featuredProductsSubtitle: 'Discover our handpicked selection of premium perfumes and cutting-edge drones',
    viewAllProducts: 'View All Products',
    
    // Trust / Benefits
    cashOnDelivery: 'Cash on Delivery',
    cashOnDeliveryDesc: 'Pay when you receive your order',
    authenticProducts: 'Authentic Products',
    authenticProductsDesc: '100% genuine luxury items',
    fastDelivery: 'Fast Delivery',
    fastDeliveryDesc: 'Express shipping across KSA',
    
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
    whyReason5: 'Bilingual customer support (EN/AR)',
    
    // Coupons Section
    availableOffers: 'Available Offers',
    availableCoupons: 'Available Coupons',
    percentOff: '% OFF',
    minOrder: 'Min. order',
    useCode: 'Use code',
    applyCoupon: 'Apply',
    couponApplied: 'Coupon Applied!',
    noCouponsAvailable: 'No offers available at the moment',
    validUntil: 'Valid until',
    
    // Order Success & Tracking
    orderPlacedSuccess: 'Order Placed Successfully!',
    yourOrderId: 'Your Order ID',
    saveOrderId: 'Please save this Order ID to track your order.',
    trackMyOrder: 'Track My Order',
    backToHome: 'Back to Home',
    orderTracking: 'Order Tracking',
    trackOrderSubtitle: 'Enter your Order ID and phone number to track your order',
    orderId: 'Order ID',
    orderIdPlaceholder: 'e.g., ZAY-100001',
    phonePlaceholder: '+966 50 123 4567',
    trackOrder: 'Track Order',
    orderDetails: 'Order Details',
    orderDate: 'Order Date',
    orderedItems: 'Ordered Items',
    orderStatus: 'Order Status',
    statusPending: 'Pending',
    statusConfirmed: 'Confirmed',
    statusShipped: 'Shipped',
    statusDelivered: 'Delivered',
    statusCancelled: 'Cancelled',
    orderNotFound: 'Order not found. Please check your Order ID and phone number.',
    thankYouOrder: 'Thank you for your order. We will contact you shortly to confirm delivery.'
  },
  ar: {
    // Header
    home: 'الرئيسية',
    shop: 'المتجر',
    perfumes: 'العطور',
    drones: 'الطائرات',
    watches: 'الساعات',
    about: 'من نحن',
    contact: 'اتصل بنا',
    cart: 'السلة',
    trackMyOrder: 'تتبع طلبي',
    
    // Hero
    heroTitle: 'الفخامة بمعناها الجديد',
    heroSubtitle: 'اكتشف أرقى العطور وأحدث الطائرات بدون طيار',
    shopNow: 'تسوق الآن',
    premiumQuality: 'جودة فاخرة مضمونة',
    
    // Products
    addToCart: 'أضف إلى السلة',
    outOfStock: 'غير متوفر',
    sar: 'ريال',
    inStock: 'متوفر',
    reviews: 'تقييم',
    featuredProducts: 'منتجات مميزة',
    featuredProductsSubtitle: 'اكتشف مجموعتنا المختارة من العطور الفاخرة والطائرات المتطورة',
    viewAllProducts: 'عرض جميع المنتجات',
    
    // Trust / Benefits
    cashOnDelivery: 'الدفع عند الاستلام',
    cashOnDeliveryDesc: 'ادفع عند استلام طلبك',
    authenticProducts: 'منتجات أصلية',
    authenticProductsDesc: 'منتجات فاخرة أصلية 100٪',
    fastDelivery: 'توصيل سريع',
    fastDeliveryDesc: 'شحن سريع داخل المملكة',
    
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
    yourMessage: 'رسالتك',
    
    // About Us Content
    aboutTitle: 'وجهتك الأولى للعطور الفاخرة والطائرات المتطورة في المملكة العربية السعودية',
    aboutPara1: 'مرحباً بكم في متجر زايلوكس، حيث تلتقي الفخامة بالابتكار. نحن منصة تجارة إلكترونية فاخرة مقرها المملكة العربية السعودية، مخصصة لتقديم أفضل تشكيلة من العطور الفاخرة والطائرات المتطورة.',
    aboutPara2: 'تأسسنا برؤية لإعادة تعريف التسوق الإلكتروني في المملكة، حيث نقدم فقط أفضل المنتجات التي تجسد الأناقة والجودة والتميز التقني. التزامنا هو تقديم تجربة تسوق استثنائية تعكس الرقي وأسلوب الحياة العصري لعملائنا.',
    aboutPara3: 'في زايلوكس، نؤمن بالمنتجات الأصلية والأسعار الشفافة ورضا العملاء. كل منتج في مجموعتنا يتم اختياره بعناية لتلبية أعلى معايير الجودة والفخامة.',
    ourMission: 'مهمتنا',
    missionText: 'توصيل الفخامة والابتكار إلى كل منزل في المملكة العربية السعودية بتميز وأصالة.',
    ourQuality: 'جودتنا',
    qualityText: 'منتجات أصلية 100% من موزعين معتمدين وعلامات تجارية موثوقة عالمياً.',
    ourPromise: 'وعدنا',
    promiseText: 'رضا العملاء هو أولويتنا. توصيل سريع، دفع آمن، وخدمة استثنائية.',
    whyChoose: 'لماذا تختار زايلوكس؟',
    whyReason1: 'منتجات فاخرة أصلية مضمونة',
    whyReason2: 'الدفع عند الاستلام في جميع أنحاء المملكة',
    whyReason3: 'توصيل سريع وآمن',
    whyReason4: 'أسعار تنافسية وعروض حصرية',
    whyReason5: 'دعم عملاء ثنائي اللغة (عربي/إنجليزي)',
    
    // Coupons Section
    availableOffers: 'العروض المتاحة',
    availableCoupons: 'الكوبونات المتاحة',
    percentOff: '% خصم',
    minOrder: 'الحد الأدنى للطلب',
    useCode: 'استخدم الرمز',
    applyCoupon: 'تطبيق',
    couponApplied: 'تم تطبيق الكوبون!',
    noCouponsAvailable: 'لا توجد عروض متاحة حالياً',
    validUntil: 'صالح حتى',
    
    // Order Success & Tracking
    orderPlacedSuccess: 'تم تقديم الطلب بنجاح!',
    yourOrderId: 'رقم طلبك',
    saveOrderId: 'يرجى حفظ رقم الطلب هذا لتتبع طلبك.',
    trackMyOrder: 'تتبع طلبي',
    backToHome: 'العودة للرئيسية',
    orderTracking: 'تتبع الطلب',
    trackOrderSubtitle: 'أدخل رقم الطلب ورقم الهاتف لتتبع طلبك',
    orderId: 'رقم الطلب',
    orderIdPlaceholder: 'مثال: ZAY-100001',
    phonePlaceholder: '+966 50 123 4567',
    trackOrder: 'تتبع الطلب',
    orderDetails: 'تفاصيل الطلب',
    orderDate: 'تاريخ الطلب',
    orderedItems: 'المنتجات المطلوبة',
    orderStatus: 'حالة الطلب',
    statusPending: 'قيد الانتظار',
    statusConfirmed: 'تم التأكيد',
    statusShipped: 'تم الشحن',
    statusDelivered: 'تم التوصيل',
    statusCancelled: 'ملغي',
    orderNotFound: 'لم يتم العثور على الطلب. يرجى التحقق من رقم الطلب ورقم الهاتف.',
    thankYouOrder: 'شكراً لطلبك. سنتواصل معك قريباً لتأكيد التوصيل.'
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
