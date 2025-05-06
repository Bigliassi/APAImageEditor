import { useState, useEffect, useRef } from 'react';
import Head from 'next/head';
import { fabric } from 'fabric';
import { HexColorPicker } from 'react-colorful';
import { FiUpload, FiSave, FiType, FiCircle, FiSquare, FiEdit3, FiTrash2, FiMove, FiEdit, FiPlus } from 'react-icons/fi';
import ObjectProperties from '../components/ObjectProperties';
import LayerManager from '../components/LayerManager';

export default function Home() {
  const canvasRef = useRef(null);
  const fabricRef = useRef(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [currentFile, setCurrentFile] = useState(null);
  const [activeObject, setActiveObject] = useState(null);
  const [activeTool, setActiveTool] = useState(null);
  const [color, setColor] = useState('#000000');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [drawingMode, setDrawingMode] = useState(false);
  const [brushSize, setBrushSize] = useState(2);

  // Initialize the canvas
  useEffect(() => {
    const canvas = new fabric.Canvas(canvasRef.current, {
      preserveObjectStacking: true,
      selection: true,
      backgroundColor: '#ffffff',
    });
    
    fabricRef.current = canvas;

    // Set up event listeners
    canvas.on('selection:created', handleSelectionChange);
    canvas.on('selection:updated', handleSelectionChange);
    canvas.on('selection:cleared', () => setActiveObject(null));
    
    // Setup double-click handler for text editing
    canvas.on('mouse:dblclick', function(options) {
      if (options.target && options.target.type === 'i-text') {
        options.target.enterEditing();
        canvas.renderAll();
      }
    });
    
    // Configure canvas for free drawing
    canvas.freeDrawingBrush.color = color;
    canvas.freeDrawingBrush.width = brushSize;

    // Resize canvas to fit container
    const resizeCanvas = () => {
      const container = document.querySelector('.canvas-container-wrapper');
      if (container && canvas) {
        const width = container.clientWidth;
        const height = container.clientHeight;
        canvas.setDimensions({ width, height });
      }
    };

    // Initial resize
    setTimeout(resizeCanvas, 100);

    // Handle window resize
    window.addEventListener('resize', resizeCanvas);

    // Clean up when component unmounts
    return () => {
      canvas.dispose();
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  // Update brush color when color changes
  useEffect(() => {
    if (fabricRef.current) {
      fabricRef.current.freeDrawingBrush.color = color;
    }
  }, [color]);

  // Update brush size
  useEffect(() => {
    if (fabricRef.current) {
      fabricRef.current.freeDrawingBrush.width = brushSize;
    }
  }, [brushSize]);

  // Handle selection change
  const handleSelectionChange = (e) => {
    setActiveObject(e.selected[0]);
    
    // If it's a text object, make it editable right away
    if (e.selected[0] && e.selected[0].type === 'i-text') {
      fabricRef.current.setActiveObject(e.selected[0]);
    }
  };

  // Toggle drawing mode
  const toggleDrawingMode = () => {
    const canvas = fabricRef.current;
    const newMode = !drawingMode;
    canvas.isDrawingMode = newMode;
    setDrawingMode(newMode);
    if (newMode) {
      setActiveTool('brush');
    } else {
      setActiveTool(null);
    }
  };

  // Handle file open
  const handleOpenFile = async () => {
    try {
      if (typeof window !== 'undefined' && window.electronAPI) {
        const file = await window.electronAPI.openFile();
        if (file) {
          loadImage(file);
        }
      }
    } catch (error) {
      console.error('Error opening file:', error);
    }
  };

  // Load image to canvas
  const loadImage = (file) => {
    const canvas = fabricRef.current;
    fabric.Image.fromURL(file.data, (img) => {
      // Clear existing canvas
      canvas.clear();
      
      // Calculate scaling to fit canvas
      const containerWidth = canvas.getWidth();
      const containerHeight = canvas.getHeight();
      
      // Resize image to fit the canvas with some margin
      const scale = Math.min(
        (containerWidth - 40) / img.width,
        (containerHeight - 40) / img.height
      );
      
      img.set({
        scaleX: scale,
        scaleY: scale,
        originX: 'center',
        originY: 'center',
        left: containerWidth / 2,
        top: containerHeight / 2,
        selectable: true,
      });
      
      // Add unique ID to the image
      img.id = 'background-image';
      
      canvas.add(img);
      canvas.renderAll();
      
      // Select the image after loading
      canvas.setActiveObject(img);
      
      setCurrentFile(file);
      setImageLoaded(true);
    });
  };

  // Handle file save
  const handleSaveFile = async () => {
    if (!imageLoaded || !currentFile) return;
    
    try {
      const canvas = fabricRef.current;
      const dataUrl = canvas.toDataURL({
        format: 'png',
        quality: 1,
      });
      
      if (typeof window !== 'undefined' && window.electronAPI) {
        const result = await window.electronAPI.saveFile({
          defaultPath: currentFile.name,
          data: dataUrl,
        });
        
        if (result.success) {
          alert('File saved successfully');
        }
      }
    } catch (error) {
      console.error('Error saving file:', error);
    }
  };

  // Add text
  const addText = () => {
    if (!imageLoaded) return;
    
    const canvas = fabricRef.current;
    const text = new fabric.IText('Click to edit text', {
      left: canvas.getWidth() / 2,
      top: canvas.getHeight() / 2,
      fill: color,
      fontFamily: 'Arial',
      fontSize: 20,
      originX: 'center',
      originY: 'center',
      editable: true,
    });
    
    canvas.add(text);
    canvas.setActiveObject(text);
    text.enterEditing();
    canvas.renderAll();
    setActiveTool('select');
  };

  // Add rectangle
  const addRectangle = () => {
    if (!imageLoaded) return;
    
    const canvas = fabricRef.current;
    const rect = new fabric.Rect({
      left: canvas.getWidth() / 2,
      top: canvas.getHeight() / 2,
      width: 100,
      height: 70,
      fill: 'transparent',
      stroke: color,
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
    });
    
    canvas.add(rect);
    canvas.setActiveObject(rect);
    canvas.renderAll();
    setActiveTool('select');
  };

  // Add circle
  const addCircle = () => {
    if (!imageLoaded) return;
    
    const canvas = fabricRef.current;
    const circle = new fabric.Circle({
      left: canvas.getWidth() / 2,
      top: canvas.getHeight() / 2,
      radius: 50,
      fill: 'transparent',
      stroke: color,
      strokeWidth: 2,
      originX: 'center',
      originY: 'center',
    });
    
    canvas.add(circle);
    canvas.setActiveObject(circle);
    canvas.renderAll();
    setActiveTool('select');
  };

  // Delete selected object
  const deleteSelectedObject = () => {
    if (!activeObject || !imageLoaded) return;
    
    // Don't delete the background image
    if (activeObject.id === 'background-image') {
      alert("Cannot delete the background image");
      return;
    }
    
    const canvas = fabricRef.current;
    canvas.remove(activeObject);
    canvas.renderAll();
    setActiveObject(null);
  };

  // Edit text object
  const editTextObject = () => {
    if (!activeObject || activeObject.type !== 'i-text') return;
    
    const canvas = fabricRef.current;
    activeObject.enterEditing();
    canvas.renderAll();
  };

  // Convert selected area into editable text
  const convertToText = () => {
    if (!activeObject || !imageLoaded) return;
    
    // Don't convert the background image
    if (activeObject.id === 'background-image') {
      alert("Please select an area or object to convert to text");
      return;
    }
    
    const canvas = fabricRef.current;
    const bounds = activeObject.getBoundingRect();
    
    // Create a new text object at the position of the selected object
    const text = new fabric.IText('Edit this text', {
      left: bounds.left,
      top: bounds.top,
      width: bounds.width,
      height: bounds.height,
      fontSize: bounds.height * 0.8,
      fill: color,
      fontFamily: 'Arial',
      editable: true,
    });
    
    // Remove the original object
    canvas.remove(activeObject);
    
    // Add new text object
    canvas.add(text);
    canvas.setActiveObject(text);
    text.enterEditing();
    canvas.renderAll();
  };

  // Handle color change
  const handleColorChange = (newColor) => {
    setColor(newColor);
    
    if (activeObject) {
      if (activeObject.type === 'i-text') {
        activeObject.set({ fill: newColor });
      } else if (activeObject.type === 'path') {
        activeObject.set({ stroke: newColor });
      } else {
        activeObject.set({ stroke: newColor });
      }
      
      fabricRef.current.renderAll();
    }
  };

  // Handle brush size change
  const handleBrushSizeChange = (e) => {
    const size = parseInt(e.target.value, 10);
    setBrushSize(size);
  };

  return (
    <div className="flex flex-col h-screen">
      <Head>
        <title>APA Image Editor</title>
        <meta name="description" content="Image editor for APA research figures" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <header className="bg-white shadow-sm p-4 border-b">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold text-gray-800">APA Image Editor</h1>
          <div className="flex space-x-3">
            <button
              onClick={handleOpenFile}
              className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              <FiUpload className="mr-1" /> Open Image
            </button>
            <button
              onClick={handleSaveFile}
              disabled={!imageLoaded}
              className={`flex items-center px-3 py-2 rounded-md transition ${
                imageLoaded
                  ? 'bg-green-600 text-white hover:bg-green-700'
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
            >
              <FiSave className="mr-1" /> Save Image
            </button>
          </div>
        </div>
      </header>

      <main className="flex flex-1 overflow-hidden">
        {/* Canvas area */}
        <div className="flex-1 relative overflow-hidden canvas-container-wrapper">
          <div className="absolute inset-0 flex items-center justify-center">
            {!imageLoaded && (
              <div className="text-center p-6 bg-white rounded-lg shadow-sm">
                <h2 className="text-xl font-medium text-gray-800 mb-2">No Image Loaded</h2>
                <p className="text-gray-600 mb-4">Open an image file to start editing</p>
                <button
                  onClick={handleOpenFile}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  Open Image
                </button>
              </div>
            )}
            <canvas ref={canvasRef} />
          </div>
          
          {/* Floating action buttons for selected object */}
          {activeObject && activeObject.id !== 'background-image' && (
            <div className="absolute top-4 right-4 bg-white rounded-md shadow-md p-2 flex space-x-2">
              {activeObject.type === 'i-text' && (
                <button 
                  onClick={editTextObject}
                  className="p-2 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200"
                  title="Edit Text"
                >
                  <FiEdit size={18} />
                </button>
              )}
              {activeObject.type !== 'i-text' && (
                <button 
                  onClick={convertToText}
                  className="p-2 bg-green-100 text-green-600 rounded-full hover:bg-green-200"
                  title="Convert to Text"
                >
                  <FiType size={18} />
                </button>
              )}
              <button 
                onClick={deleteSelectedObject}
                className="p-2 bg-red-100 text-red-600 rounded-full hover:bg-red-200"
                title="Delete Object"
              >
                <FiTrash2 size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Toolbox */}
        <div className="w-72 bg-white p-4 editor-toolbox overflow-y-auto">
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Tools</h3>
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={toggleDrawingMode}
                className={`p-2 text-center rounded-md transition flex flex-col items-center ${
                  activeTool === 'brush' ? 'draw-mode-active' : 'hover:bg-gray-100'
                }`}
              >
                <FiEdit3 className="mb-1" size={20} />
                <span className="text-xs">Draw</span>
              </button>
              <button
                onClick={addText}
                disabled={!imageLoaded}
                className={`p-2 text-center rounded-md transition flex flex-col items-center hover:bg-gray-100 ${
                  !imageLoaded ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <FiType className="mb-1" size={20} />
                <span className="text-xs">Add Text</span>
              </button>
              <button
                onClick={() => {
                  setActiveTool('select');
                  setDrawingMode(false);
                  if (fabricRef.current) {
                    fabricRef.current.isDrawingMode = false;
                  }
                }}
                disabled={!imageLoaded}
                className={`p-2 text-center rounded-md transition flex flex-col items-center ${
                  activeTool === 'select' ? 'draw-mode-active' : 'hover:bg-gray-100'
                } ${!imageLoaded ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <FiMove className="mb-1" size={20} />
                <span className="text-xs">Select</span>
              </button>
              <button
                onClick={addRectangle}
                disabled={!imageLoaded}
                className={`p-2 text-center rounded-md transition flex flex-col items-center hover:bg-gray-100 ${
                  !imageLoaded ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <FiSquare className="mb-1" size={20} />
                <span className="text-xs">Rectangle</span>
              </button>
              <button
                onClick={addCircle}
                disabled={!imageLoaded}
                className={`p-2 text-center rounded-md transition flex flex-col items-center hover:bg-gray-100 ${
                  !imageLoaded ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <FiCircle className="mb-1" size={20} />
                <span className="text-xs">Circle</span>
              </button>
              <button
                onClick={deleteSelectedObject}
                disabled={!activeObject || !imageLoaded || (activeObject && activeObject.id === 'background-image')}
                className={`p-2 text-center rounded-md transition flex flex-col items-center ${
                  !activeObject || !imageLoaded || (activeObject && activeObject.id === 'background-image')
                    ? 'opacity-50 cursor-not-allowed' 
                    : 'hover:bg-red-100 text-red-500'
                }`}
              >
                <FiTrash2 className="mb-1" size={20} />
                <span className="text-xs">Delete</span>
              </button>
            </div>
          </div>

          {/* Drawing settings */}
          {activeTool === 'brush' && (
            <div className="mb-6 p-3 bg-blue-50 rounded-md">
              <h3 className="text-sm font-medium text-gray-700 mb-2">Brush Settings</h3>
              <div>
                <label className="block text-xs text-gray-600 mb-1">Brush Size: {brushSize}px</label>
                <input
                  type="range"
                  min="1"
                  max="20"
                  value={brushSize}
                  onChange={handleBrushSizeChange}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          )}

          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-700 mb-3">Color</h3>
            <div className="flex items-center">
              <div className="color-picker-container">
                <div
                  className="color-button"
                  style={{ backgroundColor: color }}
                  onClick={() => setShowColorPicker(!showColorPicker)}
                />
                {showColorPicker && (
                  <div className="absolute z-10 mt-2">
                    <div className="fixed top-0 left-0 right-0 bottom-0" onClick={() => setShowColorPicker(false)} />
                    <div className="relative z-20">
                      <HexColorPicker color={color} onChange={handleColorChange} />
                    </div>
                  </div>
                )}
              </div>
              <div className="ml-3 text-sm text-gray-700">{color}</div>
            </div>
          </div>

          {/* Object Properties */}
          {activeObject && (
            <div className="mb-6">
              <ObjectProperties activeObject={activeObject} canvas={fabricRef.current} />
            </div>
          )}

          {/* Layer Manager */}
          {imageLoaded && fabricRef.current && (
            <div className="mb-6">
              <LayerManager canvas={fabricRef.current} activeObject={activeObject} />
            </div>
          )}

          <div>
            <h3 className="text-sm font-medium text-gray-700 mb-3">Instructions</h3>
            <div className="text-xs text-gray-600 space-y-2">
              <p>1. Open an image using the "Open Image" button</p>
              <p>2. Add text or shapes using the toolbar</p>
              <p>3. Select any element to edit its properties</p>
              <p>4. When an element is selected, use the floating buttons to edit or delete it</p>
              <p>5. Double-click on text to edit it directly</p>
              <p>6. Save your edited image using the "Save Image" button</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
} 