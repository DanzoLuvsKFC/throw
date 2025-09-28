import { createPortal } from "react-dom";

/**
 * Renders children into <body> so overlays/modals aren't clipped by parents.
 * Pass a className if you want (e.g. "fixed inset-0 z-[9999]").
 */
export default function Portal({ children, className = "" }) {
  return createPortal(
    <div className={className}>{children}</div>,
    document.body
  );
}
