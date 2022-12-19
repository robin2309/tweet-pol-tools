const { TwitterApi } = require("twitter-api-v2");
const dotenv = require("dotenv");

const usersConf = require("./usersConf");

dotenv.config();

const ABSENT = "absent";

const law = "la motion de censure déposée en application du 49.3";
const link =
  "https://www.assemblee-nationale.fr/dyn/16/dossiers/engagement_responsabilite_gvt_1erepartie_PLF_2023";

const getTweet = ({ name, stand, isFemale }) => {
  const genderAbsent = isFemale ? "ABSENTE" : "ABSENT";
  const wordedStand =
    stand === ABSENT
      ? `était ${genderAbsent} au vote sur`
      : `a voté ${stand.toUpperCase()}`;
  return `${name} ${wordedStand} ${law} - ${link}`;
};

const filterSkippable = ({ skip }) => !skip;

// usersConf.filter(filterSkippable).map((user) => {
//   const { name, isFemale, stand, token, secret } = user;

//   const tweet = getTweet({ name, stand, isFemale });
//   console.log(tweet);
// });

Promise.all(
  usersConf.filter(filterSkippable).map((user) => {
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
