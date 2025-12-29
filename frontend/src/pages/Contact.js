import React, { useState } from 'react';
import { Mail, Send, CheckCircle } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';
import { useLanguage } from '../context/LanguageContext';
import publicAPI from '../services/publicAPI';
import { toast } from 'sonner';

const Contact = () => {
  const { t, language } = useLanguage();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await publicAPI.submitContactQuery(formData);
      toast.success(language === 'ar' 
        ? 'تم إرسال رسالتك بنجاح! سنرد عليك قريباً.' 
        : 'Message sent successfully! We\'ll get back to you soon.');
      setSubmitted(true);
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (error) {
      toast.error(language === 'ar' 
        ? 'فشل في إرسال الرسالة. حاول مرة أخرى.' 
        : 'Failed to send message. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-black py-12 px-4 flex items-center justify-center">
        <Card className="bg-zinc-900 border-zinc-800 max-w-md w-full">
          <CardContent className="p-8 text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">
              {language === 'ar' ? 'شكراً لتواصلك!' : 'Thank You!'}
            </h2>
            <p className="text-gray-400 mb-6">
              {language === 'ar' 
                ? 'تم إرسال رسالتك بنجاح. سنرد عليك في أقرب وقت ممكن.' 
                : 'Your message has been sent successfully. We will get back to you as soon as possible.'}
            </p>
            <Button 
              onClick={() => setSubmitted(false)}
              className="bg-amber-500 hover:bg-amber-600 text-black font-semibold"
            >
              {language === 'ar' ? 'إرسال رسالة أخرى' : 'Send Another Message'}
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black py-12 px-4">
      <div className="container mx-auto max-w-2xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-4">{t('contactUs')}</h1>
          <p className="text-lg text-gray-400">
            {language === 'ar' 
              ? 'لديك سؤال؟ أرسل لنا رسالة وسنرد عليك قريباً.' 
              : 'Have a question? Send us a message and we\'ll get back to you soon.'}
          </p>
        </div>

        {/* Email Info */}
        <Card className="bg-zinc-900 border-zinc-800 mb-8">
          <CardContent className="p-6">
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Mail className="h-6 w-6 text-amber-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">{t('email')}</h3>
                <a href="mailto:support@zaylux.com" className="text-amber-500 hover:text-amber-400 text-lg">
                  support@zaylux.com
                </a>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact Form */}
        <Card className="bg-zinc-900 border-zinc-800">
          <CardContent className="p-6">
            <h2 className="text-2xl font-bold text-white mb-6 text-center">
              {language === 'ar' ? 'أرسل لنا رسالة' : 'Send us a Message'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="name" className="text-white mb-2">
                  {t('fullName')} *
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder={language === 'ar' ? 'اسمك الكامل' : 'Your full name'}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
                  required
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>

              <div>
                <Label htmlFor="email" className="text-white mb-2">
                  {t('email')} *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder={language === 'ar' ? 'بريدك الإلكتروني' : 'your.email@example.com'}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
                  required
                />
              </div>

              <div>
                <Label htmlFor="subject" className="text-white mb-2">
                  {language === 'ar' ? 'الموضوع' : 'Subject'} *
                </Label>
                <Input
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder={language === 'ar' ? 'موضوع رسالتك' : 'What is this about?'}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
                  required
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>

              <div>
                <Label htmlFor="message" className="text-white mb-2">
                  {language === 'ar' ? 'رسالتك' : 'Your Message'} *
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder={language === 'ar' ? 'اكتب رسالتك هنا...' : 'Write your message here...'}
                  rows={6}
                  className="bg-zinc-800 border-zinc-700 text-white placeholder:text-gray-500"
                  required
                  dir={language === 'ar' ? 'rtl' : 'ltr'}
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-amber-500 hover:bg-amber-600 text-black font-semibold py-6"
              >
                {loading ? (
                  <span className="animate-pulse">
                    {language === 'ar' ? 'جاري الإرسال...' : 'Sending...'}
                  </span>
                ) : (
                  <>
                    <Send className={`h-4 w-4 ${language === 'ar' ? 'ml-2' : 'mr-2'}`} />
                    {language === 'ar' ? 'إرسال الرسالة' : 'Send Message'}
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Contact;
