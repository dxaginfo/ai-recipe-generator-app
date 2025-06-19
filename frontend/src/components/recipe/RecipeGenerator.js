import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Box, 
  Button, 
  Card, 
  CardContent,
  Chip,
  CircularProgress,
  Divider, 
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  Paper,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  TextField,
  Typography 
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

// Import recipe generation actions
import { generateRecipe, saveRecipe } from '../../redux/slices/recipeSlice';

const RecipeGenerator = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, currentRecipe } = useSelector(state => state.recipe);
  const { isAuthenticated } = useSelector(state => state.auth);

  // State for form inputs
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '' }]);
  const [newIngredient, setNewIngredient] = useState('');
  const [complexity, setComplexity] = useState('intermediate');
  const [dietaryPreferences, setDietaryPreferences] = useState({
    vegetarian: false,
    vegan: false,
    glutenFree: false,
    dairyFree: false,
    nutFree: false,
    lowCarb: false
  });

  // Handle ingredient input changes
  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index][field] = value;
    setIngredients(updatedIngredients);
  };

  // Add a new ingredient field
  const addIngredient = () => {
    if (newIngredient.trim()) {
      setIngredients([...ingredients, { name: newIngredient, quantity: '' }]);
      setNewIngredient('');
    }
  };

  // Remove an ingredient field
  const removeIngredient = (index) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients.splice(index, 1);
    setIngredients(updatedIngredients);
  };

  // Handle dietary preferences changes
  const handleDietaryChange = (event) => {
    setDietaryPreferences({
      ...dietaryPreferences,
      [event.target.name]: event.target.checked
    });
  };

  // Handle complexity change
  const handleComplexityChange = (event) => {
    setComplexity(event.target.value);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Filter out empty ingredients
    const filteredIngredients = ingredients.filter(ing => ing.name.trim());
    
    if (filteredIngredients.length === 0) {
      // Show error if no ingredients
      return;
    }
    
    // Get array of dietary preferences that are true
    const dietaryArray = Object.entries(dietaryPreferences)
      .filter(([_, value]) => value)
      .map(([key, _]) => key);
    
    // Dispatch generate recipe action
    dispatch(generateRecipe({
      ingredients: filteredIngredients,
      dietaryPreferences: dietaryArray,
      complexity
    }));
  };

  // Handle saving the generated recipe
  const handleSaveRecipe = () => {
    dispatch(saveRecipe(currentRecipe));
    // Redirect to recipe details after saving
    navigate('/recipes');
  };

  return (
    <Box>
      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2, backgroundColor: '#f8f9fa' }}>
        <Typography variant="h4" gutterBottom>
          AI Recipe Generator
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Enter the ingredients you have, your dietary preferences, and let AI create
          a personalized recipe just for you.
        </Typography>
      </Paper>

      <Grid container spacing={4}>
        {/* Recipe Generation Form */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                What's in your kitchen?
              </Typography>
              
              <form onSubmit={handleSubmit}>
                {/* Ingredients Input */}
                <Box sx={{ mb: 3 }}>
                  <FormLabel component="legend">Ingredients</FormLabel>
                  
                  {ingredients.map((ingredient, index) => (
                    <Stack 
                      key={index} 
                      direction="row" 
                      spacing={2} 
                      alignItems="center"
                      sx={{ mb: 1 }}
                    >
                      <TextField
                        fullWidth
                        size="small"
                        label="Ingredient"
                        value={ingredient.name}
                        onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                      />
                      <IconButton 
                        color="error" 
                        onClick={() => removeIngredient(index)}
                        disabled={ingredients.length === 1}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Stack>
                  ))}
                  
                  <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                    <TextField
                      fullWidth
                      size="small"
                      label="Add new ingredient"
                      value={newIngredient}
                      onChange={(e) => setNewIngredient(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addIngredient();
                        }
                      }}
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={addIngredient}
                              edge="end"
                            >
                              <AddIcon />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                    />
                  </Stack>
                </Box>
                
                <Divider sx={{ my: 3 }} />
                
                {/* Dietary Preferences */}
                <Box sx={{ mb: 3 }}>
                  <FormLabel component="legend">Dietary Preferences</FormLabel>
                  <FormGroup row>
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={dietaryPreferences.vegetarian}
                          onChange={handleDietaryChange}
                          name="vegetarian"
                        />
                      }
                      label="Vegetarian"
                    />
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={dietaryPreferences.vegan}
                          onChange={handleDietaryChange}
                          name="vegan"
                        />
                      }
                      label="Vegan"
                    />
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={dietaryPreferences.glutenFree}
                          onChange={handleDietaryChange}
                          name="glutenFree"
                        />
                      }
                      label="Gluten Free"
                    />
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={dietaryPreferences.dairyFree}
                          onChange={handleDietaryChange}
                          name="dairyFree"
                        />
                      }
                      label="Dairy Free"
                    />
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={dietaryPreferences.nutFree}
                          onChange={handleDietaryChange}
                          name="nutFree"
                        />
                      }
                      label="Nut Free"
                    />
                    <FormControlLabel
                      control={
                        <Switch 
                          checked={dietaryPreferences.lowCarb}
                          onChange={handleDietaryChange}
                          name="lowCarb"
                        />
                      }
                      label="Low Carb"
                    />
                  </FormGroup>
                </Box>
                
                <Divider sx={{ my: 3 }} />
                
                {/* Recipe Complexity */}
                <Box sx={{ mb: 3 }}>
                  <FormControl component="fieldset">
                    <FormLabel component="legend">Recipe Complexity</FormLabel>
                    <RadioGroup
                      row
                      value={complexity}
                      onChange={handleComplexityChange}
                    >
                      <FormControlLabel 
                        value="beginner" 
                        control={<Radio />} 
                        label="Beginner"
                      />
                      <FormControlLabel 
                        value="intermediate" 
                        control={<Radio />} 
                        label="Intermediate"
                      />
                      <FormControlLabel 
                        value="advanced" 
                        control={<Radio />} 
                        label="Advanced"
                      />
                    </RadioGroup>
                  </FormControl>
                </Box>
                
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  disabled={loading}
                  startIcon={loading && <CircularProgress size={20} color="inherit" />}
                >
                  {loading ? 'Generating Recipe...' : 'Generate Recipe'}
                </Button>
                
                {error && (
                  <Typography color="error" sx={{ mt: 2 }}>
                    {error}
                  </Typography>
                )}
              </form>
            </CardContent>
          </Card>
        </Grid>
        
        {/* Recipe Result */}
        <Grid item xs={12} md={6}>
          {currentRecipe ? (
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  {currentRecipe.title}
                </Typography>
                
                <Typography variant="body2" color="text.secondary" paragraph>
                  {currentRecipe.description}
                </Typography>
                
                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                  <Chip label={`Prep: ${currentRecipe.prepTime}`} />
                  <Chip label={`Cook: ${currentRecipe.cookTime}`} />
                  <Chip label={`Servings: ${currentRecipe.servings}`} />
                </Stack>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="h6" gutterBottom>
                  Ingredients
                </Typography>
                
                <ul>
                  {currentRecipe.ingredients.map((ingredient, index) => (
                    <li key={index}>
                      <Typography variant="body2">
                        {ingredient.quantity} {ingredient.name}
                      </Typography>
                    </li>
                  ))}
                </ul>
                
                <Divider sx={{ my: 2 }} />
                
                <Typography variant="h6" gutterBottom>
                  Instructions
                </Typography>
                
                <ol>
                  {currentRecipe.instructions.map((instruction, index) => (
                    <li key={index}>
                      <Typography variant="body2" paragraph>
                        {instruction}
                      </Typography>
                    </li>
                  ))}
                </ol>
                
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleSaveRecipe}
                  disabled={loading}
                  sx={{ mt: 2 }}
                >
                  {isAuthenticated ? 'Save Recipe' : 'Save Recipe (Login Required)'}
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Paper 
              elevation={0} 
              sx={{ 
                p: 3, 
                height: '100%', 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'column',
                backgroundColor: '#f8f9fa',
                borderRadius: 2
              }}
            >
              <img 
                src="/recipe-placeholder.png" 
                alt="Recipe" 
                style={{ maxWidth: '200px', marginBottom: '16px', opacity: 0.7 }}
              />
              <Typography variant="h6" color="text.secondary" align="center">
                Your recipe will appear here
              </Typography>
              <Typography variant="body2" color="text.secondary" align="center">
                Enter your ingredients and preferences, then click "Generate Recipe"
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
    </Box>
  );
};

export default RecipeGenerator;