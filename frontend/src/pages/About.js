import React from 'react';
import { Sparkles, Target, Award, Users } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { useLanguage } from '../context/LanguageContext';

const About = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <Sparkles className="h-8 w-8 text-amber-500" />
            <span className="text-3xl font-bold bg-gradient-to-r from-amber-400 to-amber-600 bg-clip-text text-transparent">
              Zaylux Store
            </span>
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">{t('aboutUs')}</h1>
          <p className="text-lg text-gray-400">
            Your premier destination for luxury perfumes and premium drones in Saudi Arabia
          </p>
        </div>

        <div className="prose prose-invert max-w-none mb-12">
          <Card className="bg-zinc-900 border-zinc-800 mb-8">
            <CardContent className="p-8">
              <p className="text-gray-300 leading-relaxed mb-4">
                Welcome to Zaylux Store, where luxury meets innovation. We are a Saudi-based premium e-commerce
                platform dedicated to bringing you the finest selection of luxury perfumes and cutting-edge drones.
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                Founded with a vision to redefine online shopping in the Kingdom, we curate only the best products
                that embody elegance, quality, and technological excellence. Our commitment is to provide an
                exceptional shopping experience that reflects the sophistication and modern lifestyle of our customers.
              </p>
              <p className="text-gray-300 leading-relaxed">
                At Zaylux, we believe in authentic products, transparent pricing, and customer satisfaction. Every
                item in our collection is carefully selected to meet the highest standards of quality and luxury.
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-amber-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Our Mission</h3>
              <p className="text-sm text-gray-400">
                To deliver luxury and innovation to every doorstep in Saudi Arabia with excellence and authenticity.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-amber-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Our Quality</h3>
              <p className="text-sm text-gray-400">
                100% authentic products sourced from authorized distributors and trusted brands worldwide.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-amber-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">Our Promise</h3>
              <p className="text-sm text-gray-400">
                Customer satisfaction is our priority. Fast delivery, secure payment, and exceptional service.
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/30">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">Why Choose Zaylux?</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-300">Authentic luxury products guaranteed</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-300">Cash on Delivery across KSA</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-300">Fast and secure delivery</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-300">Competitive pricing and exclusive deals</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-300">Bilingual customer support (EN/AR)</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-300">Easy returns and refunds</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
