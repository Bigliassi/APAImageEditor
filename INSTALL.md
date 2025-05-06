# Installation Instructions

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn

## Installation Steps

1. Install dependencies:
```
npm install
```

2. Development Mode
To run the application in development mode:
```
npm run electron-dev
```

3. Build for Production
To build the application for production:
```
npm run package
```

This will create executables for your operating system in the `dist` folder.

## Key Features Guide

### Direct Object Editing
The application now features a simple, intuitive editing experience:

1. Click on any element in your figure to select it
2. When an element is selected, floating action buttons appear:
   - Text elements: Click the Edit button (pencil icon) to edit the text
   - Shapes/other elements: Click the Convert button (text icon) to turn it into editable text
   - Any element: Click the Delete button (trash icon) to remove it
3. Use the Object Properties panel to customize appearance (color, size, etc.)

### Adding New Elements

1. Click "Add Text" to create editable text directly on your figure
2. Use the Draw tool for freehand annotations
3. Add shapes (rectangles, circles) to highlight important areas
4. All elements can be moved, resized, and edited using the Select tool

## Troubleshooting

If you encounter any issues with Electron or dependencies:

1. Make sure you have the latest Node.js installed
2. Try clearing npm cache and reinstalling:
```
npm cache clean --force
npm install
```

3. For canvas-related errors, you may need additional system dependencies:
   - On macOS: `brew install pkg-config cairo pango libpng jpeg giflib librsvg`
   - On Ubuntu/Debian: `sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev` 