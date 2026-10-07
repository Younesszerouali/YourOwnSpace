/* ---------- Settings: edit these ---------- */
// One-tap notification. Paste your own ntfy.sh topic URL, e.g. "https://ntfy.sh/pick-a-long-random-name-123xyz"
// Install the ntfy app on your phone and subscribe to the same topic name to receive the ping.
var NOTIFY_URL = "https://ntfy.sh/stopby-vbjvvo8j1fgvq0";
var NOTIFY_TEXT = "Douzat men hna.";

var PLAYLIST_URL = "https://open.spotify.com/playlist/13cgSIWLOyvmPyIDHEu0ko";
var PLAYLIST = [
  { title: "Maak",                  artist: "Draganov" },
  { title: "Zahri",                 artist: "Inkonnu" },
  { title: "CALLIN' U",             artist: "Najm" },
  { title: "LOTSOFLOVE",            artist: "Najm" },
  { title: "Mada Biya",             artist: "Shaoline" },
  { title: "Monalisa",              artist: "Mons" },
  { title: "Nabra",                 artist: "Mons" },
  { title: "Last Christmas",        artist: "Wham!" },
  { title: "100 000 D\u00C9TAIL FIK", artist: "Shr., odeesbeats, MSKIN" }
];

var EMOJI = ["\uD83E\uDDCB","\uD83C\uDF53","\uD83C\uDF38","\uD83C\uDF80","\uD83D\uDC31","\uD83C\uDF70","\uD83D\uDC3E","\u2728"];
var GIFTS = [
"GRab something waRm to dRink today.",
  "BetteR days aRe aRound, even if today feels slow.",
  "You don't have to caRRy eveRything at once. Just bReathe.",
  "Find an excuse to laugh today, even at something stupid.",
  "The cat's official advice: sit down and get a snack.",
  "Good food, quiet houRs, and zeRo dRama. That's the plan.",
  "Take it easy on youRself today.",
  "Not eveRy pRoblem needs to be solved befoRe midnight.",
  "Put the phone down foR ten minutes and just Reset.",
  "Keep it simple today. One thing at a time.",
  "Step outside foR some fResh aiR, even foR five minutes.",
  "Don't let minoR annoyances take oveR youR evening.",
  "Give youR mind a bReak; you've been oveRthinking lately.",
  "A quiet Room and a good meal fix moRe than you think.",
  "Some days aRe just meant foR getting thRough.",
  "Let things happen without tRying to contRol the outcome.",
  "HydRate, unclench youR jaw, and dRop youR shouldeRs.",
  "A slow day isn't a wasted day.",
  "Skip the unnecessaRy explanations and just enjoy youR peace.",
  "No Rush. You'll figuRe things out in due time.",
  "Do one small thing today that actually makes you comfoRtable.",
  "Don't Replay old conveRsations in youR head tonight.",
  "Silence is undeRRated. Enjoy a bit of it today.",
  "Leave Room foR a little Rest without feeling guilty.",
  "Keep youR ciRcle calm and youR snacks close.",
  "WhateveR is botheRing you can wait until moRning.",
  "Pick youR battles; most aRen't woRth the eneRgy.",
  "A waRm showeR and clean sheets make a massive diffeRence.",
  "Give youRself some cRedit foR handling things quietly.",
  "TomoRRow is anotheR clean slate. Get some sleep."
];

/* ---------- Mascot ---------- */
var bubble = document.getElementById("bubble");
var catQuotes = [
  "BReak time? The caRs can wait.",
  "You looked boRed. TyRe test?",
  "Need a minute? Let's check youR Reflexes.",
  "Why aRe cats teRRible stoRytelleRs? Because they only have one tail.",
  "What does a cat do when it fails a test? It pRetends nothing happened and walks out of the Room.",
  "What's a cat's favoRite spoRt? Knocking things off tables with zeRo RegRet.",
  "What do you call a cat sitting next to an open dooR? Indecisive, as usual.",
  "Why did the cat sit on the computeR keyboaRd? To keep an eye on the mouse."
];
var lastBubbleQuote = null;
function toCapitalR(value) {
  return String(value).replace(/r/g, "R");
}
function say(t) { bubble.textContent = toCapitalR(t); }
function pick(a) { return a[Math.floor(Math.random() * a.length)]; }
function getNextQuote() {
  if (catQuotes.length === 1) return catQuotes[0];
  var available = catQuotes.filter(function (quote) { return quote !== lastBubbleQuote; });
  if (available.length === 0) {
    available = catQuotes.slice();
  }
  var next = pick(available);
  lastBubbleQuote = next;
  return next;
}
function cycleBubble() {
  say(getNextQuote());
}
function applyCapitalR(node) {
  if (!node || !node.childNodes) return;
  node.childNodes.forEach(function (child) {
    if (child.nodeType === 3) {
      child.textContent = toCapitalR(child.textContent);
    } else if (child.nodeType === 1) {
      applyCapitalR(child);
    }
  });
}
applyCapitalR(document.body);
cycleBubble();
bubble.addEventListener("click", cycleBubble);

/* ---------- One-tap "stopped by" (sends only when she presses the button) ---------- */
(function () {
  var btn = document.getElementById("hi");
  var sent = document.getElementById("sent");
  var builder = document.getElementById("builder");
  if (!NOTIFY_URL) { builder.hidden = false; }
  btn.addEventListener("click", function () {
    if (!NOTIFY_URL) return;
    btn.disabled = true;
    fetch(NOTIFY_URL, { method: "POST", body: NOTIFY_TEXT, headers: { "Content-Type": "text/plain" } })
      .then(function (r) {
        if (!r.ok) throw new Error("failed");
        sent.textContent = "T-siyfet. Choukran 3la douzanek. Ma khassek ta jawab.";
        sent.hidden = false;
        say("T-siyfet. Choukran!");
      })
      .catch(function () {
        btn.disabled = false;
        sent.textContent = "Ma douzatch. Mouchkil, 7ettha hakka.";
        sent.hidden = false;
      });
  });
})();

/* ---------- Lights out ---------- */
(function () {
  var lights = document.querySelectorAll("#lightRow .light");
  var btn = document.getElementById("goBtn");
  var res = document.getElementById("lightResult");
  var bestEl = document.getElementById("lightBest");
  var state = "idle", timers = [], t0 = 0, best = null;

  function clear() { timers.forEach(clearTimeout); timers = []; }
  function allOff() { lights.forEach(function (l) { l.classList.remove("on"); }); }
  function reset() {
    clear(); allOff(); state = "idle";
    btn.textContent = "Bda2"; btn.classList.remove("ready");
  }

  function start() {
    reset();
    state = "counting";
    res.textContent = "";
    btn.textContent = "Tsnna...";
    say("Tsnna... tsnna...");
    lights.forEach(function (l, i) {
      timers.push(setTimeout(function () { l.classList.add("on"); }, 700 * (i + 1)));
    });
    var wait = 700 * lights.length + 800 + Math.random() * 1800;
    timers.push(setTimeout(function () {
      allOff();
      state = "go";
      btn.textContent = "Dghti daba!";
      btn.classList.add("ready");
      t0 = performance.now();
    }, wait));
  }

  btn.addEventListener("click", function () {
    if (state === "idle") { start(); return; }
    if (state === "counting") {
      reset();
      res.textContent = "Bkri bzaf! Dghti 9bel ma tatTfa. 3awdi.";
      say("Bkri bzaf! Hhh.");
      return;
    }
    if (state === "go") {
      var ms = Math.round(performance.now() - t0);
      reset();
      res.textContent = "You: " + ms + " ms";
      if (best === null || ms < best) { best = ms; }
      bestEl.textContent = "A7ssan wa7da: " + best + " ms";
      if (ms < 300) { say("sd9ti teyaRa! \uD83C\uDFCE\uFE0F"); }
      else if (ms < 450) { say("Good !"); }
      else { say("Nice try, you retry!"); }
    }
  });
})();

/* ---------- K-drama episode titles ---------- */
(function () {
  var TITLES = [
    "The cat that witnessed it all",
    "Cold coffee in the middle of a scene",
    "Both acting tough, both checking notifications",
    "Solved over an emergency ramen",
    "The background music went completely silent",
    "Too stubborn to talk, too familiar to forget",
    "One umbrella, two completely soaked shoulders",
    "Acting unbothered while refreshing the screen",
    "Midnight snack to fix bad decisions",
    "The CEO who took the secret to grave",
    "Heavy pride, light fingers hovering over the chat",
    "Rain stopped, but the staring didn't",
    "An accidental touch, a ten-minute flashback",
    "Waiting for the fight to lose its pride",
    "A dramatic pause that lasted way too long",
    "Cold tea and words nobody wanted to say",
    "Checking the screen, pretending not to care",
    "The secret everyone in town already knows",
    "Late by an hour, dramatic by nature",
    "Awkward distance between two noisy heads",
    "A slow-motion walk to the nearest convenience store",
    "Both staying silent, both watching the status",
    "The main character staring at the ceiling again",
    "An unread message holding too many excuses",
    "Tension that even the background actors noticed",
    "Still waiting for the plot twist to drop",
    "An unspoken truce waiting for the right excuse",
    "A tragic misunderstanding over a snack",
    "Two stubborn leads running out of reasons to stay mad",
    "To be continued, unfortunately"
  ];

  var todayIndex = new Date().getDate() % TITLES.length;
  var dailyTitle = TITLES[todayIndex];
  var n = document.getElementById("epNum");
  var t = document.getElementById("epTitle");
  var b = document.getElementById("epBtn");
  var count = 0, last = -1;
  n.textContent = toCapitalR("7lqa " + (todayIndex + 1));
  t.textContent = toCapitalR(dailyTitle);
  b.addEventListener("click", function () {
    var i;
    do { i = Math.floor(Math.random() * TITLES.length); } while (i === last && TITLES.length > 1);
    last = i; count++;
    n.textContent = toCapitalR("7lqa " + count);
    t.textContent = toCapitalR(TITLES[i]);
    say("Miaw! 7lqa jdida.");
  });
})();

/* ---------- Gift ---------- */
(function () {
  var b = document.getElementById("giftBtn");
  var n = document.getElementById("giftNote");
  var i = Math.floor(Math.random() * GIFTS.length);
  b.addEventListener("click", function () {
    n.textContent = toCapitalR(GIFTS[i % GIFTS.length]);
    n.hidden = false;
    i++;
    say("Hdiya sghira!");
  });
})();

/* ---------- Playlist ---------- */
(function () {
  var ol = document.getElementById("tracks");
  PLAYLIST.forEach(function (t, i) {
    var li = document.createElement("li");
    var n = document.createElement("span"); n.className = "tr-n"; n.textContent = String(i + 1);
    var box = document.createElement("span");
    var ti = document.createElement("span"); ti.className = "tr-t"; ti.textContent = toCapitalR(t.title);
    var ar = document.createElement("span"); ar.className = "tr-a"; ar.textContent = toCapitalR(t.artist);
    box.appendChild(ti); box.appendChild(ar);
    li.appendChild(n); li.appendChild(box);
    ol.appendChild(li);
  });
  document.getElementById("plLink").href = PLAYLIST_URL;
})();

/* ---------- Memory match ---------- */
(function () {
  var grid = document.getElementById("grid");
  var movesEl = document.getElementById("moves");
  var winEl = document.getElementById("win");
  var first = null, lock = false, moves = 0, matched = 0;
  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function shuffle(arr) {
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }

  function confetti() {
    if (reduce) return;
    var set = ["\uD83C\uDF38","\u2728","\uD83C\uDF80","\uD83D\uDC3E","\uD83D\uDC31"];
    for (var i = 0; i < 22; i++) {
      var s = document.createElement("span");
      s.className = "confetti";
      s.textContent = set[i % set.length];
      s.style.left = (Math.random() * 96) + "vw";
      s.style.animationDelay = (Math.random() * 0.6) + "s";
      document.body.appendChild(s);
      (function (el) { setTimeout(function () { el.remove(); }, 3200); })(s);
    }
  }

  function build() {
    grid.innerHTML = "";
    first = null; lock = false; moves = 0; matched = 0;
    movesEl.textContent = "Moves: 0";
    winEl.hidden = true;
    shuffle(EMOJI.concat(EMOJI)).forEach(function (e) {
      var c = document.createElement("button");
      c.type = "button";
      c.className = "card";
      c.dataset.v = e;
      c.setAttribute("aria-label", "Karta mkhbya");
      c.innerHTML = '<span class="inner"><span class="face back" aria-hidden="true">?</span><span class="face front" aria-hidden="true"></span></span>';
      c.querySelector(".front").textContent = e;
      c.addEventListener("click", function () { flip(c); });
      grid.appendChild(c);
    });
  }

  function reveal(c) { c.classList.add("open"); c.setAttribute("aria-label", "Karta " + c.dataset.v); }
  function hide(c)   { c.classList.remove("open"); c.setAttribute("aria-label", "Karta mkhbya"); }

  function flip(c) {
    if (lock || c.classList.contains("open") || c.classList.contains("done")) return;
    reveal(c);
    if (!first) { first = c; say("Hmm, fin ghadi tkoun l'okhra?"); return; }
    moves++;
    movesEl.textContent = "Moves: " + moves;
    var a = first; first = null;
    if (a.dataset.v === c.dataset.v) {
      a.classList.add("done"); c.classList.add("done");
      a.classList.remove("open"); c.classList.remove("open");
      matched++;
      if (matched === EMOJI.length) {
        winEl.hidden = false;
        say(" Bravo!");
        confetti();
      } else {
        say(pick(["Bravo!", "Zwina!", "Niiiiiiiice!", "GG!"]));
      }
    } else {
      lock = true;
      say(pick(["Walo, 3awdi.", "9rib!", "Ghir 7awli."]));
      setTimeout(function () { hide(a); hide(c); lock = false; }, 800);
    }
  }

  document.getElementById("shuffle").addEventListener("click", function () { build(); say("AGAIN?!"); });
  build();
})();
