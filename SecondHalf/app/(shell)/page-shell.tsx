import type { ReactNode } from "react";
import { Sidebar, type TocGroup } from "./sidebar";
import { ScrollProgress } from "./scroll-progress";

export function PageShell({
  moduleLabel,
  tocGroups,
  moduleTone,
  children,
}: {
  moduleLabel?: string;
  tocGroups?: TocGroup[];
  moduleTone?: "module-3" | "module-4" | "module-5";
  children: ReactNode;
}) {
  return (
    <article className="module-page" data-tone={moduleTone}>
      <ScrollProgress />
      <div className="module-page__body">
        {tocGroups && tocGroups.length > 0 ? (
          <Sidebar moduleLabel={moduleLabel} groups={tocGroups} />
        ) : null}
        <div className="module-page__main">{children}</div>
      </div>
    </article>
  );
}
