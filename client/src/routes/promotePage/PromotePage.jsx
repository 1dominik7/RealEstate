import React, { useState } from "react";
import "./promotePage.scss";
import CheckIcon from "@mui/icons-material/Check";
import { useLocation, useNavigate } from "react-router-dom";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import CheckoutForm from "../../ui/CheckoutForm";

const PromotePage = () => {
  const [option, setOption] = useState(7);
  const [price, setPrice] = useState(9);
  const [optionName, setOptionName] = useState("Midi");
  const [image, setImage] = useState("/promo2.png")
  const navigate = useNavigate();
  const location = useLocation();
  const [clientSecret, setClientSecret] = useState("");

  const options = {
    clientSecret,
    appearance: {
      theme: "stripe",
    },
  };

  const addPromotionHandler = async () => {
    const stripe = await loadStripe(
      import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
    );

    const headers = {
      "Content-Type": "application/json",
    };

    const body = {
      items: {
        price,
        title: optionName,
        promoDays: option,
        id: location.state.id,
        image: image
    }
    }

    try {
      const res = await fetch(`http://localhost:8800/api/stripe/create-checkout-session`, {
        method:"POST",
        headers:headers,
        body:JSON.stringify(body)
      });
      
      const session = await res.json()

      await stripe.redirectToCheckout({
        sessionId: session.id
      })

    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="promoteContainer">
      <div className="header">
        <img src={location.state.images[0]} alt="" />
        <h1 className="title">{location?.state?.title}</h1>
      </div>
      <div className="info">
        <div className="number">1</div>
        <span className="infoText">Promote your ad and get more views!</span>
      </div>
      <div className="boxesContainer">
        <div
          className="box"
          onClick={() => {
            setOption(3);
            setPrice(7);
            setOptionName("Mini");
          }}
          style={{
            outline: option === 3 ? "2px solid rgb(42, 42, 139)" : null,
          }}
        >
          <img src="/promo1.png" alt="" />
          <span className="promoboxTitle">Mini</span>
          <span className="promoboxPrice">7 $</span>
          <span className="promoboxViews">up to 3x more views</span>
          <div className="details">
            <div className="detail">
              <CheckIcon style={{ color: "lightgreen" }} />
              <span className="viewText">Honorable mention for 3 days</span>
            </div>
          </div>
          <div
            className="button"
            style={{
              opacity: option === 3 ? "0.5" : null,
            }}
          >
            Choose
          </div>
        </div>
        <div
          className="box"
          onClick={() => {
            setOption(7);
            setPrice(9);
            setOptionName("Midi");
          }}
          style={{
            outline: option === 7 ? "2px solid rgb(42, 42, 139)" : null,
          }}
        >
          <div className="common">Most frequently chosen</div>
          <img src="/promo2.png" alt="" />
          <span className="promoboxTitle">Midi</span>
          <span className="promoboxPrice">9 $</span>
          <span className="promoboxViews">up to 7x more views</span>
          <div className="details">
            <div className="detail">
              <CheckIcon style={{ color: "lightgreen" }} />
              <span className="viewText">Honorable mention for 7 days</span>
            </div>
          </div>
          <div
            className="button"
            style={{
              opacity: option === 7 ? "0.5" : null,
            }}
          >
            Choose
          </div>
        </div>
        <div
          className="box"
          onClick={() => {
            setOption(30);
            setPrice(15);
            setOptionName("Maxi");
          }}
          style={{
            outline: option === 30 ? "2px solid rgb(42, 42, 139)" : null,
          }}
        >
          <img src="/promo3.png" alt="" />
          <span className="promoboxTitle">Maxi</span>
          <span className="promoboxPrice">15 $</span>
          <span className="promoboxViews">up to 12x more views</span>
          <div className="details">
            <div className="detail">
              <CheckIcon style={{ color: "lightgreen" }} />
              <span className="viewText">Honorable mention for 30 days</span>
            </div>
          </div>
          <div
            className="button"
            style={{
              opacity: option === 30 ? "0.5" : null,
            }}
          >
            Choose
          </div>
        </div>
      </div>
      <div className="bottomPanel">
        <div onClick={() => navigate(-1)} className="leftButton">
          Resigns
        </div>
        <div onClick={addPromotionHandler} className="rightButton">
          Add promotion ( {price} $ )
        </div>
      </div>
      {clientSecret && (
        <Elements options={options} stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      )}
    </div>
  );
};

export default PromotePage;
