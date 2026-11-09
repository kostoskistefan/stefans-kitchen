# Stefan's Kitchen

Add a folder to `recipes/`, push to `main`, and it appears on the site.

    recipes/
      pasta-carbonara/        folder name becomes the page address
        recipe.cook           the Cooklang recipe (exactly one .cook file)
        cover.jpg             optional, shown on the home page and first in the gallery
        2.jpg, 3.jpg          optional extra photos, shown in the recipe gallery

Photos can be jpg, jpeg, png, webp or avif. Without a `cover` file the first photo by name is the cover, and recipes without photos show a placeholder tile.

Each recipe starts with metadata lines, then one paragraph per step:

    >> title: Recipe name
    >> description: One sentence shown on the home page.
    >> servings: 4
    >> tags: dinner, quick
    >> time: 30 minutes

    Dice @onion{1%piece} and fry it in @olive oil{1%tbsp} in a #pan{} for ~{5%minutes}.

Setup: in the GitHub repository go to Settings, Pages, and set the source to GitHub Actions.
Local preview: `npm install` then `npm run dev`.
