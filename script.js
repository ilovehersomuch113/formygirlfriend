// Variables
let mobile_media_query = window.matchMedia("(max-width: 400px)");
let tablet_media_query = window.matchMedia("(min-width: 400px) and (max-width: 600px)");
const notes = document.querySelectorAll(".js-note");
let currentAudio = null;   // track currently playing audio
let currentNote = null;    // track currently active note

// Reset notes height
function recize_notes() {
  for (let i = 0; i < notes.length; i++) {
    if (notes[i].classList.contains("active")) {
      notes[i].classList.remove("active");
      gsap.set(notes[i], { height: "30%", clearProps: "all" });
    }
  }
}

// Enable notes click and drag
function notes_ready() {
  gsap.to(".js-envelop-content", { height: "110%", duration: 0.5 });

  notes.forEach((note, i) => {
    note.addEventListener("click", function () {
      // AUDIO HANDLING
      if (currentNote === this) {
        // same note clicked, do nothing with audio
      } else {
        // stop previous audio
        if (currentAudio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
        }
        // choose audio for first 2 notes
        let audioSrc = null;
        if (i === 0) audioSrc = "audio/1.mp3";
        else if (i === 1) audioSrc = "audio/2.mp3";

        if (audioSrc) {
          currentAudio = new Audio(audioSrc);
          currentAudio.play();
        }

        currentNote = this;
      }

      // NOTE EXPANSION
      if (this.classList.contains("active")) {
        this.classList.remove("active");
        gsap.set(this, { height: "30%", clearProps: "all" });
        currentNote = null;
        if (currentAudio) {
          currentAudio.pause();
          currentAudio.currentTime = 0;
        }
      } else {
        notes.forEach((n) => {
          n.classList.remove("active");
          gsap.set(n, { height: "30%", clearProps: "all" });
        });
        this.classList.add("active");
        gsap.set(this, { height: 70 + 20 * i + "%" });
      }
    });

    // Drag functionality for desktop & mobile
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
      let currentY = e.touches ? e.touches[0].clientY : e.clientY;
      let delta = startY - currentY;
      let newBottom = startBottom + delta;
      if (newBottom < 0) newBottom = 0; // Keep within envelope
      note.style.bottom = newBottom + "px";
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

// Envelope paper setup (ready instantly)
function set_up_paper() {
  var arr = [0, 0, 100, 0, 50, 61];
  gsap.set(".js-up-paper", {
    bottom: "97%",
    rotation: 180,
    zIndex: 200,
    clipPath: "polygon(" + arr[0] + "%" + arr[1] + "%," + arr[2] + "%" + arr[3] + "%," + arr[4] + "%" + arr[5] + "%)",
    onComplete: notes_ready
  });
}

// Sticker cut (not required if envelope ready)
// You can keep original sticker function if you want interactive opening

window.onresize = function () { recize_notes(); };

// Hearts
function spawnHearts() {
  const heartsContainer = document.createElement("div");
  heartsContainer.classList.add("hearts");
  document.querySelector(".envelop").appendChild(heartsContainer);

  for (let i = 0; i < 5; i++) {
    const heart = document.createElement("div");
    heart.classList.add("heart");
    heart.style.left = `${i * 30 - 60}px`;
    heart.style.animationDelay = `${i * 0.3}s`;
    heartsContainer.appendChild(heart);
  }
  setTimeout(() => heartsContainer.remove(), 4000);
}

document.querySelector(".js-up-paper").addEventListener("click", spawnHearts);

// INIT
set_up_paper();
