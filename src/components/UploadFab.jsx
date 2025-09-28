import { useFeed } from "../store/FeedContext";

export default function UploadFab() {
  const { openUpload } = useFeed();
  return (
    <button
      onClick={openUpload}
      className="fixed bottom-5 right-5 z-[70] rounded-full bg-charcoal text-creme px-5 py-3 shadow-lg hover:opacity-95 active:opacity-90"
      aria-label="Open upload"
    >
      flex a fit
    </button>
  );
}
