import { Children, isValidElement, type ReactNode } from "react";
import { buildConceptHeadingId } from "./concept-helpers";
import { MarginNote } from "./margin-note";

export function Concept({
  section,
  title,
  slug,
  children,
}: {
  section: string;
  title: string;
  slug: string;
  children: ReactNode;
}) {
  const id = buildConceptHeadingId(section, slug);

  const all = Children.toArray(children);
  const asides = all.filter(
    (child) => isValidElement(child) && child.type === MarginNote,
  );
  const body = all.filter(
    (child) => !(isValidElement(child) && child.type === MarginNote),
  );

  return (
    <section id={id} className="concept" aria-labelledby={`${id}-title`}>
      <header className="concept__head">
        <span className="concept__section-number tabular">§&nbsp;{section}</span>
        <h2 id={`${id}-title`} className="concept__title">{title}</h2>
      </header>
      <div className="concept__body">{body}</div>
      {asides}
    </section>
  );
}

function Definition({ children }: { children: ReactNode }) {
  return (
    <p className="concept__definition">
      <span className="concept__slot-tag">Definition</span>
      {children}
    </p>
  );
}

function Formula({ children, caption }: { children: ReactNode; caption?: string }) {
  return (
    <figure className="concept__formula">
      {caption ? <figcaption className="concept__slot-tag">{caption}</figcaption> : null}
      {children}
    </figure>
  );
}

function Intuition({ children }: { children: ReactNode }) {
  return (
    <div className="concept__intuition">
      <span className="concept__slot-tag">Intuition</span>
      {children}
    </div>
  );
}

function WorkedExample({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="concept__worked">
      <span className="concept__slot-tag">Worked example{title ? ` · ${title}` : ""}</span>
      {children}
    </div>
  );
}

function Pitfall({ title, children }: { title: string; children: ReactNode }) {
  return (
    <aside className="concept__pitfall" role="note">
      <span className="concept__slot-tag concept__slot-tag--correction">Pitfall</span>
      <h3 className="concept__pitfall-title">{title}</h3>
      {children}
    </aside>
  );
}

function FurtherReading({ children }: { children: ReactNode }) {
  return (
    <div className="concept__further">
      <span className="concept__slot-tag">Further reading</span>
      {children}
    </div>
  );
}

Concept.Definition = Definition;
Concept.Formula = Formula;
Concept.Intuition = Intuition;
Concept.WorkedExample = WorkedExample;
Concept.Pitfall = Pitfall;
Concept.FurtherReading = FurtherReading;
