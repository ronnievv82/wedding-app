import React, { useEffect, useState } from "react";
import ModalImage from "react-modal-image";

const BASE_URL = "https://gallery.viecreatives.com/uploads";

function Gallery() {
  const [photos, setPhotos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPhotos() {
      try {
        const res = await fetch("https://gallery.viecreatives.com/api/gallery");
        const data = await res.json();
        setPhotos(data);
        setLoading(false);
      } catch (err) {
        console.error("Error loading photos:", err);
        setLoading(false);
      }
    }

    fetchPhotos();
    const interval = setInterval(fetchPhotos, 10000); // refresh every 10s
    return () => clearInterval(interval);
  }, []);

  const downloadPhoto = (filename) => {
    const imageUrl = `${BASE_URL}/${filename}`;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `snead-wedding-${filename}`;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50 px-4 py-8 sm:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12 space-y-4">
          <h1 className="text-5xl font-serif text-amber-800 tracking-wide">
            Memory Gallery
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-amber-400 to-orange-400 mx-auto rounded-full"></div>
          <p className="text-amber-600 text-lg font-medium">Snead Wedding Moments</p>
          
          {/* Photo Counter */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-amber-200 inline-block">
            <div className="text-amber-700 font-semibold">
              <span className="text-2xl font-bold text-amber-800">{photos.length}</span> 
              <span className="text-lg"> beautiful memories captured</span>
            </div>
          </div>

          {/* Navigation */}
          <button
            onClick={() => window.location.href = '/'}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full shadow-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-200"
          >
            📸 Take More Photos
          </button>
        </div>

      {loading ? (
        <div className="text-center space-y-4">
          <div className="animate-spin w-16 h-16 border-4 border-amber-200 border-t-amber-600 rounded-full mx-auto"></div>
          <p className="text-amber-600 font-medium">Loading magical moments...</p>
        </div>
      ) : photos.length === 0 ? (
        <div className="text-center space-y-6 py-16">
          <div className="text-8xl">📷</div>
          <div className="space-y-2">
            <h3 className="text-2xl font-bold text-amber-800">No photos yet!</h3>
            <p className="text-amber-600">Be the first to capture a magical moment</p>
          </div>
          <button
            onClick={() => window.location.href = '/'}
            className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full shadow-lg font-semibold text-lg hover:from-amber-600 hover:to-orange-600 transition-all duration-200"
          >
            Start Taking Photos ✨
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {photos.map((filename, index) => {
            const imageUrl = `${BASE_URL}/${filename}`;
            return (
              <div
                key={index}
                className="group relative bg-white rounded-2xl shadow-lg overflow-hidden border-4 border-white hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2"
                style={{
                  transform: `rotate(${(index % 4 - 1.5) * 2}deg)`,
                }}
              >
                {/* Polaroid-style frame */}
                <div className="p-3 pb-8">
                  <ModalImage
                    small={imageUrl}
                    large={imageUrl}
                    alt={`Wedding photo ${index + 1}`}
                    hideDownload={true}
                    className="rounded-lg w-full aspect-square object-cover"
                  />
                </div>
                
                {/* Photo number */}
                <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
                  <span className="text-amber-600 font-handwriting text-sm">#{index + 1}</span>
                </div>

                {/* Download button */}
                <button
                  onClick={() => downloadPhoto(filename)}
                  className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-amber-600 p-2 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-white hover:scale-110"
                  title="Save to phone"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>

                {/* Heart overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-rose-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-2xl opacity-80">
                    💕
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      </div>
    </div>
  );
}

export default Gallery;
