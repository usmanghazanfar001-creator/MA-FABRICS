import { ArrowDown, ArrowUp } from "lucide-react";

interface Props {
  isPublished: boolean;
  isFirst: boolean;
  isLast: boolean;
  /** Pre-bound server actions, e.g. movePhoto.bind(null, id, "up") */
  moveUp: () => Promise<void>;
  moveDown: () => Promise<void>;
  togglePublish: () => Promise<void>;
  remove: () => Promise<void>;
}

/** Shared reorder / publish / delete controls for a media row (plain server-action forms, no client JS). */
export function MediaRowActions({ isPublished, isFirst, isLast, moveUp, moveDown, togglePublish, remove }: Props) {
  const arrow = "p-1 text-navy/60 hover:text-navy disabled:opacity-25 disabled:hover:text-navy/60";
  return (
    <div className="flex items-center gap-4">
      <div className="flex">
        <form action={moveUp}>
          <button className={arrow} disabled={isFirst} aria-label="Move up"><ArrowUp className="h-4 w-4" /></button>
        </form>
        <form action={moveDown}>
          <button className={arrow} disabled={isLast} aria-label="Move down"><ArrowDown className="h-4 w-4" /></button>
        </form>
      </div>
      <form action={togglePublish}>
        <button className={isPublished ? "text-green-700" : "text-navy/40"}>{isPublished ? "Published" : "Draft"}</button>
      </form>
      <form action={remove}>
        <button className="text-red-700">Delete</button>
      </form>
    </div>
  );
}
