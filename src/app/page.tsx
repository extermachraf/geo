import { PageEntrance } from "@/components/PageEntrance";
import { Nav } from "@/components/Nav";
import { Hero } from "@/components/Hero";
import {
  Approche,
  Entreprise,
  Expertises,
  Realisations,
} from "@/components/Sections";
import { Contact } from "@/components/Contact";
import { LightSurfaceMotion } from "@/components/LightSurfaceMotion";
import { Footer } from "@/components/Footer";

export default function Home() {
  return (
    <PageEntrance>
      <Nav />
      <main>
        <Hero />
        <div className="site-content">
          <Expertises />
          <Approche />
          <Realisations />
          <Entreprise />
        </div>
        <div className="site-content closing-surface" data-light-surface>
          <LightSurfaceMotion />
          <Contact />
          <Footer />
        </div>
      </main>
    </PageEntrance>
  );
}
