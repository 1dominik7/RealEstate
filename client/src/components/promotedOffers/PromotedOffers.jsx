import React, { useEffect, useState } from "react";
import "./promotedOffers.scss";
import { Link } from "react-router-dom";
import apiRequest from "../../lib/apiRequest";
import { numberWithSpace } from "../../utils/numberWithSpace";
import PulseAnimationContainer from "../../ui/PulseAnimationContainer";

const dummyData = new Array(4).fill('');

const PromotedOffers = () => {
  const [data, setData] = useState();
  const [number, setNumber] = useState(6);

  useEffect(() => {
    const read = async () => {
      try {
        const res = await apiRequest.get("/posts/promoted/true");
        setData(res.data);
      } catch (error) {
        console.log(error.response.data.message);
      }
    };
    read();
  }, []);

  const showMoreOffers = () => {
    if (number + 3 <= data?.length) {
      setNumber(number + 3);
    } else {
      setNumber(data?.length);
    }
  };

  if (!data)
  return (
    <PulseAnimationContainer>
      <div style={{marginTop:"30px"}}>
        <div>
          {dummyData.map((_, index) => {
            return <div key={index}/>;
          })}
        </div>
      </div>
    </PulseAnimationContainer>
  );

  return (
    <div className="promotedContainer">
      <div className="wrapper">
        <h1>Promoted offers</h1>
        <div className="offersContainer">
          {data?.slice(0, number).map((item) => (
            <Link key={item.id} to={`/${item.id}`} className="offerContainer">
              <img src={item?.images[0] || "/pet.png"} alt="" />
              <div className="offerDetails">
                <h2>{numberWithSpace(item.price)} $</h2>
                <span>
                  {item.address}, {item.city}
                </span>
              </div>
            </Link>
          ))}
        </div>
        {data?.length > number && (
          <button className="offerButton" onClick={showMoreOffers}>
            See more
          </button>
        )}
      </div>
    </div>
  );
};

export default PromotedOffers;
