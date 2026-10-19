import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, ExternalLink } from 'lucide-react';
import { getBanners } from '../../services/dataService';

export const isBannerActive = (banner) => {
  if (!banner || banner.active === false) return false;
  const today = new Date().toISOString().slice(0, 10);
  if (banner.fechaInicio && banner.fechaInicio > today) return false;
  if (banner.fechaFin && banner.fechaFin < today) return false;
  return true;
};

export default function BannerItem({ position, bannerData, className = "" }) {
  const [banner, setBanner] = useState(bannerData || null);

  useEffect(() => {
    if (bannerData) {
      if (isBannerActive(bannerData)) {
        setBanner(bannerData);
      } else {
        setBanner(null);
      }
      return;
    }

    const load = async () => {
      const allBanners = await getBanners();
      const match = allBanners.find(b => 
        isBannerActive(b) && (b.position === position || !position)
      );
      setBanner(match || null);
    };
    load();
  }, [position, bannerData]);

  if (!banner) return null;

  const isExternal = banner.linkUrl && (banner.linkUrl.startsWith('http://') || banner.linkUrl.startsWith('https://'));
  const LinkWrapper = ({ children, className }) => {
    if (!banner.linkUrl) return <div className={className}>{children}</div>;
    if (isExternal) {
      return (
        <a 
          href={banner.linkUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className={className}
        >
          {children}
        </a>
      );
    }
    return (
      <Link to={banner.linkUrl} className={className}>
        {children}
      </Link>
    );
  };

  // If banner has 1200x400 image and is set as image banner
  const isImageBanner = !!banner.imageUrl && (banner.isPureImage || banner.dimensions === "1200x400");

  return (
    <div className={`relative w-full max-w-7xl mx-auto ${className}`}>
      {isImageBanner && banner.imageUrl ? (
        <LinkWrapper className="block group relative overflow-hidden rounded-3xl shadow-card hover:shadow-floating transition-all duration-300 border border-slate-200/80">
          <div className="relative w-full aspect-[3/1] max-h-[400px] overflow-hidden bg-slate-900">
            <img
              src={banner.imageUrl}
              alt={banner.title || "Anuncio universitario"}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
            />
            
            {/* Visual gradient overlay for readability if title exists */}
            {banner.title && (
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-900/50 to-transparent p-6 sm:p-10 flex flex-col justify-end text-white">
                {banner.tag && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-white/20 backdrop-blur-md border border-white/20 text-white w-fit mb-2">
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                    {banner.tag}
                  </span>
                )}
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight max-w-xl">
                  {banner.title}
                </h3>
                {banner.subtitle && (
                  <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-lg line-clamp-2">
                    {banner.subtitle}
                  </p>
                )}
                <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-slate-900 font-extrabold text-xs uppercase tracking-wider w-fit shadow-md group-hover:bg-campus-50 transition-colors">
                  <span>{banner.buttonText || "Ver Promoción"}</span>
                  {isExternal ? <ExternalLink className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </div>
              </div>
            )}
          </div>
        </LinkWrapper>
      ) : (
        <div className={`relative overflow-hidden rounded-3xl shadow-card border border-slate-200/60 bg-gradient-to-r ${banner.backgroundColor || 'from-campus-700 via-campus-600 to-indigo-800'} text-white p-6 sm:p-8`}>
          <div className="relative z-10 max-w-xl space-y-3">
            {banner.tag && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold tracking-wider uppercase bg-white/20 text-white backdrop-blur-sm border border-white/20">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                {banner.tag}
              </span>
            )}

            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight">
              {banner.title}
            </h3>

            {banner.subtitle && (
              <p className="text-sm sm:text-base text-white/90 leading-relaxed font-normal">
                {banner.subtitle}
              </p>
            )}

            {banner.linkUrl && (
              <div className="pt-2">
                <LinkWrapper className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-900 hover:bg-slate-100 font-bold text-sm shadow-md transition-all active:scale-95">
                  <span>{banner.buttonText || "Conoce más"}</span>
                  {isExternal ? <ExternalLink className="w-4 h-4 text-campus-600" /> : <ArrowRight className="w-4 h-4 text-campus-600" />}
                </LinkWrapper>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
