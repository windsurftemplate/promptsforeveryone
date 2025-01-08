import React from 'react';
import ChatWindow from './ChatWindow';

const Hero = () => {
  return (
    <div className="relative isolate px-6 pt-14 lg:px-8">
      <div className="mx-auto max-w-6xl py-32 sm:py-48 lg:py-56">
        <div className="flex justify-between items-center">
          <div className="text-left max-w-2xl">
            {/* Existing hero content... */}
          </div>
          
          <div className="hidden md:block">
            <ChatWindow />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero; 