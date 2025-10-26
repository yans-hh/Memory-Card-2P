// Daftar 32 simbol unik
const symbols = [
  '🍎','🍌','🍇','🍋','🍉','🍒','🍍','🥝',
  '🍓','🍑','🥥','🍆','🌶️','🥕','🍄','🥦',
  '🍔','🍟','🍕','🌭','🍿','🍩','🍪','🍫',
  '🥨','🧀','🍗','🍖','🥩','🥓','🍰','🧁'
];

// Gandakan jadi 64 kartu (32 pasang)
let cards = [...symbols, ...symbols];
let flipped = [];
let lockBoard = false;
let scores = [0,0];
let currentPlayer = 0;

const board = document.getElementById("board");
const score1 = document.getElementById("score1");
const score2 = document.getElementById("score2");
const p1 = document.getElementById("p1");
const p2 = document.getElementById("p2");
const restartBtn = document.getElementById("restartBtn");

function shuffle(array){
  for(let i=array.length-1;i>0;i--){
    const j=Math.floor(Math.random()*(i+1));
    [array[i],array[j]]=[array[j],array[i]];
  }
}

function createBoard(){
  board.innerHTML="";
  shuffle(cards);
  cards.forEach(symbol=>{
    const card=document.createElement("div");
    card.classList.add("card");
    card.innerHTML=`
      <div class="front">${symbol}</div>
      <div class="back"></div>`;
    card.addEventListener("click",()=>flipCard(card, symbol));
    board.appendChild(card);
  });
}

function flipCard(card, symbol){
  if(lockBoard || card.classList.contains("flip")) return;
  card.classList.add("flip");
  flipped.push({card,symbol});
  if(flipped.length===2){
    lockBoard=true;
    setTimeout(checkMatch,600);
  }
}

function checkMatch(){
  const [first, second] = flipped;
  if(first.symbol===second.symbol){
    first.card.style.pointerEvents="none";
    second.card.style.pointerEvents="none";
    scores[currentPlayer]++;
    updateScores();
  } else {
    setTimeout(()=>{
      first.card.classList.remove("flip");
      second.card.classList.remove("flip");
    },400);
    switchPlayer();
  }
  flipped=[];
  lockBoard=false;
  checkEnd();
}

function updateScores(){
  score1.textContent=scores[0];
  score2.textContent=scores[1];
}

function switchPlayer(){
  currentPlayer = currentPlayer===0 ? 1 : 0;
  p1.classList.toggle("active", currentPlayer===0);
  p2.classList.toggle("active", currentPlayer===1);
}

function checkEnd(){
  const flippedCards=document.querySelectorAll(".flip");
  if(flippedCards.length===cards.length){
    let msg="";
    if(scores[0]>scores[1]) msg="🎉 Pemain 1 Menang!";
    else if(scores[1]>scores[0]) msg="🏆 Pemain 2 Menang!";
    else msg="🤝 Seri!";
    setTimeout(()=>alert(msg),500);
  }
}

function restartGame(){
  scores=[0,0];
  currentPlayer=0;
  flipped=[];
  updateScores();
  p1.classList.add("active");
  p2.classList.remove("active");
  createBoard();
}

restartBtn.addEventListener("click", restartGame);
createBoard();

document.addEventListener("DOMContentLoaded", () => {
  const fullscreenBtn = document.getElementById("fullscreenBtn");

  fullscreenBtn.addEventListener("click", async () => {
    const elem = document.documentElement;

    try {
      if (!document.fullscreenElement && !document.webkitFullscreenElement) {
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
          await elem.webkitRequestFullscreen(); // Safari
        } else if (elem.msRequestFullscreen) {
          await elem.msRequestFullscreen(); // IE11
        }
        fullscreenBtn.textContent = "❎ Keluar Fullscreen";
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen(); // Safari
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen(); // IE11
        }
        fullscreenBtn.textContent = "⛶ Fullscreen";
      }
    } catch (err) {
      console.error("Gagal mengubah fullscreen:", err);
      alert("Browser kamu mungkin tidak mendukung fullscreen otomatis.");
    }
  });
});
// ==== POPUP PERATURAN (di dalam DOMContentLoaded) ====
document.addEventListener("DOMContentLoaded", () => {
  const rulesBtn = document.getElementById("rulesBtn");
  const rulesModal = document.getElementById("rulesModal");
  const closeRules = document.getElementById("closeRules");

  if (rulesBtn && rulesModal && closeRules) {
    rulesBtn.addEventListener("click", () => {
      rulesModal.style.display = "block";
    });

    closeRules.addEventListener("click", () => {
      rulesModal.style.display = "none";
    });

    // Tutup popup kalau user klik area luar kotak
    window.addEventListener("click", (e) => {
      if (e.target === rulesModal) {
        rulesModal.style.display = "none";
      }
    });
  }
});

