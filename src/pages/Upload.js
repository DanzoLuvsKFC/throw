// src/pages/Upload.js
export default function Upload() {
  return (
    <main style={{ padding: 24 }}>
      <h1>Upload Outfit</h1>
      <form>
        <p><input type="file" accept="image/*" /></p>
        <p><input type="text" placeholder="Title" /></p>
        <p><input type="text" placeholder="Tags (comma separated)" /></p>
        <p><textarea placeholder="Story / Notes" rows="4" /></p>
        <button type="button">Save (MVP)</button>
      </form>
    </main>
  );
}