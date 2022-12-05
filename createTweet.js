const { TwitterApi } = require("twitter-api-v2");
const dotenv = require("dotenv");

const usersConf = require("./usersConf");

dotenv.config();

const ABSENT = "absent";

const law = "la loi pour protéger les logements de l'occupation illicite";
const link =
  "https://www.assemblee-nationale.fr/dyn/16/dossiers/logements_occupationillicite";

const getTweet = ({ name, stand, isFemale }) => {
  const genderAbsent = isFemale ? "ABSENTE" : "ABSENT";
  const wordedStand =
    stand === ABSENT
      ? `était ${genderAbsent} au vote sur`
      : `a voté ${stand.toUpperCase()}`;
  return `${name} ${wordedStand} ${law} - ${link}`;
};

Promise.all(
  usersConf
    .filter(({ skip }) => !skip)
    .map((user) => {
      const { name, isFemale, stand, token, secret } = user;

      const client = new TwitterApi({
        appKey: process.env.APP_KEY,
        appSecret: process.env.APP_SECRET,
        accessToken: token,
        accessSecret: secret,
      });

      const tweet = getTweet({ name, stand, isFemale });
      console.log(tweet);

      return client.v2
        .tweet(tweet)
        .then((val) => {
          console.log(val);
          console.log("tweeted for ", name);
        })
        .catch((err) => {
          console.log(err);
        });
    })
);
