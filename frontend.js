const express = require("express");
const app = express();
const fs = require("fs");
const frontEndPort = process.env.FE_PORT || 3303;
const appIp = "0.0.0.0";
app.use(express.static(__dirname + "/dist/saveWork"));

app.use("/saveWork", (req, res) => {

  console.log('11111');

  // console.log(path.join(__dirname, './dist/sgl-product-mgmt/index.html'));
  res.sendFile(path.join(__dirname, "./dist/saveWork/index.html"));
});

// app.use('/saveWork', (req, res) => {
//     // console.log(path.join(__dirname, './dist/sgl-product-mgmt/index.html'));
//     res.sendFile(path.join(__dirname, './dist/saveWork/index.html'));
//   });
//use https
// const https = require('https');
// const key = fs.readFileSync(__dirname+'/ssl/the-cool-fe-key.pem');
// const cert = fs.readFileSync(__dirname+'/ssl/the-cool-fe-cert.pem');
// const options = {
//     key: key,
//     cert: cert,
//     requestCert: false
// };
// https.createServer(options, app).listen(frontEndPort, appIp, function(err) {
//     console.log(`The Cool app listening on port  ${frontEndPort}`);
// });

//use http
app.listen(frontEndPort, function () {
  console.log('222222');
  console.log("The Cool app listening on port " + frontEndPort + "!");
});
