gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin, Draggable, InertiaPlugin);

let isMarqueeCloned = false;
const marquee__init = () => {
  const marqueeWrap = document.querySelector(".marquee-wrap");
  const marqueeSlide = document.querySelector(".marquee-slide");
  if (isMarqueeCloned === false) {
    for (let i = 0; i <= 2; i++) {
      const clone = marqueeSlide.cloneNode(true);
      marqueeWrap.appendChild(clone);
    }

    isMarqueeCloned = true;
    // console.log(`isMarqueeCloned? : ${isMarqueeCloned}`);
  }
  const setMarqueeWidth = () => {
    let marqueeDistance = marqueeSlide.getBoundingClientRect().width;
    marqueeWrap.style.setProperty(`--marquee-width`, `-${marqueeDistance}px`);
  };
  setMarqueeWidth();
};

const header__sticky = () => {
  const header = document.querySelector("header");

  ScrollTrigger.create({
    trigger: header,
    pin: true,
    pinSpacing: false,
    start: "top top",
    end: "max",
  });
};

const gsapAni__init = () => {};

const gsapScrollTo = () => {
  const toAbout = document.querySelector(".toAbout");
  toAbout.addEventListener("click", (e) => {
    e.preventDefault();
    gsap.to(window, { duration: 0.5, scrollTo: { y: "#about", offsetY: 0 } });
  });

  const toWorks = document.querySelector(".toWorks");
  toWorks.addEventListener("click", (e) => {
    e.preventDefault();
    gsap.to(window, { duration: 0.5, scrollTo: { y: "#works", offsetY: 0 } });
  });
};

const mouseReticle = () => {
  const cursorEl = document.querySelector(".cursor");
  const XEl = cursorEl.querySelector(".x");
  const YEl = cursorEl.querySelector(".y");
  const circle = cursorEl.querySelector(".circle");

  document.addEventListener("mousemove", (e) => {
    let mouseX = e.clientX + 5;
    let mouseY = e.clientY + 5;

    XEl.style.transform = `translateY(${mouseY}px)`;
    YEl.style.transform = `translateX(${mouseX}px)`;
    circle.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;
  });
};

const gsapAni__Draggable = () => {
  const dragBounds = document.querySelector(".sec-hero");
  const dragEl = dragBounds.querySelectorAll(".sec-hero .svg-box svg, .sec-hero .text-box span");

  Draggable.create(dragEl, {
    bounds: dragBounds,
    inertia: true,
  });

  let rotateDegBefore = [-2, 2];
  let rotateDegAfter = [-1, 0, 1];
  let ease = "power1.out";
  let duration = 0.3;

  dragEl.forEach((el) => {
    el.addEventListener("pointerdown", () => {
      gsap.to(el, { scale: 1.02, rotate: gsap.utils.random(rotateDegBefore), ease: ease, duration: duration });
    });
    el.addEventListener("pointerup", () => {
      gsap.to(el, { scale: 1, rotate: gsap.utils.random(rotateDegAfter), ease: ease, duration: duration });
    });
  });
};

const getWorkQTY = () => {
  const displayWorkQTY = document.querySelector(".sec-works .work-numb");
  const WorkListAll = document.querySelectorAll(".work-list-item");
  displayWorkQTY.textContent = WorkListAll.length;
};

const createWorksComponent = (works) => {
  const dataSpeed = 0.5;
  const btnHTML = works.btns
    .map(
      (btn) => `
    <div class="btn">
      <a href="${btn.link}" target="_blank">
        ${btn.text}
        <div class="svg-box">
          <svg width="2.4rem" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M6 6H18V18L6 6Z" fill="currentColor" />
          </svg>
        </div>
      </a>
    </div>
  `
    )
    .join("");

  return `
  <li class="work-list-item">
    <div class="inner">
      <div class="box box-1">
        <div class="label">${works.label}</div>
        <h4 class="work-name">${works.title}</h4>
        <div class="skills" data-font="commitMono">${works.skill}</div>
        <div class="period">${works.period}</div>
        <div class="desc">${works.desc}</div>
        <div class="roll">${works.roll}</div>
        <div class="btn-wrap">
            ${btnHTML}
        </div>
      </div>
      <div class="box box-2">
        <div class="img-box"><img src="${works.imgSrc}" alt="${works.id} thumbnail" data-speed="${dataSpeed}"/></div>
      </div>
    </div>
  </li>`;
};

async function init() {
  const response = await fetch("../script/works.json");
  const worksData = await response.json();
  const workContainer = document.querySelector(".sec-works .work-list-container");

  worksData.forEach((el) => {
    const worksComp = createWorksComponent(el);
    workContainer.insertAdjacentHTML("beforeend", worksComp);
  });

  getWorkQTY();
  ScrollSmoother.create({
    smooth: 1,
    speed: 1,
    effects: true,
  });

  gsapScrollTo();
  header__sticky();
  marquee__init();
  gsapAni__Draggable();
}
document.addEventListener("DOMContentLoaded", () => {
  init();
});

window.addEventListener("resize", () => {
  marquee__init();
});
