import React from 'react';

interface GalleryProps {
  images: string[];
  onImageClick: (imageUrl: string) => void;
  selectedImage?: string;
}

const Gallery: React.FC<GalleryProps> = ({ images, onImageClick, selectedImage }) => {
  if (!images || images.length === 0) {
    return (
      <div className="flex items-center justify-center h-32 bg-gray-100 rounded-lg">
        <p className="text-gray-500 text-sm">No images available</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-2 lg:grid-cols-1 lg:gap-4">
      {images.map((image, index) => (
        <div
          key={index}
          className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all duration-200 hover:border-indigo-500 ${
            selectedImage === image ? 'border-indigo-500 ring-2 ring-indigo-200' : 'border-gray-200'
          }`}
          onClick={() => onImageClick(image)}
        >
          <img
            src={image}
            alt={`Product view ${index + 1}`}
            className="w-full h-24 lg:h-32 object-cover transition-transform duration-200 hover:scale-105"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  );
};

export default Gallery;