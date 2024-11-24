import "./3d-slider.css";
import nextBtnImg from "./images/slider-next-btn.png";
import prevBtnImg from "./images/slider-prev-btn.png";
import nextGroupBtnImg from "./images/slider-next-group-btn.png";
import prevGroupBtnImg from "./images/slider-prev-group-btn.png";

// Slider values
let visibleCardsArray = [];
let dotsArray = [];
let isXLargeScreen = null;
let isLargeScreen = null;
let isMediumScreen = null;
let isSmallScreen = null;
let isXSmallScreen = null;
let cardsToShow = null;
let perspectiveValue = null;
let translateZValue = null;
let currentTranslateZValue = null;
let isAlwaysOnMode = null;
let translateZInterval = 0;
let currentRotateAngle = 0;
let initialIndex = 0;
let currentIndex = 0;
let groupIndex = 0;
let xSmallMode = 0;
let startX = 0;
let endX = 0;
let isTouching = false;

// Initialize 3D Slider
function initializeSlider({
  sliderContainerClass,
  transitionDuration,
  alwaysOnMode,
  alwaysOnDesktopDuration,
  alwaysOnMobileDuration,
  cardsToShowMobile,
  dotsMode,
  dotColor,
}) {
  // Check device
  const isMobile =
    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

  const sliderContainer = document.querySelector(`.${sliderContainerClass}`);
  if (!sliderContainer) {
    console.error(
      `No element found with class name "${sliderContainerClass}".`
    );
    return;
  }
  if (!transitionDuration) {
    transitionDuration = 2;
  }
  isAlwaysOnMode = alwaysOnMode;
  if (cardsToShowMobile >= 3 && isMobile) {
    cardsToShowMobile = 3;
    xSmallMode = 0;
  } else if (cardsToShowMobile < 3 && isMobile) {
    cardsToShowMobile = 2;
    xSmallMode = 1;
  }

  sliderContainer.classList.add("slider-container-3d");
  const cardsArray = Array.from(sliderContainer.children).filter(
    (child) => child.tagName === "DIV"
  );

  cardsArray.forEach((card, index) => {
    card.classList.add(`card-${index + 1}`); //todo delete this for library code
  });

  // Generate slider elements
  function createElement(tagName, className) {
    const element = document.createElement(tagName);
    if (className) element.className = className;
    return element;
  }

  const slider = createElement("div", "slider-3d");

  const sliderNextGroupBtn = createElement("button", "slider-next-group-btn");
  sliderNextGroupBtn.style.backgroundImage = `url(${nextGroupBtnImg})`;

  const sliderPrevGroupBtn = createElement("button", "slider-prev-group-btn");
  sliderPrevGroupBtn.style.backgroundImage = `url(${prevGroupBtnImg})`;

  const sliderNextBtn = createElement("button", "slider-next-btn");
  sliderNextBtn.style.backgroundImage = `url(${nextBtnImg})`;

  const sliderPrevBtn = createElement("button", "slider-prev-btn");
  sliderPrevBtn.style.backgroundImage = `url(${prevBtnImg})`;

  const dotsContainer = createElement("div", "dots-container");

  sliderContainer.innerHTML = "";
  sliderContainer.appendChild(slider);

  // Check screen size
  function setSize() {
    isXLargeScreen = window.innerWidth >= 1800;
    isLargeScreen = window.innerWidth >= 1600;
    isMediumScreen = window.innerWidth >= 1100 && window.innerWidth < 1600;
    isSmallScreen = window.innerWidth >= 700 && window.innerWidth < 1100;
    isXSmallScreen = window.innerWidth < 700;
    setCardsToShowNumber();
    setVisibleCardsArray(initialIndex, initialIndex + cardsToShow);
  }
  setSize();

  // Set cards to show
  function setCardsToShowNumber() {
    if (isXLargeScreen) {
      cardsToShow = 10;
    } else if (isLargeScreen) {
      cardsToShow = 9;
    } else if (isMediumScreen) {
      cardsToShow = 7;
    } else if (isSmallScreen) {
      cardsToShow = 4;
    } else if (isXSmallScreen) {
      cardsToShow = cardsToShowMobile;
    }

    const sliderHeight = slider.clientHeight;
    const sliderWidth = slider.clientWidth;
    perspectiveValue = sliderWidth * 1.08;
    translateZValue = sliderWidth * 0.347;
    currentTranslateZValue = sliderWidth * 0.245;
    function adjustBtnSize(btn) {
      btn.style.width = `${
        (window.innerWidth * 0.25) / (cardsToShow + xSmallMode)
      }px`;
    }
    adjustBtnSize(sliderNextBtn);
    adjustBtnSize(sliderPrevBtn);
    adjustBtnSize(sliderNextGroupBtn);
    adjustBtnSize(sliderPrevGroupBtn);
    const sliderContainerProperties = {
      "--slides": cardsToShow,
      "--perspective": `${perspectiveValue}px`,
      "--dot-color": `${dotColor}5e`,
      "--active-dot": dotColor,
    };
    for (const [property, value] of Object.entries(sliderContainerProperties)) {
      sliderContainer.style.setProperty(property, value);
    }

    const sliderProperties = {
      "--slides": cardsToShow,
      "--always-rotate-on-duration": isMobile
        ? alwaysOnMobileDuration + "s"
        : alwaysOnDesktopDuration + "s",
      "--translate-z": `${currentTranslateZValue}px`,
      "--transition": `${transitionDuration}s`,
      "--card-width": `${
        (sliderWidth / cardsToShow) * (1.6 - xSmallMode / 2)
      }px`,
      "--card-height": `${sliderHeight * 0.345}px`,
    };
    for (const [property, value] of Object.entries(sliderProperties)) {
      slider.style.setProperty(property, value);
    }
  }

  // Set dots
  function setDots() {
    if (dotsMode) {
      dotsContainer.innerHTML = "";
      dotsArray = [];
      const dotsNumber = Math.ceil(cardsArray.length / cardsToShow);
      for (let index = 0; index < dotsNumber; index++) {
        const dot = document.createElement("div");
        dotsArray.push(dot);
        dot.classList.add("dot");
        dotsContainer.appendChild(dot);
        if (index === 0) dot.classList.add("active-dot");
      }
    }
    dotsContainer.appendChild(sliderPrevGroupBtn);
    dotsContainer.appendChild(sliderNextGroupBtn);
    sliderContainer.appendChild(dotsContainer);
  }

  function updateActiveDot() {
    dotsArray.forEach((dot, index) => {
      dot.classList.toggle(
        "active-dot",
        index === Math.floor(currentIndex / cardsToShow)
      );
    });
  }
  // Set visible cards
  function setVisibleCardsArray(startIndex, lastIndex) {
    slider.innerHTML = "";
    visibleCardsArray = cardsArray.slice(startIndex, lastIndex).reverse();
    visibleCardsArray.forEach((card, index) => {
      card.classList.add("card-3d");
      card.style.setProperty("--card-group-index", index);
      slider.appendChild(card);
      slider.style.setProperty("--visible-cards", visibleCardsArray.length);
      slider.style.setProperty(
        "--card-rotate",
        `${360 / (visibleCardsArray.length + xSmallMode)}deg`
      );
    });
    sliderContainer.appendChild(sliderPrevBtn);
    sliderContainer.appendChild(sliderNextBtn);
    function adjustSliderRotate() {
      const rotateAngel = 360 / (visibleCardsArray.length + xSmallMode);
      const additionalRotate = currentRotateAngle % rotateAngel;
      currentRotateAngle === 0
        ? (currentRotateAngle = rotateAngel)
        : (currentRotateAngle =
            currentRotateAngle - additionalRotate + rotateAngel);
      slider.style.transform = `rotateY(${currentRotateAngle}deg)`;
      resetRotateDeg(currentRotateAngle, transitionDuration);
      if (isAlwaysOnMode) {
        slider.classList.add("always-rotate-on");
        resetBtnOpacity(0.5);
      }
    }
    adjustSliderRotate();
    setDots();
    setTimeout(() => {
      openCards();
    }, 2000);
  }
  // Open cards
  function openCards() {
    translateZInterval = setInterval(() => {
      if (currentTranslateZValue >= translateZValue) {
        clearInterval(translateZInterval);
        currentTranslateZValue = translateZValue;
      } else {
        currentTranslateZValue += 1;
        slider.style.setProperty(
          "--translate-z",
          `${currentTranslateZValue}px`
        );
      }
    }, 5);
  }
  // Reset slider properties
  function resetRotateDeg(rotateValue, transitionValue) {
    slider.style.setProperty("--current-rotate-angel", rotateValue + "deg");
    slider.style.setProperty("--full-round", 360 + rotateValue + "deg");
    slider.style.setProperty("--transition", transitionValue + "s");
  }
  // Button opacity handler
  function resetBtnOpacity(opacityValue) {
    sliderNextBtn.style.setProperty("--btn-opacity", opacityValue);
    sliderPrevBtn.style.setProperty("--btn-opacity", opacityValue);
  }
  // Get slider current rotate
  function getCurrentRotateY() {
    const computedStyle = window.getComputedStyle(slider);
    const transformMatrix = computedStyle.transform;
    if (transformMatrix && transformMatrix !== "none") {
      const values = transformMatrix.match(/matrix3d\((.+)\)/);
      if (values) {
        const matrix = values[1].split(", ").map(parseFloat);
        const m11 = matrix[0];
        const m13 = matrix[2];

        const angle = Math.atan2(-m13, m11) * (180 / Math.PI);
        return angle >= 0 ? angle : angle + 360;
      }
    }
    return 0;
  }
  // Cards navigate
  function rotateSlider(direction) {
    if (!isAlwaysOnMode) {
      if (direction === "next") {
        currentRotateAngle += 360 / (visibleCardsArray.length + xSmallMode);
      } else if (direction === "prev") {
        currentRotateAngle += -(360 / (visibleCardsArray.length + xSmallMode));
      }
      resetRotateDeg(currentRotateAngle, transitionDuration);
      slider.style.transform = `rotateY(${currentRotateAngle}deg)`;
      sliderNextBtn.disabled = true;
      sliderPrevBtn.disabled = true;
      setTimeout(() => {
        sliderNextBtn.disabled = false;
        sliderPrevBtn.disabled = false;
      }, transitionDuration * 500);
    }
  }
  // Groups navigate
  function updateCurrentIndex(step) {
    currentIndex += step;
    if (currentIndex >= cardsArray.length) {
      currentIndex = 0;
    } else if (currentIndex < 0) {
      currentIndex = Math.max(cardsArray.length - cardsToShow, 0);
    }
  }
  function navigateGroup(direction) {
    if (!isTouching && visibleCardsArray.length !== cardsArray.length) {
      if (direction === "next") {
        groupIndex++;
        updateCurrentIndex(cardsToShow);
        setVisibleCardsArray(currentIndex, currentIndex + cardsToShow);
        updateActiveDot();
      } else if (direction === "prev" && groupIndex > 0) {
        console.log(groupIndex);
        groupIndex--;
        updateCurrentIndex(-cardsToShow);
        setVisibleCardsArray(currentIndex, currentIndex + cardsToShow);
        updateActiveDot();
      }
    }
  }
  // Slider events

  sliderContainer.addEventListener("touchstart", (e) => {
    isTouching = true;
    startX = e.touches[0].clientX;
  });

  sliderContainer.addEventListener("touchmove", (e) => {
    endX = e.touches[0].clientX;
  });

  sliderContainer.addEventListener("touchend", () => {
    if (endX !== 0) {
      const swipeDistance = endX - startX;
      const minSwipeDistance = 50;
      if (swipeDistance > minSwipeDistance) {
        rotateSlider("next");
      } else if (swipeDistance < -minSwipeDistance) {
        rotateSlider("prev");
      }
      startX = 0;
      endX = 0;
    }
    isTouching = false;
  });

  sliderNextBtn.addEventListener("click", () => rotateSlider("next"));
  sliderPrevBtn.addEventListener("click", () => rotateSlider("prev"));
  sliderNextGroupBtn.addEventListener("click", () => navigateGroup("next"));
  sliderPrevGroupBtn.addEventListener("click", () => navigateGroup("prev"));
  slider.addEventListener("click", () => {
    const toggleAlwaysOnClass = (enable) => {
      slider.classList.toggle("always-rotate-on", enable);
      slider.classList.toggle("always-rotate-off", !enable);
    };
    if (alwaysOnMode) {
      if (isAlwaysOnMode) {
        const rotateY = getCurrentRotateY();
        const stepAngle = 360 / (visibleCardsArray.length + xSmallMode);
        const additionalRotate = rotateY % stepAngle;
        const nearestAngle =
          additionalRotate > stepAngle / 2
            ? rotateY + (stepAngle - additionalRotate)
            : rotateY - additionalRotate;
        currentRotateAngle = nearestAngle;
        slider.style.setProperty("--slider-current-rotate", rotateY + "deg");
        resetRotateDeg(currentRotateAngle, 0);
        resetBtnOpacity(1);
        toggleAlwaysOnClass(false);
        setTimeout(() => {
          slider.style.transform = `rotateY(${currentRotateAngle}deg)`;
        }, 1000);
      } else {
        toggleAlwaysOnClass(true);
        resetBtnOpacity(0.5);
      }
      isAlwaysOnMode = !isAlwaysOnMode;
    }
  });
}

initializeSlider({
  sliderContainerClass: "slider",
  transitionDuration: 2,
  alwaysOnMode: false,
  alwaysOnDesktopDuration: 10,
  alwaysOnMobileDuration: 5,
  cardsToShowMobile: 2,
  dotsMode: true,
  dotColor: "#959899",
});
