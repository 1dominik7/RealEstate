import React from "react";
import "./homePage.scss";
import SearchBar from "../../components/searchBar/SearchBar";
import PromotedOffers from "../../components/promotedOffers/PromotedOffers";
import Footer from "../../components/footer/Footer";

const HomePage = () => {
  return (
    <div className="homeContainer">
      <div className="homePage">
        <div className="textContainer">
          <div className="wrapper">
            <h1 className="title">Find Real Estate & Get Your Dream Place</h1>
            <p>
              <b style={{ color: "green", fontSize: 20 }}>Everyone</b> will find
              something for themselves on our website - a house or an apartment,
              modern or traditional, primary or secondary market, ownership or
              rental, practical or with character.
            </p>
            <SearchBar />
            <div className="boxes">
              <div className="box">
                <h1>16+</h1>
                <h2>Years of Experience</h2>
              </div>
              <div className="box">
                <h1>200</h1>
                <h2>Award Gained</h2>
              </div>
              <div className="box">
                <h1>2000+</h1>
                <h2>Property Ready</h2>
              </div>
            </div>
          </div>
        </div>
        <div className="imgContainer">
          <img src="/bg.png" alt="" />
        </div>
      </div>
      <PromotedOffers />
      <Footer />
    </div>
  );
};

export default HomePage;
