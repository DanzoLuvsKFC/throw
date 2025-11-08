import React from "react";

export default function ReviewCard({ text, handle }) {
  return (
    <article className="rb2-card">
      <p className="rb2-card-text">{text}</p>
      <div className="rb2-card-footer">
        <span className="rb2-handle">{handle}</span>
      </div>
    </article>
  );
}
