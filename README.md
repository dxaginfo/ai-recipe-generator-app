# AI Recipe Generator

An intelligent web application that creates personalized recipes based on available ingredients and dietary constraints using AI.

## Overview

The AI Recipe Generator is a modern web platform that helps users make the most of their pantry items, accommodates various dietary needs, and provides nutritional information for healthier meal planning.

Using artificial intelligence, the application analyzes the ingredients you have on hand and creates delicious, customized recipes that match your preferences and dietary requirements.

## Key Features

- **Ingredient Input and Management**: Easily enter available ingredients with auto-complete suggestions
- **Dietary Customization**: Support for various dietary restrictions and preferences
- **AI-Powered Recipe Generation**: Create personalized recipes based on your inputs
- **Nutritional Analysis**: Get detailed nutritional information for each recipe
- **User Profiles**: Save favorite recipes and track your cooking journey

## Technology Stack

### Frontend
- React.js with TypeScript
- Material UI
- Redux Toolkit
- Axios

### Backend
- Node.js with Express
- MongoDB
- JWT Authentication
- OpenAI API

### Infrastructure
- Docker
- AWS Cloud Services
- CI/CD with GitHub Actions

## Getting Started

### Prerequisites
- Node.js 18.0+
- MongoDB
- OpenAI API key

### Installation
```bash
# Clone the repository
git clone https://github.com/dxaginfo/ai-recipe-generator-app.git
cd ai-recipe-generator-app

# Install dependencies for both frontend and backend
npm run install-all

# Set up environment variables
cp .env.example .env
# Edit .env with your own values

# Run the development server
npm run dev
```

## Documentation

For detailed documentation, please visit:
[AI Recipe Generator Documentation](https://docs.google.com/document/d/1ukUG0KnOU_KB4YrdwAIER7mzChS1w6LkPkzu_xCFChE)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.