import './style.css'
import gsap from 'gsap'

const canvas = document.querySelector(".particles");
const ctx = canvas.getContext("2d");
const bgcolorSwitcher = document.querySelector("#bg-color");
const particleColorSwitcher = document.querySelector("#particle-color");
const applyColorButton = document.querySelector(".apply");
const particles = [];
let maxDistance = (window.innerWidth + window.innerHeight) / 6;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ctx.arc(50, 60, 8, 0, Math.PI * 2);
// ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
// ctx.fill();

class Particle {
  constructor() {
    this.x = Math.random() * canvas.width;
    this.y = Math.random() * canvas.height;
    this.size = Math.random() * 3 + 1;
    this.r = 255;
    this.g = 255;
    this.b = 255;
    this.color = `rgba(${this.r}, ${this.g}, ${this.b}, 0.7)`;
    this.animate();
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    ctx.fill();
  }

  changeColor(r, g, b) {
    gsap.to(this, {
      r: r,
      g: g,
      b: b,
      duration: 1,
      onComplete: () => {
        this.color = `rgba(${Math.round(this.r)}, ${Math.round(this.g)}, ${Math.round(this.b)}, 0.7)`;
      },
    })
  }

  getRandomTarget() {
    return {
      x: Math.min(Math.max(this.x + (Math.random() - 0.5) * maxDistance, 0), canvas.width),
      y: Math.min(Math.max(this.y + (Math.random() - 0.5) * maxDistance, 0), canvas.height)
    };
  }

  animate() {
    const target = this.getRandomTarget();
    gsap.to(this, {
      x: target.x,
      y: target.y,
      duration: 1 + Math.random() * 2,
      ease: "sine.inOut",
      onComplete: () => this.animate(),
    });
  }
}


for (let i = 0; i < (window.innerWidth + window.innerHeight) / 9; i++) {
  particles.push(new Particle());
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  particles.forEach(particle => {
    particle.draw();
  });
  requestAnimationFrame(animate);
}

animate();




applyColorButton.addEventListener("click", () => {
  const bg = bgcolorSwitcher.value;
  document.body.style.backgroundColor = bg;
  const hex = particleColorSwitcher.value;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  particles.forEach(particle => particle.changeColor(r, g, b));
});

const viewPresets = document.querySelector(".view");
console.log(viewPresets);
const PresetsContainer = document.querySelector(".presets");

viewPresets.addEventListener("click", () => {
  PresetsContainer.classList.toggle("active");
});