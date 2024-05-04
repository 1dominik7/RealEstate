import React, { useEffect, useRef, useState } from "react";
import "./searchBar.scss";
import { Link } from "react-router-dom";
import SearchInput from "../searchInput/SearchInput";
import apiRequest from "../../lib/apiRequest";

const types = ["buy", "rent"];

const SearchBar = () => {
  const [openLocation, setOpenLocation] = useState(false);
  const [query, setQuery] = useState({
    type: "buy",
    city: [],
    minPrice: 0,
    maxPrice: 0,
  });
  const [typing, setTyping] = useState("");
  const [data, setData] = useState();

  const ref = useRef(null);

  const switchType = (val) => {
    setQuery((prev) => ({ ...prev, type: val }));
  };

  const handleChange = (e) => {
    setQuery((prev) => ({ ...prev, [e.target.name]: e.target.value }));
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
      setQuery((prevState) => ({
        ...prevState,
        city: [...query.city, city],
      }));
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
    <div className="searchBar">
      <div className="type">
        {types.map((type) => (
          <button
            key={type}
            onClick={() => switchType(type)}
            className={query.type === type ? "active" : ""}
          >
            {type}
          </button>
        ))}
      </div>
      <form>
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
                    .filter((item) => item.city.toLowerCase().includes(typing.toLowerCase()))
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
            <div className="queryDisplay" onClick={() => setOpenLocation(true)}>
              {query.city.length !== 0 ? query.city.join(" • ") : "Choose City"}
            </div>
          )}
        </div>
        <input
          type="text"
          name="minPrice"
          min={0}
          max={10000000}
          placeholder="Min Price"
          onChange={handleChange}
        />
        <input
          type="text"
          name="maxPrice"
          min={0}
          max={10000000}
          placeholder="Max Price"
          onChange={handleChange}
        />
        <Link
          to={`/list?type=${query.type}&city=${query.city}&minPrice=${query.minPrice}&maxPrice=${query.maxPrice}`}
          state={{ query: query }}
        >
          <button>
            <img src="/search.png" alt="" />
          </button>
        </Link>
      </form>
    </div>
  );
};

export default SearchBar;
