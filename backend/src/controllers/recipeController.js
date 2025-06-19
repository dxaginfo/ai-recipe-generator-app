const Recipe = require('../models/Recipe');
const recipeGenerationService = require('../services/recipeGenerationService');

// Generate a recipe based on ingredients and preferences
exports.generateRecipe = async (req, res) => {
  try {
    const { ingredients, dietaryPreferences, complexity } = req.body;
    
    // Validate request
    if (!ingredients || !Array.isArray(ingredients) || ingredients.length === 0) {
      return res.status(400).json({ 
        status: 'error',
        message: 'Please provide at least one ingredient'
      });
    }
    
    // Generate recipe using AI
    const generatedRecipe = await recipeGenerationService.generateRecipe(
      ingredients,
      dietaryPreferences || [],
      complexity || 'intermediate'
    );
    
    return res.status(200).json({
      status: 'success',
      data: generatedRecipe
    });
  } catch (error) {
    console.error('Recipe generation error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to generate recipe'
    });
  }
};

// Save a generated recipe
exports.saveRecipe = async (req, res) => {
  try {
    const recipeData = req.body;
    
    // Add user reference if authenticated
    if (req.user) {
      recipeData.creator = req.user._id;
    }
    
    // Create new recipe
    const recipe = new Recipe(recipeData);
    await recipe.save();
    
    return res.status(201).json({
      status: 'success',
      data: recipe
    });
  } catch (error) {
    console.error('Save recipe error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to save recipe'
    });
  }
};

// Get all recipes (with filtering options)
exports.getRecipes = async (req, res) => {
  try {
    const {
      dietary,
      complexity,
      ingredients,
      query,
      limit = 10,
      skip = 0,
      sort = '-createdAt'
    } = req.query;
    
    // Build filter object
    const filter = {};
    
    // Filter by dietary preferences
    if (dietary) {
      const dietaryPreferences = dietary.split(',');
      dietaryPreferences.forEach(pref => {
        filter[`dietary.${pref}`] = true;
      });
    }
    
    // Filter by complexity
    if (complexity) {
      filter.complexity = complexity;
    }
    
    // Filter by ingredients
    if (ingredients) {
      const ingredientList = ingredients.split(',');
      filter['ingredients.name'] = { $in: ingredientList };
    }
    
    // Text search
    if (query) {
      filter.$text = { $search: query };
    }
    
    // Find recipes
    const recipes = await Recipe.find(filter)
      .limit(parseInt(limit))
      .skip(parseInt(skip))
      .sort(sort)
      .populate('creator', 'name email');
    
    // Get total count for pagination
    const total = await Recipe.countDocuments(filter);
    
    return res.status(200).json({
      status: 'success',
      results: recipes.length,
      total,
      data: recipes
    });
  } catch (error) {
    console.error('Get recipes error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to fetch recipes'
    });
  }
};

// Get a single recipe by ID
exports.getRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('creator', 'name email');
    
    if (!recipe) {
      return res.status(404).json({
        status: 'error',
        message: 'Recipe not found'
      });
    }
    
    return res.status(200).json({
      status: 'success',
      data: recipe
    });
  } catch (error) {
    console.error('Get recipe error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to fetch recipe'
    });
  }
};

// Update a recipe
exports.updateRecipe = async (req, res) => {
  try {
    const updates = req.body;
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({
        status: 'error',
        message: 'Recipe not found'
      });
    }
    
    // Check if user is the creator of the recipe
    if (req.user && recipe.creator && recipe.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to update this recipe'
      });
    }
    
    // Apply updates
    Object.keys(updates).forEach(update => {
      recipe[update] = updates[update];
    });
    
    await recipe.save();
    
    return res.status(200).json({
      status: 'success',
      data: recipe
    });
  } catch (error) {
    console.error('Update recipe error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to update recipe'
    });
  }
};

// Delete a recipe
exports.deleteRecipe = async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({
        status: 'error',
        message: 'Recipe not found'
      });
    }
    
    // Check if user is the creator of the recipe
    if (req.user && recipe.creator && recipe.creator.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        status: 'error',
        message: 'You are not authorized to delete this recipe'
      });
    }
    
    await recipe.remove();
    
    return res.status(200).json({
      status: 'success',
      message: 'Recipe deleted successfully'
    });
  } catch (error) {
    console.error('Delete recipe error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to delete recipe'
    });
  }
};

// Rate a recipe
exports.rateRecipe = async (req, res) => {
  try {
    const { score, comment } = req.body;
    const recipe = await Recipe.findById(req.params.id);
    
    if (!recipe) {
      return res.status(404).json({
        status: 'error',
        message: 'Recipe not found'
      });
    }
    
    // Check if user has already rated this recipe
    const existingRatingIndex = recipe.ratings.findIndex(
      rating => rating.user.toString() === req.user._id.toString()
    );
    
    if (existingRatingIndex !== -1) {
      // Update existing rating
      recipe.ratings[existingRatingIndex].score = score;
      
      if (comment) {
        recipe.ratings[existingRatingIndex].comment = comment;
      }
      
      recipe.ratings[existingRatingIndex].date = Date.now();
    } else {
      // Add new rating
      recipe.ratings.push({
        user: req.user._id,
        score,
        comment,
        date: Date.now()
      });
    }
    
    // Calculate average rating
    const totalScore = recipe.ratings.reduce((sum, rating) => sum + rating.score, 0);
    recipe.averageRating = totalScore / recipe.ratings.length;
    
    await recipe.save();
    
    return res.status(200).json({
      status: 'success',
      data: {
        averageRating: recipe.averageRating,
        ratingsCount: recipe.ratings.length
      }
    });
  } catch (error) {
    console.error('Rate recipe error:', error);
    return res.status(500).json({
      status: 'error',
      message: error.message || 'Failed to rate recipe'
    });
  }
};