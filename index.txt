import React, { useEffect, useState } from "react";
import Tesseract from "tesseract.js";
import Loading from "../Components/Loading";
import { backendURL } from "../Constants";

const Home = () => {
  const [result, setResult] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const convertImageToText = async () => {
      setIsLoading(true);
      try {
        if (selectedImage) {
          // Send the selected image to the backend for enhancement
          const enhancedImage = await enhanceImage(selectedImage);
          const { data } = await Tesseract.recognize(enhancedImage);

          const formattedText = data.text.replace(/\n/g, "<br />");
          setResult(formattedText);
        }
      } catch (error) {
        console.error("Error during OCR:", error);
        setResult("Error Reading Image");
      } finally {
        setIsLoading(false);
      }
    };

    convertImageToText();
  }, [selectedImage]);

  const handleImageChange = async (e) => {
    setIsLoading(true);
    try {
      const enhancedImage = await enhanceImage(e.target.files[0]);
      setSelectedImage(enhancedImage);
    } catch (error) {
      console.error("Error enhancing image:", error);
      setResult("Error Enhancing Image");
    } finally {
      setIsLoading(false);
    }
  };

  const enhanceImage = async (image) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("image", image);
      const response = await fetch(`${backendURL}/upload`, {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const enhancedImageBlob = await response.blob();
        return new File([enhancedImageBlob], "enhanced-image.jpg");
      } else {
        throw new Error("Error enhancing image");
      }
    } catch (error) {
      console.error("Error enhancing image:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto my-20">
      <h1 className="font-bold text-5xl">Extract Data From Image</h1>
      <div className="relative flex mt-8">
        <label
          htmlFor="imageInput"
          className="p-4 bg-black text-white border rounded-3xl cursor-pointer"
        >
          Upload Image
        </label>
        <input
          id="imageInput"
          className="hidden"
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>

      {selectedImage && (
        <>
          <div className="w-20 h-20 mx-auto">
            <img
              className=""
              src={URL.createObjectURL(selectedImage)}
              alt=""
            />
          </div>

          {isLoading ? (
            <Loading />
          ) : (
            <div className="result">
              <p dangerouslySetInnerHTML={{ __html: result }}></p>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Home;
