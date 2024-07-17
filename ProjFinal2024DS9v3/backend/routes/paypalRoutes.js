const express = require('express');
const router = express.Router();
// sin la linea 1 y 2 da error

const { CLIENT_ID, APP_SECRET } = process.env;

//   sandbox: "https://api-m.sandbox.paypal.com",
const baseUrl = {
  sandbox: "https://sandbox.paypal.com",
  production: "https://api-m.paypal.com"
};

const createOrder = require('../controllers/createOrder');


// async function generateAccessToken() {
//   console.log("CLIENT_ID  = ",CLIENT_ID);
//   console.log("APP_SECRET = ",APP_SECRET);

//   const auth = Buffer.from(CLIENT_ID + ":" + APP_SECRET).toString("base64")
//   const response = await fetch(`${baseUrl.sandbox}/v1/oauth2/token`, {
//     method: "post",
//     body: "grant_type=client_credentials",
//     headers: {
//       Authorization: `Basic ${auth}`,
//     },
//   });
//   const data = await response.json();
//   return data.access_token;
// }

router.post('/create', async (req, res) => {
    console.log("en create req.body = ",req.body);
    const order = await createOrder(req, res);
    res.json(order);
});


router.post('/payOrden', async (req, res) => {
  const accessToken = await generateAccessToken();
  const url = `${baseUrl.sandbox}/v2/checkout/orders`;
  const response = await fetch(url, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: "102.00",
          },
          description: "A book2 on the subject of technology.",
        },
      ],
    }),
  });
  const data = await response.json();
  console.log({ data });
  console.log("retorno de payOrden");
  return data;
});

router.post('/execute', async (req, red) => {
    console.log("entro a execute");
});




module.exports = router;
