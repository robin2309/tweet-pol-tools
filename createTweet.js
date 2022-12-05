const { TwitterApi } = require("twitter-api-v2");
const dotenv = require("dotenv");

const usersConf = require("./usersConf");

dotenv.config();

console.log(usersConf[1].token);

const client = new TwitterApi({
  appKey: process.env.APP_KEY,
  appSecret: process.env.APP_SECRET,
  accessToken: usersConf[1].token, // oauth token from previous step (link generation)
  accessSecret: usersConf[1].secret, // oauth token secret from previous step (link generation)
});

client.v2
  .tweet("test test")
  .then((val) => {
    console.log(val);
    console.log("success");
  })
  .catch((err) => {
    console.log(err);
  });
