import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  Container,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Rating,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import PeopleIcon from '@mui/icons-material/People';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BookmarkIcon from '@mui/icons-material/Bookmark';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';

import { fetchRecipeById, rateRecipe } from '../../redux/slices/recipeSlice';

const RecipeDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const { currentRecipe, loading, error } = useSelector(state => state.recipe);
  const { isAuthenticated, user } = useSelector(state => state.auth);
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  
  // Fetch recipe on component mount
  useEffect(() => {
    if (id) {
      dispatch(fetchRecipeById(id));
    }
  }, [dispatch, id]);
  
  // Update rating if user has already rated
  useEffect(() => {
    if (currentRecipe && isAuthenticated && user) {
      const userRating = currentRecipe.ratings?.find(
        r => r.user && r.user._id === user._id
      );
      
      if (userRating) {
        setRating(userRating.score);
        setComment(userRating.comment || '');
      }
    }
  }, [currentRecipe, isAuthenticated, user]);
  
  // Handle recipe rating submission
  const handleRatingSubmit = () => {
    if (rating > 0) {
      dispatch(rateRecipe({ 
        id: currentRecipe._id, 
        rating, 
        comment 
      }));
    }
  };
  
  // Handle print recipe
  const handlePrintRecipe = () => {
    window.print();
  };
  
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  if (error) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" color="error" gutterBottom>
          Error loading recipe
        </Typography>
        <Typography paragraph>
          {error}
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/recipes')}
        >
          Back to Recipes
        </Button>
      </Box>
    );
  }
  
  if (!currentRecipe) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Recipe not found
        </Typography>
        <Button 
          variant="contained" 
          onClick={() => navigate('/recipes')}
        >
          Browse Recipes
        </Button>
      </Box>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper elevation={0} sx={{ overflow: 'hidden', borderRadius: 2 }}>
            {currentRecipe.imageUrl ? (
              <CardMedia
                component="img"
                height="400"
                image={currentRecipe.imageUrl}
                alt={currentRecipe.title}
                sx={{ objectFit: 'cover' }}
              />
            ) : (
              <Box 
                sx={{ 
                  height: '300px', 
                  backgroundColor: '#f0f0f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <RestaurantIcon sx={{ fontSize: 100, color: '#ccc' }} />
              </Box>
            )}
            
            <Box sx={{ p: 3 }}>
              <Typography variant="h4" gutterBottom>
                {currentRecipe.title}
              </Typography>
              
              <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2 }}>
                <Rating 
                  value={currentRecipe.averageRating || 0} 
                  precision={0.5} 
                  readOnly
                />
                <Typography variant="body2" color="text.secondary">
                  ({currentRecipe.ratings?.length || 0} ratings)
                </Typography>
              </Stack>
              
              <Typography variant="body1" paragraph>
                {currentRecipe.description}
              </Typography>
              
              <Stack 
                direction={{ xs: 'column', sm: 'row' }} 
                spacing={2} 
                sx={{ mb: 3 }}
              >
                <Chip 
                  icon={<AccessTimeIcon />} 
                  label={`Prep: ${currentRecipe.prepTime}`} 
                />
                <Chip 
                  icon={<AccessTimeIcon />} 
                  label={`Cook: ${currentRecipe.cookTime}`} 
                />
                <Chip 
                  icon={<PeopleIcon />} 
                  label={`Serves: ${currentRecipe.servings}`} 
                />
                <Chip 
                  color={currentRecipe.complexity === 'beginner' ? 'success' : 
                         currentRecipe.complexity === 'intermediate' ? 'primary' : 'warning'}
                  label={`${currentRecipe.complexity.charAt(0).toUpperCase()}${currentRecipe.complexity.slice(1)}`} 
                />
              </Stack>
              
              {/* Dietary Tags */}
              {currentRecipe.dietary && Object.entries(currentRecipe.dietary).some(([_, value]) => value) && (
                <Stack direction="row" spacing={1} flexWrap="wrap" sx={{ mb: 3 }}>
                  {Object.entries(currentRecipe.dietary)
                    .filter(([_, value]) => value)
                    .map(([key, _]) => (
                      <Chip 
                        key={key}
                        icon={<CheckCircleIcon />}
                        color="success"
                        size="small"
                        label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                        sx={{ mb: 1 }}
                      />
                    ))}
                </Stack>
              )}
              
              <Stack 
                direction="row" 
                spacing={2} 
                sx={{ mb: 3 }}
              >
                <Button 
                  startIcon={<BookmarkIcon />}
                  variant="outlined"
                  disabled={!isAuthenticated}
                >
                  Save
                </Button>
                <Button 
                  startIcon={<PrintIcon />}
                  variant="outlined"
                  onClick={handlePrintRecipe}
                >
                  Print
                </Button>
                <Button 
                  startIcon={<ShareIcon />}
                  variant="outlined"
                >
                  Share
                </Button>
              </Stack>
              
              <Divider sx={{ my: 3 }} />
              
              {/* Ingredients */}
              <Typography variant="h5" gutterBottom sx={{ mt: 3 }}>
                Ingredients
              </Typography>
              
              <List>
                {currentRecipe.ingredients.map((ingredient, index) => (
                  <ListItem key={index} disableGutters>
                    <ListItemIcon sx={{ minWidth: 32 }}>
                      <CheckCircleIcon color="primary" fontSize="small" />
                    </ListItemIcon>
                    <ListItemText 
                      primary={`${ingredient.quantity || ''} ${ingredient.name}`}
                    />
                  </ListItem>
                ))}
              </List>
              
              <Divider sx={{ my: 3 }} />
              
              {/* Instructions */}
              <Typography variant="h5" gutterBottom>
                Instructions
              </Typography>
              
              <List>
                {Array.isArray(currentRecipe.instructions) ? (
                  currentRecipe.instructions.map((instruction, index) => (
                    <ListItem key={index} disableGutters sx={{ alignItems: 'flex-start', mb: 2 }}>
                      <ListItemIcon sx={{ minWidth: 36, mt: 0.5 }}>
                        <Box
                          sx={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            backgroundColor: 'primary.main',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 600,
                            fontSize: 14
                          }}
                        >
                          {index + 1}
                        </Box>
                      </ListItemIcon>
                      <ListItemText 
                        primary={
                          typeof instruction === 'string' 
                            ? instruction 
                            : instruction.description
                        }
                      />
                    </ListItem>
                  ))
                ) : (
                  <Typography variant="body1">Instructions not available.</Typography>
                )}
              </List>
              
              {/* Nutritional Information */}
              {currentRecipe.nutritionalInfo && Object.keys(currentRecipe.nutritionalInfo).length > 0 && (
                <>
                  <Divider sx={{ my: 3 }} />
                  
                  <Typography variant="h5" gutterBottom>
                    Nutritional Information
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    {Object.entries(currentRecipe.nutritionalInfo)
                      .filter(([key, _]) => key !== 'servingSize')
                      .map(([key, value]) => (
                        <Grid item xs={6} sm={4} key={key}>
                          <Paper 
                            elevation={0} 
                            sx={{ 
                              p: 2, 
                              textAlign: 'center',
                              backgroundColor: '#f5f5f5',
                              borderRadius: 2
                            }}
                          >
                            <Typography variant="h6" color="primary">
                              {value}
                              {key === 'calories' ? '' : 'g'}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </Typography>
                          </Paper>
                        </Grid>
                      ))}
                  </Grid>
                  
                  {currentRecipe.nutritionalInfo.servingSize && (
                    <Typography variant="body2" color="text.secondary">
                      *Per {currentRecipe.nutritionalInfo.servingSize}
                    </Typography>
                  )}
                </>
              )}
            </Box>
          </Paper>
        </Grid>
        
        {/* Sidebar */}
        <Grid item xs={12} md={4}>
          {/* Rating Card */}
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Rate this Recipe
              </Typography>
              
              {isAuthenticated ? (
                <>
                  <Box sx={{ mb: 2 }}>
                    <Rating
                      name="recipe-rating"
                      value={rating}
                      onChange={(_, newValue) => setRating(newValue)}
                      size="large"
                    />
                  </Box>
                  
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="Your comment (optional)"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  
                  <Button
                    variant="contained"
                    onClick={handleRatingSubmit}
                    disabled={rating === 0}
                  >
                    Submit Rating
                  </Button>
                </>
              ) : (
                <Box>
                  <Typography variant="body2" sx={{ mb: 2 }}>
                    Please log in to rate this recipe
                  </Typography>
                  <Button
                    variant="contained"
                    onClick={() => navigate('/login')}
                  >
                    Log In
                  </Button>
                </Box>
              )}
            </CardContent>
          </Card>
          
          {/* Creator Info */}
          {currentRecipe.creator && (
            <Card sx={{ mb: 3 }}>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Recipe by
                </Typography>
                
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      width: 50,
                      height: 50,
                      borderRadius: '50%',
                      backgroundColor: 'primary.main',
                      color: 'white',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: 20,
                      fontWeight: 'bold'
                    }}
                  >
                    {currentRecipe.creator.name ? currentRecipe.creator.name.charAt(0).toUpperCase() : 'U'}
                  </Box>
                  
                  <Box>
                    <Typography variant="body1" fontWeight="500">
                      {currentRecipe.creator.name || 'Anonymous User'}
                    </Typography>
                    {currentRecipe.createdAt && (
                      <Typography variant="body2" color="text.secondary">
                        {new Date(currentRecipe.createdAt).toLocaleDateString()}
                      </Typography>
                    )}
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          )}
          
          {/* Related Recipes - Placeholder */}
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                You may also like
              </Typography>
              
              <Typography variant="body2" color="text.secondary">
                Related recipes will appear here.
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default RecipeDetails;