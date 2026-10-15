import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import { CtaBand } from "@/components/oss/CtaBand";
import { caseStudies, type CaseStudy as CaseData } from "@/data/caseStudies";
import type { WorkProject } from "@/data/work";

const INK = "#0E1311";
const CREAM = "#FFF3EA";

/** Readable text colour for a project plate. */
function textOn(hex: string) {
  const n = parseInt(hex.slice(1), 16);
  const lin = [(n >> 16) & 255, (n >> 8) & 255, n & 255].map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  const L = 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
  // Pick whichever of ink or cream has more contrast against the plate.
  return (L + 0.05) / 0.056 > 1.05 / (L + 0.05) ? INK : CREAM;
}

/** A case study built from the shared structure. Sections appear only when there is real material for them. */
export function CaseStudy({ project, next }: { project: WorkProject; next: WorkProject }) {
  const study: CaseData | undefined = caseStudies[project.slug];
  const nextStudy = caseStudies[next.slug];

  const bg = study?.theme.bg ?? project.tint;
  const fg = study?.theme.fg ?? textOn(project.tint);
  const hero = study?.hero ?? { src: project.img.d, alt: `${project.name} website, home page` };
  const phone = study?.phone ?? { src: project.img.m, alt: `${project.name} website on a phone` };
  const longest = Math.max(...project.name.split(" ").map((w) => w.length));
  const ts = Math.min(236, Math.round(2750 / project.name.length));
  const tsm = Math.min(104, Math.round(340 / (0.56 * longest)));

  const style = {
    "--c-bg": bg,
    "--c-fg": fg,
    "--c-meta": study?.theme.meta ?? fg,
    "--ts": ts,
    "--tsm": tsm,
    "--nts": Math.min(150, Math.round(3000 / next.name.length)),
    "--b-bg": study?.theme.briefBg,
    "--b-fg": study?.theme.briefFg,
    "--c-accent": study?.theme.accent,
    "--p-bg": study?.theme.phonesBg,
    "--p-fg": study?.theme.phonesFg,
    "--f-bg": study?.theme.fullBg,
    "--n-bg": nextStudy?.theme.nextBg ?? "#F8F6F1",
    "--n-fg": nextStudy?.theme.nextFg ?? INK,
  } as CSSProperties;

  const place = `${project.place}${project.status === "Preview build" ? ", in build" : ""}`;
  const built = study?.builtDetail ?? project.built.map((t) => ({ title: t, text: "" }));

  return (
    <div style={style}>
      <header className="ch" data-tone="light">
        <h1 className="oss-disp">{project.name}</h1>
        <div className="d1 oss-screen oss-shadow">
          <img src={hero.src} alt={hero.alt} decoding="async" {...{ fetchpriority: "high" }} />
        </div>
        <div className="oss-phone ph">
          <div className="oss-screen">
            <img src={phone.src} alt={phone.alt} loading="lazy" decoding="async" />
          </div>
        </div>
        <dl className="meta">
          <div>
            <dt>{project.label ?? "Sector"}</dt>
            <dd>{project.sector}</dd>
          </div>
          <div>
            <dt>Place</dt>
            <dd>{place}</dd>
          </div>
          {study?.scope && (
            <div>
              <dt>Scope</dt>
              <dd>{study.scope}</dd>
            </div>
          )}
          <div>
            <dt>Stack</dt>
            <dd>{project.stack.join(", ")}</dd>
          </div>
        </dl>
      </header>

      <section className={`brief${study?.brief ? "" : " brief--long"}`} data-tone="dark" aria-label="The brief">
        {study?.brief ? (
          <>
            <h2 className="oss-disp">
              {study.brief.lead}
              <span className="a">{study.brief.accent}</span>
            </h2>
            <p>{study.brief.body}</p>
          </>
        ) : (
          <>
            <h2 className="oss-disp">{project.summary}</h2>
          </>
        )}
      </section>

      {study?.phones && (
        <section className={`phones phones--${study.phones.images.length}`} data-tone="light" aria-label="On a phone">
          {study.phones.images.map((im, i) => (
            <div key={im.src} className={`oss-phone p${i + 1}`}>
              <div className="oss-screen">
                <img src={im.src} alt={im.alt} loading="lazy" decoding="async" />
              </div>
            </div>
          ))}
          <p className="t">{study.phones.title}</p>
        </section>
      )}

      {study?.full && (
        <>
          <section className="full" data-tone="dark">
            <div className="oss-screen">
              <img src={study.full.src} alt={study.full.alt} loading="lazy" decoding="async" />
            </div>
          </section>
          <div className="cap" data-tone="dark">
            <span>
              <b>{study.full.label}</b> {study.full.caption}
            </span>
          </div>
        </>
      )}

      {study?.duo && (
        <section className="duo" data-tone="light">
          {study.duo.images.map((im, i) => (
            <div key={im.src} className={`x x${i + 1} oss-screen oss-shadow`}>
              <img src={im.src} alt={im.alt} loading="lazy" decoding="async" />
            </div>
          ))}
          <p>
            <b>{study.duo.title}</b>
            {study.duo.text}
          </p>
        </section>
      )}

      <section className="built" data-tone="dark" aria-labelledby="built-title">
        <h2 id="built-title" className="oss-disp">What we built</h2>
        <ul>
          {built.map((b) => (
            <li key={b.title}>
              {b.text ? (
                <>
                  <b>{b.title}</b>
                  {b.text}
                </>
              ) : (
                b.title
              )}
            </li>
          ))}
        </ul>
        {study?.palette && (
          <div className="pal">
            {study.palette.colors.map((c) => (
              <i key={c} style={{ background: c }} aria-hidden="true" />
            ))}
            <span>{study.palette.note}</span>
          </div>
        )}
        <p className="pal">We don't publish traffic, enquiry or revenue figures for this project, because we can't verify them for you.</p>
      </section>

      <section className="next" data-tone="light" aria-label="Next project">
        <span className="t">Next project</span>
        <div className="d1 oss-screen oss-shadow">
          <img src={nextStudy?.nextShot?.src ?? next.img.t} alt="" loading="lazy" decoding="async" />
        </div>
        <h2 className="oss-disp">
          <Link to={`/work/${next.slug}`}>{next.name}</Link>
        </h2>
      </section>

      <CtaBand />
    </div>
  );
}
