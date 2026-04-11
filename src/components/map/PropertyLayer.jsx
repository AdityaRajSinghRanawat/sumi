import { divIcon } from "leaflet";
import { Marker, Popup, Tooltip } from "react-leaflet";
import { getPropertyFallbackImage } from "../../utils/propertyImage";
import { formatSafetyScoreLabel } from "../../utils/safetyScore";

const formatPinPrice = (amount) => {
  if (amount >= 1_000_000) {
    return `¥${(amount / 1_000_000).toFixed(amount % 1_000_000 === 0 ? 0 : 1)}M`;
  }

  if (amount >= 1_000) {
    return `¥${Math.round(amount / 1_000)}K`;
  }

  return `¥${amount}`;
};

const PropertyLayer = ({ properties, selectedProperty, onSelectProperty }) => {
  return (
    <>
      {properties.map((property) => {
        const isActive = selectedProperty === property.id;
        const icon = divIcon({
          className: "sumi-price-pin-icon",
          html: `<span class="sumi-price-pin ${isActive ? "is-active" : ""}">${formatPinPrice(property.price)}</span>`,
          iconSize: [62, 24],
          iconAnchor: [31, 24],
          popupAnchor: [0, -22],
          tooltipAnchor: [0, -24],
        });

        return (
          <Marker
            key={property.id}
            position={[property.lat, property.lng]}
            icon={icon}
            eventHandlers={{
              mouseover: () => onSelectProperty(property.id),
              mouseout: () => onSelectProperty(null),
              click: () => onSelectProperty(property.id),
            }}
          >
            {isActive && (
              <Tooltip
                direction="top"
                offset={[0, -12]}
                opacity={1}
                permanent
                className="sumi-pin-tooltip"
              >
                <span className="sr-only">Selected property</span>
              </Tooltip>
            )}

            <Popup className="sumi-property-popup" autoPan closeButton>
              <div className="sumi-popup-card">
                <div className="sumi-popup-media">
                  <img
                    src={property.imageUrl}
                    alt={`${property.name} area`}
                    className="sumi-popup-image"
                    loading="lazy"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = getPropertyFallbackImage(property);
                    }}
                  />
                  <div className="sumi-popup-media-overlay" />
                  <div className="sumi-popup-media-header">
                    <span className="sumi-popup-chip">Property</span>
                    <span className="sumi-popup-price">¥{property.price.toLocaleString("ja-JP")}</span>
                  </div>
                </div>

                <div className="sumi-popup-body">
                  <p className="sumi-popup-title">{property.name}</p>
                  <p className="sumi-popup-subtitle">{property.address}</p>

                  <div className="sumi-popup-score-row">
                    <span className="sumi-popup-score-label">{formatSafetyScoreLabel(property.overallScore)}</span>
                    <span className="sumi-popup-score-value">{property.overallScore}</span>
                  </div>

                  <div className="sumi-popup-metrics">
                    <span className="sumi-popup-metric">{property.layout}</span>
                    <span className="sumi-popup-metric">{property.stationDistance} min walk</span>
                    <span className="sumi-popup-metric">Risk {property.earthquakeRisk}</span>
                    {property.builtYear ? (
                      <span className="sumi-popup-metric">Built {property.builtYear}</span>
                    ) : null}
                    {property.tags?.slice(0, 1).map((tag) => (
                      <span key={`${property.id}-${tag}`} className="sumi-popup-metric">
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};

export default PropertyLayer;
