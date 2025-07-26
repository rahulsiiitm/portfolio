// src/components/RightSidebar.jsx
import React from 'react';
import { FaLinkedinIn, FaFacebookF, FaTwitter, FaPinterestP } from 'react-icons/fa'; 

function RightSidebar() {
  return (
    <div className="absolute right-0 top-1/2 -translate-y-1/2 flex flex-col items-center justify-center space-y-8 h-full w-[106px] border-l-2 border-[#9D9D9D]/55 z-10">
      
      {/* Visual Scroll Indicator - Enlarged its container height to h-48 */}
      <div className="flex flex-col items-center relative h-48"> 
          {/* Top number */}
          <div className="text-[20px] text-white absolute top-0 -mt-2">01</div> 

          {/* The scroll line - Increased width to w-[3px] */}
          <div className="h-full w-[3px] bg-[#9D9D9D]/55 mt-2"> 
            {/* The white part indicating progress */}
            <div className="bg-white h-1/4 w-full"></div> 
          </div>

          {/* Bottom number - Adjusted position using bottom-[-8px] */}
          <div className="text-[20px] text-white absolute bottom-[-8px]">06</div> {/* Moved "06" slightly below the line */}
      </div>
      
      {/* Social Icons */}
      <div className="flex flex-col space-y-5">
        <a href="#" className="text-white text-xl hover:text-[#FF4500] transition-colors">
          <FaLinkedinIn />
        </a>
        <a href="#" className="text-white text-xl hover:text-[#FF4500] transition-colors">
          <FaFacebookF />
        </a>
        <a href="#" className="text-white text-xl hover:text-[#FF4500] transition-colors">
          <FaTwitter />
        </a>
        <a href="#" className="text-white text-xl hover:text-[#FF4500] transition-colors">
          <FaPinterestP />
        </a>
      </div>
    </div>
  );
}

export default RightSidebar;