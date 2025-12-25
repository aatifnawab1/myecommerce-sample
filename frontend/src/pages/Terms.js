import React from 'react';
import { FileText } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { useLanguage } from '../context/LanguageContext';

const Terms = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500/10 rounded-full mb-4">
            <FileText className="h-8 w-8 text-amber-500" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">{t('termsConditions')}</h1>
          <p className="text-gray-400">Last updated: January 2025</p>
        </div>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-8 prose prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Agreement to Terms</h2>
              <p className="text-gray-300 leading-relaxed">
                By accessing and using Zaylux Store, you agree to be bound by these Terms and Conditions. If you
                disagree with any part of these terms, you may not access our website or use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Use of Website</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                You agree to use our website only for lawful purposes and in a way that does not infringe the rights
                of others. You must not:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Use the website in any way that violates applicable laws or regulations</li>
                <li>Transmit any harmful or malicious code</li>
                <li>Attempt to gain unauthorized access to our systems</li>
                <li>Interfere with the proper functioning of the website</li>
                <li>Impersonate any person or entity</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Product Information</h2>
              <p className="text-gray-300 leading-relaxed">
                We strive to provide accurate product descriptions, images, and pricing. However, we do not warrant
                that product descriptions or other content is accurate, complete, or error-free. We reserve the right
                to correct errors and update information at any time without prior notice.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Orders and Payment</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                By placing an order, you confirm that:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>You are legally capable of entering into binding contracts</li>
                <li>All information provided is accurate and complete</li>
                <li>You authorize us to process your order</li>
                <li>You agree to pay the total amount including applicable taxes and delivery fees</li>
              </ul>
              <p className="text-gray-300 leading-relaxed mt-4">
                We accept Cash on Delivery (COD) as our primary payment method. Payment must be made in Saudi Riyals
                (SAR) at the time of delivery.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Pricing</h2>
              <p className="text-gray-300 leading-relaxed">
                All prices are listed in Saudi Riyals (SAR) and include applicable taxes. We reserve the right to
                change prices at any time. Price changes will not affect orders already placed.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Delivery</h2>
              <p className="text-gray-300 leading-relaxed">
                We deliver to addresses within Saudi Arabia. Delivery times are estimates and may vary based on
                location and availability. We are not liable for delays caused by circumstances beyond our control.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Product Authenticity</h2>
              <p className="text-gray-300 leading-relaxed">
                All products sold on Zaylux Store are 100% authentic and sourced from authorized distributors. We
                guarantee the authenticity of all luxury perfumes and drones in our catalog.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Intellectual Property</h2>
              <p className="text-gray-300 leading-relaxed">
                All content on this website, including text, graphics, logos, images, and software, is the property of
                Zaylux Store or its licensors and is protected by copyright and intellectual property laws.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Limitation of Liability</h2>
              <p className="text-gray-300 leading-relaxed">
                To the fullest extent permitted by law, Zaylux Store shall not be liable for any indirect, incidental,
                special, or consequential damages arising from your use of our website or products.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Contact Information</h2>
              <p className="text-gray-300 leading-relaxed">
                For questions about these Terms and Conditions, please contact us at:
                <br />
                <span className="text-amber-500">legal@zaylux.sa</span>
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Terms;
