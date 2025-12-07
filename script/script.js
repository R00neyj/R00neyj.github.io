gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin);
ScrollSmoother.create({
  smooth: 1,
  speed: 1,
  effects: true,
});

let isMarqueeCloned = false;
const marquee__init = () => {
  const marqueeWrap = document.querySelector(".marquee-wrap");
  const marqueeSlide = document.querySelector(".marquee-slide");
  if (isMarqueeCloned === false) {
    for (i = 0; i <= 2; i++) {
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
  toAbout.addEventListener("click", () => {
    gsap.to(window, { duration: 0.5, scrollTo: { y: "#about", offsetY: 0 } });
  });
  const toWorks = document.querySelector(".toWorks");
};
gsapScrollTo();
header__sticky();
marquee__init();

const mouseReticle = () => {
  const cursorEl = document.querySelector(".cursor");
  const XEl = cursorEl.querySelector(".x");
  const YEl = cursorEl.querySelector(".y");
  const circle = cursorEl.querySelector(".circle");

  document.addEventListener("mousemove", (e) => {
    let mouseX = e.clientX + 5;
    let mouseY = e.clientY + 5;

    // XEl.style.transform = `translateY(${mouseY}px)`;
    // YEl.style.transform = `translateX(${mouseX}px)`;
    circle.style.transform = `translate(calc(${mouseX}px - 50%), calc(${mouseY}px - 50%))`;
  });
};

mouseReticle();

window.addEventListener("resize", () => {
  marquee__init();
});
