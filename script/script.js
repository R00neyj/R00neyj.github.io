gsap.registerPlugin(ScrollTrigger, ScrollSmoother, ScrollToPlugin, Draggable, InertiaPlugin);

let isMobile;
const getIsMobile = () => {
  if (window.innerWidth <= 768) isMobile = true;
  else isMobile = false;
};
getIsMobile();

const ScrollSmoother__init = () => {
  let smoother;
  gsap.matchMedia().add("(min-width: 769px)", () => {
    smoother = ScrollSmoother.create({
      wrapper: "#smooth-wrapper",
      content: "#smooth-content",
      smooth: 1,
      effects: true,
    });

    return () => {
      if (smoother) smoother.kill();
    };
  });
};

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

let headerST;
const header__sticky = () => {
  const header = document.querySelector("header");

  headerST = ScrollTrigger.create({
    trigger: header,
    pin: true,
    pinSpacing: false,
    start: "top top",
    end: "max",
    onEnter: () => header.classList.add("active"),
    onLeaveBack: () => header.classList.remove("active"),
  });

  const about = document.querySelector(".sec-about");
  const ToAbout = document.querySelector(".toAbout");

  ScrollTrigger.create({
    trigger: about,
    start: "top top",
    onEnter: () => ToAbout.classList.add("active"),
    onEnterBack: () => ToAbout.classList.add("active"),
    onLeave: () => ToAbout.classList.remove("active"),
    onLeaveBack: () => ToAbout.classList.remove("active"),
  });

  const contact = document.querySelector("#contact");
  const toContact = document.querySelector(".toContact");

  ScrollTrigger.create({
    trigger: contact,
    start: "top bottom",
    onEnter: () => toContact.classList.add("active"),
    onEnterBack: () => toContact.classList.add("active"),
    onLeave: () => toContact.classList.remove("active"),
    onLeaveBack: () => toContact.classList.remove("active"),
  });

  const project = document.querySelector("#project");
  const toProject = document.querySelector(".toProject");

  ScrollTrigger.create({
    trigger: project,
    start: "top bottom",
    onEnter: () => toProject.classList.add("active"),
    onEnterBack: () => toProject.classList.add("active"),
    onLeave: () => toProject.classList.remove("active"),
    onLeaveBack: () => toProject.classList.remove("active"),
  });

  const mobNavClose = document.querySelector(".mob-nav-close");
  const mobNavOpen = document.querySelector(".mob-nav-open");

  mobNavOpen.addEventListener("click", () => {
    header.classList.add("mobile-active");
  });
  mobNavClose.addEventListener("click", () => {
    header.classList.remove("mobile-active");
  });
};

const gsapAni__init = () => {
  const imgs = document.querySelectorAll(".work-list-item img");

  header__sticky();
  gsapScrollTo();
  gsapAni__drag(".sec-hero");
  gsapAni__drag(".sec-about");
  gsapAni__textWave();
  gsapAni__Slide();

  let isImgLoaded = 0;
  imgs.forEach((img) => {
    img.onload = () => {
      isImgLoaded++;
      checkImgLoaded();
    };
  });

  const checkImgLoaded = () => {
    if (isImgLoaded == imgs.length) gsapAni__works();
    else return;
  };
};

const gsapAni__Slide = () => {
  const target = document.querySelectorAll(`[data-gsap="slide-up"]`);

  target.forEach((el) => {
    const slideUpTl = gsap.timeline();
    slideUpTl.from(el, { y: "50%", opacity: 0, duration: 0.6, ease: "power2.out" });

    gsapAni__ST(el, slideUpTl, "none");
  });
};

const gsapAni__textWave = () => {
  const target = document.querySelectorAll(`[data-gsap="text-wave"]`);

  target.forEach((el) => {
    const currentText = el.textContent;
    let newText = "";
    currentText.split("").forEach((char) => {
      newText += `<span>${char}</span>`;
    });
    el.innerHTML = "";
    el.innerHTML = newText;

    const waveTl = gsap.timeline();
    waveTl.from(el.children, { y: 100, opacity: 0, duration: 1, stagger: 0.05, ease: "back.out(2)" });

    gsapAni__ST(el, waveTl, "reverse");
  });
};

const gsapAni__ST = (trigger, timeline, reverse) => {
  ScrollTrigger.create({
    trigger: trigger,
    animation: timeline,
    start: "top 90%",
    toggleActions: `play none none ${reverse}`,
  });
};

const gsapAni__works = () => {
  const workListContainer = document.querySelector(".work-list-container");
  const workListItem = document.querySelectorAll(".work-list-item");
  const ToWorks = document.querySelector(".toWorks");

  const workListArr = Array.from(workListItem);
  workListArr.splice(workListArr.length - 1, 1);

  workListArr.forEach((el) => {
    el.style.willChange = "height, opacity";
  });

  const tl = gsap.timeline();
  let initialH = "10rem";
  let headerH = document.querySelector("header").offsetHeight;
  let masterDuration = 0.5;

  tl.to(workListArr, { stagger: masterDuration, height: initialH, duration: masterDuration, ease: "none" });
  tl.to(workListArr, { stagger: masterDuration, height: 0, opacity: 0.5, duration: masterDuration, ease: "none" }, `<${100 / workListArr.length}%`);
  tl.to(workListArr, { stagger: masterDuration, padding: 0, opacity: 0, duration: masterDuration, ease: "none" }, `<${100 / workListArr.length}%`);

  ScrollTrigger.create({
    trigger: workListContainer,
    pin: true,
    start: `=-${headerH} top`,
    end: () => {
      let totalHeight = 0;
      workListItem.forEach((el) => {
        totalHeight += el.offsetHeight;
      });
      return `+=${totalHeight}`;
    },
    animation: tl,
    scrub: 0.5,

    onEnter: () => ToWorks.classList.add("active"),
    onEnterBack: () => ToWorks.classList.add("active"),
    onLeave: () => ToWorks.classList.remove("active"),
    onLeaveBack: () => ToWorks.classList.remove("active"),
  });
};

const gsapScrollTo = () => {
  const header = document.querySelector("header");
  const toAbout = document.querySelectorAll(".toAbout");
  const toWorks = document.querySelectorAll(".toWorks");
  const toContact = document.querySelectorAll(".toContact");
  const toProject = document.querySelectorAll(".toProject");
  const toTop = document.querySelectorAll(".toTop");

  const letsGo = (trigger, target) => {
    trigger.forEach((el) => {
      el.addEventListener("click", (e) => {
        e.preventDefault();
        gsap.to(window, { duration: 0.5, scrollTo: { y: target, offsetY: 0 } });
        header.classList.remove("mobile-active");
      });
    });
  };

  letsGo(toAbout, "#about");
  letsGo(toWorks, "#works");
  letsGo(toContact, "#contact");
  letsGo(toProject, "#project");
  letsGo(toTop, "0");
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
const gsapAni__drag = (boundEl, randomRotate = true) => {
  const dragBounds = typeof boundEl == "string" ? document.querySelectorAll(boundEl) : [boundEl];

  dragBounds.forEach((el) => {
    const dragEls = el.querySelectorAll(`[data-gsap="drag"]`);

    dragEls.forEach((el) => {
      el.style.willChange = "transform";
    });

    let rotateDegBefore = [-2, 2];
    let rotateDegAfter = [-1, 0, 1];
    let ease = "power2.out";
    let duration = 0.3;

    Draggable.create(dragEls, {
      bounds: el,
      inertia: true,
      dragClickables: true,
      minimumMovement: 5,
    });

    if (randomRotate) {
      dragEls.forEach((el) => {
        el.addEventListener("pointerenter", () => {
          gsap.to(el, { rotate: gsap.utils.random(rotateDegBefore), ease: ease, duration: duration });
        });
        el.addEventListener("pointerleave", () => {
          gsap.to(el, { rotate: gsap.utils.random(rotateDegAfter), ease: ease, duration: duration });
        });
        el.addEventListener("pointerdown", () => {
          gsap.to(el, { scale: 1.03, ease: ease, duration: duration });
        });
        el.addEventListener("pointerup", () => {
          gsap.to(el, { scale: 1, ease: ease, duration: duration });
        });
      });
    }
  });
};

/**
 * 카운터함수
 * @param {string} counter
 * @param {string} listItem
 * @param {string} triggerEl
 */
const counterQTY = (counter, listItem, triggerEl) => {
  const displayWorkQTY = document.querySelector(counter);
  const WorkListAll = document.querySelectorAll(listItem);
  displayWorkQTY.setAttribute("data-counter", WorkListAll.length);

  const tl = gsap.timeline();
  tl.to(displayWorkQTY, {
    innerHTML: WorkListAll.length,
    ease: "power1.out",
    snap: { innerHTML: 1 },
    duration: 1,
  });

  ScrollTrigger.create({
    trigger: triggerEl,
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
  `,
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

  ScrollSmoother__init();
  counterQTY(".work-numb", ".work-list-item", ".sec-works");
  counterQTY(".project-numb", "project-card", ".sec-project");
  gsapAni__init();
}

const loading__init = () => {
  const spanAll = document.querySelectorAll(`.loading-page span[data-split="true"]`);
  const body = document.querySelector("body");
  const loadingScreen = document.querySelector(".loading-page");
  body.style.overflow = "hidden";
  loadingScreen.classList.add("active");

  const skipBtn = document.querySelector("#loading_skip");

  loadingScreen.addEventListener("click", () => {
    skipBtn.focus();
  });

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

    tl.from(el.children, { opacity: 0, duration: 0.02, stagger: 0.02, ease: "none" });
    tl.to({}, { duration: 0.1 });
  });
  tl.to(".loading-page .init .dot", { opacity: 0, duration: 0.1, stagger: -0.2, yoyo: true, repeat: 2 });

  skipBtn.addEventListener("keyup", (e) => {
    if (e.key === "Enter") (tl.pause(), loadingFinish());
  });

  marquee__init();
  mouseReticle();
};

function loadingFinish() {
  document.querySelector(".loading-page").classList.remove("active");
  document.querySelector("body").style.overflow = "hidden auto";

  const tl = gsap.timeline();

  tl.to(".loading-page", { scale: 2, duration: 0.6, ease: "power2.out" });

  const aniTarget = document.querySelectorAll(`
  .sec-hero .svg-box svg,
  .sec-hero .text-box span`);

  let targetArr = Array.from(aniTarget);

  const header = document.querySelector("header");
  targetArr.push(header);

  tl.from(targetArr, { stagger: 0.2, opacity: 0, y: 30, duration: 1, ease: "power2.out" });
}

class projectCard extends HTMLElement {
  connectedCallback() {
    const imgSrc = this.getAttribute("img-src") || "";
    const linkUrl = this.getAttribute("link-url") || "#";
    const textColor = this.dataset?.color || "#fff";
    const title = this.querySelector(".title")?.innerHTML || "Title";
    const desc = this.querySelector(".desc")?.innerHTML || "Dsecriotion";
    const spec = this.querySelector(".spec")?.innerHTML || "Specification";
    const period = this.querySelector(".period")?.innerHTML || "Period";
    const BtnName = this.querySelector(".btn-name")?.innerHTML || "Github";

    const img = new Image();
    img.src = imgSrc;
    img.onload = () => {
      this.innerHTML = `
     <div class="card" style="--card-text-color:${textColor};">
        <div class="card__bg img-box" >
          <img src="${imgSrc}" loading="lazy" width="${img.naturalWidth}" height="${img.naturalHeight}" alt="" data-speed="0.1" />
        </div>
        <div class="inner" data-speed="0.001">
          <div class="card__head">
           </div>
          <div class="card__body" data-gsap="drag">
            <div class="body-head">
              ${title}
              <div class="close" data-clickable="true">
                <span class="line"></span><span class="line"></span>
              </div>
            </div>
            <div class="text">
              <p class="desc">
                ${desc}
              </p>
              <p class="spec">
                ${spec}
              </p>
              <p class="period">
                ${period}
              </p>
            </div>
            <div class="btn-wrap">
              <div class="btn"><a href="${linkUrl}" target="_blank" data-clickable="true">${BtnName}</a></div>
            </div>
          </div>
        </div>
      </div>`;

      requestAnimationFrame(() => {
        const cardBound = this.querySelector(".card");
        if (cardBound) gsapAni__drag(cardBound, false);

        const closeBtn = this.querySelector(".close");
        const cardBody = this.querySelector(".card__body");

        closeBtn.addEventListener("click", (e) => {
          e.stopPropagation();
          gsap.to(cardBody, { autoAlpha: 0, duration: 0.2, ease: "power2.out" });
        });

        this.querySelector(".card").addEventListener("click", (e) => {
          if (!e.target.closest(".card__body")) {
            gsap.to(cardBody, { autoAlpha: 1, duration: 0.2, x: 0, y: 0, ease: "power2.out" });
          }
        });
      });
    };
  }
}
customElements.define("project-card", projectCard);

document.addEventListener("DOMContentLoaded", () => {
  getData__init();
  loading__init();
});

// headerST.kill()
let resizeTimer;
let currentWidth = window.innerWidth;
window.addEventListener("resize", () => {
  if (window.innerWidth === currentWidth) return;

  clearTimeout(resizeTimer);
  resizeTimer = setTimeout(() => {
    marquee__init();
    getIsMobile();
    ScrollTrigger.refresh();
  }, 300);
});
