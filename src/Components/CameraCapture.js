import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';

const CameraCapture = () => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isFrontCamera, setIsFrontCamera] = useState(true);

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  const switchCamera = () => {
    setIsFrontCamera(!isFrontCamera);
  };

  return (
    <div className="relative">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: isFrontCamera ? 'user' : 'environment' }}
        width={640}
        height={480}
      />
      <button onClick={captureImage} className="absolute bottom-4 left-4 bg-gray-800 text-white py-2 px-4 rounded">
        Capture Image
      </button>
      <button onClick={switchCamera} className="absolute bottom-4 right-4 bg-gray-800 text-white py-2 px-4 rounded">
        Switch Camera
      </button>
      {capturedImage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white p-4 rounded-lg">
            <h2 className="text-lg font-semibold mb-2">Captured Image:</h2>
            <img src={capturedImage} alt="Captured" className="max-w-xs" />
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraCapture;
