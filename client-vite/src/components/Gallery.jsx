import React, { useEffect, useState } from "react";
import ModalImage from "react-modal-image";

function Gallery() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const res = await fetch("https://gallery.viecreatives.com/api/gallery");
        const data = await res.json();
        setPhotos(data);
      } catch (err) {
        console.error("Error loading photos:", err);
      }
    }

    fetchPhotos();
    const interval = setInterval(fetchPhotos, 10000); // auto-refresh every 10s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white px-4 py-8 sm:px-8">
      <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800 mb-6 text-center">
        📸 Wedding Memories
      </h1>

      {photos.length === 0 ? (
        <p className="text-center text-gray-500">Loading photos...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {photos.map((photoUrl, index) => (
            <div key={index} className="rounded shadow-sm hover:shadow-md transition">
              <ModalImage
                small={photoUrl}
                large={photoUrl}
                alt={`Photo ${index + 1}`}
                hideDownload={false}
                imageBackgroundColor="#fff"
                className="rounded"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Gallery;
