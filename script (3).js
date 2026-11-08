
/* Original YourOwnSpace interactions — retained. */
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


/* My Playlist: nine tracks streamed from the public Supabase Storage bucket. */
(function(){
 const list=document.getElementById('tracks'),audio=document.getElementById('playlist-audio');
 if(!list||!audio)return;
 const songs=[
  {title:'Monalisa',artist:'Mons',src:'https://wsgmpjkncjfisadkjfzy.supabase.co/storage/v1/object/public/playlist/Monalisa%20-%20Mons.mp3'},
  {title:'Mada Biya',artist:'Shaoline',src:'https://wsgmpjkncjfisadkjfzy.supabase.co/storage/v1/object/public/playlist/Shaoline%20-%20Mada%20Biya%20%28Official%20Music%29%20-%20Shaoline.mp3'},
  {title:'Maak',artist:'Draganov',src:'https://wsgmpjkncjfisadkjfzy.supabase.co/storage/v1/object/public/playlist/Maak%20-%20Draganov.mp3'},
  {title:'100 000 DÉTAIL FIK',artist:'Shr., MSKIN',src:'https://wsgmpjkncjfisadkjfzy.supabase.co/storage/v1/object/public/playlist/100000-detail-fik-shr-mskin.mp3.mp3'},
  {title:'Last Christmas',artist:'Wham!',src:'https://wsgmpjkncjfisadkjfzy.supabase.co/storage/v1/object/public/playlist/Last%20Christmas%20-%20Wham%21.mp3'},
  {title:'Nabra',artist:'Mons',src:'https://wsgmpjkncjfisadkjfzy.supabase.co/storage/v1/object/public/playlist/Nabra%20-%20Mons.mp3'},
  {title:'LOTSOFLOVE',artist:'Najm',src:'https://wsgmpjkncjfisadkjfzy.supabase.co/storage/v1/object/public/playlist/LOTSOFLOVE%20-%20Najm.mp3'},
  {title:"CALLIN' U",artist:'Najm',src:'https://wsgmpjkncjfisadkjfzy.supabase.co/storage/v1/object/public/playlist/CALLIN%27%20U%20-%20Najm.mp3'},
  {title:'Zahri',artist:'Inkonnu',src:'https://wsgmpjkncjfisadkjfzy.supabase.co/storage/v1/object/public/playlist/Zahri%20-%20Inkonnu.mp3'}
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
