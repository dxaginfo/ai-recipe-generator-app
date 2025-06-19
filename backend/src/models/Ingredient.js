const mongoose = require('mongoose');

const nutritionalDataSchema = new mongoose.Schema({
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
  // Per 100g or standard serving
  servingSize: {
    type: String,
    default: '100g'
  }
});

const ingredientSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true
  },
  category: {
    type: String,
    required: true,
    trim: true,
    enum: [
      'vegetable',
      'fruit',
      'grain',
      'protein',
      'dairy',
      'herb',
      'spice',
      'oil',
      'condiment',
      'other'
    ]
  },
  description: {
    type: String,
    trim: true
  },
  nutritionalData: {
    type: nutritionalDataSchema,
    default: {}
  },
  commonUnit: {
    type: String,
    trim: true,
    default: 'g'
  },
  alternativeNames: [{
    type: String,
    trim: true
  }],
  imageUrl: {
    type: String
  },
  isAllergen: {
    type: Boolean,
    default: false
  },
  allergenType: {
    type: String,
    enum: [
      'none',
      'gluten',
      'dairy',
      'nuts',
      'shellfish',
      'soy',
      'egg',
      'other'
    ],
    default: 'none'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Add text index for search
ingredientSchema.index({ 
  name: 'text',
  alternativeNames: 'text',
  description: 'text' 
});

const Ingredient = mongoose.model('Ingredient', ingredientSchema);

module.exports = Ingredient;