// Variables
let mobile_media_query = window.matchMedia("(max-width: 400px)");
let tablet_media_query = window.matchMedia("(min-width: 400px) and (max-width: 600px)");
const notes = document.querySelectorAll(".js-note");

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
      if (this.classList.contains("active")) {
        this.classList.remove("active");
        gsap.set(this, { height: "30%", clearProps: "all" });
      } else {
        notes.forEach((n) => { n.classList.remove("active"); gsap.set(n, { height: "30%", clearProps: "all" }); });
        this.classList.add("active");
        gsap.set(this, { height: 70 + 20 * i + "%" });
      }
    });

    // Drag functionality for desktop & mobile
    let startY, startBottom;
    const envelopeRect = document.querySelector(".envelop").getBoundingClientRect();

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

// Envelope paper setup
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

// Envelope open transition
function envelop_transition() {
  gsap.to(".js-up-paper", { bottom: "1%", duration: 0.25, onComplete: set_up_paper });
  const upPaper = document.querySelector(".js-up-paper");
  upPaper.removeEventListener("click", envelop_transition);
  upPaper.classList.remove("cursor");
}

// Sticker cut
function sticker() {
  gsap.set(".js-sticker", { width: "20%", left: "-80%" });
  document.body.classList.remove("scissors");
  document.querySelector(".js-sticker").removeEventListener("click", sticker);
  const upPaper = document.querySelector(".js-up-paper");
  upPaper.addEventListener("click", envelop_transition);
  upPaper.classList.add("cursor");
}

document.querySelector(".js-sticker").addEventListener("click", sticker);

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
