"use client";

import { useEffect, useState } from "react";
import { A4_HEIGHT_PX, LETTER_HEIGHT_PX } from "@/lib/constants";

const CONTROL_BAR_HEIGHT_PX = 48;
const OUTER_PADDING_PX = 24; // p-3 top + bottom on builder container
const SECTION_PADDING_PX = 32; // p-4 top + bottom on preview section

export function useSetDefaultScale({
  setScale,
  documentSize,
}: {
  setScale: (scale: number) => void;
  documentSize: string;
}) {
  const [scaleOnResize, setScaleOnResize] = useState(true);

  useEffect(() => {
    function getDefaultScale() {
      const screenHeight = window.innerHeight;
      const availableHeight =
        screenHeight - CONTROL_BAR_HEIGHT_PX - OUTER_PADDING_PX - SECTION_PADDING_PX;
      const documentHeight =
        documentSize === "A4" ? A4_HEIGHT_PX : LETTER_HEIGHT_PX;
      return Math.round((availableHeight / documentHeight) * 100) / 100;
    }

    function setDefaultScale() {
      setScale(getDefaultScale());
    }

    if (scaleOnResize) {
      setDefaultScale();
      window.addEventListener("resize", setDefaultScale);
    }

    return () => window.removeEventListener("resize", setDefaultScale);
  }, [setScale, scaleOnResize, documentSize]);

  return { scaleOnResize, setScaleOnResize };
}
