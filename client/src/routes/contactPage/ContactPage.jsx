import React, { useContext, useState } from "react";
import "./contactPage.scss";
import { Link } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Footer from "../../components/footer/Footer";

const ContactPage = () => {
  const [success, setSuccess] = useState(false);
  const [subject, setSubject] = useState("--None--");
  const [userType, setUserType] = useState("--None--");
  const [validation, setValidation] = useState({
    email: "",
    description: "",
    name: "",
  });

  const { currentUser } = useContext(AuthContext);

  const handleChange = (e) => {
    setValidation((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      validation.email.length !== 0 &&
      validation.description.length !== 0 &&
      validation.name.length !== 0 &&
      subject !== "--None--" &&
      userType !== "--None--"
    ) {
      try {
        setSuccess(true);
        setValidation({
          email: "",
          description: "",
          name: "",
        });
        setSubject("--None--");
        setUserType("--None--");
      } catch (error) {
        setError(true);
        setSuccess(false);
      }
    } else {
      setSuccess(false);
      console.log("Error");
    }
  };

  return (
    <div className="contactPageContainer">
      <div className="top">
        <h1>Send a report</h1>
        <Link className="button" to={currentUser ? "/add" : "/login"}>
          Add property
        </Link>
      </div>
      <div className="formContainer">
        <div className="form">
          <form onSubmit={handleSubmit}>
            <div className="formBox">
              <span>Subject of the report</span>
              <select
                name="subject"
                id=""
                required
                onChange={(e) =>
                  setSubject(e.nativeEvent.target[e.target.selectedIndex].text)
                }
              >
                <option>--None--</option>
                <option>I want to report a technical error</option>
                <option>
                  I want to report an incident of abuse or violation
                </option>
                <option>Suggestions</option>
                <option>Account</option>
                <option>Other</option>
              </select>
            </div>
            {subject === "--None--" && (
              <div className="errorBox">
                <InfoOutlinedIcon size={8} color="red" />
                <span>Subject of the report: The field cannot be empty</span>
              </div>
            )}
            <div className="formBox">
              <span>Email address</span>
              <input type="email" name="email" onChange={handleChange} />
            </div>
            {validation.email.length === 0 && (
              <div className="errorBox">
                <InfoOutlinedIcon size={8} color="red" />
                <span>Email: The field cannot be empty</span>
              </div>
            )}
            <div className="formBox">
              <span>Description</span>
              <textarea rows={10} name="description" onChange={handleChange} />
            </div>
            {validation.description.length === 0 && (
              <div className="errorBox">
                <InfoOutlinedIcon size={8} color="red" />
                <span>Description: The field cannot be empty</span>
              </div>
            )}
            <div className="formBox">
              <span>Type of user</span>
              <select
                name="user"
                id=""
                required
                onChange={(e) =>
                  setUserType(e.nativeEvent.target[e.target.selectedIndex].text)
                }
              >
                <option>--None--</option>
                <option>Private</option>
                <option>Agent</option>
                <option>Selling property</option>
                <option>Looking for a property</option>
                <option>Looking for real estate</option>
                <option>Other/Unknown</option>
              </select>
            </div>
            {userType === "--None--" && (
              <div className="errorBox">
                <InfoOutlinedIcon size={8} color="red" />
                <span>Email address: The field cannot be empty</span>
              </div>
            )}
            <div className="formBox">
              <span>Name and username or name of company</span>
              <input name="name" type="name" onChange={handleChange} />
            </div>
            {validation.name.length === 0 && (
              <div className="errorBox">
                <InfoOutlinedIcon size={8} color="red" />
                <span>Name: The field cannot be empty</span>
              </div>
            )}
            <div className="formBox">
              <span>Account login or NIP (optionally)</span>
              <input type="login" />
            </div>
            <div className="formBox">
              <span>Ad ID/ link to ad (optionally)</span>
              <input type="ad" />
            </div>
            <button>Send</button>
            {success && (
              <h2 style={{ color: "green", fontSize: 18 }}>
                Message has been send!!!
              </h2>
            )}
          </form>
        </div>
        <div className="contactInfo">
          <span>
            You can contact us from Monday to Friday from 8:00 a.m. to 5:00 p.m
          </span>
          <span>
            <b>Service and technical support</b>
          </span>
          <span className="green">+48 61 880 111</span>
          <div className="details">
            <span>
              <b>Address for correspondence:</b>
            </span>
            <span>RealEstate sp. z o. o.</span>
            <span>RealEstate Service</span>
            <span>Jana Kasporwicza 22</span>
            <span>35-010 Rzeszów</span>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
