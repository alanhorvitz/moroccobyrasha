import { Link } from 'react-router-dom';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Facebook, Twitter, Instagram, Youtube, Linkedin, Mail } from 'lucide-react';

const Footer = () => {
  const { t, isRTL } = useLanguage();

  return (
    <footer className={`bg-slate-900 text-white ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                Visit Morocco
              </span>
            </div>
            <p className="text-slate-300 text-sm">
              {t('home.heroSubtitle')}
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white">
                <Youtube className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white">
                <Linkedin className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('nav.discover')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/discover" className="text-slate-300 hover:text-white transition-colors">
                  {t('nav.discover')}
                </Link>
              </li>
              <li>
                <Link to="/tourism" className="text-slate-300 hover:text-white transition-colors">
                  {t('nav.tourism')}
                </Link>
              </li>
              <li>
                <Link to="/gallery" className="text-slate-300 hover:text-white transition-colors">
                  {t('nav.gallery')}
                </Link>
              </li>
              <li>
                <Link to="/marketplace" className="text-slate-300 hover:text-white transition-colors">
                  {t('nav.marketplace')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('nav.services')}</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/services" className="text-slate-300 hover:text-white transition-colors">
                  {t('services.accommodation')}
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-slate-300 hover:text-white transition-colors">
                  {t('services.transportation')}
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-slate-300 hover:text-white transition-colors">
                  {t('services.guides')}
                </Link>
              </li>
              <li>
                <Link to="/content-hub" className="text-slate-300 hover:text-white transition-colors">
                  {t('nav.contentHub')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">{t('footer.newsletter')}</h3>
            <p className="text-slate-300 text-sm">
              {t('footer.subscribeNewsletter')}
            </p>
            <div className="flex space-x-2">
              <Input
                placeholder={t('footer.enterEmail')}
                className="bg-slate-800 border-slate-700 text-white placeholder:text-slate-400"
              />
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                <Mail className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-slate-800 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 text-sm">
              <Link to="#" className="text-slate-300 hover:text-white transition-colors">
                {t('footer.aboutUs')}
              </Link>
              <Link to="#" className="text-slate-300 hover:text-white transition-colors">
                {t('footer.contactUs')}
              </Link>
              <Link to="#" className="text-slate-300 hover:text-white transition-colors">
                {t('footer.privacyPolicy')}
              </Link>
              <Link to="#" className="text-slate-300 hover:text-white transition-colors">
                {t('footer.termsOfService')}
              </Link>
            </div>
            <div className="text-sm text-slate-300">
              {t('footer.copyRight')}
            </div>
          </div>
          <div className="text-center mt-4 text-sm text-slate-400">
            {t('footer.madeWith')}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;