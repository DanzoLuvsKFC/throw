// src/components/Section.jsx
export default function Section({ id, className = "", children }) {
  // Consistent vertical rhythm on every page
  return (
    <section id={id} className={`py-10 md:py-16 ${className}`}>
      {children}
    </section>
  );
}
