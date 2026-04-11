import PropertyCard from "./PropertyCard";

const PropertySlider = ({ properties, selectedProperty, onHoverProperty }) => {
  if (!properties.length) {
    return (
      <div className="mt-4 rounded-2xl border border-zinc-700 bg-linear-to-br from-zinc-900/95 to-zinc-950/95 p-4 text-sm text-zinc-300">
        No properties match your current filters for this region.
      </div>
    );
  }

  return (
    <div className="mt-4 w-full max-w-full overflow-hidden rounded-2xl border border-zinc-700 bg-linear-to-br from-zinc-900/95 to-zinc-950/95 p-4">
      <section className="grid auto-cols-[300px] grid-flow-col gap-3 overflow-x-auto pb-1" aria-label="Property list">
        {properties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
            isActive={selectedProperty === property.id}
            onHover={onHoverProperty}
          />
        ))}
      </section>
    </div>
  );
};

export default PropertySlider;
