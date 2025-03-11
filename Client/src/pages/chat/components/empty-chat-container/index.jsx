import { animationDefaultOptions } from "@/lib/utils";
import Lottie from "lottie-react";
const EmptyChatContainer = () => {
  return (
    <div className="md:bg-[#1c1d25] flex-1 md:flex flex-col items-center justify-center hidden duration-1000 transition-all">
      <Lottie
        animationData={animationDefaultOptions.animationData}
        loop={animationDefaultOptions.loop}
        autoplay={animationDefaultOptions.autoplay}
        style={{ height: 200, width: 200 }}
      />
      <div className="text-opacity-80 text-white flex flex-col gap-5 items-center mt-10 lg:text-4xl text-3xl duration-300 transition-all text-center">
        <h3 className="poppins-medium">
          Hi<span className="text-purple-500">! </span>Welcome to
          <span className="text-purple-500"> VibeChat</span> Chat App
          <span className="text-purple-500">.</span>
        </h3>
      </div>
    </div>
  );
};

export default EmptyChatContainer;
