import React from "react";
import { useLottie } from "lottie-react";
import successLottie from "../utils/successLottie.json";
import { height, width } from "@mui/system";
import './lottieSuccess.scss'

const LottieSuccess = () => {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: successLottie,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
        className: "lottie-svg-class",
        id: "lottie-svg-id"
      }
  };

  const { View } = useLottie(defaultOptions);

  return <>{View}</>;
};

export default LottieSuccess;
