import React from 'react';
import { Shield } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { useLanguage } from '../context/LanguageContext';

const Privacy = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-500/10 rounded-full mb-4">
            <Shield className="h-8 w-8 text-amber-500" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-4">{t('privacyPolicy')}</h1>
          <p className="text-gray-400">Last updated: January 2025</p>
        </div>

        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-8 prose prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Introduction</h2>
              <p className="text-gray-300 leading-relaxed">
                At Zaylux Store, we are committed to protecting your privacy and personal information. This Privacy
                Policy explains how we collect, use, disclose, and safeguard your information when you visit our
                website and use our services.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Information We Collect</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We collect information that you provide directly to us, including:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Personal identification information (name, email address, phone number)</li>
                <li>Delivery address and location information</li>
                <li>Order history and shopping preferences</li>
                <li>Payment information (processed securely through our payment partners)</li>
                <li>Communication preferences and feedback</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">How We Use Your Information</h2>
              <p className="text-gray-300 leading-relaxed mb-4">
                We use the collected information for the following purposes:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Processing and delivering your orders</li>
                <li>Communicating with you about your orders and account</li>
                <li>Providing customer support and responding to inquiries</li>
                <li>Improving our products, services, and website</li>
                <li>Sending promotional communications (with your consent)</li>
                <li>Detecting and preventing fraud or security issues</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Information Sharing</h2>
              <p className="text-gray-300 leading-relaxed">
                We do not sell, trade, or rent your personal information to third parties. We may share your
                information with:
              </p>
              <ul className="list-disc list-inside text-gray-300 space-y-2 mt-4">
                <li>Delivery partners to fulfill your orders</li>
                <li>Payment processors to handle transactions securely</li>
                <li>Service providers who assist in operating our website</li>
                <li>Law enforcement when required by law</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Data Security</h2>
              <p className="text-gray-300 leading-relaxed">
                We implement appropriate technical and organizational security measures to protect your personal
                information from unauthorized access, alteration, disclosure, or destruction. However, no method of
                transmission over the Internet is 100% secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Your Rights</h2>
              <p className="text-gray-300 leading-relaxed mb-4">You have the right to:</p>
              <ul className="list-disc list-inside text-gray-300 space-y-2">
                <li>Access your personal information</li>
                <li>Correct inaccurate information</li>
                <li>Request deletion of your information</li>
                <li>Opt-out of marketing communications</li>
                <li>Object to processing of your information</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-white mb-4">Cookies</h2>
              <p className="text-gray-300 leading-relaxed">
                We use cookies and similar tracking technologies to enhance your browsing experience, analyze site
                traffic, and personalize content. You can control cookie settings through your browser preferences.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold text-white mb-4">Contact Us</h2>
              <p className="text-gray-300 leading-relaxed">
                If you have any questions about this Privacy Policy or our data practices, please contact us at:
                <br />
                <span className="text-amber-500">privacy@zaylux.sa</span>
              </p>
            </section>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Privacy;
