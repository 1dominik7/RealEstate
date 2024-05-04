import React from "react";
import "./searchInput.scss";

const SearchInput = ({ queryCity, setQuery, data }) => {

  const handleCheck = (city) => {
    if (queryCity?.includes(city)) {
      const filterCities = queryCity?.filter((cities) => cities !== city);
      setQuery((prevState) => ({
        ...prevState,
        city: filterCities,
      }));
    } else {
      setQuery((prevState) => ({
        ...prevState,
        city: [...queryCity, city],
      }));
    }
  };

  return (
    <div className="inputContainer">
      <div className="wrapperInput">
        {queryCity?.length >= 1 && (
          <>
            <span>Chosen</span>
            <div className="selected">
              {queryCity?.map((item, index) => (
                item.length > 1 &&
                <div
                  key={index}
                  className="itemSelected"
                  onClick={() => handleCheck(item, index)}
                >
                  <input
                    className="selectedInput"
                    type="checkbox"
                    checked={queryCity.includes(item)}
                    onChange={(e) => {}}
                  />
                  <span>{item}</span>
                </div>                
                
              ))}
            </div>
          </>
        )}
        <span className="desc">Choose location</span>
        <div className="selectedItems">
          {data?.map((item, index) => (
            <div
              className="selectedItem"
              key={index}
              onClick={() => handleCheck(item.city)}
            >
              <input
                type="checkbox"
                checked={queryCity?.includes(item.city)}
                onChange={(e) => {}}
              />
              <span>{item.city}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SearchInput;
