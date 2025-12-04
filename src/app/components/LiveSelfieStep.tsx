import { useState, useRef, useCallback, useEffect } from "react";
import { Camera, ArrowLeft, ArrowRight, RefreshCw, Upload } from "lucide-react";
import Image from "next/image";
import { useOnboardingStore } from "../../store/onboardingStore";

interface LiveSelfieStepProps {
  onNext: () => void;
  onBack: () => void;
}

export default function LiveSelfieStep({
  onNext,
  onBack,
}: LiveSelfieStepProps) {
  const { selfie, setSelfie } = useOnboardingStore();
  const [capturedImage, setCapturedImage] = useState<string | null>(
    selfie?.image || null
  );
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  }, []);

  const startCamera = useCallback(async () => {
    // Stop existing stream if any
    if (streamRef.current) {
      stopCamera();
    }

    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "user", width: 1280, height: 720 },
        audio: false,
      });

      streamRef.current = stream;
      setIsCameraActive(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      setError("Unable to access camera. Please check permissions.");
      setIsCameraActive(false);
    }
  }, [stopCamera]);

  // Attach stream to video element when it becomes available
  useEffect(() => {
    if (isCameraActive && videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current;
      videoRef.current.play().catch((err) => {
        console.error("Error playing video:", err);
      });
    }
  }, [isCameraActive]);

  // Auto-start camera on mount (only if no captured image exists)
  useEffect(() => {
    let mounted = true;
    
    // Don't start camera if we already have a captured image
    if (capturedImage) {
      return;
    }

    const initializeCamera = async () => {
      try {
        setError(null);
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: 1280, height: 720 },
          audio: false,
        });

        if (mounted) {
          streamRef.current = stream;
          setIsCameraActive(true);
        } else {
          // Component unmounted, stop the stream
          stream.getTracks().forEach((track) => track.stop());
        }
      } catch (err) {
        if (mounted) {
          console.error("Error accessing camera:", err);
          setError("Unable to access camera. Please check permissions.");
          setIsCameraActive(false);
        }
      }
    };

    initializeCamera();

    return () => {
      mounted = false;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
        streamRef.current = null;
      }
      setIsCameraActive(false);
    };
  }, [capturedImage]);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      // Ensure video is ready and has valid dimensions
      if (video.readyState < 2 || video.videoWidth === 0 || video.videoHeight === 0) {
        console.warn("Video not ready for capture");
        return;
      }

      const context = canvas.getContext("2d");

      if (context) {
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;

        // Draw the image
        context.drawImage(video, 0, 0, canvas.width, canvas.height);

        const imageData = canvas.toDataURL("image/jpeg", 0.92); // 0.92 quality for better compression
        setCapturedImage(imageData);
        // Update store immediately
        setSelfie(imageData);
        stopCamera();
      }
    }
  }, [stopCamera, setSelfie]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    setSelfie(null); // Clear selfie from store when retaking
    startCamera();
  }, [startCamera, setSelfie]);

  return (
    <div className="w-full mx-auto max-w-4xl  my-auto flex flex-col h-full">
      <div className="mb-6">
        <p className="text-sm text-gray-500">Step 3 of 5</p>
        <h1 className="mt-2 text-3xl font-bold text-gray-900">
          Add <span className="text-[#0F62FE]">Live Selfie</span>
        </h1>
        <p className="mt-4 text-gray-600">
          For verification, please capture a live selfie. Make sure your face is
          clearly visible.
        </p>
      </div>

      {/* Camera/Image Display Area */}
      <div className="relative w-full aspect-video h-[400px] bg-[#D4A574] rounded-lg overflow-hidden mb-6 flex items-center justify-center group bg-gray-100">
        {error && (
          <div className="text-red-500 text-center px-4">
            <p>{error}</p>
            <button
              onClick={startCamera}
              className="mt-2 text-sm underline hover:text-red-700"
            >
              Try Again
            </button>
          </div>
        )}

        {!capturedImage && !isCameraActive && !error && (
          <div className="text-gray-500">Starting Camera...</div>
        )}

        {isCameraActive && !capturedImage && (
          <video
            ref={videoRef}
            autoPlay
            playsInline
            muted
            onClick={capturePhoto} // Click video to capture
            className="w-full h-full object-cover cursor-pointer transform scale-x-[-1]" // Mirror effect
          />
        )}

        {capturedImage && (
          <div className="relative w-full h-full">
            <Image
              src={capturedImage}
              alt="Captured selfie"
              fill
              className="object-cover transform scale-x-[-1]" // Mirror effect for consistency
            />
          </div>
        )}

        {/* Face guide overlay */}
        {isCameraActive && !capturedImage && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="w-64 h-80 border-2 border-white/50 rounded-[50%] border-dashed"></div>
          </div>
        )}
      </div>

      {/* Camera Control Buttons */}
      <div className="flex justify-center gap-4 mb-6 min-h-[80px] items-center">
        {isCameraActive && !capturedImage && (
          <button
            onClick={capturePhoto}
            className="bg-[#0F62FE] text-white p-5 rounded-full hover:bg-blue-700 transition-all shadow-lg hover:scale-105"
            title="Capture Photo"
          >
            <Camera size={32} />
          </button>
        )}

        {capturedImage && (
          <div className="flex gap-4">
            <button
              onClick={retakePhoto}
              className="flex items-center gap-2 px-6 py-2 rounded-lg border-2 border-blue-400 text-blue-500 font-semibold hover:bg-blue-50 transition-colors"
            >
              Retake
            </button>
            <button
              onClick={() => {
                // Ensure store is updated and camera is stopped
                setSelfie(capturedImage);
                stopCamera();
                onNext();
              }}
              style={{
                background: "linear-gradient(180deg, #297AE0 0%, #0054BE 100%)",
              }}
              className="flex items-center gap-2 px-6 py-2 rounded-lg text-white font-semibold hover:opacity-90 transition-opacity shadow-md"
            >
              <Upload size={20} />
              Continue
            </button>
          </div>
        )}
      </div>

      {/* Hidden canvas for capturing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Navigation Buttons */}
      <div className="mt-auto flex justify-between items-center max-w-4xl w-full pt-6">
        <button
          onClick={() => {
            stopCamera();
            onBack();
          }}
          className="flex items-center gap-2 font-semibold text-gray-900 hover:text-[#0F62FE] transition-colors"
        >
          <ArrowLeft size={20} /> Back
        </button>

        <button
          onClick={() => {
            if (capturedImage) {
              // Ensure selfie is saved to store before proceeding
              setSelfie(capturedImage);
              stopCamera();
              onNext();
            }
          }}
          disabled={!capturedImage}
          className={`flex items-center gap-2 font-semibold transition-colors ${
            capturedImage
              ? "text-[#0F62FE] hover:underline"
              : "text-gray-400 cursor-not-allowed"
          }`}
        >
          Next <ArrowRight size={20} />
        </button>
      </div>
    </div>
  );
}
