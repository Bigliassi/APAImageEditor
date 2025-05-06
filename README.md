# APA Image Editor

A local desktop application for editing research figures and graphs that are commonly used in APA publications and grants. This tool allows researchers to make small modifications to figures without requiring changes to the original code that generated them.

## Features

- Open and edit PNG, JPG, and SVG image files
- Simple, intuitive interface with direct editing capabilities
- Add and edit text with a wide range of formatting options
- Convert any element to editable text
- Draw directly on images to highlight or annotate specific areas
- Add geometric shapes (rectangles, circles) to highlight important areas
- Move, resize, and delete elements with easy-to-use controls
- Save high-resolution PNG images suitable for publication

## Use Cases

- Modify figures after peer review without rerunning your Python/R code
- Replace or edit text labels in existing graphs
- Highlight specific data points or areas of interest
- Add annotations or labels to clarify data
- Correct minor issues in figures quickly
- Customize colors to meet journal specifications

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository
```
git clone https://github.com/yourusername/apa-image-editor.git
cd apa-image-editor
```

2. Install dependencies
```
npm install
```

3. Start the development environment
```
npm run electron-dev
```

4. Build the application (creates executable)
```
npm run package
```

## Usage

1. Open the application
2. Click "Open Image" to load a figure from your computer
3. Use the tools in the right toolbar to modify your figure:
   - Draw tool: Freehand drawing on the canvas
   - Add Text: Add new text annotations
   - Rectangle/Circle: Add shapes to highlight areas
   - Select tool: Click on any element to modify it
4. When an element is selected:
   - Floating buttons appear for quick editing or deletion
   - For shapes, you can convert them to text
   - For text, you can edit it directly
5. Customize colors using the color picker
6. Save your edited image using the "Save Image" button

## Technical Details

Built with:
- Next.js for the React application framework
- Electron for desktop application capabilities
- Fabric.js for canvas manipulation
- TailwindCSS for styling 