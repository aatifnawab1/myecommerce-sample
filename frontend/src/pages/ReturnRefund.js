import React from 'react';
import { RotateCcw } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { useLanguage } from '../context/LanguageContext';

const ReturnRefund = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500/10 rounded-full mb-4">
            <RotateCcw className="h-8 w-8 text-amber-500" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">{t('returnRefund')}</h1>
          <p className="text-gray-400">Last updated: January 2025</p>
        </div>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-8 prose prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Return Policy</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                At Zaylux Store, customer satisfaction is our priority. We accept returns within 14 days of delivery
                for most products, subject to the conditions outlined below.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Eligible Products</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                The following conditions must be met for returns:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Products must be unused and in original condition</li>
                <li>Original packaging must be intact and undamaged</li>
                <li>All accessories, manuals, and documentation must be included</li>
                <li>Product seals (if any) must be unbroken</li>
                <li>Return request must be initiated within 14 days of delivery</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Non-Returnable Items</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                For hygiene and safety reasons, the following items cannot be returned:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Opened or used perfumes and fragrances</li>
                <li>Products with broken seals or tampered packaging</li>
                <li>Products damaged due to misuse or negligence</li>
                <li>Items purchased during special sales or promotions (unless defective)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Defective Products</h2>
              <p className="text-gray-300 leading-relaxed">
                If you receive a defective or damaged product, please contact us immediately at support@zaylux.sa.
                We will arrange for a replacement or full refund at no additional cost to you. Please provide photos
                of the damaged item and packaging.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Return Process</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                To initiate a return:
              </p>
              <ol className="list-decimal list-inside text-gray-300 space-y-2">
                <li>Contact our customer service at support@zaylux.sa or +966 50 123 4567</li>
                <li>Provide your order number and reason for return</li>
                <li>Wait for return authorization and instructions</li>
                <li>Pack the product securely in its original packaging</li>
                <li>Ship the product to the address provided by our team</li>
              </ol>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Refund Policy</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Once we receive and inspect your returned item:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>If approved, refunds will be processed within 7-10 business days</li>
                <li>Refunds will be issued to the original payment method (if applicable)</li>
                <li>For Cash on Delivery orders, refunds will be processed via bank transfer</li>
                <li>You will receive an email confirmation once the refund is processed</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Exchange Policy</h2>
              <p className="text-gray-300 leading-relaxed">
                We offer exchanges for defective products or incorrect items. If you wish to exchange a product for a
                different model or variant, please follow the return process and place a new order.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Return Shipping</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                Return shipping costs:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Free return shipping for defective or incorrect items</li>
                <li>Customer responsibility for return shipping on change-of-mind returns</li>
                <li>We recommend using a trackable shipping service</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
              <p className="text-gray-300 leading-relaxed">
                For any questions about returns or refunds, please contact our customer service team:
                <br />
                Email: <span className="text-amber-500">support@zaylux.sa</span>
                <br />
                Phone: <span className="text-amber-500">+966 50 123 4567</span>
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReturnRefund;
