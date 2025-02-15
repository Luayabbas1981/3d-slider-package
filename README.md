# 3D slider

A customizable animation slider component for web projects.

## Description

`3D slider` allows you to create an interactive slider with a unique 3D cylindrical animation effect. The slider dynamically adjusts for different screen sizes and supports configurable navigation, dots, and animations.

## Features

- **3D Cylinder Animation**: Cards are arranged in a cylindrical shape with smooth rotations.
- **Dynamic Properties**: Adjusts perspective, card dimensions, and animations dynamically based on screen width.
- **Customizable screen size definitions**:
  - Large Screens (≥1280px): Up to cardsToShowLargeScreen.
  - Medium Screens (1024px–1279px): Up to cardsToShowMediumScreen.
  - Small Screens (768px–1023px): Up to cardsToShowSmallScreen.
  - Mobile Screens (<768px): Discover triangle mode.
- **Customizable Dots**: Includes configurable dots for group navigation with customizable colors.
- **Navigation Options**: Supports buttons for navigating individual cards or groups, with optional navigation dots.
- **Touch Support**: Mobile-friendly design with touch gesture support for navigation.
- **Always-On Rotation Control**: When alwaysOnMode is enabled, users can toggle continuous rotation on or off by clicking or tapping - on the slider.

## Installation

Installation:

```bash
npm install 3d-slider
```

or

```bash
yarn add 3d-slider
```

```bash
import { initializeSlider } from '3d-slider';
import '3d-slider/src/3d-slider.css';
```
```bash
initializeSlider({
  sliderContainerClass: "slider", // CSS class of the slider container.
  perspective: 1, // Slider container perspective.
  transitionDuration: 2, // Transition duration for animations (in seconds) - Default: 2
  alwaysOnMode: false, // Enable or disable continuous rotation mode.
  alwaysOnDesktopDuration: 15, // Continuous rotation duration for desktop (in seconds) - Recommend: 15
  alwaysOnMobileDuration: 5, // Continuous rotation duration for mobile (in seconds) - Recommend: 5
  cardsToShowLargeScreen: 10, // Number of cards visible on large screens (≥1280px) - Default: 10
  cardsToShowMediumScreen: 7, // Number of cards visible on medium screens (1024px–1279px) - Default: 7
  cardsToShowSmallScreen: 4, // Number of cards visible on small screens (768px–1023px) - Default: 4
  cardsToShowMobile: 2, // Cards to show on mobile mode (min 2) (max 3) 'Triangle mode' (<768px) - Default: 2
  dotsMode: true, // Enable or disable navigation dots.
  dotColor: "#959899", // HEX color for navigation dots (6 digit).
});

```

### Options

- **sliderContainerClass**: The CSS class of the container element.
- **perspective**: 1 or higher to adjust container perspective.
- **transitionDuration**: Transition duration (in seconds) for animations. - **Default**: 2
- **alwaysOnMode**: Enable or disable always-on mode.
- **alwaysOnDesktopDuration**: Continuous rotation duration for desktop (in seconds).
- **alwaysOnMobileDuration**: Continuous rotation duration for mobile (in seconds).
- **cardsToShowLargeScreen**: Number of cards visible on large screens (≥1280px). - Default: 10
- **cardsToShowMediumScreen**: Number of cards visible on medium screens (1024px–1279px). - Default: 7
- **cardsToShowSmallScreen**: Number of cards visible on small screens (768px–1023px). - Default: 4
- **cardsToShowMobile**: Switch between (min 2) (max 3) 'Triangle mobile mode'(< 768px).
- **dots**: Show navigation dots (`true` / `false`).
- **dotColor**: Color of the navigation dots "HEX Color 6 digit".

### How to Use the Toggle for Always-On Mode

If the alwaysOnMode is enabled in the configuration:

Click on the Slider:
Clicking toggles between rotation and pause.
When paused, the slider snaps to the nearest angle, aligning the active card in the viewport.

## Dependencies

This version of animate-slider has no external dependencies, making it lightweight and easy to use. No additional packages are required to run the slider.

## HTML

```bash
<body>
  <div class="your-slider-container-class">
    <div>card-1</div>
    <div>card-2</div>
    <div>card-3</div>
  </div>
</body>
```

## Library demo link

[3D Slider demo link...](https://luayabbas1981.github.io/3d-slider-demo/)

## Other links

[Portfolio link...](https://luayabbas1981.github.io/portfolio-last/)
