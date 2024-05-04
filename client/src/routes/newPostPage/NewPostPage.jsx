import React, { useEffect, useRef, useState } from "react";
import "./newPostPage.scss";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import apiRequest from "../../lib/apiRequest";
import UploadWidget from "../../components/uploadWidget/UploadWidget";
import { useNavigate } from "react-router-dom";
import { City } from "country-state-city";

const NewPostPage = () => {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [images, setImages] = useState([]);
  const [property, setProperty] = useState("apartment");
  const [openLocation, setOpenLocation] = useState(false);
  const [typing, setTyping] = useState("");
  const [city, setCity] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputs = Object.fromEntries(formData);

    try {
      const res = await apiRequest.post("/posts", {
        postData: {
          title: inputs.title,
          price: parseInt(inputs.price) || 0,
          address: inputs.address,
          city: city,
          bedroom: parseInt(inputs.bedroom) || 0,
          bathroom: parseInt(inputs.bathroom) || 0,
          type: inputs.type,
          property: inputs.property,
          latitude: inputs.latitude,
          longitude: inputs.longitude,
          images: images,
        },
        postDetail: {
          desc: value || "",
          utilities: inputs.utilities,
          pet: inputs.pet,
          income: inputs.income || "",
          size: parseInt(inputs.size) || 0,
          school: parseInt(inputs.school) || 0,
          bus: parseInt(inputs.bus) || 0,
          restaurant: parseInt(inputs.restaurant) || 0,
        },
      });
      navigate("/" + res.data.id);
    } catch (error) {
      console.log(error.response.data.message);
      setError(error);
    }
  };

  const ref = useRef(null);

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

  const cityData = City.getCitiesOfCountry("PL");

  const handleChangeCity = (e) => {
    setTyping(e.target.value);
  };

  return (
    <div className="newPostPage">
      <div className="formContainer">
        <h1>Add New Post</h1>
        <div className="wrapper">
          <form onSubmit={handleSubmit}>
            <div className="item">
              <label htmlFor="title">Title</label>
              <input id="title" name="title" type="text" />
            </div>
            <div className="item">
              <label htmlFor="price">Price</label>
              <input
                id="price"
                name="price"
                type="number"
                onKeyDown={(e) => {
                  if (
                    !/[0-9\.]|Backspace|Tab|Enter|Delete|ArrowLeft|ArrowRight/.test(
                      e.key
                    )
                  ) {
                    e.preventDefault();
                  }
                }}
              />
            </div>
            <div className="item">
              <label htmlFor="address">Address</label>
              <input id="address" name="address" type="text" />
            </div>
            <div className="item description">
              <label htmlFor="desc">Description</label>
              <ReactQuill there="snow" onChange={setValue} value={value} />
            </div>
            <div className="item">
              <label htmlFor="city">City</label>
              <div className="cityContainer" ref={ref}>
                {!openLocation ? (
                  <div
                    className="cityInput"
                    onClick={() => setOpenLocation(true)}
                  >
                    <span>{city}</span>
                  </div>
                ) : (
                  <>
                    <input
                      id="city"
                      name="city"
                      type="text"
                      autoComplete="off"
                      onChange={handleChangeCity}
                      onClick={() => setOpenLocation(true)}
                      autoFocus
                    />
                    <div className="citiesList">
                      {...cityData
                        .filter((item) =>
                          item.name.toLowerCase().includes(typing.toLowerCase())
                        )
                        .map((item, index) => (
                          <span
                            key={index}
                            onClick={() => {
                              setCity(item.name);
                              setOpenLocation(false);
                            }}
                          >
                            {item.name}
                          </span>
                        ))}
                    </div>
                  </>
                )}
              </div>
            </div>
            {property !== "land" && (
              <>
                <div className="item">
                  <label htmlFor="bedroom">Bedroom Number</label>
                  <input
                    min={1}
                    id="bedroom"
                    name="bedroom"
                    type="number"
                    onKeyDown={(e) => {
                      if (
                        !/[0-9]|Backspace|Tab|Enter|Delete|ArrowLeft|ArrowRight/.test(
                          e.key
                        )
                      ) {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>
                <div className="item">
                  <label htmlFor="bathroom">Bathroom Number</label>
                  <input
                    min={1}
                    id="bathroom"
                    name="bathroom"
                    type="number"
                    onKeyDown={(e) => {
                      if (
                        !/[0-9]|Backspace|Tab|Enter|Delete|ArrowLeft|ArrowRight/.test(
                          e.key
                        )
                      ) {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>
              </>
            )}
            <div className="item">
              <label htmlFor="latitude">Latitude</label>
              <input
                id="latitude"
                name="latitude"
                type="number"
                min="-180"
                max="180"
                required
                step={0.01}
                onKeyDown={(e) => {
                  if (
                    !/[0-9\.]|Backspace|Tab|Enter|Delete|ArrowLeft|ArrowRight/.test(
                      e.key
                    )
                  ) {
                    e.preventDefault();
                  }
                }}
              />
            </div>
            <div className="item">
              <label htmlFor="longitude">Longitude</label>
              <input
                id="longitude"
                name="longitude"
                type="number"
                min="-180.00"
                max="180.00"
                required
                step={0.01}
                onKeyDown={(e) => {
                  if (
                    !/[0-9\.]|Backspace|Tab|Enter|Delete|ArrowLeft|ArrowRight/.test(
                      e.key
                    )
                  ) {
                    e.preventDefault();
                  }
                }}
              />
            </div>
            <div className="item">
              <label htmlFor="type">Type</label>
              <select name="type">
                <option value="rent" defaultChecked>
                  Rent
                </option>
                <option value="buy">Buy</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="type">Property</label>
              <select
                name="property"
                onChange={(e) => setProperty(e.target.value)}
              >
                <option value="apartment">Apartment</option>
                <option value="house">House</option>
                <option value="condo">Condo</option>
                <option value="land">Land</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="utilities">Utilities Policy</label>
              <select name="utilities">
                <option value="owner">Owner is responsible</option>
                <option value="tenant">Tenant is responsible</option>
                <option value="shared">Shared</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="pet">Pet Policy</label>
              <select name="pet">
                <option value="allowed">Allowed</option>
                <option value="not-allowed">Not Allowed</option>
              </select>
            </div>
            <div className="item">
              <label htmlFor="income">Income Policy</label>
              <input
                id="income"
                name="income"
                type="text"
                placeholder="Income Policy"
              />
            </div>
            <div className="item">
              <label htmlFor="size">Total Size (m²)</label>
              <input
                required
                min={0}
                id="size"
                name="size"
                type="number"
                onKeyDown={(e) => {
                  if (
                    !/[0-9]|Backspace|Tab|Enter|Delete|ArrowLeft|ArrowRight/.test(
                      e.key
                    )
                  ) {
                    e.preventDefault();
                  }
                }}
              />
            </div>
            {property !== "land" && (
              <>
                <div className="item">
                  <label htmlFor="school">School</label>
                  <input
                    min={0}
                    id="school"
                    name="school"
                    type="number"
                    onKeyDown={(e) => {
                      if (
                        !/[0-9]|Backspace|Tab|Enter|Delete|ArrowLeft|ArrowRight/.test(
                          e.key
                        )
                      ) {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>
                <div className="item">
                  <label htmlFor="bus">Bus</label>
                  <input
                    min={0}
                    id="bus"
                    name="bus"
                    type="number"
                    onKeyDown={(e) => {
                      if (
                        !/[0-9]|Backspace|Tab|Enter|Delete|ArrowLeft|ArrowRight/.test(
                          e.key
                        )
                      ) {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>
                <div className="item">
                  <label htmlFor="restaurant">Restaurant</label>
                  <input
                    min={0}
                    id="restaurant"
                    name="restaurant"
                    type="number"
                    onKeyDown={(e) => {
                      if (
                        !/[0-9]|Backspace|Tab|Enter|Delete|ArrowLeft|ArrowRight/.test(
                          e.key
                        )
                      ) {
                        e.preventDefault();
                      }
                    }}
                  />
                </div>
              </>
            )}
            <button className="sendButton">Update</button>
            {error && <span>Error during add posts!!</span>}
          </form>
        </div>
      </div>
      <div className="sideContainer">
        {images.map((image, index) => (
          <img src={image} key={index} alt="" />
        ))}
        <UploadWidget
          uwConfig={{
            multiple: true,
            cloudName: "dominikdev",
            uploadPreset: "realestate",
            folder: "posts",
          }}
          setState={setImages}
        />
      </div>
    </div>
  );
};

export default NewPostPage;
