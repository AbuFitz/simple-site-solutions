import { photosFor } from "./templates/kit";

/** Credits for the sample photographs and the map, shown under the preview. */
export function PhotoCredits({ category }: { category: string }) {
  const list = photosFor(category);
  return (
    <details className="rounded-xl border border-border bg-card p-4 text-sm text-muted-foreground">
      <summary className="min-h-[44px] cursor-pointer py-2 font-semibold text-foreground">Photo and map credits</summary>
      <p className="mt-2">
        The photographs are sample images from Wikimedia Commons, used under the licences shown. Your own website uses your photography, or photos we agree with you. The map is a live OpenStreetMap view of the town you entered (© <a className="underline underline-offset-2" href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener noreferrer">OpenStreetMap contributors</a>); we send the town name to OpenStreetMap to show it.
      </p>
      {list.length > 0 && (
        <ul className="mt-3 space-y-2">
          {list.map((m) => (
            <li key={m.file}>
              {m.alt}: {m.credit}{" "}
              <a className="underline underline-offset-2" href={m.source} target="_blank" rel="noopener noreferrer">
                source<span className="sr-only"> (opens in a new tab)</span>
              </a>
            </li>
          ))}
        </ul>
      )}
    </details>
  );
}
