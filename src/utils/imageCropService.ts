import { centerCrop, makeAspectCrop } from "react-image-crop";

export function getAspectRatio(ratio: string): number | undefined {
  if (ratio === 'free') return undefined;
  const [width, height] = ratio.split(':').map(Number);
  return width / height;
}

export function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number | undefined,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect || 1,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  );
}