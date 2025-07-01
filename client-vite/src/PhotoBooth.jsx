import React, { useEffect, useRef, useState } from "react";
import confetti from "canvas-confetti";

function PhotoBooth() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [photoCount, setPhotoCount] = useState(() =>
    parseInt(sessionStorage.getItem("photoCount") || "0")
  );
  const [hasUploaded, setHasUploaded] = useState(photoCount >= 20);
  const [showWelcome, setShowWelcome] = useState(() =>
    !sessionStorage.getItem("welcomeShown")
  );
  const [status, setStatus] = useState("");
  const [previewMode, setPreviewMode] = useState(false);
  const [capturedBlob, setCapturedBlob] = useState(null);
  const [countdown, setCountdown] = useState(3);
  const [countdownActive, setCountdownActive] = useState(false);
  const [facingMode, setFacingMode] = useState(() => {
    const isMobile = /iPhone|iPad|Android/i.test(navigator.userAgent);
    return isMobile ? "environment" : "user";
  });
  const [isFlipping, setIsFlipping] = useState(false);
  const [showFlash, setShowFlash] = useState(false);

  useEffect(() => {
    if (showWelcome) {
      const timer = setTimeout(() => {
        sessionStorage.setItem("welcomeShown", "true");
        setShowWelcome(false);
      }, 35000);
      return () => clearTimeout(timer);
    }
  }, [showWelcome]);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode },
      });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
    } catch (err) {
      console.error("Camera error:", err);
      setStatus("Unable to access camera");
    }
  };

  useEffect(() => {
    startCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  useEffect(() => {
    if (!countdownActive || !previewMode) return;
    if (countdown === 0) {
      handleUploadConfirmed();
      setCountdownActive(false);
      return;
    }
    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown, countdownActive, previewMode]);

  const captureAndPreview = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    // Flash effect
    setShowFlash(true);
    setTimeout(() => setShowFlash(false), 150);

    // Confetti celebration
    confetti({
      particleCount: 30,
      spread: 60,
      origin: { y: 0.8 }
    });

    const context = canvas.getContext("2d");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
      setCapturedBlob(blob);
      setPreviewMode(true);
      setCountdown(3);
      setCountdownActive(true);
      setStatus("");
      
      // Automatically save to phone
      saveToPhone(blob);
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
        const updatedCount = photoCount + 1;
        sessionStorage.setItem("photoCount", updatedCount);
        setPhotoCount(updatedCount);
        setCapturedBlob(null);
        setPreviewMode(false);
        setCountdownActive(false);
        setStatus(`Photo ${updatedCount}/20 uploaded!`);

        if (updatedCount >= 20) {
          setHasUploaded(true);
        } else {
          startCamera();
        }
      } else {
        setStatus("Upload failed. Please try again.");
      }
    };

    xhr.onerror = () => {
      setStatus("Upload error. Please check your connection.");
    };

    xhr.send(formData);
  };

  const flipCamera = () => {
    setIsFlipping(true);
    setTimeout(() => {
      setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
      setTimeout(() => setIsFlipping(false), 300);
    }, 150);
  };

  const saveToPhone = (blob) => {
    try {
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `snead-wedding-${Date.now()}.jpg`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      URL.revokeObjectURL(url);
      
      setStatus("📱 Photo saved to your device!");
      setTimeout(() => setStatus(""), 3000);
    } catch (error) {
      console.error("Error saving photo:", error);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-amber-50 via-rose-50 to-orange-50 flex flex-col items-center justify-center px-6 py-10 space-y-8 text-center">
      
      {/* Flash Effect */}
      {showFlash && (
        <div className="fixed inset-0 bg-white z-50 opacity-70 pointer-events-none" />
      )}

      {showWelcome && (
        <div className="fixed top-6 inset-x-0 mx-auto w-fit z-50 bg-gradient-to-r from-amber-600 to-orange-600 text-white text-xl sm:text-2xl font-bold px-8 py-6 rounded-2xl shadow-2xl animate-bounce border-4 border-white">
          💕 Help create magical memories! 💕<br />
          <span className="text-lg font-medium">Capture 20 beautiful moments for the happy couple ✨</span>
        </div>
      )}

      <div className="text-center space-y-2">
        <h1 className="text-4xl font-serif text-amber-800 tracking-wide">
          Snead Wedding
        </h1>
        <div className="w-24 h-1 bg-gradient-to-r from-amber-400 to-orange-400 mx-auto rounded-full"></div>
        <p className="text-amber-600 text-sm font-medium">Capture the Love</p>
      </div>

      {!hasUploaded && (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-amber-200">
          <div className="text-amber-700 font-semibold">
            <span className="text-2xl font-bold text-amber-800">{20 - photoCount}</span> 
            <span className="text-lg"> photo{20 - photoCount !== 1 && "s"} remaining</span>
          </div>
          
          {/* Circular Progress */}
          <div className="relative w-16 h-16 mx-auto mt-3">
            <svg className="w-16 h-16 transform -rotate-90" viewBox="0 0 32 32">
              <circle cx="16" cy="16" r="14" stroke="#fed7aa" strokeWidth="4" fill="none" />
              <circle 
                cx="16" cy="16" r="14" 
                stroke="#d97706" strokeWidth="4" fill="none"
                strokeDasharray="87.96" 
                strokeDashoffset={87.96 - (87.96 * photoCount / 20)}
                className="transition-all duration-500"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-amber-800 font-bold text-sm">{photoCount}/20</span>
            </div>
          </div>
        </div>
      )}

      {!hasUploaded && !previewMode && (
        <div className="space-y-6">
          <div className={`relative overflow-hidden rounded-3xl shadow-2xl border-4 border-white transition-transform duration-300 ${isFlipping ? 'scale-x-0' : 'scale-x-100'}`}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full max-w-md aspect-square object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
          </div>
          
          <div className="flex flex-col items-center gap-4">
            <button
              onClick={captureAndPreview}
              className="relative w-20 h-20 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full shadow-xl transform transition-all duration-200 hover:scale-110 active:scale-95 border-4 border-white group"
            >
              <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                <span className="text-2xl">📸</span>
              </div>
              <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full opacity-0 group-hover:opacity-20 animate-pulse"></div>
            </button>
            
            <button
              onClick={flipCamera}
              disabled={isFlipping}
              className="px-6 py-3 bg-white/90 backdrop-blur-sm text-amber-800 rounded-full hover:bg-white shadow-lg border border-amber-200 font-medium transition-all duration-200 hover:scale-105 disabled:opacity-50"
            >
              <span className={`inline-block transition-transform duration-300 ${isFlipping ? 'rotate-180' : ''}`}>
                🔄
              </span>
              <span className="ml-2">Flip Camera</span>
            </button>
          </div>
        </div>
      )}

      {previewMode && capturedBlob && (
        <div className="flex flex-col items-center space-y-6 animate-fade-in">
          <div className="relative">
            <img
              src={URL.createObjectURL(capturedBlob)}
              alt="Preview"
              className="w-full max-w-sm rounded-2xl shadow-2xl border-4 border-white transform rotate-1"
            />
            <div className="absolute -bottom-2 -right-2 bg-white rounded-lg px-3 py-1 shadow-lg border border-amber-200">
              <span className="text-amber-600 text-sm font-medium">✨ Beautiful!</span>
            </div>
          </div>

          {countdownActive && (
            <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-6 py-4 shadow-lg border border-amber-200">
              <div className="text-amber-700 font-semibold animate-pulse">
                Uploading in {countdown}...
              </div>
              <div className="w-32 h-2 bg-amber-200 rounded-full mt-2 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-amber-400 to-orange-400 rounded-full transition-all duration-1000"
                  style={{ width: `${((4 - countdown) / 3) * 100}%` }}
                />
              </div>
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={() => {
                setPreviewMode(false);
                setCapturedBlob(null);
                setStatus("");
                setCountdownActive(false);
                startCamera();
              }}
              className="px-6 py-3 bg-white/90 backdrop-blur-sm text-amber-800 rounded-full shadow-lg border border-amber-200 font-medium hover:bg-white transition-all duration-200"
            >
              🔄 Retake
            </button>
            <button
              onClick={handleUploadConfirmed}
              className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-full shadow-lg font-medium hover:from-green-600 hover:to-emerald-600 transition-all duration-200"
            >
              ✅ Perfect!
            </button>
          </div>
        </div>
      )}

      {hasUploaded && (
        <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-2xl p-8 shadow-lg border border-green-200 space-y-4">
          <div className="text-6xl">🎉</div>
          <div className="text-green-700 font-bold text-xl">
            Mission Complete!
          </div>
          <div className="text-green-600 text-lg">
            Thank you for capturing 20 magical moments!<br />
            <span className="text-sm">All photos are saved to your device and uploaded to the gallery.</span>
          </div>
          <button
            onClick={() => window.location.href = '/gallery'}
            className="px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-full shadow-lg font-medium hover:from-amber-600 hover:to-orange-600 transition-all duration-200"
          >
            View Gallery ✨
          </button>
        </div>
      )}

      {status && (
        <div className="bg-white/90 backdrop-blur-sm rounded-xl px-4 py-2 shadow-lg border border-amber-200">
          <p className="text-amber-700 font-medium">{status}</p>
        </div>
      )}
      
      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
}

export default PhotoBooth;
