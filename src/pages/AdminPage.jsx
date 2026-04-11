import { useMemo } from "react";
import { Link } from "react-router-dom";
import { seedProperties, STORAGE_KEY } from "../data/properties";
import { assignRegionFromCoords } from "../utils/assignRegionFromCoords";

const yen = new Intl.NumberFormat("ja-JP", {
  style: "currency",
  currency: "JPY",
  maximumFractionDigits: 0,
});

const AdminPage = () => {
  const listings = useMemo(() => {
    const custom = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const all = [...seedProperties, ...custom];

    return all.map((item) => ({
      ...item,
      region: assignRegionFromCoords(item.lat, item.lng),
    }));
  }, []);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_10%_10%,#111111_0%,#0a0a0a_42%,#000000_100%)] px-6 py-6 text-zinc-100">
      <div className="mx-auto w-full max-w-6xl rounded-2xl border border-zinc-700 bg-zinc-950/80 p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="m-0 text-2xl font-semibold">Admin Listings</h1>
            <p className="mt-1 text-sm text-zinc-400">All seed + user listings</p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              to="/explore"
              className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-100 transition hover:border-zinc-500"
            >
              Explore
            </Link>
            <Link
              to="/list-property"
              className="rounded-xl border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm font-medium text-zinc-100 transition hover:border-zinc-500"
            >
              Add Listing
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto rounded-xl border border-zinc-700">
          <table className="min-w-full border-collapse text-left text-sm">
            <thead className="bg-zinc-900 text-zinc-300">
              <tr>
                <th className="px-3 py-2">Name</th>
                <th className="px-3 py-2">Price</th>
                <th className="px-3 py-2">Address</th>
                <th className="px-3 py-2">Region</th>
                <th className="px-3 py-2">Built Year</th>
                <th className="px-3 py-2">Station</th>
              </tr>
            </thead>
            <tbody>
              {listings.map((listing) => (
                <tr key={listing.id} className="border-t border-zinc-800 hover:bg-zinc-900/60">
                  <td className="px-3 py-2 font-medium text-zinc-100">{listing.name}</td>
                  <td className="px-3 py-2 text-zinc-300">{yen.format(listing.price)}</td>
                  <td className="px-3 py-2 text-zinc-400">{listing.address}</td>
                  <td className="px-3 py-2 text-zinc-300">{listing.region?.macroRegion || "Unknown"}</td>
                  <td className="px-3 py-2 text-zinc-400">{listing.builtYear || "-"}</td>
                  <td className="px-3 py-2 text-zinc-400">{listing.stationDistance} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default AdminPage;
