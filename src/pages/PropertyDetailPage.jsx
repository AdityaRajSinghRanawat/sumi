import { useLocation, useNavigate, useParams } from "react-router-dom";
import { getCustomPropertiesFromLocalStorage, getSeedProperties } from "../localdb";
import { getPropertyFallbackImage } from "../utils/propertyImage";
import { formatSafetyScoreLabel } from "../utils/safetyScore";

const yen = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
  maximumFractionDigits: 0,
});

const metricClass =
  "inline-flex items-center gap-1 rounded-full border border-zinc-700 bg-zinc-900/80 px-2.5 py-1 text-xs font-medium text-zinc-200";

const PropertyDetailPage = () => {
  const { propertyId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();

  const goBack = () => {
    if (state?.exploreStateSnapshot) {
      navigate("/explore", {
        state: { restoreExploreState: state.exploreStateSnapshot },
      });
      return;
    }

    if (window.history.length > 1) {
      navigate(-1);
      return;
    }

    navigate("/explore");
  };

  const fromState = state?.property;
  let cachedProperty = null;

  try {
    cachedProperty = JSON.parse(localStorage.getItem(`sumi.propertyCache.${propertyId}`) || "null");
  } catch {
    cachedProperty = null;
  }

  const fallbackPool = [...getSeedProperties(), ...getCustomPropertiesFromLocalStorage()];
  const fallbackProperty = fallbackPool.find((item) => item.id === propertyId);
  const property = fromState || cachedProperty || fallbackProperty || null;

  if (!property) {
    return (
      <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_10%_10%,#111827_0%,#111111_38%,#000000_100%)] p-6 text-zinc-100">
        <div className="w-full max-w-2xl rounded-2xl border border-zinc-700 bg-zinc-950/90 p-6">
          <h1 className="m-0 text-2xl font-semibold">Property Not Found</h1>
          <p className="mt-2 text-sm text-zinc-400">
            This property is not available in the current local dataset. Please return to Explore and open the property again.
          </p>
          <div className="mt-4 flex gap-2">
            <button
              type="button"
              onClick={goBack}
              className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-100 transition hover:border-zinc-500"
            >
              ← Back
            </button>
          </div>
        </div>
      </main>
    );
  }

  const tags = property.tags?.slice(0, 4) || [];

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_10%_10%,#14171d_0%,#0b0c10_45%,#020202_100%)] px-4 py-4 text-zinc-100 lg:px-6 lg:py-5">
      <div className="mx-auto w-full max-w-6xl rounded-2xl border border-zinc-700/80 bg-zinc-950/90 p-4 shadow-[0_20px_48px_rgba(0,0,0,0.4)] lg:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={goBack}
              className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-1.5 text-xs font-medium text-zinc-100 transition hover:border-zinc-500"
            >
              ← Back
            </button>
          </div>
          <p className="text-xs uppercase tracking-[0.14em] text-zinc-400">Property Profile</p>
        </div>

        <section className="grid gap-3 lg:grid-cols-[58%_42%]">
          <div className="overflow-hidden rounded-xl border border-zinc-700 bg-zinc-900/70">
            <img
              src={property.imageUrl || getPropertyFallbackImage(property)}
              alt={`${property.name} gallery`}
              className="h-[280px] w-full object-cover lg:h-[420px]"
              loading="lazy"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = getPropertyFallbackImage(property);
              }}
            />
          </div>

          <div className="rounded-xl border border-zinc-700 bg-zinc-900/60 p-4">
            <p className="m-0 text-2xl font-semibold text-zinc-50">{yen.format(property.price || 0)}</p>
            <h1 className="mt-2 text-xl leading-tight font-semibold text-zinc-100">{property.name}</h1>
            <p className="mt-1 text-sm text-zinc-400">{property.address}</p>

            <div className="mt-3 flex flex-wrap gap-2">
              <span className={metricClass}>{formatSafetyScoreLabel(property.overallScore || 0)}</span>
              {property.layout ? <span className={metricClass}>{property.layout}</span> : null}
              {property.stationDistance ? <span className={metricClass}>{property.stationDistance} min walk</span> : null}
              {property.earthquakeRisk ? <span className={metricClass}>Risk {property.earthquakeRisk}</span> : null}
              {property.builtYear ? <span className={metricClass}>Built {property.builtYear}</span> : null}
            </div>

            <p className="mt-4 text-sm leading-relaxed text-zinc-300">
              {property.description || "No description available for this property yet."}
            </p>

            {tags.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {tags.map((tag) => (
                  <span key={`${property.id}-${tag}`} className="rounded-full border border-zinc-700 bg-zinc-900/80 px-2 py-0.5 text-xs text-zinc-100">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-5 grid grid-cols-3 gap-2 text-center">
              <div className="rounded-lg border border-zinc-700 bg-zinc-950/70 px-2 py-2">
                <p className="m-0 text-xs text-zinc-400">Schools</p>
                <p className="m-0 text-lg font-semibold text-zinc-100">{property.nearby?.schools || 0}</p>
              </div>
              <div className="rounded-lg border border-zinc-700 bg-zinc-950/70 px-2 py-2">
                <p className="m-0 text-xs text-zinc-400">Universities</p>
                <p className="m-0 text-lg font-semibold text-zinc-100">{property.nearby?.universities || 0}</p>
              </div>
              <div className="rounded-lg border border-zinc-700 bg-zinc-950/70 px-2 py-2">
                <p className="m-0 text-xs text-zinc-400">Hospitals</p>
                <p className="m-0 text-lg font-semibold text-zinc-100">{property.nearby?.hospitals || 0}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default PropertyDetailPage;
