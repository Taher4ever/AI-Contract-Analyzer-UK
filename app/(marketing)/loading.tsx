export default function MarketingLoading() {
  return (
    <div
      role="status"
      aria-label="Loading"
      className="fixed inset-x-0 top-0 z-[60] h-0.5 overflow-hidden"
    >
      <div className="bg-primary animate-loading-bar motion-reduce:animate-none h-full w-1/3" />
    </div>
  );
}
