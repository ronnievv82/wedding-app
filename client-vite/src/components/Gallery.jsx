import React, { useEffect, useState } from "react";

function Gallery() {
  const [photoList, setPhotoList] = useState([]);

  // Fetch photos from the server
  const fetchPhotos = async () => {
    try {
      const res = await fetch("https://gallery.viecreatives.com/api/gallery");
      const files = await res.json();
      setPhotoList(files);
    } catch (error) {
      console.error("Error fetching gallery:", error);
    }
  };

  useEffect(() => {
    fetchPhotos();

    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchPhotos, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white px-4 py-6">
      <h1 className="text-3xl font-semibold text-center mb-6 text-gray-800">
        Wedding Memories 📸
      </h1>

      {photoList.length === 0 ? (
        <p className="text-center text-gray-500">No photos yet, but the magic is coming...</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
          {photoList.map((filename, index) => (
            <img
              key={index}
              src={`https://viecreatives.com/gallery/${filename}`}
              alt={`photo-${index}`}
              className="rounded shadow-sm object-cover w-full aspect-square transition-transform hover:scale-105"
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Gallery;
