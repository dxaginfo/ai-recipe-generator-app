const OpenAI = require('openai');
const mongoose = require('mongoose');
const Ingredient = require('../models/Ingredient');

class RecipeGenerationService {
  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }

  async generateRecipe(ingredients, dietaryPreferences, complexity) {
    try {
      // Validate ingredients
      const validatedIngredients = await this.validateIngredients(ingredients);
      
      // Create prompt for AI
      const prompt = this.createRecipePrompt(
        validatedIngredients, 
        dietaryPreferences, 
        complexity
      );
      
      // Generate recipe using OpenAI
      const response = await this.openai.completions.create({
        model: "gpt-4",
        prompt: prompt,
        max_tokens: 1000,
        temperature: 0.7,
      });
      
      // Parse and structure the response
      const parsedRecipe = this.parseRecipeResponse(response.choices[0].text);
      
      // Calculate nutritional information
      const nutritionalInfo = await this.calculateNutrition(parsedRecipe);
      
      return {
        ...parsedRecipe,
        nutritionalInfo
      };
    } catch (error) {
      console.error('Recipe generation error:', error);
      throw new Error('Failed to generate recipe');
    }
  }

  async validateIngredients(ingredients) {
    // Check if ingredients exist in database
    const ingredientDocs = await Ingredient.find({
      name: { $in: ingredients.map(ing => ing.name) }
    });
    
    // Map user ingredients to validated ingredients with additional data
    return ingredients.map(userIng => {
      const dbIng = ingredientDocs.find(
        doc => doc.name.toLowerCase() === userIng.name.toLowerCase()
      );
      
      return {
        ...userIng,
        validated: !!dbIng,
        category: dbIng ? dbIng.category : 'unknown',
        nutritionalData: dbIng ? dbIng.nutritionalData : null
      };
    });
  }
  
  createRecipePrompt(ingredients, dietaryPreferences, complexity) {
    return `Create a ${complexity} level recipe using some or all of these ingredients: 
      ${ingredients.map(i => i.name).join(', ')}. 
      Dietary preferences: ${dietaryPreferences.join(', ')}.
      Format the response as a JSON object with title, description, ingredients (with quantities), 
      instructions (as an array of steps), prepTime, cookTime, and servings.`;
  }
  
  parseRecipeResponse(response) {
    try {
      // Clean up the response text to ensure valid JSON
      const cleanedResponse = response.trim().replace(/```json|```/g, '');
      return JSON.parse(cleanedResponse);
    } catch (error) {
      console.error('Error parsing recipe response:', error);
      
      // Fallback parsing for non-JSON responses
      const lines = response.trim().split('\n');
      const title = lines[0].replace('#', '').trim();
      const description = lines.find(l => !l.startsWith('#') && l.length > 30) || '';
      
      // Extract ingredients and instructions using regex
      const ingredientsMatch = response.match(/ingredients:([\s\S]*?)instructions/i);
      const instructionsMatch = response.match(/instructions:([\s\S]*?)$/i);
      
      return {
        title,
        description,
        ingredients: ingredientsMatch ? 
          ingredientsMatch[1].split('\n').filter(l => l.trim().length > 0).map(l => l.trim()) : [],
        instructions: instructionsMatch ? 
          instructionsMatch[1].split('\n').filter(l => l.trim().length > 0).map(l => l.trim()) : [],
        prepTime: '15 minutes',
        cookTime: '30 minutes',
        servings: 4
      };
    }
  }
  
  async calculateNutrition(recipe) {
    // Implementation of nutritional calculation based on ingredients
    // This would typically use a nutritional database or API
    
    // Placeholder implementation
    return {
      calories: 450,
      protein: 20,
      carbs: 55,
      fat: 15,
      fiber: 8,
      sugar: 10
    };
  }
}

module.exports = new RecipeGenerationService();