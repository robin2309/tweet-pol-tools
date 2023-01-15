const { TwitterApi } = require("twitter-api-v2");
const dotenv = require("dotenv");

const usersConf = require("./usersConf");

dotenv.config();

const ABSENT = "absent";
const ABSTENTION = "abstention";

const law =
  "le projet de loi relatif à l'accélération de la production d'énergies renouvelables";
const link =
  "https://www.assemblee-nationale.fr/dyn/16/dossiers/DLR5L16N46539?etape=16-AN1";

const getWordedStand = ({ stand, isFemale }) => {
  const genderAbsent = isFemale ? "ABSENTE" : "ABSENT";
  if (stand === ABSENT) {
    return `était ${genderAbsent} au vote sur`;
  }
  return stand === ABSTENTION
    ? `s'est ABSTENU${isFemale ? "E" : ""} lors du vote sur`
    : `a voté ${stand.toUpperCase()}`;
};

const getTweet = ({ name, stand, isFemale }) => {
  return `${name} ${getWordedStand({ stand, isFemale })} ${law} - ${link}`;
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
