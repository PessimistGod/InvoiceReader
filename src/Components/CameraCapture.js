import React, { useRef, useState } from 'react';
import Webcam from 'react-webcam';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';

const CameraCapture = ({ setSelectedImage }) => {
  const webcamRef = useRef(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [isFrontCamera, setIsFrontCamera] = useState(true);
  const [crop, setCrop] = useState({ aspect: 1 });
  const [croppedImage, setCroppedImage] = useState(null);

  const captureImage = () => {
    const imageSrc = webcamRef.current.getScreenshot();
    setCapturedImage(imageSrc);
  };

  const switchCamera = () => {
    setIsFrontCamera(!isFrontCamera);
  };

  const closeImage = () => {
    setCapturedImage(null);
  };

  const useImage = () => {
    setSelectedImage(croppedImage || capturedImage);
    setCapturedImage(null);
    setCroppedImage(null);
  };

  const onCropChange = (crop) => {
    setCrop(crop);
  };

  const onCropComplete = (crop) => {
    if (crop.width && crop.height) {
      cropImage(crop);
    }
  };

  const cropImage = (crop) => {
    const canvas = document.createElement('canvas');
    const image = new Image();
    image.src = capturedImage;
    image.onload = () => {
      const scaleX = image.naturalWidth / image.width;
      const scaleY = image.naturalHeight / image.height;
      const ctx = canvas.getContext('2d');
      canvas.width = crop.width;
      canvas.height = crop.height;
      ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0,
        0,
        crop.width,
        crop.height
      );
      const croppedImageUrl = canvas.toDataURL('image/jpeg');
      setCroppedImage(croppedImageUrl);
    };
  };

  return (
    <div className="relative">
      {capturedImage && (
        <>
          <ReactCrop
            src={capturedImage}
            crop={crop}
            onChange={onCropChange}
            onComplete={onCropComplete}
          />
          <button onClick={closeImage} className="absolute top-4 left-4 bg-red-500 text-white py-2 px-4 rounded">
            Close
          </button>
          <button onClick={useImage} className="absolute top-4 right-4 bg-green-500 text-white py-2 px-4 rounded">
            Use Image
          </button>
        </>
      )}
      {!capturedImage && (
        <>
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
        </>
      )}
    </div>
  );
};

export default CameraCapture;
