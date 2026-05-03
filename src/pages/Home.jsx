import StaggeredMenu from "@/components/StaggeredMenu";
import ColorBends from "@/components/ColorBends";
import LandingPage from "@/components/component-pagewise/home/LandingPage";
import DecisionSection from "@/components/component-pagewise/home/DecisionSection";

const HOME_MENU_ITEMS = [
  { label: "Open Explore", link: "/explore", ariaLabel: "Open explore" },
  {
    label: "List Property",
    link: "/list-property",
    ariaLabel: "List property",
  },
  { label: "Admin", link: "/admin", ariaLabel: "Open admin" },
];

const Home = () => {
  return (
    <section className="relative overflow-hidden text-slate-50 font-dx-grafik">
      <div className="relative">
        <div className="relative min-h-screen">
          <div className="absolute inset-0">
            <ColorBends
              className="h-full w-full"
              colors={["#3b82f6"]}
              rotation={61}
              speed={0.2}
              scale={1}
              autoRotate={0}
              frequency={1}
              warpStrength={1}
              mouseInfluence={1}
              parallax={0.5}
              noise={0.15}
              iterations={1}
              intensity={1.5}
              bandWidth={6}
              transparent={false}
            />
          </div>

          <div className="relative z-20 min-h-screen">
            <StaggeredMenu
              isFixed
              position="right"
              brandLabel="sumi."
              logoUrl=""
              menuButtonColor="#ffffff"
              openMenuButtonColor="#111111"
              colors={["#2563eb", "#8b5cf6", "#10b981"]}
              accentColor="var(--accent-500)"
              items={HOME_MENU_ITEMS}
              displaySocials={false}
              displayItemNumbering
            />

            <LandingPage />
          </div>
        </div>
      </div>

      <DecisionSection />
    </section>
  );
};

export default Home;
