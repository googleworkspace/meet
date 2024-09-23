/**
 * This file isn't necessary to understand what is going on with Meet Add-ons.
 * It just gives us something fun to look at while testing the add-on code :)
 */

import { ReactElement, useState } from 'react';
import './prettyColors.css';

type Props = {
  // Hex color picked within color input component.
  baseColor: string;
};

// Copied from https://github.com/google/closure-library/blob/master/closure/goog/color/color.js#L562
// To avoid installing full closure dep.
function hexToHsl(hexColor: string) {
  const rgb = parseInt(hexColor.slice(1), 16);
  const r = rgb >> 16;
  const g = (rgb >> 8) & 255;
  const b = rgb & 255;
  const normR = r / 255;
  const normG = g / 255;
  const normB = b / 255;
  const max = Math.max(normR, normG, normB);
  const min = Math.min(normR, normG, normB);
  let h = 0;
  let s = 0;

  // Luminosity is the average of the max and min rgb color intensities.
  const l = 0.5 * (max + min);

  // The hue and saturation are dependent on which color intensity is the max.
  // If max and min are equal, the color is gray and h and s should be 0.
  if (max != min) {
    if (max == normR) {
      h = (60 * (normG - normB)) / (max - min);
    } else if (max == normG) {
      h = (60 * (normB - normR)) / (max - min) + 120;
    } else if (max == normB) {
      h = (60 * (normR - normG)) / (max - min) + 240;
    }

    if (0 < l && l <= 0.5) {
      s = (max - min) / (2 * l);
    } else {
      s = (max - min) / (2 - 2 * l);
    }
  }
  // Make sure the hue falls between 0 and 360.
  return [Math.round(h + 360) % 360, s, l];
}

/**
 * Causes the lines to spin in the opposite direction for 1 second, so that
 * mousing over the main animation does something.
 */
function reverseAnimation(e: React.MouseEvent<HTMLDivElement, MouseEvent>) {
  const div = e.target as HTMLDivElement;
  div.style.animationDirection = 'reverse';
  div.style.animationDuration = '1000ms';

  setTimeout(() => {
    div.style.animationDirection = 'normal';
    div.style.animationDuration = '10000ms';
  }, 1000);
}

/**
 * Draw steps^3 divs that all are shades of the given hslColor and
 * all will spin.
 */
function createLines(hslColor: number[], steps: number, isAnimated: boolean) {
  const coloredLines = [];
  const minSaturation = hslColor[1] / 2;
  const maxSaturation = Math.max(1, hslColor[1] * 1.5);
  const minLuminosity = hslColor[2] / 2;
  const maxLuminosity = Math.max(0.9, hslColor[2] * 1.5);
  let key = 0;

  for (let i = 0; i < steps; i++) {
    for (
      let saturation = minSaturation;
      saturation <= maxSaturation;
      saturation += (maxSaturation - minSaturation) / steps
    ) {
      for (
        let luminosity = minLuminosity;
        luminosity <= maxLuminosity;
        luminosity += (maxLuminosity - minLuminosity) / steps
      ) {
        coloredLines.push(
          createLine(hslColor[0], saturation, luminosity, isAnimated, key++)
        );
      }
    }
  }
  return coloredLines;
}

/**
 * Create a single colored div with the given hue/saturation/luminosity.
 * This will spin indefinitely, due to css.
 */
function createLine(
  hue: number,
  saturation: number,
  luminosity: number,
  isAnimated: boolean,
  lineNumber: number
): ReactElement {
  const randomColor = `hsl(${hue}, ${saturation * 100}%, ${luminosity * 100}%)`;
  const top = lineNumber % 100;
  const left = (lineNumber % 110) - 2;
  const randomStyle = {
    backgroundColor: randomColor,
    color: randomColor,
    top: `${top}%`,
    left: `${left}%`,
  };
  const animatedClass = isAnimated ? ' animatedLine' : '';
  return (
    <div
      key={lineNumber}
      className={`prettyLine${animatedClass}`}
      style={randomStyle}
      onMouseOver={(e) => reverseAnimation(e)}
    ></div>
  );
}

/**
 * Draw a bunch of lines in a div that rotate and create a sort of shimmer
 * effect.
 */
export default function PrettyColors({ baseColor }: Props) {
  const [isAnimated, setIsAnimated] = useState(false);

  const hslColor = hexToHsl(baseColor);
  // Draw 1000 lines (10^3).
  const coloredLines = createLines(hslColor, 10, isAnimated);

  return (
    <>
      <button
        aria-label="Toggle animation"
        onClick={(e) => setIsAnimated(!isAnimated)}
      >
        {isAnimated ? 'Stop' : 'Start'} animation
      </button>
      <div className="prettyColorsContainer">{coloredLines}</div>
    </>
  );
}
