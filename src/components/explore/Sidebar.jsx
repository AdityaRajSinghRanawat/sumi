import { useEffect, useState } from "react";
import PropertyCard from "./PropertyCard";

const CustomDualSlider = ({ min, max, step, values, onChange }) => {
  const handleMinChange = (e) => {
    const newMin = Math.min(Number(e.target.value), values[1] - step);
    onChange([newMin, values[1]]);
  };

  const handleMaxChange = (e) => {
    const newMax = Math.max(Number(e.target.value), values[0] + step);
    onChange([values[0], newMax]);
  };

  const minPercent = ((values[0] - min) / (max - min)) * 100;
  const maxPercent = ((values[1] - min) / (max - min)) * 100;

  const isOverlap = values[1] - values[0] <= step;

  return (
    <div className="relative h-5 flex items-center">
      <div className="relative w-full h-1 rounded-full bg-zinc-700">
        <div
          className="absolute h-full rounded-full bg-zinc-300"
          style={{
            left: `${minPercent}%`,
            right: `${100 - maxPercent}%`,
          }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={values[0]}
        onChange={handleMinChange}
        className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-zinc-700 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:cursor-grab [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-zinc-700 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:box-border [&::-moz-range-thumb]:cursor-grab"
        style={{ zIndex: isOverlap ? 7 : 5 }}
      />
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={values[1]}
        onChange={handleMaxChange}
        className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-zinc-700 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:cursor-grab [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-zinc-700 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:box-border [&::-moz-range-thumb]:cursor-grab"
        style={{ zIndex: 6 }}
      />
    </div>
  );
};

const CustomSingleSlider = ({ min, max, step, value, onChange }) => {
  const percent = ((value - min) / (max - min)) * 100;

  return (
    <div className="relative h-5 flex items-center">
      <div className="relative w-full h-1 rounded-full bg-zinc-700">
        <div
          className="absolute h-full rounded-full bg-zinc-300"
          style={{ width: `${percent}%` }}
        />
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="absolute w-full appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-3.5 [&::-webkit-slider-thumb]:w-3.5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:border [&::-webkit-slider-thumb]:border-zinc-700 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-sm [&::-webkit-slider-thumb]:cursor-grab [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:h-3.5 [&::-moz-range-thumb]:w-3.5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border [&::-moz-range-thumb]:border-zinc-700 [&::-moz-range-thumb]:bg-white [&::-moz-range-thumb]:box-border [&::-moz-range-thumb]:cursor-grab"
      />
    </div>
  );
};

const Sidebar = ({
  currentStep,
  selectedRegion,
  selectedPrefecture,
  properties,
  selectedProperty,
  onHoverProperty,
  filters,
  priceBounds,
  onFilterChange,
  sortBy,
  onSortChange,
  onBackToRegionSelection,
}) => {
  const [activeControl, setActiveControl] = useState(null);

  useEffect(() => {
    if (currentStep === 3) {
      setActiveControl(null);
    }
  }, [currentStep]);

  return (
    <aside className="flex min-h-0 flex-col rounded-2xl border border-zinc-700/80 bg-linear-to-br from-zinc-900/95 via-zinc-900/90 to-zinc-950/95 p-4 shadow-[0_16px_40px_rgba(0,0,0,0.35)] backdrop-blur">
      {currentStep !== 3 && (
        <div className="mb-4 border-b border-zinc-700/60 pb-3">
          <h2 className="mb-2 text-lg font-semibold">Region</h2>
          <p className="m-0 text-sm text-zinc-400">
            {selectedRegion ? selectedRegion.name : "Choose a region from the map to begin"}
          </p>
        </div>
      )}

      {currentStep === 2 && (
        <div className="space-y-3">
          <button
            className="inline-flex w-full items-center gap-2 rounded-xl border border-zinc-600 bg-zinc-900 px-4 py-2.5 font-semibold text-zinc-200 transition hover:border-zinc-400"
            onClick={onBackToRegionSelection}
            type="button"
          >
            <span aria-hidden="true">←</span>
            Back to Region Selection
          </button>

          <div className="rounded-xl border border-zinc-700/70 bg-zinc-900/60 px-3 py-3 text-sm text-zinc-300">
            <p className="m-0 font-semibold text-zinc-100">Selection Status</p>
            <p className="mt-2 mb-1">Region: {selectedRegion?.name || "Not selected"}</p>
            <p className="m-0">Prefecture: {selectedPrefecture?.name || "Not selected"}</p>
          </div>
        </div>
      )}

      {currentStep === 3 && (
        <div className="flex min-h-0 flex-1 flex-col gap-3">
          <button
            className="inline-flex w-full items-center gap-2 rounded-xl border border-zinc-600 bg-zinc-900 px-4 py-2.5 font-semibold text-zinc-200 transition hover:border-zinc-400"
            onClick={onBackToRegionSelection}
            type="button"
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M15 18L9 12L15 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            Back to Region Selection
          </button>

          <div className="flex items-center justify-start gap-2">
            <button
              type="button"
              className={`inline-flex w-auto items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                activeControl === "filter"
                  ? "border-zinc-900 bg-white text-zinc-900 shadow-sm"
                  : "border-zinc-300 bg-zinc-100 text-zinc-800 hover:border-zinc-900 hover:bg-white hover:text-zinc-900"
              }`}
              onClick={() =>
                setActiveControl((current) => (current === "filter" ? null : "filter"))
              }
            >
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M4 6H20"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M7 12H17"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M10 18H14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              Filter
            </button>

            <button
              type="button"
              className={`ml-auto inline-flex w-auto items-center justify-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                activeControl === "sort"
                  ? "border-zinc-900 bg-white text-zinc-900 shadow-sm"
                  : "border-zinc-300 bg-zinc-100 text-zinc-800 hover:border-zinc-900 hover:bg-white hover:text-zinc-900"
              }`}
              onClick={() =>
                setActiveControl((current) => (current === "sort" ? null : "sort"))
              }
            >
              <svg
                className="h-3.5 w-3.5"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path
                  d="M8 6V18"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M5 15L8 18L11 15"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16 18V6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
                <path
                  d="M13 9L16 6L19 9"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              Sort
            </button>
          </div>

          {/* Filter Panel */}
          {activeControl === "filter" && (
            <div className="rounded-xl border border-zinc-700/70 bg-zinc-900/60 p-2">
              <div className="grid grid-cols-2 gap-2">
              {/* Price Range */}
              <div className="rounded-lg border border-zinc-700/60 bg-zinc-950/60 p-2">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 inline-flex items-center gap-1 mb-1">
                  <svg
                    className="h-3 w-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M12 3V21"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M17 7.5C17 6.1 14.8 5 12 5C9.2 5 7 6.1 7 7.5C7 8.9 9.2 10 12 10C14.8 10 17 11.1 17 12.5C17 13.9 14.8 15 12 15C9.2 15 7 13.9 7 12.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                  Price
                </label>
                <CustomDualSlider
                  min={priceBounds.min}
                  max={priceBounds.max}
                  step={1000000}
                  values={filters.priceRange}
                  onChange={(nextValues) =>
                    onFilterChange({ ...filters, priceRange: nextValues })
                  }
                />
                <p className="text-[9px] text-zinc-400 text-center mt-0.5">
                  ¥{(filters.priceRange[0] / 1000000).toFixed(0)}M - ¥
                  {(filters.priceRange[1] / 1000000).toFixed(0)}M
                </p>
              </div>

              {/* Rooms Range */}
              <div className="rounded-lg border border-zinc-700/60 bg-zinc-950/60 p-2">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 inline-flex items-center gap-1 mb-1">
                  <svg
                    className="h-3 w-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M3 7.5L12 3L21 7.5V18L12 21L3 18V7.5Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M3 7.5L12 12L21 7.5"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Rooms
                </label>
                <CustomDualSlider
                  min={1}
                  max={4}
                  step={1}
                  values={filters.roomRange}
                  onChange={(nextValues) =>
                    onFilterChange({ ...filters, roomRange: nextValues })
                  }
                />
                <p className="text-[9px] text-zinc-400 text-center mt-0.5">
                  {filters.roomRange[0]} - {filters.roomRange[1]} rooms
                </p>
              </div>

              {/* Station Distance */}
              <div className="rounded-lg border border-zinc-700/60 bg-zinc-950/60 p-2">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 inline-flex items-center gap-1 mb-1">
                  <svg
                    className="h-3 w-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2" />
                    <path
                      d="M12 7V12L15.5 14"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Walk
                </label>
                <CustomDualSlider
                  min={5}
                  max={40}
                  step={1}
                  values={filters.stationDistanceRange}
                  onChange={(nextValues) =>
                    onFilterChange({
                      ...filters,
                      stationDistanceRange: nextValues,
                    })
                  }
                />
                <p className="text-[9px] text-zinc-400 text-center mt-0.5">
                  {filters.stationDistanceRange[0]}m - {filters.stationDistanceRange[1]}m
                </p>
              </div>

              {/* Earthquake Risk */}
              <div className="rounded-lg border border-zinc-700/60 bg-zinc-950/60 p-2">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 inline-flex items-center gap-1 mb-1">
                  <svg
                    className="h-3 w-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M13 2L5 14H11L9 22L19 9H13L13 2Z"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Risk
                </label>
                <CustomDualSlider
                  min={1}
                  max={10}
                  step={1}
                  values={filters.earthquakeRiskRange}
                  onChange={(nextValues) =>
                    onFilterChange({
                      ...filters,
                      earthquakeRiskRange: nextValues,
                    })
                  }
                />
                <p className="text-[9px] text-zinc-400 text-center mt-0.5">
                  {filters.earthquakeRiskRange[0]}/10 - {filters.earthquakeRiskRange[1]}/10
                </p>
              </div>

              {/* Elevation Range */}
              <div className="rounded-lg border border-zinc-700/60 bg-zinc-950/60 p-2">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 inline-flex items-center gap-1 mb-1">
                  <svg
                    className="h-3 w-3"
                    viewBox="0 0 24 24"
                    fill="none"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 18L10 9L14 14L20 6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  Elevation
                </label>
                <CustomDualSlider
                  min={1}
                  max={3}
                  step={1}
                  values={filters.elevationRange}
                  onChange={(nextValues) =>
                    onFilterChange({ ...filters, elevationRange: nextValues })
                  }
                />
                <p className="text-[9px] text-zinc-400 text-center mt-0.5">
                  {filters.elevationRange[0]} - {filters.elevationRange[1]}
                </p>
              </div>

              {/* Facilities */}
              <div className="rounded-lg border border-zinc-700/60 bg-zinc-950/60 p-2">
                <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 block mb-1">
                  Facilities
                </label>
                <div className="grid grid-cols-3 gap-1">
                  <label className="cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.amenities.schools}
                      onChange={(event) =>
                        onFilterChange({
                          ...filters,
                          amenities: {
                            ...filters.amenities,
                            schools: event.target.checked,
                          },
                        })
                      }
                      className="peer sr-only"
                    />
                    <span className="inline-flex w-full items-center justify-center rounded border border-zinc-700 bg-zinc-900/80 px-1.5 py-0.5 text-[9px] font-medium text-zinc-300 transition peer-checked:border-zinc-900 peer-checked:bg-white peer-checked:text-zinc-900">
                      Schools
                    </span>
                  </label>
                  <label className="cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.amenities.universities}
                      onChange={(event) =>
                        onFilterChange({
                          ...filters,
                          amenities: {
                            ...filters.amenities,
                            universities: event.target.checked,
                          },
                        })
                      }
                      className="peer sr-only"
                    />
                    <span className="inline-flex w-full items-center justify-center rounded border border-zinc-700 bg-zinc-900/80 px-1.5 py-0.5 text-[9px] font-medium text-zinc-300 transition peer-checked:border-zinc-900 peer-checked:bg-white peer-checked:text-zinc-900">
                      Univ.
                    </span>
                  </label>
                  <label className="cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filters.amenities.hospitals}
                      onChange={(event) =>
                        onFilterChange({
                          ...filters,
                          amenities: {
                            ...filters.amenities,
                            hospitals: event.target.checked,
                          },
                        })
                      }
                      className="peer sr-only"
                    />
                    <span className="inline-flex w-full items-center justify-center rounded border border-zinc-700 bg-zinc-900/80 px-1.5 py-0.5 text-[9px] font-medium text-zinc-300 transition peer-checked:border-zinc-900 peer-checked:bg-white peer-checked:text-zinc-900">
                      Hospitals
                    </span>
                  </label>
                </div>
              </div>

              {/* Reset Button */}
              <button
                type="button"
                className="col-span-2 w-full rounded border border-zinc-600 bg-zinc-950/70 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-zinc-200 transition hover:border-zinc-400"
                onClick={() =>
                  onFilterChange({
                    priceRange: [priceBounds.min, priceBounds.max],
                    roomRange: [1, 4],
                    stationDistanceRange: [5, 40],
                    earthquakeRiskRange: [1, 10],
                    elevationRange: [1, 3],
                    amenities: {
                      schools: false,
                      universities: false,
                      hospitals: false,
                    },
                  })
                }
              >
                Reset
              </button>
              </div>
            </div>
          )}

          {/* Sort Panel */}
          {activeControl === "sort" && (
            <div className="rounded-xl border border-zinc-700/70 bg-zinc-900/60 p-2 max-w-[220px]">
              <label className="text-[10px] uppercase tracking-wider font-semibold text-zinc-400 block mb-1">
                Sort By
              </label>
              <select
                className="w-full rounded border border-zinc-700 bg-zinc-950/80 px-2 py-1 text-xs text-zinc-100 outline-none transition hover:border-zinc-500"
                value={sortBy}
                onChange={(event) => onSortChange(event.target.value)}
              >
                <option value="overallScore-desc">Sumi Safety Index: High to Low</option>
                <option value="overallScore-asc">Sumi Safety Index: Low to High</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
              </select>
            </div>
          )}

          {/* Properties List */}
          <div className="min-h-0 flex-1 overflow-hidden rounded-xl border border-zinc-700/70 bg-zinc-950/70">
            <div className="border-b border-zinc-700/70 px-3 py-2">
              <p className="m-0 text-sm font-semibold text-zinc-100">
                {properties.length} properties found
              </p>
            </div>

            <div className="sumi-scroll min-h-0 h-full overflow-y-auto p-3 pb-6">
              {properties.length === 0 ? (
                <p className="m-0 text-sm text-zinc-400">
                  No properties match the current filters.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-3">
                  {properties.map((property) => (
                    <div key={property.id} className="min-w-0">
                      <PropertyCard
                        property={property}
                        isActive={selectedProperty === property.id}
                        onHover={onHoverProperty}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
