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

  const about = document.querySelector(".sec-about");
  const ToAbout = document.querySelector(".toAbout");

  ScrollTrigger.create({
    trigger: header,
    pin: true,
    pinSpacing: false,
    start: "top top",
    end: "max",
    onEnter: () => header.classList.add("active"),
    onLeaveBack: () => header.classList.remove("active"),
  });

  ScrollTrigger.create({
    trigger: about,
    start: "top top",
    onEnter: () => ToAbout.classList.add("active"),
    onEnterBack: () => ToAbout.classList.add("active"),
    onLeave: () => ToAbout.classList.remove("active"),
    onLeaveBack: () => ToAbout.classList.remove("active"),
  });
};

const gsapAni__init = () => {
  const workListItem = document.querySelectorAll(".work-list-item");
  const img = workListItem[0].querySelector("img");

  img.onload = () => {
    header__sticky();
    gsapScrollTo();
    gsapAni__Draggable();
    gsapAni__works();
  };
};

const gsapAni__works = () => {
  const workListContainer = document.querySelector(".work-list-container");
  const workListItem = document.querySelectorAll(".work-list-item");
  const img = workListItem[0].querySelector("img");
  const ToWorks = document.querySelector(".toWorks");

  const workListArr = Array.from(workListItem);
  workListArr.splice(4, 1);

  workListArr.forEach((el) => {
    el.style.willChange = "height, opacity";
  });

  const tl = gsap.timeline();
  let initialH = "10rem";
  let originH;
  let headerH = document.querySelector("header").offsetHeight;
  let masterDuration = 0.5;

  tl.to(workListArr, { stagger: masterDuration, height: initialH, duration: masterDuration, ease: "none" });
  tl.to(workListArr, { stagger: masterDuration, height: 0, opacity: 0.5, duration: masterDuration, ease: "none" }, `<${100 / workListArr.length}%`);
  tl.to(workListArr, { stagger: masterDuration, padding: 0, duration: masterDuration, ease: "none" }, `<${100 / workListArr.length}%`);

  originH = workListItem[0].offsetHeight;

  ScrollTrigger.create({
    trigger: workListContainer,
    pin: true,
    start: `=-${headerH} top`,
    end: `+=${originH * 5}`,
    animation: tl,
    scrub: 0.5,

    onEnter: () => ToWorks.classList.add("active"),
    onEnterBack: () => ToWorks.classList.add("active"),
    onLeave: () => ToWorks.classList.remove("active"),
    onLeaveBack: () => ToWorks.classList.remove("active"),
  });
};

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
  // const cursorEl = document.querySelector(".cursor");
  // const XEl = cursorEl.querySelector(".x");
  // const YEl = cursorEl.querySelector(".y");
  const circle = document.querySelector(".circle");

  document.addEventListener("mousemove", (e) => {
    let mouseX = e.clientX + 5;
    let mouseY = e.clientY + 5;

    // XEl.style.transform = `translateY(${mouseY}px)`;
    // YEl.style.transform = `translateX(${mouseX}px)`;
    // circle.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;

    gsap.to(circle, { x: mouseX, y: mouseY, duration: 0, ease: "none" });
  });

  const alinkAll = document.querySelectorAll("a");
  alinkAll.forEach((el) => {
    el.addEventListener("mouseenter", () => {
      gsap.to(circle, { scale: 1.5, duration: 0.3 });
    });
    el.addEventListener("mouseleave", () => {
      gsap.to(circle, { scale: 1, duration: 0.3 });
    });
  });
};
const gsapAni__Draggable = () => {
  const dragBounds = document.querySelector(".sec-hero");
  const dragEl = dragBounds.querySelectorAll(".sec-hero .svg-box svg, .sec-hero .text-box span");

  let rotateDegBefore = [-2, 2];
  let rotateDegAfter = [-1, 0, 1];
  let ease = "power1.out";
  let duration = 0.3;

  Draggable.create(dragEl, {
    bounds: dragBounds,
    inertia: true,
  });

  dragEl.forEach((el) => {
    el.addEventListener("pointerdown", () => {
      gsap.to(el, { scale: 1.03, rotate: gsap.utils.random(rotateDegBefore), ease: ease, duration: duration });
    });
    el.addEventListener("pointerup", () => {
      gsap.to(el, { scale: 1, rotate: gsap.utils.random(rotateDegAfter), ease: ease, duration: duration });
    });
  });
};

const getWorkQTY = () => {
  const displayWorkQTY = document.querySelector(".sec-works .work-numb");
  const WorkListAll = document.querySelectorAll(".work-list-item");
  displayWorkQTY.setAttribute("data-counter", WorkListAll.length);

  const tl = gsap.timeline();
  tl.to(displayWorkQTY, {
    innerHTML: WorkListAll.length,
    ease: "power1.out",
    snap: { innerHTML: 1 },
    duration: 1,
  });

  ScrollTrigger.create({
    trigger: ".sec-works",
    animation: tl,
    toggleActions: "play none none none",
  });
};

const createWorksComponent = (works, index) => {
  const dataSpeed = 1;
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
        <a href="${works.btns[0].link}" target="_blank" class="img-box" data-hover="true"><img src="${works.imgSrc}" alt="${works.id} thumbnail" data-speed="${dataSpeed}"/></a>
      </div>
    </div>
  </li>`;
};

async function getData__init() {
  const response = await fetch("../script/works.json");
  const worksData = await response.json();
  const workContainer = document.querySelector(".sec-works .work-list-container");

  worksData.forEach((el, index) => {
    const worksComp = createWorksComponent(el);
    workContainer.insertAdjacentHTML("beforeend", worksComp);
  });

  ScrollSmoother.create({
    smooth: 1,
    speed: 1,
    effects: true,
  });

  getWorkQTY();
  gsapAni__init();
}

const loading__init = () => {
  const spanAll = document.querySelectorAll(`.loading-page [data-split="true"]`);
  const body = document.querySelector("body");
  const loadingScreen = document.querySelector(".loading-page");
  body.style.overflow = "hidden";
  loadingScreen.classList.add("active");

  const skeepBtn = document.querySelector("#loading_skip");

  let tl = gsap.timeline({
    onComplete: loadingFinish,
  });

  spanAll.forEach((el) => {
    let currentText = el.textContent;
    let newText = "";
    currentText.split("").forEach((char) => {
      if (char === " ") newText += `&nbsp;`;
      else if (char === ".") newText += `<span class="dot">${char}</span>`;
      else newText += `<span>${char}</span>`;
    });
    el.innerHTML = "";
    el.innerHTML = newText;

    tl.from(el.children, { opacity: 0, duration: 0.03, stagger: 0.03, ease: "none" });
    tl.to({}, { duration: 0.1 });
  });
  tl.to({}, { duration: 0.4 });

  skeepBtn.addEventListener("keyup", (e) => {
    if (e.key === "Enter") tl.pause(), loadingFinish();
  });
};

function loadingFinish() {
  marquee__init();
  mouseReticle();
  document.querySelector(".loading-page").classList.remove("active");
  document.querySelector("body").style.overflow = "auto";

  const tl = gsap.timeline();

  tl.to(".loading-page", { scale: 2, duration: 0.6, ease: "power2.out" });

  const aniTarget = document.querySelectorAll(`
  .sec-hero .svg-box svg,
  .sec-hero .text-box span`);

  let targetArr = Array.from(aniTarget);

  const header = document.querySelector("header");
  targetArr.push(header);

  console.log(targetArr);

  tl.from(targetArr, { stagger: 0.2, opacity: 0, y: 30, duration: 1, ease: "power2.out" });
}

getData__init();
loading__init();

window.addEventListener("resize", () => {
  marquee__init();
});
