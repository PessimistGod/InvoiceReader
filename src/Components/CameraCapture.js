import React, { useRef, useState, useEffect } from 'react';
import Cropper from 'react-easy-crop';
import Webcam from 'react-webcam';
import { BiCamera } from 'react-icons/bi';
import { MdOutlineCameraswitch } from 'react-icons/md';
import { FaSearchPlus, FaSearchMinus, FaCheck } from 'react-icons/fa';

const CameraCapture = ({ setSelectedImage }) => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [showSelected, setShowSelected] = useState(false);
  const [aspectRatio, setAspectRatio] = useState(4 / 3); // Default aspect ratio

  useEffect(() => {
    // Dynamically adjust aspect ratio based on screen size
    const handleResize = () => {
      const { innerWidth, innerHeight } = window;
      setAspectRatio(innerWidth < innerHeight ? 3 / 4 :  4 / 3); // Adjust aspect ratio for portrait or landscape orientation
    };
    handleResize(); // Call once to set initial aspect ratio
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
    setShowSelected(true);
  };

  const switchCamera = () => {
    setIsFrontCamera(!isFrontCamera);
  };

  const onCropComplete = (croppedArea, croppedAreaPixels) => {
    if (croppedAreaPixels) {
      const image = new Image();
      image.onload = () => {
        const scaleX = image.naturalWidth / webcamRef.current.video.clientWidth;
        const scaleY = image.naturalHeight / webcamRef.current.video.clientHeight;
        const canvas = document.createElement('canvas');
        canvas.width = croppedAreaPixels.width * scaleX;
        canvas.height = croppedAreaPixels.height * scaleY;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(
          image,
          croppedAreaPixels.x * scaleX,
          croppedAreaPixels.y * scaleY,
          croppedAreaPixels.width * scaleX,
          croppedAreaPixels.height * scaleY,
          0,
          0,
          croppedAreaPixels.width * scaleX,
          croppedAreaPixels.height * scaleY
        );
        canvas.toBlob(blob => setSelectedImage(blob), 'image/jpeg');
      };
      image.src = capturedImage;
    } else {
      console.error('croppedAreaPixels is undefined');
    }
  };

  const handleZoomIn = () => {
    setZoom(prevZoom => Math.min(prevZoom + 0.1, 3));
  };

  const handleZoomOut = () => {
    setZoom(prevZoom => Math.max(prevZoom - 0.1, 1));
  };

  return (
    <div className="relative bg-gray-200 rounded-lg overflow-hidden">
      <Webcam
        audio={false}
        ref={webcamRef}
        screenshotFormat="image/jpeg"
        videoConstraints={{ facingMode: isFrontCamera ? 'user' : 'environment' }}
        className="w-full h-full"
      />
      <div className="absolute top-4 left-4 flex space-x-4">
        <button onClick={captureImage} className="bg-gray-800 text-white py-2 px-4 rounded-lg flex items-center">
          <BiCamera className="mr-2" /> Capture Image
        </button>
        <button onClick={switchCamera} className="bg-gray-800 text-white py-2 px-4 rounded-lg flex items-center">
          <MdOutlineCameraswitch className="mr-2" /> Switch Camera
        </button>
      </div>
      {capturedImage && showSelected && (
        <>
          <Cropper
            image={capturedImage}
            crop={crop}
            zoom={zoom}
            aspect={aspectRatio}
            onCropChange={setCrop}
            onCropComplete={onCropComplete}
            onZoomChange={setZoom}
            style={{
              containerStyle: { width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 },
              mediaStyle: { maxWidth: '100%', maxHeight: '100%' },
              cropAreaStyle: { borderColor: 'red' },
            }}
            classes={{
              containerClassName: 'custom-container-class',
              mediaClassName: 'custom-media-class',
              cropAreaClassName: 'custom-crop-area-class',
            }}
          />
          <div className="absolute top-4 right-4 space-y-4">
            <button onClick={handleZoomIn} className="bg-blue-500 text-white py-2 px-4 flex items-center rounded-full justify-center">
              <FaSearchPlus className="mr-2" />
            </button>
            <button onClick={handleZoomOut} className="bg-blue-500 text-white py-2 px-4 flex items-center rounded-full justify-center">
              <FaSearchMinus className="mr-2" />
            </button>
          </div>
          <div className="absolute bottom-4 right-4">
            <button
              onClick={() => onCropComplete()}
              className="bg-green-500 text-white py-2 px-4 rounded-lg flex items-center"
            >
              <FaCheck className="mr-2" /> Approve
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default CameraCapture;
