import React, { useRef, useState, useEffect } from "react";

const PhotoBooth = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [facingMode, setFacingMode] = useState("user"); // 'user' or 'environment'
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [stream, setStream] = useState(null);

  useEffect(() => {
    startCamera();
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, [facingMode]);

  const startCamera = async () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }

    try {
      const newStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
      });
      videoRef.current.srcObject = newStream;
      setStream(newStream);
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  const flipCamera = () => {
    setFacingMode(prev => (prev === "user" ? "environment" : "user"));
  };

  const takePhoto = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (video && canvas) {
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      setCapturedPhoto(canvas.toDataURL("image/jpeg"));
    }
  };

  const uploadPhoto = async () => {
    const blob = await (await fetch(capturedPhoto)).blob();
    const form = new FormData();
    form.append("photo", blob, "wedding-photo.jpg");

    try {
      const res = await fetch("https://ronnievv.duckdns.org:3001/api/upload", {
        method: "POST",
        body: form,
      });
      const data = await res.json();
      console.log("✅ Upload success:", data);
    } catch (err) {
      console.error("❌ Upload failed:", err);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6 bg-gray-900 min-h-screen text-white">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        className="rounded-lg w-full max-w-sm border-4 border-pink-500"
      />
      <button onClick={flipCamera} className="px-4 py-2 bg-blue-500 rounded hover:bg-blue-600 transition">
        🔄 Flip Camera
      </button>
      <button onClick={takePhoto} className="px-4 py-2 bg-green-500 rounded hover:bg-green-600 transition">
        📸 Take Photo
      </button>

      {capturedPhoto && (
        <>
          <img
            src={capturedPhoto}
            alt="Captured"
            className="rounded-lg w-full max-w-xs border-2 border-yellow-400"
          />
          <button onClick={uploadPhoto} className="px-4 py-2 bg-purple-600 rounded hover:bg-purple-700 transition">
            ⬆️ Upload
          </button>
        </>
      )}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default PhotoBooth;
