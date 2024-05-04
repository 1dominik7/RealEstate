import React, { useContext } from "react";
import "./aboutPage.scss";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Footer from "../../components/footer/Footer";

const AboutPage = () => {

    const { currentUser } = useContext(AuthContext);

  return (
    <div className="aboutContainer">
      <div className="aboutTop">
        <div className="aboutLeft">
          <div className="titleContainer">
            <h1>We address</h1>
            <h1 className="green">dreams</h1>
          </div>
          <span className="desc">
            Realestate is the most popular website in Poland supporting the
            purchase, sale and rental of real estate. Thanks to many years of
            experience, huge data resources and the synergy of the other real
            estate services, we understand the users of our website. We also
            help them make important decisions regarding residence, investment
            or business.
          </span>
          <Link className="button" to="/list?type=&city=&minPrice=0&maxPrice=0">Find property</Link>
        </div>
        <div className="aboutRight">
          <img src="/aboutscreen.png" alt="" />
        </div>
      </div>
      <div className="line">
        <div></div>
        </div>
      <div className="aboutBottom">
        <div className="titleContainer">
        <h1>Why</h1>
        <h1 className="green">Realestate?</h1>
        </div>
        <span className="boldText">
          We have the largest database of real estate advertisements in Europe.
          We examine preferences, analyze data and help understand the real
          estate market.
        </span>
        <div className="boxesContainer">
          <div className="box">
            <img src="/aboutBuy.jpg" alt="" />
            <span>
              Find your dream property. Browse hundreds of ads for houses,
              apartments, plots, investment premises and other properties that
              you won't find anywhere else.
            </span>
            <Link className="button" to="/list?type=buy&city=&minPrice=0&maxPrice=0">Check properties</Link>
          </div>
          <div className="box">
            <img src="/aboutsell.jpg" alt="" />
            <span>
              Regardless of whether you decide to sell yourself or with the
              support of a real estate agent, we will help you go through the
              process quickly and effficiently. Check out the possibilities!
            </span>
            <Link className="button" to={currentUser ? "/add" : "/login"}>Add property</Link>
          </div>
          <div className="box">
            <img src="/aboutRent.jpg" alt="" />
            <span>
              Discover the advantages of renting. Check out the offers of
              apartments and houses for rent, and we will tell you how to choose
              the best one and find the tenant-landlord relationship.
            </span>
            <Link className="button" to="/list?type=rent&city=&minPrice=0&maxPrice=0">Rent property</Link>
          </div>
        </div>
      <Footer/>
      </div>
    </div>
  );
};

export default AboutPage;
