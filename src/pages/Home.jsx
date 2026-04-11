import { Link } from "react-router-dom";

const Home = () => {
  return (
    <section className="grid min-h-screen place-items-center bg-[radial-gradient(circle_at_10%_10%,#1a1a1a_0%,#0f0f0f_38%,#000000_100%)] p-6 text-zinc-100">
      <div className="w-full max-w-170 rounded-2xl border border-zinc-700 bg-linear-to-br from-zinc-900/95 to-zinc-950/95 p-6">
        <h1 className="m-0 text-5xl font-semibold">Sumi</h1>
        <p className="mt-1 text-sm text-zinc-400">
          Professional map-based exploration and property listing for Japan.
        </p>

        <div className="mt-4 flex flex-wrap gap-2.5">
          <Link
            to="/explore"
            className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-100 transition hover:border-zinc-500"
          >
            Open Explore
          </Link>
          <Link
            to="/list-property"
            className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-100 transition hover:border-zinc-500"
          >
            List Property
          </Link>
          <Link
            to="/admin"
            className="rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-2.5 text-sm font-medium text-zinc-100 transition hover:border-zinc-500"
          >
            Admin
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Home;
