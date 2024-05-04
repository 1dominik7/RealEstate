import React, { useEffect, useRef, useState } from "react";
import "./filter.scss";
import { useSearchParams } from "react-router-dom";
import SearchInput from "../searchInput/SearchInput";
import apiRequest from "../../lib/apiRequest";

const Filter = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [openLocation, setOpenLocation] = useState(false);
  const [query, setQuery] = useState({
    type: searchParams.get("type") || "",
    city: searchParams.get("city").split(',') || "",
    property: searchParams.get("property") || "",
    minPrice: searchParams.get("minPrice") || "",
    maxPrice: searchParams.get("maxPrice") || "",
    bedroom: searchParams.get("bedroom") || "",
  });
  const [typing, setTyping] = useState("");
  const [data, setData] = useState();

  const handleChange = (e) => {
    setQuery({
      ...query,
      [e.target.name]: e.target.value,
    });
  };

  const ref = useRef(null);

  const handleFilter = () => {
    setSearchParams({
      ...query,
      city: query.city.join(','),
      type: query.type,
      property: query.property,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      bedroom: query.bedroom,
    });
  };

  const handleChangeCity = (e) => {
    setTyping(e.target.value);
  };

  const useOnClickOutside = (ref, handler) => {
    useEffect(() => {
      const listener = (event) => {
        if (!ref.current || ref.current.contains(event.target)) {
          return;
        }
        handler(event);
      };

      document.addEventListener("mousedown", listener);
      document.addEventListener("touchstart", listener);

      return () => {
        document.removeEventListener("mousedown", listener);
        document.removeEventListener("touchstart", listener);
      };
    }, [ref, handler]);
  };

  useOnClickOutside(ref, () => {
    setOpenLocation(false);
    setTyping("");
  });

  const handleCheck = (city, index) => {
    if (query?.city?.includes(city)) {
      const filterCities = query?.city?.filter((cities) => cities !== city);
      setQuery((prevState) => ({
        ...prevState,
        city: filterCities,
      }));
    } else {
      if(query.city.length < 1){
        setQuery((prevState) => ({
          ...prevState,
          city: [city],
        }));
      } else {
        setQuery((prevState) => ({
          ...prevState,
          city: [...query.city, city],
        }));
      }
    }
  };

  useEffect(() => {
    const getPostsByCity = async () => {
      try {
        const res = await apiRequest("/posts/city/countCity");
        setData(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    getPostsByCity();
  });

  return (
    <div className="filter">
      <h1>
        Search results for{" "}
        <b>
          {searchParams.get("city").split(',').map(item => item.trim()).filter(item => item.length !== 0).join(" • ") ||
            "All over the Poland"}
        </b>
      </h1>
      <div className="top">
        <div className="item">
          <label htmlFor="city">Location</label>
          <div className="locationContainer" ref={ref}>
            {openLocation ? (
              <>
                <input
                  type="text"
                  name="city"
                  placeholder="City"
                  autoComplete="off"
                  onChange={handleChangeCity}
                  onClick={() => setOpenLocation(true)}
                  autoFocus
                />
                {typing.length === 0 ? (
                  <SearchInput
                    queryCity={query.city}
                    setQuery={setQuery}
                    data={data}
                    setData={setData}
                  />
                ) : (
                  <div className="selectedTypingItems">
                    {data
                      .filter((item) =>
                        item.city.toLowerCase().includes(typing)
                      )
                      .map((item, index) => (
                        <div
                          className="typingItem"
                          key={index}
                          onClick={() => handleCheck(item.city)}
                        >
                          <input
                            type="checkbox"
                            checked={query?.city?.includes(item.city)}
                            onChange={(e) => {}}
                          />
                          <span>{item.city}</span>
                        </div>
                      ))}
                  </div>
                )}
              </>
            ) : (
              <div
                className="queryDisplay"
                onClick={() => setOpenLocation(true)}
              >
                {query.city.length !== 0
                  ? query.city.filter(item => item).join(" • ")
                  :
                    "Choose City"}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="bottom">
        <div className="item">
          <label htmlFor="type">Type</label>
          <select
            name="type"
            id="type"
            onChange={handleChange}
            defaultValue={query.type}
          >
            <option value="">any</option>
            <option value="buy">Buy</option>
            <option value="rent">Rent</option>
          </select>
        </div>
        <div className="item">
          <label htmlFor="property">Property</label>
          <select
            name="property"
            id="property"
            onChange={handleChange}
            defaultValue={query.property}
          >
            <option value="">any</option>
            <option value="apartment">Apartment</option>
            <option value="house">House</option>
            <option value="condo">Condo</option>
            <option value="land">Land</option>
          </select>
        </div>
        <div className="item">
          <label htmlFor="minPrice">Min Price</label>
          <input
            type="number"
            id="minPrice"
            name="minPrice"
            placeholder="any"
            onChange={handleChange}
            defaultValue={query.minPrice}
          />
        </div>
        <div className="item">
          <label htmlFor="maxPrice">Max Price</label>
          <input
            type="text"
            id="maxPrice"
            name="maxPrice"
            placeholder="any"
            onChange={handleChange}
            defaultValue={query.maxPrice}
          />
        </div>
        <div className="item">
          <label htmlFor="bedroom">Bedroom</label>
          <input
            type="text"
            id="bedroom"
            name="bedroom"
            placeholder="any"
            onChange={handleChange}
            defaultValue={query.bedroom}
          />
        </div>
        <button onClick={handleFilter}>
          <img src="/search.png" alt="" />
        </button>
      </div>
    </div>
  );
};

export default Filter;
