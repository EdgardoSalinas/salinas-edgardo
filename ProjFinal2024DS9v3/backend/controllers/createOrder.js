//const express = require('express');
//const router = express.Router();

const { CLIENT_ID, APP_SECRET } = process.env;

//   sandbox: "https://api-m.sandbox.paypal.com",
// con este funciono varias veces =   sandbox: "https://sandbox.paypal.com",

const baseUrl = {
  sandbox: "https://api-m.sandbox.paypal.com",
  production: "https://api-m.paypal.com"
};

async function generateAccessToken() {
  console.log("CLIENT_ID  = ",CLIENT_ID);
  console.log("APP_SECRET = ",APP_SECRET);
  console.log("sanbox",baseUrl.sandbox);
  const auth = Buffer.from(CLIENT_ID + ":" + APP_SECRET).toString("base64")
  const response = await fetch(`${baseUrl.sandbox}/v1/oauth2/token`, {
    method: "post",
    body: "grant_type=client_credentials",
    headers: {
      Authorization: `Basic ${auth}`,
    },
  });
  const data = await response.json();
  return data.access_token;
}


module.exports = async (req, res) => {
  //console.log("reqbody", req.body);
  console.log("base url sandbox",baseUrl.sandbox)
  const accessToken = await generateAccessToken();

  console.log(" url sandbox 33 createorder js = ",baseUrl.sandbox)

  const url = `${baseUrl.sandbox}/v2/checkout/orders`;

  console.log(" baseUrl.sandbox = ",baseUrl.sandbox);
  console.log(" url = ",url);
  console.log(" req.body = ",req.body);
  console.log(" access token ",accessToken);

  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify(req.body),
    // body: JSON.stringify({
    //   intent: "CAPTURE",
    //   purchase_units: [
    //     {
    //       amount: {
    //         currency_code: "USD",
    //         value: "103.00",
    //       },
    //       description: "A book3 on the subject of technology.",
    //     },
    //   ],
    // }),
  });
  const data = await response.json();
  console.log("resultado del wait final ",{ data })
  return data;
};