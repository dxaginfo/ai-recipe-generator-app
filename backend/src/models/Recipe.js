const mongoose = require('mongoose');

const recipeIngredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  quantity: {
    type: String,
    required: true,
    trim: true
  },
  unit: {
    type: String,
    trim: true
  },
  // Reference to Ingredient model (optional)
  ingredientId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ingredient'
  }
});

const recipeInstructionSchema = new mongoose.Schema({
  step: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true,
    trim: true
  },
  timeEstimate: {
    type: String,
    trim: true
  }
});

const nutritionalInfoSchema = new mongoose.Schema({
  calories: {
    type: Number,
    default: 0
  },
  protein: {
    type: Number,
    default: 0
  },
  carbs: {
    type: Number,
    default: 0
  },
  fat: {
    type: Number,
    default: 0
  },
  fiber: {
    type: Number,
    default: 0
  },
  sugar: {
    type: Number,
    default: 0
  },
  servingSize: {
    type: String,
    default: 'per serving'
  }
});

const recipeSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  description: {
    type: String,
    trim: true
  },
  ingredients: [recipeIngredientSchema],
  instructions: [recipeInstructionSchema],
  prepTime: {
    type: String,
    trim: true
  },
  cookTime: {
    type: String,
    trim: true
  },
  totalTime: {
    type: String,
    trim: true
  },
  servings: {
    type: Number,
    required: true,
    default: 4
  },
  complexity: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate'
  },
  imageUrl: {
    type: String
  },
  nutritionalInfo: {
    type: nutritionalInfoSchema,
    default: {}
  },
  dietary: {
    vegetarian: {
      type: Boolean,
      default: false
    },
    vegan: {
      type: Boolean,
      default: false
    },
    glutenFree: {
      type: Boolean,
      default: false
    },
    dairyFree: {
      type: Boolean,
      default: false
    },
    nutFree: {
      type: Boolean,
      default: false
    },
    lowCarb: {
      type: Boolean,
      default: false
    }
  },
  tags: [{
    type: String,
    trim: true
  }],
  cuisine: {
    type: String,
    trim: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  generatedByAI: {
    type: Boolean,
    default: true
  },
  ratings: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    score: {
      type: Number,
      min: 1,
      max: 5
    },
    comment: {
      type: String,
      trim: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  averageRating: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Calculate total time before saving
recipeSchema.pre('save', function(next) {
  if (this.prepTime && this.cookTime) {
    // This is a simple example - in a real app, you'd need to parse and add the times properly
    this.totalTime = this.prepTime + ' + ' + this.cookTime;
  }
  next();
});

// Add text search index
recipeSchema.index({
  title: 'text',
  description: 'text',
  tags: 'text',
  cuisine: 'text',
  'ingredients.name': 'text'
});

const Recipe = mongoose.model('Recipe', recipeSchema);

module.exports = Recipe;