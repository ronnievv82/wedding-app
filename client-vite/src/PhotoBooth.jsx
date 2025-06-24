import React, { useEffect, useState, useRef } from "react";
import confetti from "canvas-confetti";

function PhotoBooth() {
  const [photos, setPhotos] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const [cameraFacing, setCameraFacing] = useState("user");
  const [cameraReady, setCameraReady] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const videoRef = useRef(null);
  const streamRef = useRef(null);

  useEffect(() => {
    (async () => {
      if (!navigator.mediaDevices?.getUserMedia) {
        alert("Camera not supported.");
        return;
      }

      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }

      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: cameraFacing },
        });

        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          setCameraReady(true);
        }
      } catch (error) {
        console.error("Camera error:", error);
        alert("Failed to access camera.");
      }
    })();

    return () => {
      streamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, [cameraFacing]);

  const handleUpload = async () => {
    if (photos.length >= 20 || isUploading) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;
    canvas.getContext("2d").drawImage(videoRef.current, 0, 0);

    const photoBlob = await new Promise(resolve =>
      canvas.toBlob(resolve, "image/jpeg", 0.9)
    );

    const previewURL = URL.createObjectURL(photoBlob);
    const updatedPhotos = [...photos, { url: previewURL, blob: photoBlob }];
    setPhotos(updatedPhotos);

    if (updatedPhotos.length >= 20 && !limitReached) {
      setLimitReached(true);
      confetti({
        particleCount: 200,
        spread: 90,
        origin: { y: 0.6 },
      });
    }

    const formData = new FormData();
    formData.append("photo", photoBlob, `photo_${Date.now()}.jpg`);

    const token = new URLSearchParams(window.location.search).get("t");
    if (token) formData.append("token", token);

    setIsUploading(true);
    await fetch("https://ronnievv.duckdns.org:3001/api/upload", {
      method: "POST",
      body: formData,
    });
    setIsUploading(false);

    // Show toast
    setShowConfirmation(true);
    setTimeout(() => setShowConfirmation(false), 2000);
  };

  return (
    <div className="photo-booth text-center py-6">
      {showConfirmation && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg transition-all duration-500 z-50">
          📸 Photo uploaded!
        </div>
      )}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="preview mx-auto rounded shadow-md"
      />

      <div className="flex justify-center gap-4 mt-4">
        <button
          onClick={() =>
            setCameraFacing(prev => (prev === "user" ? "environment" : "user"))
          }
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded"
        >
          Flip Camera
        </button>

        <button
          onClick={handleUpload}
          disabled={!cameraReady || isUploading || limitReached}
          className={`px-4 py-2 rounded transition-all ${
            isUploading
              ? "animate-pulse bg-blue-400 cursor-wait"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white`}
        >
          {isUploading ? "Uploading..." : "Take Photo"}
        </button>
      </div>

      <p className="text-sm text-gray-600 mt-2">
        {20 - photos.length} photo{20 - photos.length !== 1 ? "s" : ""} left
      </p>

      <div className="gallery mt-4 grid grid-cols-3 gap-2 px-4">
        {photos.map((p, index) => (
          <img
            key={index}
            src={p.url}
            alt={`upload-${index}`}
            className="rounded shadow-sm"
          />
        ))}
      </div>
    </div>
  );
}

export default PhotoBooth;
