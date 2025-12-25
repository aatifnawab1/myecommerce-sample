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
            {t('aboutTitle')}
          </p>
        </div>

        <div className="prose prose-invert max-w-none mb-12">
          <Card className="bg-zinc-900 border-zinc-800 mb-8">
            <CardContent className="p-8">
              <p className="text-gray-300 leading-relaxed mb-4">
                {t('aboutPara1')}
              </p>
              <p className="text-gray-300 leading-relaxed mb-4">
                {t('aboutPara2')}
              </p>
              <p className="text-gray-300 leading-relaxed">
                {t('aboutPara3')}
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
              <h3 className="text-lg font-bold text-white mb-2">{t('ourMission')}</h3>
              <p className="text-sm text-gray-400">
                {t('missionText')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-amber-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t('ourQuality')}</h3>
              <p className="text-sm text-gray-400">
                {t('qualityText')}
              </p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800">
            <CardContent className="p-6 text-center">
              <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-amber-500" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">{t('ourPromise')}</h3>
              <p className="text-sm text-gray-400">
                {t('promiseText')}
              </p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-br from-amber-500/10 to-amber-600/5 border-amber-500/30">
          <CardContent className="p-8 text-center">
            <h3 className="text-2xl font-bold text-white mb-4">{t('whyChoose')}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-300">{t('whyReason1')}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-300">{t('whyReason2')}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-300">{t('whyReason3')}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-300">{t('whyReason4')}</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full mt-2 flex-shrink-0" />
                <p className="text-gray-300">{t('whyReason5')}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default About;
