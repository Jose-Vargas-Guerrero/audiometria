import React, { useState } from "react";

const DragAndDrop = () => {
  const [images, setImages] = useState([]);

  const handleDrop = (event) => {
    event.preventDefault();

    const files = Array.from(event.dataTransfer.files);
    const imageFiles = files.filter((file) => file.type.startsWith("image/"));

    const imageUrls = imageFiles.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...imageUrls]);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  return (
   <>
    <div
     
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <p>Arrastra tus imágenes aquí</p>
    </div>
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
      {images.map((src, index) => (
        <img
          key={index}
          src={src}
          alt={`Uploaded ${index + 1}`}
          style={{ width: "100px", height: "100px", objectFit: "cover" }}
        />
      ))}
    </div></>
  );
};

export default DragAndDrop;
