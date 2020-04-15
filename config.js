"use strict";

// This is the user ID, not the username
// User ID is visible in url when looking at the profile page
// Most of the time user ID and username are identical, but not always
const teamNames = [
  "macz",
  "kikko",
  "Alkanor",
  "Jrmbt",
  "Florian-49364", // username: ENOENT
];

const challengeCategories = [
  "App - Script",
  "App - Système",
  "Cracking",
  "Cryptanalyse",
  "Forensic",
  "Programmation",
  "Réaliste",
  "Réseau",
  "Stéganographie",
  "Web - Client",
  "Web - Serveur"
];


// A proxy is needed to access root-me ressources

// proxy variable should be formatted in a way that forms a valid request
// when directly concatenated with the root-me url

// If current proxy is dead, you might find a new one at:
// https://gist.github.com/jimmywarting/ac1be6ea0297c16c477e17f8fbe51347
const proxy = "https://cors-anywhere.herokuapp.com/";
