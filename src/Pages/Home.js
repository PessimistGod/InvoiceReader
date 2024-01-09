import React, { useEffect, useState } from 'react';
import Tesseract from 'tesseract.js';
import Loading from '../Components/Loading';

const Home = () => {
  const [result, setResult] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const convertImageToText = async () => {
      try {
        setIsLoading(true)
        if (selectedImage) {
          const { data } = await Tesseract.recognize(selectedImage);
          const formattedText = data.text.replace(/\n/g, '<br />');

          setResult(formattedText);
        }
        setIsLoading(false)
      } catch (error) {
        console.error('Error during OCR:', error);
        setResult("Error Reading Image");
        setIsLoading(false)
        // Handle the error (e.g., show an error message to the user)
      }
    };

    convertImageToText();
  }, [selectedImage]);



  const handleImageChange = (e) => {
    setIsLoading(true)
    setSelectedImage(e.target.files[0]);
    setIsLoading(false)

};

  return (
    <div className='max-w-4xl mx-auto my-20'>
      <h1 className='font-bold text-5xl'>Extract Data From Image</h1>
      <div className='relative flex mt-8'>
        <label htmlFor="imageInput" className='p-4 bg-black text-white border rounded-3xl cursor-pointer'>
          Upload Image
        </label>
        <input
          id="imageInput"
          className='hidden'
          type="file"
          name="image"
          accept='image/*'
          onChange={handleImageChange}
        />
      </div>

      {selectedImage && (
  <>
    <div className='w-20 h-20 mx-auto'>
      <img className='' src={URL.createObjectURL(selectedImage)} alt="" />
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