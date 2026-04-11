const AddressInput = ({ value, onChange, onResolve, resolvedCoords }) => {
  return (
    <div className="grid gap-1.5">
      <label htmlFor="address" className="text-sm text-zinc-300">
        Address
      </label>
      <div className="grid grid-cols-[1fr_auto] gap-2">
        <input
          className="w-full rounded-xl border border-zinc-700 bg-zinc-950/80 px-3 py-2.5 text-zinc-100 outline-none transition focus:border-zinc-300"
          id="address"
          name="address"
          value={value}
          placeholder="e.g. Chuo, Tokyo"
          onChange={(event) => onChange(event.target.value)}
          required
        />
        <button
          type="button"
          className="rounded-xl border border-zinc-700 bg-zinc-800 px-3 py-2.5 font-semibold text-white transition hover:bg-zinc-700"
          onClick={onResolve}
        >
          Resolve
        </button>
      </div>
      <p className="m-0 text-sm text-zinc-400">
        {resolvedCoords
          ? `Coordinates: ${resolvedCoords.lat.toFixed(4)}, ${resolvedCoords.lng.toFixed(4)}`
          : "Resolve to mock geocode coordinates before submit."}
      </p>
    </div>
  );
};

export default AddressInput;
