/** Shown on legal pages until the owner has had them reviewed. Remove the component once reviewed. */
export function LegalNotice() {
  return (
    <p role="note" className="mb-8 max-w-2xl rounded-lg border border-border bg-card p-3 text-sm text-muted-foreground">
      Working draft: this page is awaiting review by the business owner and a legal adviser, and the operating company's details will be added. Contact us if anything is unclear.
    </p>
  );
}
