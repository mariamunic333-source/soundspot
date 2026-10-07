const songs=[
 {title:"Blinding Lights",artist:"The Weeknd",genre:"Pop"},
 {title:"Billie Jean",artist:"Michael Jackson",genre:"Pop"},
 {title:"One Dance",artist:"Drake",genre:"Hip-Hop"},
 {title:"Calm Down",artist:"Rema",genre:"Afrobeats"},
 {title:"Essence",artist:"Wizkid ft. Tems",genre:"Afrobeats"}
];

const stages=[0.1,0.5,2,8,15];
const points=[1200,900,600,300,100];
let round=0,score=0,stage=0,selected=null,finished=false;

const roundLabel=document.querySelector("#roundLabel");
const scoreLabel=document.querySelector("#scoreLabel");
const stageLabel=document.querySelector("#stageLabel");
const playHint=document.querySelector("#playHint");
const input=document.querySelector("#guessInput");
const suggestions=document.querySelector("#suggestions");
const result=document.querySelector("#result");

function current(){return songs[round%songs.length]}
function render(){
  roundLabel.textContent=`ROUND ${Math.min(round+1,5)} / 5`;
  scoreLabel.textContent=`SCORE ${score}`;
  stageLabel.textContent=`${stages[stage]}s`;
  document.querySelectorAll(".clip").forEach((b,i)=>{
    b.classList.toggle("active",i===stage);
    b.classList.toggle("locked",i>stage);
  });
  result.className="result hidden";
  result.textContent="";
  input.value="";
  selected=null;
  suggestions.innerHTML="";
  playHint.textContent="Press play to hear the clue";
  finished=false;
}
function play(){
  playHint.textContent=`Playing a ${stages[stage]} second clue…`;
  const btn=document.querySelector("#playBtn");
  btn.textContent="■";
  setTimeout(()=>{btn.textContent="▶";playHint.textContent="Replay the clue or make your guess";},Math.max(350,stages[stage]*1000));
}
function showSuggestions(){
  const q=input.value.trim().toLowerCase();
  if(!q){suggestions.innerHTML="";return}
  const matches=songs.filter(s=>(s.title+" "+s.artist).toLowerCase().includes(q)).slice(0,5);
  suggestions.innerHTML=matches.map((s,i)=>`<div class="suggestion" data-i="${songs.indexOf(s)}"><b>${s.title}</b><small>${s.artist}</small></div>`).join("");
  document.querySelectorAll(".suggestion").forEach(el=>el.onclick=()=>{
    selected=songs[Number(el.dataset.i)];
    input.value=selected.title;
    suggestions.innerHTML="";
  });
}
function revealMore(){
  if(stage<stages.length-1){stage++;render();playHint.textContent=`New clue unlocked: ${stages[stage]} seconds`}
  else finish(false);
}
function guess(){
  const answer=(selected||songs.find(s=>s.title.toLowerCase()===input.value.trim().toLowerCase()));
  if(!answer){result.className="result bad";result.textContent="Select a song from the suggestions first.";return}
  if(answer.title===current().title) finish(true);
  else revealMore();
}
function finish(correct){
  finished=true;
  if(correct){
    score+=points[stage];
    scoreLabel.textContent=`SCORE ${score}`;
    result.className="result good";
    result.textContent=`Correct! +${points[stage]} points — ${current().title} by ${current().artist}`;
  }else{
    result.className="result bad";
    result.textContent=`The answer was ${current().title} by ${current().artist}.`;
  }
  setTimeout(()=>{
    if(round<4){round++;stage=0;render()}
    else{
      roundLabel.textContent="GAME COMPLETE";
      playHint.textContent=`Final score: ${score}`;
      document.querySelector("#playBtn").disabled=true;
      document.querySelector("#skipBtn").disabled=true;
    }
  },1400);
}

document.querySelector("#playBtn").onclick=play;
document.querySelector("#skipBtn").onclick=revealMore;
document.querySelector("#guessBtn").onclick=guess;
input.addEventListener("input",showSuggestions);
input.addEventListener("keydown",e=>{if(e.key==="Enter")guess()});
document.querySelector("#resetBtn").onclick=()=>{round=0;score=0;stage=0;document.querySelector("#playBtn").disabled=false;document.querySelector("#skipBtn").disabled=false;render()};
document.querySelectorAll(".diff").forEach(b=>b.onclick=()=>{
  document.querySelectorAll(".diff").forEach(x=>x.classList.remove("active"));
  b.classList.add("active");
});
render();
