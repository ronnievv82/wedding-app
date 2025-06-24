import React, { useEffect, useState } from "react";

function Gallery() {
  const [photoList, setPhotoList] = useState([]);

  const fetchPhotos = async () => {
    try {
      const res = await fetch("https://ronnievv.duckdns.org:3001/gallery/");
      const html = await res.text();
      const matches = [...html.matchAll(/href="(photo_\d+\.jpg)"/g)];
      const files = matches.map(match => match[1]);
      const sorted = files.sort((a, b) => b.localeCompare(a)); // Newest first
      setPhotoList(sorted);
    } catch (error) {
      console.error("Gallery fetch error:", error);
    }
  };

  useEffect(() => {
    fetchPhotos();
    const interval = setInterval(fetchPhotos, 10000); // refresh every 10 sec
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 max-w-5xl mx-auto">
      <h1 className="text-2xl font-semibold text-center mb-6">
        Wedding Memories 📸
      </h1>

      {photoList.length === 0 ? (
        <p className="text-center text-gray-500">No photos yet—stay tuned!</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {photoList.map((filename, index) => (
            <img
              key={index}
              src={`https://ronnievv.duckdns.org:3001/gallery/${filename}`}
              alt={`Wedding memory ${index + 1}`}
              className="rounded shadow-md hover:scale-105 transition-transform"
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Gallery;
