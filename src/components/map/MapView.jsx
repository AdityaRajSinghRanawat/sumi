import { MapContainer, TileLayer } from "react-leaflet";
import RegionLayer from "./RegionLayer";
import PropertyLayer from "./PropertyLayer";
import AmenityLayer from "./AmenityLayer";

const mapCenter = [35.9, 134.6];

const formatCompactYen = (amount) => {
  if (amount >= 1_000_000) {
    return `¥${(amount / 1_000_000).toFixed(amount % 1_000_000 === 0 ? 0 : 1)}M`;
  }

  if (amount >= 1_000) {
    return `¥${Math.round(amount / 1_000)}K`;
  }

  return `¥${amount}`;
};

const amenityLabelMap = {
  schools: "Schools",
  universities: "Universities",
  hospitals: "Hospitals",
};

const MapView = ({
  mapResetToken,
  selectedRegion,
  selectedPrefecture,
  properties,
  amenitySourceProperties,
  selectedProperty,
  filters,
  exploreStateSnapshot,
  showMapFilters,
  priceBounds,
  onFilterChange,
  onSelectRegion,
  onSelectPrefecture,
  onSelectProperty,
  onToggleMapFilters,
}) => {
  const elevationLabel = `${filters.elevationRange[0]}-${filters.elevationRange[1]}`;
  const activeAmenityKeys = Object.entries(filters.amenities || {})
    .filter(([, checked]) => checked)
    .map(([key]) => key);

  return (
    <div className="relative h-full w-full">
      <MapContainer
        key={mapResetToken}
        center={mapCenter}
        zoom={4.5}
        minZoom={4.0}
        maxZoom={12}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
          subdomains="abcd"
          detectRetina
        />

        <RegionLayer
          selectedRegionId={selectedRegion?.id}
          selectedPrefectureId={selectedPrefecture?.id}
          onSelectRegion={onSelectRegion}
          onSelectPrefecture={onSelectPrefecture}
        />

        {properties.length > 0 && (
          <PropertyLayer
            properties={properties}
            exploreStateSnapshot={exploreStateSnapshot}
            selectedProperty={selectedProperty}
            onSelectProperty={onSelectProperty}
          />
        )}

        {amenitySourceProperties.length > 0 && (
          <AmenityLayer
            properties={amenitySourceProperties}
            exploreStateSnapshot={exploreStateSnapshot}
            selectedPrefecture={selectedPrefecture}
            filters={filters}
          />
        )}
      </MapContainer>

      {selectedPrefecture && (
        <div className="pointer-events-none absolute top-2 left-2 right-2 z-50 flex flex-wrap items-center gap-2">
          <button
            type="button"
            className="pointer-events-auto inline-flex items-center gap-1 rounded-full border border-zinc-700/80 bg-zinc-900/90 px-3 py-1.5 text-xs font-semibold text-zinc-100 shadow-lg transition hover:bg-zinc-800"
            onClick={onToggleMapFilters}
          >
            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M4 6H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M7 12H17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              <path d="M10 18H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
            {showMapFilters ? "Hide Filters" : "Show Filters"}
          </button>
          {showMapFilters && (
            <>
              <button
                type="button"
                className="pointer-events-auto sumi-map-chip"
                onClick={() => onFilterChange((current) => ({ ...current, priceRange: [priceBounds.min, priceBounds.max] }))}
              >
                {formatCompactYen(filters.priceRange[0])} - {formatCompactYen(filters.priceRange[1])}
              </button>
              <button
                type="button"
                className="pointer-events-auto sumi-map-chip"
                onClick={() => onFilterChange((current) => ({ ...current, roomRange: [1, 4] }))}
              >
                {filters.roomRange[0]}-{filters.roomRange[1]} rooms
              </button>
              <button
                type="button"
                className="pointer-events-auto sumi-map-chip"
                onClick={() => onFilterChange((current) => ({ ...current, stationDistanceRange: [5, 40] }))}
              >
                {filters.stationDistanceRange[0]}-{filters.stationDistanceRange[1]}m walk
              </button>
              <button
                type="button"
                className="pointer-events-auto sumi-map-chip"
                onClick={() => onFilterChange((current) => ({ ...current, earthquakeRiskRange: [1, 10] }))}
              >
                Risk {filters.earthquakeRiskRange[0]}-{filters.earthquakeRiskRange[1]}
              </button>
              <button
                type="button"
                className="pointer-events-auto sumi-map-chip"
                onClick={() => onFilterChange((current) => ({ ...current, elevationRange: [1, 3] }))}
              >
                Elevation {elevationLabel}
              </button>

              {activeAmenityKeys.map((amenityKey) => (
                <button
                  key={amenityKey}
                  type="button"
                  className="pointer-events-auto sumi-map-chip"
                  onClick={() =>
                    onFilterChange((current) => ({
                      ...current,
                      amenities: {
                        ...current.amenities,
                        [amenityKey]: false,
                      },
                    }))
                  }
                >
                  {amenityLabelMap[amenityKey] || amenityKey} x
                </button>
              ))}
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MapView;