/** Canonical photocard widths (px). Filenames: `{picSet}-{width}.webp` */

export const PHOTO_WIDTHS = [400, 582];

export const PHOTO_QUALITY = {
  400: Number(process.env.WEBP_QUALITY_400 ?? 73),
  582: Number(process.env.WEBP_QUALITY_582 ?? process.env.WEBP_QUALITY_2X ?? 76),
};

export const WEBP_EFFORT = Number(process.env.WEBP_EFFORT ?? 5);

export function localPhotoPath(memberFolder, picSet, width) {
  return `/members/${memberFolder}/${picSet}-${width}.webp`;
}

export function photoFileName(picSet, width) {
  return `${picSet}-${width}.webp`;
}

/** Widths removed when re-tiering (cleanup on disk). */
export const RETIRED_PHOTO_WIDTHS = [340, 480];