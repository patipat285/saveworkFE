const express = require("express");
const app = express();
const fs = require("fs");
const frontEndPort = process.env.FE_PORT || 3303;
const appIp = "0.0.0.0";

app.use(express.static(path.join(__dirname, './dist/saveWork/')));

app.use('/', (req, res) => {

  console.log('222222222');

  // console.log(path.join(__dirname, './dist/sgl-product-mgmt/index.html'));
  res.sendFile(path.join(__dirname, './dist/saveWork/index.html'));
});

//use http
app.listen(frontEndPort, function () {
  console.log("The Cool app listening on port " + frontEndPort + "!");
});
