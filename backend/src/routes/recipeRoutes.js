const express = require('express');
const recipeController = require('../controllers/recipeController');
const auth = require('../middleware/auth');

const router = express.Router();

// Generate a recipe based on ingredients and preferences
// POST /api/recipes/generate
router.post('/generate', recipeController.generateRecipe);

// Save a generated recipe (authentication optional)
// POST /api/recipes/save
router.post('/save', auth.optional, recipeController.saveRecipe);

// Get all recipes (with filtering options)
// GET /api/recipes
router.get('/', recipeController.getRecipes);

// Get user's saved recipes (requires authentication)
// GET /api/recipes/my-recipes
router.get('/my-recipes', auth.required, async (req, res) => {
  req.query.creator = req.user._id;
  return recipeController.getRecipes(req, res);
});

// Get a single recipe by ID
// GET /api/recipes/:id
router.get('/:id', recipeController.getRecipe);

// Update a recipe (requires authentication)
// PUT /api/recipes/:id
router.put('/:id', auth.required, recipeController.updateRecipe);

// Delete a recipe (requires authentication)
// DELETE /api/recipes/:id
router.delete('/:id', auth.required, recipeController.deleteRecipe);

// Rate a recipe (requires authentication)
// POST /api/recipes/:id/rate
router.post('/:id/rate', auth.required, recipeController.rateRecipe);

module.exports = router;