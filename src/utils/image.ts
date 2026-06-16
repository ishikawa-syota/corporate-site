/**
 * Convert file size to WebP
 * @param originalSize Original file size in bytes
 * @returns Estimated WebP file size in bytes
 */
export const estimateWebPSize = (originalSize: number): number => {
  // WebP typically reduces file size by 25-34%
  return Math.round(originalSize * 0.7);
};

/**
 * Generate responsive image widths
 * @param maxWidth Maximum width of the image
 * @returns Array of image widths
 */
export const generateImageWidths = (maxWidth: number): number[] => {
  const breakpoints = [320, 640, 768, 1024, 1280, 1536];
  return breakpoints.filter(width => width <= maxWidth);
};