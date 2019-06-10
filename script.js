"use strict";

let teams = {}, challenges = {}, challengesWorth = {}, teamsScore = {};

window.addEventListener("load", main);

function main(){
  if (localStorage.getItem("f") !== null){
    restoreScore();
  }
  for (let c of challengeCategories){
    challenges[c] = {};
  }
  let requests = [];
  for (let name of teamNames){
    let r = fetchScore(name);
    requests.push(r);
  }
  Promise.all(requests).then(computeScore).catch(console.error);
}

function fetchScore(name){
  const proxy = "https://cors.io/?";
  // const proxy = "https://crossorigin.me/";
  const url = `https://www.root-me.org/${name}?inc=score&lang=fr`;
  return new Promise((resolve, reject)=>{
    fetch(proxy+url)
      .then(res=>res.text()
        .then(txt=>{storeScore(txt); resolve(1);})
        .catch(err=>{console.error(err); reject(err);}))
      .catch(err=>{console.error(err); reject(err);});
  });
}

function storeScore(webpage){
  const reUsername = /<span class=" forum" >.*<\/span>/;
  const username = reUsername.exec(webpage)[0].slice(22,-7);
  teams[username] = [];
  const mainTag = webpage.slice(webpage.indexOf("<main"));
  for (let c of challengeCategories){
    const categoryTag = mainTag.slice(mainTag.indexOf(c));
    const listTag = categoryTag.slice(categoryTag.indexOf("<ul"), categoryTag.indexOf("</ul>"));
    const validatedChallenges = listTag.match(/<li><a class=" vert".*<\/li>/g);
    for (let vc of validatedChallenges){
      const challengeName = vc.slice(vc.indexOf("&nbsp;")+6, -9);
      teams[username].push(challengeName);
      challenges[c][challengeName] = challenges[c][challengeName]+1 || 1;
    }
  }
}

function restoreScore(){
  teams = JSON.parse(localStorage.getItem("teams"));
  challenges = JSON.parse(localStorage.getItem("challenges"));
  challengesWorth = JSON.parse(localStorage.getItem("challengesWorth"));
  teamsScore = JSON.parse(localStorage.getItem("teamsScore"));

  displayScores();
  displayChallenges();
  document.body.classList.remove("loading");

  teams = {}, challenges = {}, challengesWorth = {}, teamsScore = {};
}

function computeScore(){
  let worth = [];
  for (let i = 0; i <= teamNames.length; ++i){
    if (i <= teamNames.length*0.1)
      worth.push(1);
    else if (i <= teamNames.length*0.5)
      worth.push(0.75);
    else if (i <= teamNames.length*0.9)
      worth.push(0.5);
    else if (i <= teamNames.length-1)
      worth.push(0.25);
    else if (i <= teamNames.length)
      worth.push(0.125);
  }
  for (let cat in challenges){
    for (let c in challenges[cat]){
      challengesWorth[c] = worth[challenges[cat][c]];
    }
  }
  for (let t in teams){
    teamsScore[t] = 0;
    for (let c of teams[t]){
      teamsScore[t] += challengesWorth[c];
    }
  }
  document.body.classList.add("loading");
  displayScores();
  displayChallenges();
  document.body.classList.remove("loading");

  localStorage.setItem("teams", JSON.stringify(teams));
  localStorage.setItem("challenges", JSON.stringify(challenges));
  localStorage.setItem("challengesWorth", JSON.stringify(challengesWorth));
  localStorage.setItem("teamsScore", JSON.stringify(teamsScore));
  localStorage.setItem("f", "");
}

function clearTable(table){
  console.log(table);
  let element = table.firstElementChild;
  while (element !== null){
    const nextElement = element.nextElementSibling;
    table.removeChild(element);
    element = nextElement;
  }
}

function displayScores(){
  let names = [];
  for (let n in teams){
    names.push(n);
  }
  names.sort((a,b)=>{
    return teamsScore[b] - teamsScore[a];
  });
  let teamsTbodyTag = document.getElementById("teams").children[1];
  clearTable(teamsTbodyTag);
  for (let n of names){
    let teamTrtag = document.createElement("tr");

    let nameTdTag = document.createElement("td");
    nameTdTag.textContent = n;
    teamTrtag.appendChild(nameTdTag);

    let scoreTdTag = document.createElement("td");
    scoreTdTag.textContent = teamsScore[n];
    teamTrtag.appendChild(scoreTdTag);

    switch (teamsScore[n]){
      case teamsScore[names[0]]: teamTrtag.classList.add("first"); break;
      case teamsScore[names[1]]: teamTrtag.classList.add("second"); break;
      case teamsScore[names[2]]: teamTrtag.classList.add("third"); break;
    }

    teamsTbodyTag.appendChild(teamTrtag);
  }

}

function displayChallenges(){
  let challTbodytag = document.getElementById("challenges").children[1];
  clearTable(challTbodytag);
  for (let cat of challengeCategories){
    let catThTag = document.createElement("th");
    catThTag.textContent = cat;
    let nb = 0;
    for (let chall in challenges[cat]){
      let challTrTag = document.createElement("tr");
      if (nb == 0){
        challTrTag.appendChild(catThTag);
      }
      let nameTdTag = document.createElement("td");
      nameTdTag.textContent = chall;
      challTrTag.appendChild(nameTdTag);

      let worthTdTag = document.createElement("td");
      worthTdTag.textContent = challengesWorth[chall];
      challTrTag.appendChild(worthTdTag);

      let nbTdTag = document.createElement("td");
      nbTdTag.textContent = challenges[cat][chall];
      challTrTag.appendChild(nbTdTag);

      challTbodytag.appendChild(challTrTag);
      nb += 1;
    }
    catThTag.rowSpan = nb;
  }
  let nbValThTag = document.getElementById("nbval");
  const len = teamNames.length;
  let str = `nb <= ${len*0.1} : 1.00\n`;
  str +=    `nb <= ${len*0.5} : 0.75\n`;
  str +=    `nb <= ${len*0.9} : 0.5\n`;
  str +=    `nb <= ${len-1} : 0.25\n`;
  str +=    `nb <= ${len} : 0.125\n`;
  nbValThTag.title=str;

}
