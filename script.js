// Variables
const notes = document.querySelectorAll(".js-note");
let currentAudio = null;

// Reset notes height
function recize_notes() {
  notes.forEach(n => { 
    n.classList.remove("active"); 
    gsap.set(n, {height:"30%", clearProps:"all"}); 
  });
}

// Enable notes click and drag
function notes_ready() {
  gsap.to(".js-envelop-content", {height:"110%", duration:0.5});

  notes.forEach((note, i) => {
    note.addEventListener("click", () => {
      // Audio
      const file = i === 0 ? "audio/1.mp3" : i === 1 ? "audio/2.mp3" : null;
      if(file){
        // Only stop previous audio if a different note is clicked
        if(!currentAudio || currentAudio.src.indexOf(file) === -1){
          if(currentAudio) currentAudio.pause();
          currentAudio = new Audio(file);
          currentAudio.play();
        }
        // Same note clicked again => do nothing (keep playing)
      }

      // Expand/collapse note
      if(note.classList.contains("active")){
        note.classList.remove("active");
        gsap.set(note, {height:"30%", clearProps:"all"});
      } else {
        notes.forEach(n => {n.classList.remove("active"); gsap.set(n, {height:"30%", clearProps:"all"});});
        note.classList.add("active");
        gsap.set(note, {height:70 + 20*i + "%"});
      }
    });

    // Drag functionality
    let startY, startBottom;
    function dragStart(e) { 
      e.preventDefault(); 
      startY = e.touches ? e.touches[0].clientY : e.clientY; 
      startBottom = parseFloat(getComputedStyle(note).bottom); 
      document.addEventListener("mousemove", dragMove); 
      document.addEventListener("mouseup", dragEnd); 
      document.addEventListener("touchmove", dragMove); 
      document.addEventListener("touchend", dragEnd);
    }
    function dragMove(e) { 
      let cur = e.touches ? e.touches[0].clientY : e.clientY; 
      let newB = startBottom + (startY - cur); 
      if(newB < 0) newB = 0; 
      note.style.bottom = newB + "px"; 
    }
    function dragEnd() { 
      document.removeEventListener("mousemove", dragMove); 
      document.removeEventListener("mouseup", dragEnd); 
      document.removeEventListener("touchmove", dragMove); 
      document.removeEventListener("touchend", dragEnd); 
    }
    note.addEventListener("mousedown", dragStart); 
    note.addEventListener("touchstart", dragStart);
  });
}

// Envelope setup
function set_up_paper() {
  gsap.set(".js-up-paper", {bottom:"0%", rotation:0, zIndex:200, clipPath:"polygon(0% 0%,100% 0%,50% 61%)", onComplete: notes_ready});
}
function envelop_transition() {
  gsap.to(".js-up-paper", {bottom:"50%", duration:0.5, onComplete: set_up_paper});
  const up = document.querySelector(".js-up-paper");
  up.removeEventListener("click", envelop_transition);
  up.classList.remove("cursor");
}

// Sticker
function sticker() {
  gsap.set(".js-sticker", {width:"20%", left:"-80%"});
  document.body.classList.remove("scissors");
  document.querySelector(".js-sticker").removeEventListener("click", sticker);
  const up = document.querySelector(".js-up-paper");
  up.addEventListener("click", envelop_transition);
  up.classList.add("cursor");
}
document.querySelector(".js-sticker").addEventListener("click", sticker);

window.onresize = recize_notes;

// Hearts
function spawnHearts() {
  const container = document.createElement("div");
  container.classList.add("hearts");
  document.querySelector(".envelop").appendChild(container);
  for(let i=0;i<5;i++){
    const h = document.createElement("div");
    h.classList.add("heart");
    h.style.left = `${i*30-60}px`;
    h.style.animationDelay = `${i*0.3}s`;
    container.appendChild(h);
  }
  setTimeout(()=>container.remove(),4000);
}
document.querySelector(".js-up-paper").addEventListener("click", spawnHearts);
