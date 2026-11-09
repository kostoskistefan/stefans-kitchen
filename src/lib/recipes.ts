import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { Parser } from '@cooklang/cooklang-ts';

export type RecipeIngredient = { name: string; quantity: number | null; unit: string };

export type RecipeStepPart =
  | { type: 'text'; value: string }
  | { type: 'ingredient'; name: string }
  | { type: 'cookware'; name: string }
  | { type: 'timer'; label: string };

export type Recipe = {
  slug: string;
  title: string;
  description: string;
  time: string;
  servings: number;
  tags: string[];
  ingredients: RecipeIngredient[];
  cookware: string[];
  steps: RecipeStepPart[][];
};

type ParsedItem = {
  type: string;
  value?: string;
  name?: string;
  quantity?: number | string;
  units?: string;
};

const recipesDirectory = join(process.cwd(), 'recipes');

function capitalizeFirstLetter(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function mergeIngredients(parsedIngredients: ParsedItem[]): RecipeIngredient[] {
  const ingredientsByName = new Map<string, RecipeIngredient>();

  for (const parsedIngredient of parsedIngredients) {
    const name = capitalizeFirstLetter(parsedIngredient.name ?? '');
    const quantity = typeof parsedIngredient.quantity === 'number' ? parsedIngredient.quantity : null;
    const unit = parsedIngredient.units ?? '';
    const existingIngredient = ingredientsByName.get(name.toLowerCase());

    if (existingIngredient === undefined) {
      ingredientsByName.set(name.toLowerCase(), { name, quantity, unit });
    } else if (existingIngredient.quantity === null) {
      existingIngredient.quantity = quantity;
      existingIngredient.unit = unit;
    } else if (typeof quantity === 'number' && existingIngredient.unit === unit) {
      existingIngredient.quantity += quantity;
    }
  }

  return [...ingredientsByName.values()];
}

function toStepPart(item: ParsedItem): RecipeStepPart {
  if (item.type === 'ingredient') {
    return { type: 'ingredient', name: item.name ?? '' };
  }
  if (item.type === 'cookware') {
    return { type: 'cookware', name: item.name ?? '' };
  }
  if (item.type === 'timer') {
    return { type: 'timer', label: `${item.quantity ?? ''} ${item.units ?? ''}`.trim() };
  }
  return { type: 'text', value: item.value ?? '' };
}

function findRecipeFileName(folderName: string): string {
  const recipeFileNames = readdirSync(join(recipesDirectory, folderName)).filter((fileName) => fileName.endsWith('.cook'));
  if (recipeFileNames.length === 0) {
    throw new Error(`recipes/${folderName}: add a recipe.cook file to this folder.`);
  }
  if (recipeFileNames.length > 1) {
    throw new Error(`recipes/${folderName}: keep only one .cook file per recipe folder.`);
  }
  return recipeFileNames[0];
}

function parseRecipeFolder(folderName: string): Recipe {
  const slug = folderName;
  const recipeFileName = findRecipeFileName(folderName);
  const source = readFileSync(join(recipesDirectory, folderName, recipeFileName), 'utf8');
  const parsed = new Parser().parse(source);
  const metadata = parsed.metadata as Record<string, string>;
  const servings = Number(metadata.servings);

  if (Number.isFinite(servings) === false || servings <= 0) {
    throw new Error(`recipes/${folderName}/${recipeFileName}: add a line such as ">> servings: 4" at the top of the recipe.`);
  }

  return {
    slug,
    title: metadata.title ?? slug,
    description: metadata.description ?? '',
    time: metadata.time ?? '',
    servings,
    tags: (metadata.tags ?? '')
      .split(',')
      .map((tag) => tag.trim())
      .filter((tag) => tag.length > 0),
    ingredients: mergeIngredients(parsed.ingredients as ParsedItem[]),
    cookware: (parsed.cookwares as ParsedItem[]).map((cookware) => cookware.name ?? ''),
    steps: (parsed.steps as ParsedItem[][]).map((step) => step.map(toStepPart)),
  };
}

export function loadRecipes(): Recipe[] {
  return readdirSync(recipesDirectory, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => entry.name)
    .sort()
    .map(parseRecipeFolder);
}
