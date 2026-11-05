
/* Original YouR Own interactions — retained */
var NOTIFY_URL = "https://ntfy.sh/Raouaa";
var NOTIFY_TEXT = "seen.";
var PLAYLIST_URL = "https://open.spotify.com/playlist/13cgSIWLOyvmPyIDHEu0ko";
var PLAYLIST = [
 {title:"Maak",artist:"Draganov"},{title:"Zahri",artist:"Inkonnu"},
 {title:"CALLIN' U",artist:"Najm"},{title:"LOTSOFLOVE",artist:"Najm"},
 {title:"Mada Biya",artist:"Shaoline"},{title:"Monalisa",artist:"Mons"},
 {title:"Nabra",artist:"Mons"},{title:"Last Christmas",artist:"Wham!"},
 {title:"100 000 DÉTAIL FIK",artist:"Shr., odeesbeats, MSKIN"}
];
var EMOJI=["🥞","🍓","🌸","🎀","🐱","🍰","🐾","✨"];
var GIFTS=[
"Grab something warm to drink today.","Better days are around, even if today feels slow.",
"You don't have to carry everything at once. Just breathe.","Find an excuse to laugh today, even at something stupid.",
"The cat's official advice: sit down and get a snack.","Good food, quiet hours, and zero drama. That's the plan.",
"Take it easy on yourself today.","Not every problem needs to be solved before midnight.",
"Put the phone down for ten minutes and just reset.","Keep it simple today. One thing at a time.",
"Step outside for some fresh air, even for five minutes.","Don't let minor annoyances take over your evening.",
"Give your mind a break; you've been overthinking lately.","A quiet room and a good meal fix more than you think.",
"Some days are just meant for getting through.","Let things happen without trying to control the outcome.",
"Hydrate, unclench your jaw, and drop your shoulders.","A slow day isn't a wasted day.",
"Skip the unnecessary explanations and just enjoy your peace.","No rush. You'll figure things out in due time.",
"Do one small thing today that actually makes you comfortable.","Don't replay old conversations in your head tonight.",
"Silence is underrated. Enjoy a bit of it today.","Leave room for a little rest without feeling guilty.",
"Keep your circle calm and your snacks close.","Whatever is bothering you can wait until morning.",
"Pick your battles; most aren't worth the energy.","A warm shower and clean sheets make a massive difference.",
"Give yourself some credit for handling things quietly.","Tomorrow is another clean slate. Get some sleep."
];
var bubble=document.getElementById("bubble");
var catQuotes=["Break time? The cars can wait.","You looked bored. Tyre test?","Need a minute? Let's check your reflexes.",
"Why are cats terrible storytellers? Because they only have one tail.","What's a cat's favourite sport? Knocking things off tables.",
"What do you call a cat sitting next to an open door? Indecisive, as usual."];
function pick(a){return a[Math.floor(Math.random()*a.length)];}
function say(t){if(bubble)bubble.textContent=t;}
if(bubble){bubble.addEventListener("click",function(){say(pick(catQuotes));});say(pick(catQuotes));}
(function(){
 var btn=document.getElementById("hi"),sent=document.getElementById("sent"),builder=document.getElementById("builder");
 if(!btn)return;
 if(!NOTIFY_URL&&builder)builder.hidden=false;
 btn.addEventListener("click",function(){
  if(!NOTIFY_URL)return;btn.disabled=true;
  fetch(NOTIFY_URL,{method:"POST",body:NOTIFY_TEXT,headers:{"Content-Type":"text/plain"}})
   .then(function(r){if(!r.ok)throw Error("failed");sent.textContent="Welcome back anytime 💕";sent.hidden=false;say("Welcome back anytime!");})
   .catch(function(){btn.disabled=false;sent.textContent="Message could not be sent. Try again.";sent.hidden=false;});
 });
})();
(function(){
 var lights=document.querySelectorAll("#lightRow .light"),btn=document.getElementById("goBtn"),
 res=document.getElementById("lightResult"),bestEl=document.getElementById("lightBest");
 if(!btn)return;var state="idle",timers=[],start=0,best=null;
 function clear(){timers.forEach(clearTimeout);timers=[];lights.forEach(function(x){x.classList.remove("on");});}
 function reset(){clear();state="idle";btn.textContent="Start";btn.classList.remove("ready");}
 btn.addEventListener("click",function(){
  if(state==="idle"){reset();state="counting";res.textContent="";btn.textContent="Wait…";
   lights.forEach(function(x,i){timers.push(setTimeout(function(){x.classList.add("on");},650*(i+1)));});
   timers.push(setTimeout(function(){lights.forEach(function(x){x.classList.remove("on");});state="go";start=performance.now();btn.textContent="NOW!";btn.classList.add("ready");},4300+Math.random()*1400));return;}
  if(state==="counting"){reset();res.textContent="Too early! Try again.";return;}
  var ms=Math.round(performance.now()-start);reset();res.textContent="Your reaction: "+ms+" ms";
  if(best===null||ms<best)best=ms;bestEl.textContent="Personal best: "+best+" ms";
 });
})();
(function(){
 var titles=["The cat that witnessed it all","Cold coffee in the middle of a scene","Both acting tough, both checking notifications",
 "Solved over an emergency ramen","The background music went completely silent","Too stubborn to talk, too familiar to forget",
 "One umbrella, two completely soaked shoulders","Acting unbothered while refreshing the screen","Midnight snack to fix bad decisions",
 "The CEO who took the secret to the grave","Heavy pride, light fingers hovering over the chat","Rain stopped, but the staring didn't",
 "An accidental touch, a ten-minute flashback","Waiting for the fight to lose its pride","A dramatic pause that lasted way too long",
 "Cold tea and words nobody wanted to say","Checking the screen, pretending not to care","The secret everyone in town already knows",
 "Late by an hour, dramatic by nature","Awkward distance between two noisy heads","A slow-motion walk to the nearest convenience store",
 "Both staying silent, both watching the status","The main character staring at the ceiling again","An unread message holding too many excuses",
 "Tension that even the background actors noticed","Still waiting for the plot twist to drop","An unspoken truce waiting for the right excuse",
 "A tragic misunderstanding over a snack","Two stubborn leads running out of reasons to stay mad","To be continued, unfortunately"];
 var index=new Date().getDate()%titles.length,n=document.getElementById("epNum"),t=document.getElementById("epTitle"),b=document.getElementById("epBtn");
 if(!b)return;n.textContent="Episode "+(index+1);t.textContent=titles[index];
 b.addEventListener("click",function(){var i;do{i=Math.floor(Math.random()*titles.length);}while(i===index);index=i;n.textContent="New episode";t.textContent=titles[i];say("A new episode!");});
})();
(function(){
 var b=document.getElementById("giftBtn"),n=document.getElementById("giftNote"),i=Math.floor(Math.random()*GIFTS.length);
 if(!b)return;b.addEventListener("click",function(){n.textContent=GIFTS[i++%GIFTS.length];n.hidden=false;say("A little gift for you.");});
})();
(function(){
 var ol=document.getElementById("tracks");if(!ol)return;
 PLAYLIST.forEach(function(t,i){var li=document.createElement("li"),num=document.createElement("span"),box=document.createElement("span"),
 title=document.createElement("span"),artist=document.createElement("span");
 num.className="tr-n";num.textContent=i+1;title.className="tr-t";title.textContent=t.title;
 artist.className="tr-a";artist.textContent=t.artist;box.append(title,artist);li.append(num,box);ol.append(li);});
 var link=document.getElementById("plLink");if(link)link.href=PLAYLIST_URL;
})();
(function(){
 var grid=document.getElementById("grid"),movesEl=document.getElementById("moves"),win=document.getElementById("win");
 if(!grid)return;var first=null,locked=false,moves=0,matches=0;
 function shuffle(a){for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var x=a[i];a[i]=a[j];a[j]=x;}return a;}
 function build(){grid.innerHTML="";first=null;locked=false;moves=matches=0;movesEl.textContent="Moves: 0";win.hidden=true;
  shuffle(EMOJI.concat(EMOJI)).forEach(function(v){var c=document.createElement("button");c.type="button";c.className="card";c.dataset.v=v;
   c.setAttribute("aria-label","Hidden card");c.innerHTML='<span class="inner"><span class="face back">?</span><span class="face front"></span></span>';
   c.querySelector(".front").textContent=v;c.addEventListener("click",function(){flip(c);});grid.append(c);});
 }
 function flip(c){if(locked||c.classList.contains("open")||c.classList.contains("done"))return;c.classList.add("open");
  if(!first){first=c;return;}moves++;movesEl.textContent="Moves: "+moves;var a=first;first=null;
  if(a.dataset.v===c.dataset.v){a.classList.add("done");c.classList.add("done");matches++;if(matches===EMOJI.length){win.hidden=false;say("You found them all!");}}
  else{locked=true;setTimeout(function(){a.classList.remove("open");c.classList.remove("open");locked=false;},750);}
 }
 document.getElementById("shuffle").addEventListener("click",build);build();
})();


/* Arcade Station game engine */
/* ARCADE STATION — 12 playable mini-games. No external libraries. */
(()=>{'use strict';
const root=document.getElementById('arcade-station');if(!root||root.dataset.asReady)return;root.dataset.asReady='1';
const $=id=>root.querySelector('#'+id),canvas=$('as-canvas'),ctx=canvas.getContext('2d',{alpha:false});
const games=[
{id:'drift',name:'NEON DRIFT',cat:'RACING',filter:'racing',symbol:'🏎️',desc:'Chase the racing line. Dodge traffic and survive the neon highway.',tag:'FEATURED',colors:['#122d49','#0a1324','#36d9e8'],how:'Hold accelerate. Steer left and right to avoid traffic.',keys:'← → steer · ↑ accelerate · ↓ brake'},
{id:'snake',name:'CYBER SNAKE',cat:'ARCADE',filter:'skill',symbol:'🐍',desc:'Eat energy cores, grow longer and avoid your own trail.',tag:'CLASSIC',colors:['#123b37','#091e28','#53f0bd'],how:'Collect glowing orbs. Do not hit the walls or your tail.',keys:'Arrow keys or WASD'},
{id:'breakout',name:'NEON BREAKER',cat:'ACTION',filter:'action',symbol:'🧱',desc:'Smash the neon wall. Keep the ball alive and clear every wave.',tag:'ACTION',colors:['#45204d','#1a1430','#ff6ac1'],how:'Move the paddle to bounce the ball into the bricks.',keys:'Mouse / touch / ← →'},
{id:'space',name:'STARFALL DEFENCE',cat:'ACTION',filter:'action',symbol:'🚀',desc:'Defend the sector. Shoot incoming drones and survive the waves.',tag:'SHOOTER',colors:['#20275a','#0b1026','#8b9cff'],how:'Move and fire. Destroy enemies before they reach you.',keys:'← → move · Space shoot'},
{id:'pong',name:'DUALITY PONG',cat:'SKILL',filter:'skill',symbol:'◒',desc:'A precision duel. Keep the rally alive and beat the AI.',tag:'VERSUS',colors:['#164b56','#0c1c2b','#5be5ed'],how:'Move your paddle and return the ball past the rival.',keys:'Mouse / touch / ↑ ↓'},
{id:'memory',name:'SYNAPSE',cat:'BRAIN',filter:'skill',symbol:'✧',desc:'Flip the tiles. Find every matching pair with fewer moves.',tag:'BRAIN',colors:['#49345f','#1c1731','#c7a2ff'],how:'Tap two cards to find matching symbols.',keys:'Tap / click cards'},
{id:'mines',name:'DANGER ZONE',cat:'STRATEGY',filter:'skill',symbol:'✹',desc:'Read the numbers, mark the mines and clear the field.',tag:'STRATEGY',colors:['#4a3821','#1d1720','#ffd16b'],how:'Reveal safe tiles. Use flags on suspected mines.',keys:'Tap reveal · Flag mode to mark'},
{id:'merge',name:'2048: OVERDRIVE',cat:'PUZZLE',filter:'skill',symbol:'▦',desc:'Merge matching power cells. Reach the target tile.',tag:'PUZZLE',colors:['#4a2e42','#211628','#ff9dca'],how:'Slide tiles together to merge matching numbers.',keys:'Arrow keys / swipe'},
{id:'flap',name:'SKYLINE FLIGHT',cat:'ARCADE',filter:'action',symbol:'🪽',desc:'Thread the skyline. One clean gap at a time.',tag:'ENDLESS',colors:['#234d68','#102237','#79d9ff'],how:'Tap or press Space to flap through the gaps.',keys:'Tap / Space'},
{id:'reaction',name:'FLASHPOINT',cat:'SKILL',filter:'skill',symbol:'⚡',desc:'Wait for the signal. React instantly. False starts count against you.',tag:'REACTION',colors:['#4d202e','#1c111d','#ff647e'],how:'Press the button only when the screen turns green.',keys:'Tap / Space'},
{id:'words',name:'WORDSTORM',cat:'SKILL',filter:'skill',symbol:'⌨',desc:'Type the falling words before they reach the bottom.',tag:'TYPING',colors:['#16465a','#0d1c2c','#5de1ff'],how:'Type the word shown on screen and press Enter.',keys:'Keyboard'},
{id:'target',name:'TARGET FRENZY',cat:'ACTION',filter:'action',symbol:'◎',desc:'A 45-second accuracy test. Hit moving targets and build combos.',tag:'CHALLENGE',colors:['#4d3b21','#201a16','#ffca72'],how:'Tap targets as they appear. Misses break your combo.',keys:'Tap / click targets'}
];
let current=null,raf=0,last=0,elapsed=0,score=0,best=JSON.parse(localStorage.getItem('asBest')||'{}'),played=Number(localStorage.getItem('asPlayed')||0),state={},held={},pointer={x:0,y:0,down:false},keys={},running=false,filter='all',audio=null;
const rand=(a,b)=>a+Math.random()*(b-a),ri=(a,b)=>Math.floor(rand(a,b+1)),clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const save=()=>{localStorage.setItem('asBest',JSON.stringify(best));localStorage.setItem('asPlayed',String(played));};
const fmt=n=>Math.floor(n).toLocaleString();
function updateHome(){ $('as-total-played').textContent=played;$('as-total-best').textContent=fmt(Object.values(best).reduce((a,b)=>a+Number(b||0),0));let xp=Object.values(best).reduce((a,b)=>a+Number(b||0),0);$('as-rank').textContent=xp>5000?'ELITE':xp>1200?'PRO':xp>300?'RISING':'ROOKIE';}
function renderCards(){const grid=$('as-grid');grid.innerHTML='';games.filter(g=>filter==='all'||g.filter===filter).forEach((g,i)=>{let card=document.createElement('article');card.className='as-card';card.tabIndex=0;card.style.setProperty('--c1',g.colors[0]);card.style.setProperty('--c2',g.colors[1]);card.style.setProperty('--glow',g.colors[2]+'66');card.innerHTML=`<div class="as-card-art"><span class="as-card-number">${String(games.indexOf(g)+1).padStart(2,'0')} / 12</span><span class="as-card-tag">${g.tag}</span><span class="as-card-symbol">${g.symbol}</span></div><div class="as-card-info"><h3>${g.name}</h3><p>${g.desc}</p><div class="as-card-bottom"><span>${g.cat} · BEST ${fmt(best[g.id]||0)}</span><span class="as-card-play">↗</span></div></div>`;card.addEventListener('click',()=>openGame(g.id));card.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();openGame(g.id)}});grid.appendChild(card);});}
function openGame(id){current=games.find(g=>g.id===id);$('as-modal').classList.add('open');$('as-modal').setAttribute('aria-hidden','false');document.body.style.overflow='hidden';$('as-game-title').textContent=current.name;$('as-game-category').textContent=current.cat;$('as-game-best').textContent=fmt(best[id]||0);$('as-instructions').textContent=current.how+' '+current.keys;$('as-score').textContent='0';$('as-meta').textContent='—';$('as-status').textContent='READY';$('as-game-overlay').classList.remove('hidden');$('as-overlay-title').textContent=current.name;$('as-overlay-copy').textContent=current.desc+' '+current.how;$('as-start').textContent='START GAME ↗';makeControls();initGame();draw(); }
function closeGame(){stop();$('as-modal').classList.remove('open');$('as-modal').setAttribute('aria-hidden','true');document.body.style.overflow='';current=null;renderCards();updateHome();}
function makeControls(){let box=$('as-controls');box.innerHTML='';let sets={drift:[['left','◀'],['right','▶'],['brake','BRAKE'],['gas','GAS']],snake:[['up','▲'],['left','◀'],['down','▼'],['right','▶']],breakout:[['left','◀'],['right','▶']],space:[['left','◀'],['fire','FIRE'],['right','▶']],pong:[['up','▲'],['down','▼']],memory:[],mines:[['flag','⚑ FLAG MODE']],merge:[['up','▲'],['left','◀'],['down','▼'],['right','▶']],flap:[['flap','FLAP']],reaction:[['hit','REACT']],words:[],target:[]};(sets[current.id]||[]).forEach(([k,label])=>{let b=document.createElement('button');b.textContent=label;b.dataset.key=k;if(k==='flag')b.classList.add('toggle');b.addEventListener('pointerdown',e=>{e.preventDefault();if(k==='flag'){state.flagMode=!state.flagMode;b.classList.toggle('down',state.flagMode);return}held[k]=true;b.classList.add('down');action(k)});['pointerup','pointercancel','pointerleave'].forEach(ev=>b.addEventListener(ev,()=>{held[k]=false;b.classList.remove('down')}));box.appendChild(b);});if(current.id==='words'){let input=document.createElement('input');input.id='as-word-input';input.autocomplete='off';input.autocapitalize='characters';input.placeholder='TYPE WORD';input.style.cssText='min-width:130px;max-width:190px;padding:9px 11px;border:1px solid #3a4a62;border-radius:8px;background:#101b2b;color:white;font:900 12px system-ui;';let send=document.createElement('button');send.textContent='ENTER';send.addEventListener('click',submitWord);input.addEventListener('keydown',e=>{if(e.key==='Enter')submitWord()});box.append(input,send);}}
function action(k){if(k==='hit'&&current?.id==='reaction')reactionTap();if(k==='flap'&&current?.id==='flap')held.flap=true;}
function submitWord(){if(!current||current.id!=='words')return;let input=$('as-word-input');if(!input)return;let i=state.words.findIndex(w=>w.word===input.value.trim().toUpperCase());if(i>=0){state.words.splice(i,1);addScore(25)}input.value='';draw();}
function initGame(){stop();elapsed=0;score=0;state={};held={};keys={};pointer.down=false;running=false;
switch(current.id){
case'drift':Object.assign(state,{x:0,road:0,cars:Array.from({length:8},(_,i)=>({z:.1+i*.13,lane:ri(-1,1),color:['#ffb84d','#65d7ff','#b79aff'][i%3],passed:false})),speed:0,lap:1,lapP:0});break;
case'snake':Object.assign(state,{size:22,body:[{x:10,y:10},{x:9,y:10},{x:8,y:10}],dir:{x:1,y:0},next:{x:1,y:0},food:{x:15,y:10},tick:0,level:1});break;
case'breakout':Object.assign(state,{paddle:450,ball:{x:450,y:460,vx:4,vy:-5},bricks:[],lives:3,level:1});makeBricks();break;
case'space':Object.assign(state,{ship:450,shots:[],foes:[],spawn:0,lives:3,inv:0});break;
case'pong':Object.assign(state,{py:280,ai:280,ball:{x:450,y:280,vx:5,vy:3},hits:0});break;
case'memory':{let vals=['◆','●','▲','✦','☾','✚','⬟','♥'];let deck=[...vals,...vals].sort(()=>Math.random()-.5);Object.assign(state,{deck,shown:[],matched:[],moves:0,lock:0});break;}
case'mines':{let n=8,m=10,mines=new Set();while(mines.size<10){let x=ri(0,n*m-1);mines.add(x)}Object.assign(state,{n,m,mines,revealed:new Set(),flags:new Set(),over:false});break;}
case'merge':Object.assign(state,{board:Array(16).fill(0),target:512});spawnTile();spawnTile();break;
case'flap':Object.assign(state,{y:270,vy:0,pipes:[],spawn:0,passed:0});break;
case'reaction':Object.assign(state,{phase:'wait',delay:rand(1.8,4),timer:0,start:0,tries:0,results:[]});break;
case'words':Object.assign(state,{words:[],typed:'',spawn:0,level:1});break;
case'target':Object.assign(state,{targets:[],spawn:0,combo:0,miss:0});break;
}}
function makeBricks(){state.bricks=[];for(let r=0;r<5;r++)for(let c=0;c<10;c++)state.bricks.push({x:95+c*72,y:75+r*29,w:62,h:18,hp:1+(r>2?1:0),color:['#ff5e8a','#ffb65c','#7de4db','#9c8cff','#55c6ff'][r]})}
function stop(){running=false;cancelAnimationFrame(raf)}
function start(){if(!current)return;initGame();$('as-game-overlay').classList.add('hidden');running=true;played++;save();last=performance.now();raf=requestAnimationFrame(loop);updateHome();}
function finish(message='RUN COMPLETE'){running=false;$('as-game-overlay').classList.remove('hidden');$('as-overlay-title').textContent=message;$('as-overlay-copy').textContent=`Score ${fmt(score)} · Best ${fmt(best[current.id]||0)}. ${current.how}`;$('as-start').textContent='PLAY AGAIN ↗';$('as-status').textContent='FINISHED';}
function addScore(n){score+=n;$('as-score').textContent=fmt(score);if(score>(best[current.id]||0)){best[current.id]=score;save();$('as-game-best').textContent=fmt(score)}}
function meta(s){$('as-meta').textContent=s}
function loop(now){if(!running)return;let dt=Math.min((now-last)/1000,.04);last=now;elapsed+=dt;updateGame(dt);draw();if(running)raf=requestAnimationFrame(loop)}
function updateGame(dt){switch(current.id){
case'drift':{let s=state;s.speed=clamp(s.speed+((held.gas||keys.ArrowUp)?.7:-.22)*dt-(held.brake||keys.ArrowDown?1.4*dt:0),0,1);if(held.left||keys.ArrowLeft||keys.a)s.x-=dt*(.9+s.speed);if(held.right||keys.ArrowRight||keys.d)s.x+=dt*(.9+s.speed);s.x=clamp(s.x,-1.3,1.3);s.lapP+=s.speed*dt*.15;if(s.lapP>=1){s.lapP--;s.lap++;if(s.lap>3){finish('PODIUM FINISH');return}}s.cars.forEach(c=>{c.z-=dt*(.12+s.speed*.18);if(c.z<.24&&!c.passed&&Math.abs(s.x-c.lane*.7)<.22){c.passed=true;addScore(100)}if(c.z<-.08){c.z=1.15+Math.random()*.2;c.lane=ri(-1,1);c.passed=false}if(c.z<.13&&c.z>0&&Math.abs(s.x-c.lane*.7)<.25){s.speed*=.7;}});meta('LAP '+s.lap+'/3');break}
case'snake':{let s=state;s.tick+=dt;if(held.up||keys.ArrowUp)s.next={x:0,y:-1};if(held.down||keys.ArrowDown)s.next={x:0,y:1};if(held.left||keys.ArrowLeft)s.next={x:-1,y:0};if(held.right||keys.ArrowRight)s.next={x:1,y:0};if(s.tick>.12){s.tick=0;if(s.next.x!==-s.dir.x||s.next.y!==-s.dir.y)s.dir=s.next;let h={x:s.body[0].x+s.dir.x,y:s.body[0].y+s.dir.y};if(h.x<0||h.x>=s.size||h.y<0||h.y>=s.size||s.body.some(p=>p.x===h.x&&p.y===h.y)){finish('SNAKE BITE');return}s.body.unshift(h);if(h.x===s.food.x&&h.y===s.food.y){addScore(25);s.food={x:ri(0,s.size-1),y:ri(0,s.size-1)}}else s.body.pop()}meta('LENGTH '+s.body.length);break}
case'breakout':{let s=state,b=s.ball;s.paddle=clamp(pointer.x||s.paddle,60,840);if(!pointer.down&&!('mouse' in state)){}if(keys.ArrowLeft)s.paddle-=500*dt;if(keys.ArrowRight)s.paddle+=500*dt;b.x+=b.vx*dt*60;b.y+=b.vy*dt*60;if(b.x<12||b.x>888)b.vx*=-1;if(b.y<10)b.vy=Math.abs(b.vy);if(b.y>520&&b.y<540&&Math.abs(b.x-s.paddle)<75&&b.vy>0){b.vy=-Math.abs(b.vy);b.vx+=(b.x-s.paddle)*.025}for(let i=s.bricks.length-1;i>=0;i--){let q=s.bricks[i];if(b.x>q.x&&b.x<q.x+q.w&&b.y>q.y&&b.y<q.y+q.h&&b.vy<0){q.hp--;b.vy=Math.abs(b.vy);if(!q.hp){s.bricks.splice(i,1);addScore(10)}break}}if(b.y>560){s.lives--;if(s.lives<=0){finish('OUT OF LIVES');return}b.x=450;b.y=460;b.vy=-5}if(!s.bricks.length){s.level++;makeBricks();b.vy=-Math.abs(b.vy);addScore(100)}meta('LIVES '+s.lives+' · WAVE '+s.level);break}
case'space':{let s=state;if(held.left||keys.ArrowLeft)s.ship-=420*dt;if(held.right||keys.ArrowRight)s.ship+=420*dt;s.ship=clamp(s.ship,35,865);s.spawn+=dt;if(s.spawn>.7){s.spawn=0;s.foes.push({x:rand(40,860),y:-20,v:rand(90,160)})}if(held.fire||keys.Space){if(!s.cool||s.cool<=0){s.shots.push({x:s.ship,y:485});s.cool=.22}}s.cool=(s.cool||0)-dt;s.shots.forEach(a=>a.y-=450*dt);s.foes.forEach(e=>e.y+=e.v*dt);s.shots=s.shots.filter(a=>a.y>-10);s.foes=s.foes.filter(e=>{if(e.y>570){s.lives--;if(s.lives<=0)finish('SECTOR LOST');return false}let hit=s.shots.findIndex(a=>Math.hypot(a.x-e.x,a.y-e.y)<25);if(hit>=0){s.shots.splice(hit,1);addScore(20);return false}return true});meta('SHIELDS '+s.lives);break}
case'pong':{let s=state,b=s.ball;if(held.up||keys.ArrowUp)s.py-=400*dt;if(held.down||keys.ArrowDown)s.py+=400*dt;s.py=clamp(s.py,55,505);s.ai+=clamp(b.y-s.ai,-240*dt,240*dt);b.x+=b.vx*dt*60;b.y+=b.vy*dt*60;if(b.y<10||b.y>550)b.vy*=-1;if(b.x<45&&Math.abs(b.y-s.py)<62){b.vx=Math.abs(b.vx)*1.06;b.vy+=(b.y-s.py)*.05;addScore(1)}if(b.x>855&&Math.abs(b.y-s.ai)<62)b.vx=-Math.abs(b.vx)*1.03;if(b.x<0||b.x>900){if(b.x>900)addScore(10);b.x=450;b.y=rand(120,440);b.vx=(b.x<450?5:-5);b.vy=rand(-4,4)}meta('RALLY '+score);break}
case'memory':{let s=state;if(s.lock>0){s.lock-=dt;if(s.lock<=0){s.shown=[]}}meta('MOVES '+s.moves+' · PAIRS '+s.matched.length/2);break}
case'mines':meta('SAFE '+state.revealed.size+' / 54');break;
case'merge':meta('TARGET 512');break;
case'flap':{let s=state;s.vy+=850*dt;if(held.flap||keys.Space){s.vy=-300;held.flap=false;keys.Space=false} s.y+=s.vy*dt;s.spawn+=dt;if(s.spawn>1.5){s.spawn=0;s.pipes.push({x:940,gap:rand(190,370),passed:false})}s.pipes.forEach(p=>{p.x-=230*dt;if(!p.passed&&p.x<170){p.passed=true;addScore(1)}});s.pipes=s.pipes.filter(p=>p.x>-70);if(s.y<0||s.y>560||s.pipes.some(p=>p.x<195&&p.x+65>155&&(s.y<p.gap-85||s.y>p.gap+85))){finish('FLIGHT OVER');return}meta('GATES '+score);break}
case'reaction':{let s=state;s.timer+=dt;if(s.phase==='wait'&&s.timer>s.delay){s.phase='go';s.start=performance.now();$('as-stage').classList.add('as-green')}if(s.phase==='go')meta('NOW!');else meta('WAIT FOR GREEN');break}
case'words':{let s=state;s.spawn+=dt;if(s.spawn>2.2){s.spawn=0;let list=['NOVA','DRIFT','PIXEL','BOOST','LASER','COMET','TURBO','NEON','RIVAL','ORBIT'];s.words.push({word:list[ri(0,list.length-1)],x:rand(80,760),y:30})}s.words.forEach(w=>w.y+=75*dt);s.words=s.words.filter(w=>{if(w.y>550){return false}return true});meta('WORDS '+s.words.length);break}
case'target':{let s=state;s.spawn+=dt;if(s.spawn>Math.max(.35,1-elapsed*.012)){s.spawn=0;s.targets.push({x:rand(60,840),y:rand(70,500),r:rand(17,27),life:2})}s.targets.forEach(t=>t.life-=dt);s.targets=s.targets.filter(t=>t.life>0);if(elapsed>45)finish('TIME UP');meta(Math.max(0,45-Math.floor(elapsed))+' SEC');break}
}}
function draw(){if(!current)return;let g=current.id;ctx.fillStyle='#080e19';ctx.fillRect(0,0,900,560);ctx.save();
switch(g){
case'drift':drawDrift();break;case'snake':drawSnake();break;case'breakout':drawBreakout();break;case'space':drawSpace();break;case'pong':drawPong();break;case'memory':drawMemory();break;case'mines':drawMines();break;case'merge':drawMerge();break;case'flap':drawFlap();break;case'reaction':drawReaction();break;case'words':drawWords();break;case'target':drawTarget();break;
}ctx.restore();}
function text(t,x,y,size=18,color='#fff',align='center'){ctx.fillStyle=color;ctx.font=`900 ${size}px system-ui`;ctx.textAlign=align;ctx.fillText(t,x,y)}
function drawDrift(){let s=state;let grad=ctx.createLinearGradient(0,0,0,560);grad.addColorStop(0,'#153a50');grad.addColorStop(1,'#102018');ctx.fillStyle=grad;ctx.fillRect(0,0,900,560);for(let i=0;i<22;i++){let y=(i*35+elapsed*speedFactor())%580;let p=y/580;ctx.fillStyle='#24543e';ctx.beginPath();ctx.arc(45+(i%2)*810,y,5+p*12,0,7);ctx.fill();ctx.fillStyle='#76543d';ctx.fillRect(42+(i%2)*810,y,5,16)}for(let y=150;y<560;y+=3){let p=(y-150)/410,half=30+p*330,x=450+Math.sin(elapsed*.6+p*4)*p*100;ctx.fillStyle=Math.floor((y+elapsed*220)/25)%2?'#e9edf1':'#e44c67';ctx.fillRect(x-half-8,y,16,4);ctx.fillRect(x+half-8,y,16,4);ctx.fillStyle='#303944';ctx.fillRect(x-half,y,half*2,4);if(Math.floor((y+elapsed*240)/45)%2===0){ctx.fillStyle='#d5dce2';ctx.fillRect(x-2,y,4,4)}}s.cars.forEach(c=>{let y=150+c.z*390,x=450+c.lane*(35+c.z*260);drawMiniCar(x,y,.2+c.z*.8,c.color)});drawMiniCar(450+s.x*190,470,1.25,'#ff456c');text('NEON CIRCUIT',22,32,13,'#73e9f2','left');}
function speedFactor(){return state.speed*180}
function drawMiniCar(x,y,scale,color){ctx.save();ctx.translate(x,y);ctx.scale(scale,scale);ctx.fillStyle='#080d15';ctx.fillRect(-27,-15,12,40);ctx.fillRect(15,-15,12,40);ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(-12,-48);ctx.lineTo(12,-48);ctx.lineTo(20,20);ctx.lineTo(31,29);ctx.lineTo(-31,29);ctx.lineTo(-20,20);ctx.closePath();ctx.fill();ctx.fillStyle='#b8efff';ctx.fillRect(-10,-25,20,13);ctx.restore();}
function drawSnake(){let s=state,cell=22,ox=241,oy=38;ctx.fillStyle='#0b2229';ctx.fillRect(ox,oy,418,418);ctx.strokeStyle='#1d4145';for(let i=0;i<=19;i++){ctx.beginPath();ctx.moveTo(ox+i*22,oy);ctx.lineTo(ox+i*22,oy+418);ctx.stroke();ctx.beginPath();ctx.moveTo(ox,oy+i*22);ctx.lineTo(ox+418,oy+i*22);ctx.stroke()}s.body.forEach((p,i)=>{ctx.fillStyle=i?'#36dcb1':'#c1fff0';ctx.fillRect(ox+p.x*22+2,oy+p.y*22+2,18,18)});ctx.fillStyle='#ff5c87';ctx.beginPath();ctx.arc(ox+s.food.x*22+11,oy+s.food.y*22+11,8,0,7);ctx.fill();text('CORE '+score,35,60,15,'#69edcf','left')}
function drawBreakout(){let s=state;s.bricks.forEach(b=>{ctx.fillStyle=b.color;ctx.beginPath();ctx.roundRect(b.x,b.y,b.w,b.h,5);ctx.fill();ctx.fillStyle='#ffffff35';ctx.fillRect(b.x+4,b.y+3,b.w-8,2)});ctx.fillStyle='#d9fbff';ctx.beginPath();ctx.roundRect(s.paddle-65,520,130,13,7);ctx.fill();ctx.fillStyle='#ff65bd';ctx.beginPath();ctx.arc(s.ball.x,s.ball.y,9,0,7);ctx.fill();text('LIVES '+s.lives,20,535,13,'#fff','left')}
function drawSpace(){let s=state;for(let i=0;i<65;i++){ctx.fillStyle='#ffffff88';ctx.fillRect((i*137)%900,(i*83+elapsed*40)%560,2,2)}s.shots.forEach(a=>{ctx.fillStyle='#65f4ff';ctx.fillRect(a.x-3,a.y,6,18)});s.foes.forEach(e=>{ctx.fillStyle='#ff5e8b';ctx.beginPath();ctx.moveTo(e.x,e.y+18);ctx.lineTo(e.x-18,e.y-12);ctx.lineTo(e.x,e.y-4);ctx.lineTo(e.x+18,e.y-12);ctx.fill()});ctx.fillStyle='#69eaff';ctx.beginPath();ctx.moveTo(s.ship,460);ctx.lineTo(s.ship-28,510);ctx.lineTo(s.ship,500);ctx.lineTo(s.ship+28,510);ctx.fill();text('SECTOR 07',20,30,13,'#9eaaff','left')}
function drawPong(){let s=state;ctx.setLineDash([12,14]);ctx.strokeStyle='#ffffff35';ctx.beginPath();ctx.moveTo(450,0);ctx.lineTo(450,560);ctx.stroke();ctx.setLineDash([]);ctx.fillStyle='#69e5ee';ctx.fillRect(25,s.py-55,13,110);ctx.fillStyle='#ff7da4';ctx.fillRect(862,s.ai-55,13,110);ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(s.ball.x,s.ball.y,10,0,7);ctx.fill();text('YOU',35,35,12,'#69e5ee');text('CPU',865,35,12,'#ff7da4')}
function drawMemory(){let s=state;for(let i=0;i<16;i++){let x=180+(i%4)*138,y=38+Math.floor(i/4)*126,show=s.shown.includes(i)||s.matched.includes(i);ctx.fillStyle=show?'#253e59':'#17263a';ctx.strokeStyle=show?'#69e4ef':'#344963';ctx.lineWidth=2;ctx.beginPath();ctx.roundRect(x,y,116,105,12);ctx.fill();ctx.stroke();text(show?s.deck[i]:'✦',x+58,y+67,show?36:28,show?'#d9faff':'#6d819f')}}
function drawMines(){let s=state;for(let i=0;i<s.n*s.m;i++){let x=190+(i%s.m)*53,y=65+Math.floor(i/s.m)*53,rev=s.revealed.has(i),flag=s.flags.has(i);ctx.fillStyle=rev?'#203449':'#31445a';ctx.beginPath();ctx.roundRect(x,y,46,46,7);ctx.fill();ctx.strokeStyle='#536b83';ctx.stroke();if(flag)text('⚑',x+23,y+31,22,'#ffca70');else if(rev){let mine=s.mines.has(i);text(mine?'✹':countMines(i),x+23,y+30,18,mine?'#ff6685':'#78e6ed')}}text('TAP A TILE TO REVEAL',450,40,13,'#a9bad0')}
function countMines(i){let {n,m,mines}=state,x=i%m,y=Math.floor(i/m),c=0;for(let dy=-1;dy<=1;dy++)for(let dx=-1;dx<=1;dx++){let xx=x+dx,yy=y+dy;if(xx>=0&&xx<m&&yy>=0&&yy<n&&mines.has(yy*m+xx))c++}return c||''}
function drawMerge(){let s=state;for(let i=0;i<16;i++){let x=230+(i%4)*112,y=45+Math.floor(i/4)*112,v=s.board[i];ctx.fillStyle=v?'#'+({2:'283b55',4:'28566a',8:'247c82',16:'7565a5',32:'a65386',64:'bd5a64',128:'d58b46',256:'e4b94e',512:'7de0d2'}[v]||'d9e4ed'):'#152235';ctx.beginPath();ctx.roundRect(x,y,98,98,12);ctx.fill();if(v)text(v,x+49,y+61,v>99?24:31,'#fff')}}
function drawFlap(){let s=state;ctx.fillStyle='#142b48';ctx.fillRect(0,0,900,560);for(let i=0;i<18;i++){ctx.fillStyle='#ffffff66';ctx.fillRect(i*57,(i*83)%560,3,3)}s.pipes.forEach(p=>{ctx.fillStyle='#3cdbb0';ctx.fillRect(p.x,0,65,p.gap-85);ctx.fillRect(p.x,p.gap+85,65,560-p.gap-85);ctx.fillStyle='#b3ffed';ctx.fillRect(p.x-5,p.gap-95,75,10);ctx.fillRect(p.x-5,p.gap+85,75,10)});ctx.fillStyle='#ffd16d';ctx.beginPath();ctx.arc(170,s.y,17,0,7);ctx.fill();text('GATES '+score,25,35,14,'#fff','left')}
function drawReaction(){let s=state;ctx.fillStyle=s.phase==='go'?'#0d563e':'#521d34';ctx.fillRect(0,0,900,560);text(s.phase==='go'?'TAP NOW':'WAIT FOR GREEN',450,270,42,'#fff');text('FALSE STARTS RESET YOUR RUN',450,320,13,'#ffffffaa')}
function drawWords(){let s=state;s.words.forEach(w=>{ctx.fillStyle='#142e43';ctx.beginPath();ctx.roundRect(w.x-60,w.y-27,w.word.length*22+32,44,9);ctx.fill();text(w.word,w.x,w.y+7,18,'#73eaff')});ctx.fillStyle='#0c1c2a';ctx.fillRect(20,490,860,48);ctx.strokeStyle='#58d8ed';ctx.strokeRect(20,490,860,48);text(s.typed.toUpperCase()||'TYPE THE FALLING WORD…',38,521,19,'#eafaff','left')}
function drawTarget(){state.targets.forEach(t=>{ctx.fillStyle='#ffcc75';ctx.beginPath();ctx.arc(t.x,t.y,t.r,0,7);ctx.fill();ctx.fillStyle='#e74e65';ctx.beginPath();ctx.arc(t.x,t.y,t.r*.62,0,7);ctx.fill();ctx.fillStyle='#fff';ctx.beginPath();ctx.arc(t.x,t.y,t.r*.25,0,7);ctx.fill()});text('45 SECOND CHALLENGE',450,30,13,'#ffcf80')}
function canvasPoint(e){let r=canvas.getBoundingClientRect();return{x:(e.clientX-r.left)/r.width*900,y:(e.clientY-r.top)/r.height*560}}
canvas.addEventListener('pointermove',e=>{let p=canvasPoint(e);pointer.x=p.x;pointer.y=p.y;if(current?.id==='breakout')state.paddle=p.x;if(current?.id==='pong')state.py=p.y;if(current?.id==='drift'&&pointer.down)state.x=(p.x-450)/190});
canvas.addEventListener('pointerdown',e=>{let p=canvasPoint(e);pointer={...p,down:true};if(!current||!running)return;switch(current.id){case'memory':memoryTap(p);break;case'mines':mineTap(p);break;case'target':targetTap(p);break;case'reaction':reactionTap();break;case'flap':held.flap=true;break;case'breakout':state.paddle=p.x;break;case'pong':state.py=p.y;break;case'drift':state.x=clamp((p.x-450)/190,-1.2,1.2);break;}});
canvas.addEventListener('pointerup',()=>pointer.down=false);
function memoryTap(p){let s=state,col=Math.floor((p.x-180)/138),row=Math.floor((p.y-38)/126),i=row*4+col;if(col<0||col>3||row<0||row>3||s.shown.length>=2||s.matched.includes(i)||s.shown.includes(i))return;s.shown.push(i);if(s.shown.length===2){s.moves++;if(s.deck[s.shown[0]]===s.deck[s.shown[1]]){s.matched.push(...s.shown);s.shown=[];addScore(50);if(s.matched.length===16)finish('MEMORY MASTER')}else s.lock=.7}}
function mineTap(p){let s=state,col=Math.floor((p.x-190)/53),row=Math.floor((p.y-65)/53),i=row*s.m+col;if(col<0||col>=s.m||row<0||row>=s.n)return;if(s.flagMode){s.flags.has(i)?s.flags.delete(i):s.flags.add(i);draw();return}if(s.revealed.has(i)||s.flags.has(i))return;s.revealed.add(i);if(s.mines.has(i)){s.over=true;finish('MINE TRIGGERED');return}addScore(5);if(s.revealed.size===s.n*s.m-s.mines.size)finish('FIELD CLEARED')}
function targetTap(p){let s=state;let i=s.targets.findIndex(t=>Math.hypot(t.x-p.x,t.y-p.y)<t.r+8);if(i>=0){s.targets.splice(i,1);s.combo++;addScore(10+s.combo*2)}else{s.combo=0;s.miss++}}
function reactionTap(){let s=state;if(s.phase==='go'){let ms=Math.round(performance.now()-s.start);addScore(Math.max(1,1000-ms));$('as-overlay-title').textContent='REACTION: '+ms+' MS';finish('REACTION RECORDED')}else{finish('FALSE START!')}}

function spawnTile(){let s=state,empty=s.board.map((v,i)=>v===0?i:-1).filter(i=>i>=0);if(empty.length)s.board[empty[ri(0,empty.length-1)]]=Math.random()<.9?2:4}
function mergeMove(dx,dy){let s=state,b=s.board,changed=false;for(let line=0;line<4;line++){let ids=[];for(let k=0;k<4;k++){let x=dx? (dx>0?3-k:k):line,y=dy?(dy>0?3-k:k):line;ids.push(y*4+x)}let vals=ids.map(i=>b[i]).filter(Boolean);for(let j=0;j<vals.length-1;j++)if(vals[j]===vals[j+1]){vals[j]*=2;addScore(vals[j]);vals.splice(j+1,1)}while(vals.length<4)vals.push(0);ids.forEach((id,j)=>{if(b[id]!==vals[j])changed=true;b[id]=vals[j]})}if(changed){spawnTile();if(Math.max(...b)>=512)finish('OVERDRIVE COMPLETE')}}
function keyDown(e){if(!current||!running)return;let k=e.key;if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight',' '].includes(k))e.preventDefault();keys[k]=true;if(current.id==='merge'){let map={ArrowUp:[0,-1],ArrowDown:[0,1],ArrowLeft:[-1,0],ArrowRight:[1,0]};if(map[k])mergeMove(...map[k])}if(current.id==='snake'){let map={ArrowUp:{x:0,y:-1},ArrowDown:{x:0,y:1},ArrowLeft:{x:-1,y:0},ArrowRight:{x:1,y:0}};if(map[k])state.next=map[k]}if(current.id==='words'&&k==='Enter'){let i=state.words.findIndex(w=>w.word===state.typed.toUpperCase());if(i>=0){state.words.splice(i,1);addScore(25)}state.typed='';drawWords()}else if(current.id==='words'&&k.length===1){state.typed+=k.toUpperCase();drawWords()}if(current.id==='reaction'&&k===' '){reactionTap()}}
function keyUp(e){keys[e.key]=false}
window.addEventListener('keydown',keyDown);window.addEventListener('keyup',keyUp);
$('as-start').addEventListener('click',start);$('as-restart').addEventListener('click',start);$('as-close').addEventListener('click',closeGame);$('as-modal').addEventListener('click',e=>{if(e.target===$('as-modal'))closeGame()});
$('as-featured-play').addEventListener('click',()=>openGame('drift'));$('as-scroll-library').addEventListener('click',()=>$('as-library').scrollIntoView({behavior:'smooth'}));
root.querySelectorAll('.as-filter button').forEach(b=>b.addEventListener('click',()=>{root.querySelectorAll('.as-filter button').forEach(x=>x.classList.remove('active'));b.classList.add('active');filter=b.dataset.filter;renderCards()}));
renderCards();updateHome();
})();
/* My Playlist: nine bundled MP3 tracks with a full in-page player. */
(function(){
 const list=document.getElementById('tracks'),audio=document.getElementById('playlist-audio');
 if(!list||!audio)return;
 const songs=[
  {title:'Monalisa',artist:'Mons',src:'music/Monalisa - Mons.mp3'},
  {title:'Mada Biya',artist:'Shaoline',src:'music/Shaoline - Mada Biya (Official Music) - Shaoline.mp3'},
  {title:'Maak',artist:'Draganov',src:'music/Maak - Draganov.mp3'},
  {title:'100 000 DÉTAIL FIK',artist:'Shr., MSKIN',src:'music/100 000 DÉTAIL FIK (feat. MSKIN) - Shr.mp3'},
  {title:'Last Christmas',artist:'Wham!',src:'music/Last Christmas - Wham!.mp3'},
  {title:'Nabra',artist:'Mons',src:'music/Nabra - Mons.mp3'},
  {title:'LOTSOFLOVE',artist:'Najm',src:'music/LOTSOFLOVE - Najm.mp3'},
  {title:"CALLIN' U",artist:'Najm',src:"music/CALLIN' U - Najm.mp3"},
  {title:'Zahri',artist:'Inkonnu',src:'music/Zahri - Inkonnu.mp3'}
 ];
 let current=-1;const $=id=>document.getElementById(id);
 const fmt=s=>{if(!Number.isFinite(s))return '0:00';const m=Math.floor(s/60),sec=Math.floor(s%60);return m+':'+String(sec).padStart(2,'0')};
 function render(){list.innerHTML='';songs.forEach((song,i)=>{const li=document.createElement('li');if(i===current)li.classList.add('active');const n=document.createElement('span');n.className='tr-n';n.textContent=String(i+1);const info=document.createElement('div');info.className='track-info';const title=document.createElement('strong');title.className='tr-t';title.textContent=song.title;const artist=document.createElement('span');artist.className='tr-a';artist.textContent=song.artist;info.append(title,artist);const b=document.createElement('button');b.type='button';b.className='track-play';b.textContent=(i===current&&!audio.paused)?'Ⅱ':'▶';b.setAttribute('aria-label',(i===current&&!audio.paused?'Pause ':'Play ')+song.title);b.addEventListener('click',()=>{if(i===current){if(audio.paused)audio.play();else audio.pause();}else play(i)});li.append(n,info,b);list.append(li)});}
 function play(i){if(i<0||i>=songs.length)return;current=i;audio.src=songs[i].src;audio.play().catch(()=>{$('playlist-status').textContent='Tap Play again if your browser blocked automatic playback.'});$('now-title').textContent=songs[i].title;$('now-artist').textContent=songs[i].artist;$('player-toggle').textContent='Ⅱ';$('player-toggle').setAttribute('aria-label','Pause');render()}
 $('player-toggle').addEventListener('click',()=>{if(current<0){play(0);return}if(audio.paused)audio.play();else audio.pause()});
 $('previous-track').addEventListener('click',()=>play((current<=0?songs.length-1:current-1)));
 $('next-track').addEventListener('click',()=>play((current+1)%songs.length));
 $('volume-control').addEventListener('input',e=>audio.volume=Number(e.target.value));audio.volume=.85;
 audio.addEventListener('play',()=>{$('player-toggle').textContent='Ⅱ';$('player-toggle').setAttribute('aria-label','Pause');render()});
 audio.addEventListener('pause',()=>{$('player-toggle').textContent='▶';$('player-toggle').setAttribute('aria-label','Play');render()});
 audio.addEventListener('ended',()=>play((current+1)%songs.length));
 audio.addEventListener('loadedmetadata',()=>{$('duration').textContent=fmt(audio.duration)});
 audio.addEventListener('timeupdate',()=>{if(audio.duration){$('seek-bar').value=Math.round(audio.currentTime/audio.duration*1000);$('current-time').textContent=fmt(audio.currentTime)}});
 $('seek-bar').addEventListener('input',e=>{if(audio.duration)audio.currentTime=(Number(e.target.value)/1000)*audio.duration});
 const addForm=$('shared-track-form');addForm.addEventListener('submit',e=>{e.preventDefault();const input=$('local-track'),file=input.files&&input.files[0];if(!file)return;$('playlist-status').textContent='This extra file is ready for this browser session only. To share it with Raouaa, upload it to connected cloud storage.';const url=URL.createObjectURL(file);songs.push({title:file.name.replace(/\.[^.]+$/,''),artist:'Added from this device',src:url});render();input.value='';});
 render();
})();
(function(){
 const form=document.getElementById('private-form'),status=document.getElementById('private-status'),content=document.getElementById('private-content');if(!form)return;
 const enc=new TextEncoder(),dec=new TextDecoder();let activeKey=null,spaceId=null;
 const hex=b=>Array.from(new Uint8Array(b)).map(x=>x.toString(16).padStart(2,'0')).join('');
 async function derive(code,salt){const material=await crypto.subtle.importKey('raw',enc.encode(code),'PBKDF2',false,['deriveKey']);return crypto.subtle.deriveKey({name:'PBKDF2',salt,iterations:250000,hash:'SHA-256'},material,{name:'AES-GCM',length:256},false,['encrypt','decrypt'])}
 async function idFor(code){const d=await crypto.subtle.digest('SHA-256',enc.encode('YourOwnSpace:'+code));return hex(d)}
 async function encrypt(value){const iv=crypto.getRandomValues(new Uint8Array(12));const data=await crypto.subtle.encrypt({name:'AES-GCM',iv},activeKey,enc.encode(value));return JSON.stringify({iv:Array.from(iv),data:Array.from(new Uint8Array(data))})}
 async function decrypt(blob){const o=JSON.parse(blob);const data=await crypto.subtle.decrypt({name:'AES-GCM',iv:new Uint8Array(o.iv)},activeKey,new Uint8Array(o.data));return dec.decode(data)}
 form.addEventListener('submit',async e=>{e.preventDefault();const code=document.getElementById('space-code').value;if(code.length<6){status.textContent='Use at least 6 characters.';return}try{spaceId=await idFor(code);const storage='yos_private_'+spaceId;let saved=localStorage.getItem(storage);if(saved){const parsed=JSON.parse(saved);activeKey=await derive(code,new Uint8Array(parsed.salt));document.getElementById('private-note').value=await decrypt(parsed.note||await encrypt(''));status.textContent='Your encrypted private space is unlocked on this device.'}else{const salt=crypto.getRandomValues(new Uint8Array(16));activeKey=await derive(code,salt);localStorage.setItem(storage,JSON.stringify({salt:Array.from(salt),note:await encrypt('')}));document.getElementById('private-note').value='';status.textContent='Private space created. Remember your code; it cannot be recovered.'}content.hidden=false;document.getElementById('space-code').value='';}catch(err){activeKey=null;status.textContent='Could not unlock this space. Check your code.';}});
 document.getElementById('save-note').addEventListener('click',async()=>{if(!activeKey)return;const storage='yos_private_'+spaceId;const saved=JSON.parse(localStorage.getItem(storage));saved.note=await encrypt(document.getElementById('private-note').value);localStorage.setItem(storage,JSON.stringify(saved));document.getElementById('note-status').textContent='Encrypted note saved on this device.'});
 document.getElementById('private-lock').addEventListener('click',()=>{activeKey=null;spaceId=null;content.hidden=true;document.getElementById('private-note').value='';status.textContent='Space locked.'});
 document.querySelectorAll('[data-private-tab]').forEach(b=>b.addEventListener('click',()=>{const notes=b.dataset.privateTab==='notes';document.getElementById('private-notes').hidden=!notes;document.getElementById('private-gallery').hidden=notes}));
 const photo=document.getElementById('private-photo');photo.addEventListener('change',()=>{const f=photo.files&&photo.files[0];if(!f)return;const img=document.createElement('img');img.alt='Private photo preview';img.src=URL.createObjectURL(f);document.getElementById('private-photo-list').append(img);status.textContent='Photo preview only for now; encrypted persistent photo storage will be added with cloud storage.'});
})();
/* Rule R: replace lowercase r in visible text while preserving every other character. */
(function(){
 function fix(node){if(node.nodeType===Node.TEXT_NODE){if(node.nodeValue&&node.nodeValue.includes('r'))node.nodeValue=node.nodeValue.replace(/r/g,'R');return}if(node.nodeType!==Node.ELEMENT_NODE)return;const tag=node.tagName;if(['SCRIPT','STYLE','TEXTAREA','INPUT','NOSCRIPT'].includes(tag))return;node.childNodes.forEach(fix);}
 fix(document.body);new MutationObserver(records=>records.forEach(r=>{if(r.type==='characterData')fix(r.target);else r.addedNodes.forEach(fix)})).observe(document.body,{subtree:true,childList:true,characterData:true});
 document.querySelectorAll('input[placeholder],textarea[placeholder]').forEach(el=>el.placeholder=el.placeholder.replace(/r/g,'R'));
})();
