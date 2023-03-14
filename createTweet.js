const { TwitterApi } = require("twitter-api-v2");
const dotenv = require("dotenv");

const usersConf = require("./usersConf");

dotenv.config();

const ABSENT = "absent";
const ABSTENTION = "abstention";

const law =
  "le dossier visant à assurer un repas à 1 euro pour tous les étudiants";
const link =
  "https://www.assemblee-nationale.fr/dyn/16/dossiers/securiser_approvisionnement_francais_produit_grande_consommation_xvie";
const lawLink =
  "https://www.assemblee-nationale.fr/dyn/16/dossiers/alt/assurer_repas_uneuro_etudiants#acte-16-AN1-DEBATS-DEC";
const status = "a été rejeté par l'assemblée nationale";

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

const altavoixUser = usersConf.find(({ name }) => {
  return name === "AltaVoix";
});

/**
 * TWEET AS ALTAVOIX
 */
const tweetAsAltavoix = () => {
  const client = new TwitterApi({
    appKey: process.env.APP_KEY,
    appSecret: process.env.APP_SECRET,
    accessToken: altavoixUser.token,
    accessSecret: altavoixUser.secret,
  });

  const tweet = `${
    law.charAt(0).toUpperCase() + law.slice(1)
  } ${status}: ${lawLink}`;
  // const tweet =
  //   "L'assemblée nationale a adopté en première lecture le texte pour sécuriser l'approvisionnement des Français en produits de grande consommation: https://www.assemblee-nationale.fr/dyn/16/dossiers/securiser_approvisionnement_francais_produit_grande_consommation_xvie";
  // console.log(tweet);

  return client.v2
    .tweet(tweet)
    .then((val) => {
      console.log(val);
      console.log("tweeted for Altavoix");
    })
    .catch((err) => {
      console.log(err);
    });
};

tweetAsAltavoix();

/**
 * DEBUG NEW TWEET FORMAT
 */
// usersConf.filter(filterSkippable).map((user) => {
//   const { name, isFemale, stand, token, secret } = user;

//   const tweet = getTweet({ name, stand, isFemale });
//   console.log(tweet);
// });

/**
 * TWEET AS MEMBER
 */
// Promise.all(
//   usersConf.filter(filterSkippable).map((user) => {
//     const { name, isFemale, stand, token, secret } = user;

//     const client = new TwitterApi({
//       appKey: process.env.APP_KEY,
//       appSecret: process.env.APP_SECRET,
//       accessToken: token,
//       accessSecret: secret,
//     });

//     const tweet = getTweet({ name, stand, isFemale });
//     console.log(tweet);

//     return client.v2
//       .tweet(tweet)
//       .then((val) => {
//         console.log(val);
//         console.log("tweeted for ", name);
//       })
//       .catch((err) => {
//         console.log(err);
//       });
//   })
// );
