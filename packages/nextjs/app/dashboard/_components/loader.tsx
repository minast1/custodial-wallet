import React from "react";

const Loader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-background/80 backdrop-blur-sm">
      <div className="relative">
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-muted border-t-primary"></div>
        <div className="absolute inset-0 h-16 w-16 animate-ping rounded-full border-4 border-primary opacity-20"></div>
      </div>
    </div>
  );
};

export default Loader;
