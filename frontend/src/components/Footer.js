import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const Footer = () => {
  const { t } = useLanguage();

  return (
    <footer className="bg-black border-t border-amber-500/20 mt-20">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-6 w-6 text-amber-500" />
              <span className="text-xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
                Zaylux Store
              </span>
            </div>
            <p className="text-sm text-gray-400 mb-4">
              Your destination for luxury perfumes and premium drones in Saudi Arabia.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('quickLinks')}</h3>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-gray-400 hover:text-amber-500 transition-colors">
                {t('home')}
              </Link>
              <Link to="/shop" className="text-sm text-gray-400 hover:text-amber-500 transition-colors">
                {t('shop')}
              </Link>
              <Link to="/perfumes" className="text-sm text-gray-400 hover:text-amber-500 transition-colors">
                {t('perfumes')}
              </Link>
              <Link to="/drones" className="text-sm text-gray-400 hover:text-amber-500 transition-colors">
                {t('drones')}
              </Link>
              <Link to="/watches" className="text-sm text-gray-400 hover:text-amber-500 transition-colors">
                {t('watches')}
              </Link>
              <Link to="/about" className="text-sm text-gray-400 hover:text-amber-500 transition-colors">
                {t('about')}
              </Link>
            </div>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('customerService')}</h3>
            <div className="flex flex-col gap-2">
              <Link to="/track-order" className="text-sm text-gray-400 hover:text-amber-500 transition-colors">
                {t('trackMyOrder')}
              </Link>
              <Link to="/contact" className="text-sm text-gray-400 hover:text-amber-500 transition-colors">
                {t('contact')}
              </Link>
              <Link to="/privacy" className="text-sm text-gray-400 hover:text-amber-500 transition-colors">
                {t('privacyPolicy')}
              </Link>
              <Link to="/terms" className="text-sm text-gray-400 hover:text-amber-500 transition-colors">
                {t('termsConditions')}
              </Link>
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-semibold mb-4">{t('contactUs')}</h3>
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2">
                <Mail className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-400">info@zaylux.sa</span>
              </div>
              <div className="flex items-start gap-2">
                <Phone className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-400">+966 50 123 4567</span>
              </div>
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-amber-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-400">Riyadh, Saudi Arabia</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-amber-500/20 text-center">
          <p className="text-sm text-gray-400">
            &copy; 2025 Zaylux Store. {t('allRightsReserved')}.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
