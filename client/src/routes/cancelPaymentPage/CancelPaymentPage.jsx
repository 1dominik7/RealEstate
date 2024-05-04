import React from "react";
import LottieFailed from "../../ui/LottieFailed";
import { Link } from "react-router-dom";
import './cancelPaymentPage.scss'

const CancelPaymentPage = () => {
  return (
    <div className="failedContainer">
      <LottieFailed />
      <h1>Payment has been failed !!</h1>
      <Link to="/profile" className="button">
        Home
      </Link>
    </div>
  );
};

export default CancelPaymentPage;
