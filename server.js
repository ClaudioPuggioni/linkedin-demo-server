const express = require("express");
const cors = require("cors");
const axios = require("axios");
require("dotenv").config();

// Cors config
const corsOptions = {
  origin: "*",
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());

app.post("/token", async (req, res) => {
  const { code } = req.body;

  // ACCESSTOKEN
  const URL = "https://www.linkedin.com/oauth/v2/accessToken";
  // PROFILE DATA
  const URL2 = "https://api.linkedin.com/v2/me?projection=(id,firstName,lastName,profilePicture(displayImage~:playableStreams))";

  console.log("code:", code);
  console.log(process.env.REACT_APP_CLIENT_ID);
  console.log(process.env.REACT_APP_SECRET_KEY);
  try {
    const response = await axios({
      method: "POST",
      url: URL,
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8",
      },
      data: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        client_id: process.env.REACT_APP_CLIENT_ID,
        client_secret: process.env.REACT_APP_SECRET_KEY,
        // redirect_uri: "http://localhost:3000/profile",
        redirect_uri: "https://linkedin-login-demo.netlify.app/profile",
      }).toString(),
    });
    console.log("RESPONSE:", response.data);

    const response2 = await axios({
      method: "GET",
      url: URL2,
      headers: {
        Authorization: `Bearer ${response.data.access_token}`,
      },
    });
    console.log("RESPONSE2:", response2.data);

    const imgURL = response2.data.profilePicture["displayImage~"].elements["2"].identifiers["0"].identifier;
    const firstName = Object.values(response2.data.firstName.localized)[0];
    const lastName = Object.values(response2.data.lastName.localized)[0];
    return res.status(200).json({ imgURL, firstName, lastName });
  } catch (error) {
    console.error(error);
    console.error(error.message);
  }
});

app.listen(process.env.port || 1111);
