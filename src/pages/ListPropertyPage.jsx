import { useMemo, useState } from "react";
import AddressInput from "../components/explore/AddressInput";
import { STORAGE_KEY } from "../data/properties";

function hashString(value) {
  return value.split("").reduce((acc, char) => (acc * 31 + char.charCodeAt(0)) >>> 0, 7);
}

function geocodeAddressMock(address) {
  const hash = hashString(address.trim().toLowerCase());
  const lat = 31 + (hash % 1400) / 100;
  const lng = 130 + ((hash >> 5) % 1200) / 100;
  return { lat, lng };
}

function toNearbyScores(seed) {
  return {
    schools: (seed % 4) + 1,
    universities: ((seed >> 2) % 3) + 1,
    hospitals: ((seed >> 3) % 3) + 1,
  };
}

const ListPropertyPage = () => {
  const [form, setForm] = useState({
    name: "",
    address: "",
    price: "",
    builtYear: "",
    description: "",
  });
  const [coords, setCoords] = useState(null);
  const [message, setMessage] = useState("");

  const canSubmit = useMemo(() => {
    return (
      form.name.trim() &&
      form.address.trim() &&
      form.price &&
      form.builtYear &&
      form.description.trim() &&
      coords
    );
  }, [form, coords]);

  const resolveAddress = () => {
    if (!form.address.trim()) {
      setMessage("Enter an address before resolving.");
      return;
    }

    const resolved = geocodeAddressMock(form.address);
    setCoords(resolved);
    setMessage("Address resolved using mock geocoding.");
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!canSubmit) {
      setMessage("Complete all fields and resolve address first.");
      return;
    }

    const seed = hashString(form.address + form.name);
    const property = {
      id: `custom-${Date.now()}`,
      name: form.name.trim(),
      address: form.address.trim(),
      price: Number(form.price),
      builtYear: Number(form.builtYear),
      description: form.description.trim(),
      lat: coords.lat,
      lng: coords.lng,
      stationDistance: 5 + (seed % 21),
      tags: ["new-listing", "owner-listed"],
      nearby: toNearbyScores(seed),
    };

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...stored, property]));

    setForm({
      name: "",
      address: "",
      price: "",
      builtYear: "",
      description: "",
    });
    setCoords(null);
    setMessage("Property saved locally. It will appear in Explore after refresh.");
  };

  return (
    <main className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_10%_10%,#111111_0%,#0a0a0a_42%,#000000_100%)] p-6 text-zinc-100">
      <section className="w-full max-w-180 rounded-2xl border border-zinc-700 bg-linear-to-br from-zinc-900/95 to-zinc-950/95 p-5">
        <h1 className="m-0 text-3xl font-semibold">List Property</h1>
        <p className="mt-1 text-sm text-zinc-400">Create a property listing with mock geocoded coordinates.</p>

        <form onSubmit={handleSubmit} className="mt-4 grid gap-3">
          <div className="grid gap-1.5">
            <label htmlFor="name" className="text-sm text-zinc-300">
              Property Name
            </label>
            <input
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950/80 px-3 py-2.5 text-zinc-100 outline-none transition focus:border-zinc-300"
              id="name"
              value={form.name}
              onChange={(event) => setForm({ ...form, name: event.target.value })}
              required
            />
          </div>

          <AddressInput
            value={form.address}
            onChange={(address) => setForm({ ...form, address })}
            onResolve={resolveAddress}
            resolvedCoords={coords}
          />

          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            <div className="grid gap-1.5">
              <label htmlFor="price" className="text-sm text-zinc-300">
                Price (JPY)
              </label>
              <input
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950/80 px-3 py-2.5 text-zinc-100 outline-none transition focus:border-zinc-300"
                id="price"
                type="number"
                min={1000000}
                step={100000}
                value={form.price}
                onChange={(event) => setForm({ ...form, price: event.target.value })}
                required
              />
            </div>

            <div className="grid gap-1.5">
              <label htmlFor="year" className="text-sm text-zinc-300">
                Built Year
              </label>
              <input
                className="w-full rounded-xl border border-zinc-700 bg-zinc-950/80 px-3 py-2.5 text-zinc-100 outline-none transition focus:border-zinc-300"
                id="year"
                type="number"
                min={1950}
                max={new Date().getFullYear()}
                value={form.builtYear}
                onChange={(event) => setForm({ ...form, builtYear: event.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid gap-1.5">
            <label htmlFor="description" className="text-sm text-zinc-300">
              Description
            </label>
            <textarea
              className="w-full rounded-xl border border-zinc-700 bg-zinc-950/80 px-3 py-2.5 text-zinc-100 outline-none transition focus:border-zinc-300"
              id="description"
              rows={5}
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-linear-to-r from-zinc-100 to-zinc-300 px-4 py-2.5 font-semibold text-zinc-950 transition hover:from-zinc-200 hover:to-zinc-400"
          >
            Save Listing
          </button>
        </form>

        {message && <p className="mt-3 text-sm text-zinc-300">{message}</p>}
      </section>
    </main>
  );
};

export default ListPropertyPage;
