import { LightSurfaceMotion } from "./LightSurfaceMotion";
import { site } from "@/content/site";
import { Accent } from "./Accent";
import { DirectionalContent } from "./DirectionalContent";
import { CompanyStory } from "./CompanyStory";
import { SectionSurfaceMotion } from "./SectionSurfaceMotion";
import { ApproachSequence } from "./ApproachSequence";
import { CountUp } from "./CountUp";
import { ProjectSequence } from "./ProjectSequence";
import { ExpertiseTimeline } from "./ExpertiseTimeline";
import { AnimatedSectionHead } from "./AnimatedSectionHead";

export function Expertises() {
  const { expertises } = site;
  return (
    <section id="expertises" className="section expertise-section" data-light-surface>
      <LightSurfaceMotion />
      <div className="container-x">
        <ExpertiseTimeline items={expertises.items} title={expertises.title} lead={expertises.lead} />
      </div>
    </section>
  );
}

export function Approche() {
  const { approche } = site;
  return (
    <section id="approche" className="section approach-section">
      <div className="approach-backdrop" aria-hidden="true" />
      <div className="approach-exit-backdrop" aria-hidden="true" />
      <div className="container-x">
        <AnimatedSectionHead title={approche.title} lead={approche.lead} />

        <ApproachSequence>
          <ol className="approach-steps">
            {approche.steps.map((step, i) => (
              <li id={`approche-${i}`} key={step.title} className="approach-step">
                <span className="approach-rail" aria-hidden="true"><span /></span>
                <span className="approach-number tnum" aria-hidden="true">
                  0<span>{i + 1}</span>
                </span>
                <div className="approach-copy">
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                </div>
              </li>
            ))}
          </ol>

          <div className="approach-stats-shell">
            <dl className="approach-stats">
              {approche.stats.map((stat) => (
                <div key={stat.label}>
                  <dt>{stat.label}</dt>
                  <dd>
                    {"value" in stat ? (
                      <CountUp to={stat.value} prefix={"prefix" in stat ? stat.prefix : ""} suffix={"suffix" in stat ? stat.suffix : ""} />
                    ) : (
                      stat.text
                    )}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </ApproachSequence>
      </div>
    </section>
  );
}

export function Realisations() {
  const { realisations } = site;
  return (
    <section id="realisations" className="section projects-section">
      <div className="projects-backdrop" aria-hidden="true" />
      <div className="container-x">
        <AnimatedSectionHead title={realisations.title} lead={realisations.lead} />
        <ProjectSequence items={realisations.items} />
      </div>
    </section>
  );
}

export function Entreprise() {
  const { entreprise } = site;
  return (
    <section id="entreprise" className="section company-section">
      <SectionSurfaceMotion departure={false} />
      <DirectionalContent className="container-x company-content">
        <div data-motion-group data-motion-side="left" className="company-heading">
          <h2 data-motion-surface className="display-2"><Accent text={entreprise.title} /></h2>
        </div>
        <CompanyStory paragraphs={entreprise.paragraphs} commitments={entreprise.commitments} />
      </DirectionalContent>
    </section>
  );
}
