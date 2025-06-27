import React, { useEffect, useRef, useState } from "react";

function PhotoBooth() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [hasUploaded, setHasUploaded] = useState(false);
  const [showWelcome, setShowWelcome] = useState(() => {
    return !sessionStorage.getItem("welcomeShown");
  });

  const [status, setStatus] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const [capturedBlob, setCapturedBlob] = useState(null);
  const [previewProgress, setPreviewProgress] = useState(false);

  // Show welcome message once per session
  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        sessionStorage.setItem("welcomeShown", "true");
        setShowWelcome(false);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  // Initialize camera and session upload state
  useEffect(() => {
    const uploaded = sessionStorage.getItem("hasUploaded");
    if (uploaded === "true") setHasUploaded(true);

    navigator.mediaDevices
      .getUserMedia({ video: true })
      .then((stream) => {
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      })
      .catch((err) => {
        console.error("Camera access error:", err);
        setStatus("Unable to access camera");
      });
  }, []);

  // Auto-cancel preview after 15 seconds
  useEffect(() => {
    if (previewMode && capturedBlob) {
      setPreviewProgress(true);
      const timeout = setTimeout(() => {
        setPreviewMode(false);
        setCapturedBlob(null);
        setPreviewProgress(false);
        setStatus("Preview timed out — try again!");
      }, 15000);

      return () => clearTimeout(timeout);
    }
  }, [previewMode, capturedBlob]);

  const captureAndPreview = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      setCapturedBlob(blob);
      setPreviewMode(true);
      setPreviewProgress(true);
      setStatus("");
    }, "image/jpeg");
  };

  const handleUploadConfirmed = () => {
    if (!capturedBlob) return;

    const formData = new FormData();
    formData.append("photo", capturedBlob, "snapshot.jpg");

    setStatus("Uploading...");

    const xhr = new XMLHttpRequest();
    xhr.open("POST", "https://gallery.viecreatives.com/api/upload");

    xhr.onload = () => {
      if (xhr.status === 200) {
        sessionStorage.setItem("hasUploaded", "true");
        setHasUploaded(true);
        setPreviewMode(false);
        setCapturedBlob(null);
        setStatus("Thanks for your photo! 💫");
      } else {
        setStatus("Upload failed. Please try again.");
      }
    };

    xhr.onerror = () => {
      setStatus("Upload error. Please check your connection.");
    };

    xhr.send(formData);
  };

  return (
    <div className="relative min-h-screen bg-gray-50 flex flex-col items-center justify-center px-6 py-10 space-y-6 text-center">

      {showWelcome && (
        <div className="fixed top-4 inset-x-0 mx-auto w-fit z-50 bg-yellow-200 text-yellow-900 px-6 py-3 rounded shadow-md animate-fade-in">
          <strong>Help us create memories today!</strong><br />
          Take 20 of your best photos today 📸✨
        </div>
      )}

      <h1 className="text-3xl font-bold text-gray-800">Photo Booth</h1>

      {!hasUploaded && !previewMode && (
        <>
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full max-w-md rounded-lg shadow"
          />
          <button
            onClick={captureAndPreview}
            className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-full hover:bg-blue-700 font-semibold"
          >
            Snap a Photo 📷
          </button>
        </>
      )}

      {previewMode && capturedBlob && (
        <div className="flex flex-col items-center space-y-4">
          <img
            src={URL.createObjectURL(capturedBlob)}
            alt="Preview"
            className="w-full max-w-xs rounded shadow"
          />

          {previewProgress && (
            <div className="relative w-full max-w-xs h-2 bg-gray-200 rounded overflow-hidden">
              <div className="absolute left-0 top-0 h-full bg-yellow-400 animate-bar" />
            </div>
          )}

          <div className="flex gap-4 mt-3">
            <button
              onClick={() => {
                setPreviewMode(false);
                setCapturedBlob(null);
                setPreviewProgress(false);
                setStatus("");
              }}
              className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
            >
              Retake 🔄
            </button>
            <button
              onClick={handleUploadConfirmed}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Upload ✅
            </button>
          </div>
        </div>
      )}

      {hasUploaded && (
        <div className="text-green-600 font-medium text-lg mt-6">
          ✅ You've already taken your photo this session. Thanks!
        </div>
      )}

      {status && <p className="text-sm text-gray-600 mt-2">{status}</p>}

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

export default PhotoBooth;
