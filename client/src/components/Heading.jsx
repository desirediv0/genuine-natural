import React from "react";

const Heading = ({ title, description }) => {
  return (
    <div className="text-center">
      <h2 className="text-2xl md:text-5xl font-bold text-black mb-2">
        {title}
      </h2>
      <div className="flex items-center justify-center gap-2">
        <div className="w-12 h-1 bg-black rounded-full"></div>
        <div className="w-3 h-3 bg-black rounded-full"></div>
        <div className="w-12 h-1 bg-black rounded-full"></div>
      </div>

      <p className="text-gray-600 max-w-2xl mx-auto text-sm md:text-base">{description}</p>
    </div>
  );
};

export default Heading;
