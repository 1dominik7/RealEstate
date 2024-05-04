import React from "react";
import { useLottie } from "lottie-react";
import failedLottie from "../utils/failedLottie.json";
import { height, width } from "@mui/system";
import './lottieFailed.scss'

const LottieFailed = () => {
  const defaultOptions = {
    loop: false,
    autoplay: true,
    animationData: failedLottie,
    rendererSettings: {
        preserveAspectRatio: "xMidYMid slice",
        className: "lottie-svg-class",
        id: "lottie-svg-id"
      }
  };

  const { View } = useLottie(defaultOptions);

  return <>{View}</>;
};

export default LottieFailed;
