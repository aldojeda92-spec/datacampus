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

  const isImageBanner = !!banner.imageUrl && (banner.isPureImage || banner.dimensions === "1200x400");

  return (
    <div className={`relative w-full max-w-7xl mx-auto ${className}`}>
      
      {/* Transparencia Comercial Obligatoria (Brandbook V4.1 Sección 9.1) */}
      <div className="absolute top-3 right-3 z-30 pointer-events-none">
        <span className="px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-black/70 text-white backdrop-blur-md border border-white/20 font-display">
          Publicidad
        </span>
      </div>

      {isImageBanner && banner.imageUrl ? (
        <LinkWrapper className="block group relative overflow-hidden rounded-xl shadow-soft hover:shadow-card transition-all duration-300 border border-[#D6E2EF]">
          <div className="relative w-full aspect-[3/1] max-h-[400px] overflow-hidden bg-[#0A1F33]">
            <img
              src={banner.imageUrl}
              alt={banner.title || "Anuncio institucional"}
              className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500"
            />
            
            {banner.title && (
              <div className="absolute inset-0 bg-gradient-to-r from-[#0A1F33]/90 via-[#0A1F33]/60 to-transparent p-6 sm:p-10 flex flex-col justify-end text-white">
                {banner.tag && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-white/20 backdrop-blur-md border border-white/20 text-white w-fit mb-2 font-display">
                    <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                    {banner.tag}
                  </span>
                )}
                <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight max-w-xl font-display">
                  {banner.title}
                </h3>
                {banner.subtitle && (
                  <p className="text-xs sm:text-sm text-slate-200 mt-1 max-w-lg line-clamp-2">
                    {banner.subtitle}
                  </p>
                )}
                <div className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white text-[#0A1F33] font-extrabold text-xs uppercase tracking-wider w-fit shadow-sm group-hover:bg-[#F2F6FB] transition-colors font-display">
                  <span>{banner.buttonText || "Conocer Más"}</span>
                  {isExternal ? <ExternalLink className="w-3.5 h-3.5" /> : <ArrowRight className="w-3.5 h-3.5" />}
                </div>
              </div>
            )}
          </div>
        </LinkWrapper>
      ) : (
        <div className={`relative overflow-hidden rounded-xl shadow-soft border border-[#D6E2EF] bg-gradient-to-r from-[#008F7A] via-[#087360] to-[#0A1F33] text-white p-6 sm:p-8`}>
          <div className="relative z-10 max-w-xl space-y-3">
            {banner.tag && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-white/20 text-white backdrop-blur-sm border border-white/20 font-display">
                <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                {banner.tag}
              </span>
            )}

            <h3 className="text-xl sm:text-2xl lg:text-3xl font-extrabold tracking-tight text-white leading-tight font-display">
              {banner.title}
            </h3>

            {banner.subtitle && (
              <p className="text-sm sm:text-base text-white/90 leading-relaxed font-normal">
                {banner.subtitle}
              </p>
            )}

            {banner.linkUrl && (
              <div className="pt-2">
                <LinkWrapper className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white text-[#0A1F33] hover:bg-[#F2F6FB] font-bold text-sm shadow-sm transition-all active:scale-95 font-display">
                  <span>{banner.buttonText || "Conocer más"}</span>
                  {isExternal ? <ExternalLink className="w-4 h-4 text-[#008F7A]" /> : <ArrowRight className="w-4 h-4 text-[#008F7A]" />}
                </LinkWrapper>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
