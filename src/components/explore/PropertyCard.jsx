import { getPropertyFallbackImage } from "../../utils/propertyImage";
import { formatSafetyScoreLabel } from "../../utils/safetyScore";

const yen = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
  maximumFractionDigits: 0,
});

const PropertyCard = ({ property, exploreStateSnapshot, isActive, onHover }) => {
  const tags = property.tags?.slice(0, 2) || [];

  const openProperty = () => {
    try {
      localStorage.setItem(`sumi.propertyCache.${property.id}`, JSON.stringify(property));
    } catch {
      // Ignore storage quota/private mode issues and still attempt navigation.
    }

    window.open(`/property/${property.id}`, "_blank", "noopener,noreferrer");
  };

  return (
    <article
      className={`group overflow-hidden rounded-2xl border bg-zinc-950/95 transition duration-200 ${
        isActive
          ? "border-sky-300/90 shadow-[0_0_0_1px_rgba(125,211,252,0.45),0_14px_24px_rgba(8,47,73,0.32)] -translate-y-0.5"
          : "border-zinc-700/85 shadow-[0_8px_20px_rgba(0,0,0,0.22)] hover:border-zinc-500 hover:-translate-y-0.5"
      }`}
      onMouseEnter={() => onHover(property.id)}
      onMouseLeave={() => onHover(null)}
      onClick={openProperty}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openProperty();
        }
      }}
    >
      <div className="flex gap-3 p-2.5">
        <div className="relative w-24 shrink-0 overflow-hidden rounded-xl border border-zinc-700/70 bg-zinc-900 sm:w-28">
          <img
            src={property.imageUrl}
            alt={`${property.name} area preview`}
            className="h-full min-h-24 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            loading="lazy"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = getPropertyFallbackImage(property);
            }}
          />
          <div className="absolute inset-0 bg-linear-to-t from-black/68 via-black/8 to-transparent" />
          <div className="absolute left-2 top-2 rounded-full border border-white/25 bg-black/55 px-2 py-0.5 text-[10px] font-semibold tracking-[0.08em] text-zinc-50 backdrop-blur">
            {property.layout}
          </div>
          <div className="absolute right-2 bottom-2 rounded-full border border-white/20 bg-black/55 px-1.5 py-0.5 text-[10px] font-semibold text-zinc-100 backdrop-blur">
            {property.stationDistance}m
          </div>
        </div>

        <div className="min-w-0 flex-1 py-0.5 pr-1">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <p className="m-0 text-[1.05rem] leading-[1.02] font-semibold tracking-tight text-zinc-50">{yen.format(property.price)}</p>
              <p className="mt-1 line-clamp-2 text-[13px] leading-[1.12] font-semibold text-zinc-100">{property.name}</p>
              <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.08em] text-zinc-400">
                {formatSafetyScoreLabel(property.overallScore)}
              </p>
            </div>

            <span className="inline-flex shrink-0 items-center rounded-full border border-sky-300/55 bg-sky-950/45 px-2.5 py-1 text-xs font-bold text-sky-100">
              {property.overallScore}
            </span>
          </div>

          <p className="mt-1.5 line-clamp-1 text-[11px] leading-[1.08] text-zinc-400">{property.address}</p>

          <div className="mt-2 flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-900/85 px-2 py-0.5 text-[10px] font-medium text-zinc-200">
              <svg className="h-3 w-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3 7.5L12 3L21 7.5V18L12 21L3 18V7.5Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
                <path d="M3 7.5L12 12L21 7.5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
              </svg>
              {property.layout}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-900/85 px-2 py-0.5 text-[10px] font-medium text-zinc-200">
              <svg className="h-3 w-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                <path d="M12 7V12L15.5 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              {property.stationDistance}m walk
            </span>
            <span className="inline-flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-900/85 px-2 py-0.5 text-[10px] font-medium text-zinc-200">
              <svg className="h-3 w-3 flex-shrink-0" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M13 2L5 14H11L9 22L19 9H13L13 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Risk {property.earthquakeRisk}
            </span>
          </div>

          {tags.length > 0 && (
            <div className="mt-1.5 flex flex-wrap gap-1">
              {tags.map((tag) => (
                <span
                  key={`${property.id}-${tag}`}
                  className="rounded-full border border-zinc-700 bg-zinc-800/80 px-2 py-0.5 text-[10px] text-zinc-100"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </article>
  );
};

export default PropertyCard;
