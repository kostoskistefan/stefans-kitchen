import type { ImageMetadata } from 'astro';

const imageModulesByPath = import.meta.glob<{ default: ImageMetadata }>(
  '/recipes/*/*.{jpg,jpeg,png,webp,avif}',
  { eager: true },
);

function getFileName(imagePath: string): string {
  return imagePath.slice(imagePath.lastIndexOf('/') + 1);
}

function getCoverRank(imagePath: string): number {
  const fileNameWithoutExtension = getFileName(imagePath).replace(/\.[^.]+$/, '');
  return fileNameWithoutExtension.toLowerCase() === 'cover' ? 0 : 1;
}

function compareImagePaths(firstPath: string, secondPath: string): number {
  const coverRankDifference = getCoverRank(firstPath) - getCoverRank(secondPath);
  if (coverRankDifference === 0) {
    return getFileName(firstPath).localeCompare(getFileName(secondPath), undefined, { numeric: true });
  }
  return coverRankDifference;
}

export function findRecipeImages(slug: string): ImageMetadata[] {
  const folderPrefix = `/recipes/${slug}/`;
  return Object.entries(imageModulesByPath)
    .filter(([imagePath]) => imagePath.startsWith(folderPrefix))
    .sort(([firstPath], [secondPath]) => compareImagePaths(firstPath, secondPath))
    .map(([, imageModule]) => imageModule.default);
}
