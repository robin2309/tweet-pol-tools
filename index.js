const { TwitterApi } = require("twitter-api-v2");
const dotenv = require("dotenv");
const open = require("open");
const readline = require("readline");

// const usersConf = require("./usersConf");

dotenv.config();

const client = new TwitterApi({
  appKey: process.env.APP_KEY,
  appSecret: process.env.APP_SECRET,
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function getUserPin() {
  return new Promise((resolve) => {
    rl.question("Enter your code...\n", (pin) => {
      console.log(`you entered ${pin}`);
      resolve(pin);
    });
  });
}

async function doStuff() {
  // const client = new TwitterApi({ appKey: CONSUMER_KEY, appSecret: CONSUMER_SECRET });

  const authLink = await client.generateAuthLink("oob");

  console.log(authLink);

  const { url, oauth_token, oauth_token_secret } = authLink;

  await open(url);

  const userPin = await getUserPin();

  const oauthClient = new TwitterApi({
    appKey: process.env.APP_KEY,
    appSecret: process.env.APP_SECRET,
    accessToken: oauth_token, // oauth token from previous step (link generation)
    accessSecret: oauth_token_secret, // oauth token secret from previous step (link generation)
  });

  // Give the PIN to client.login()
  const {
    client: loggedClient,
    accessToken,
    accessSecret,
  } = await oauthClient.login(userPin);

  console.log(loggedClient);
  console.log(accessToken);
  console.log(accessSecret);

  // client.v1
  //   .tweet("test test")
  //   .then((val) => {
  //     console.log(val);
  //     console.log("success");
  //   })
  //   .catch((err) => {
  //     console.log(err);
  //   });
}

doStuff();
