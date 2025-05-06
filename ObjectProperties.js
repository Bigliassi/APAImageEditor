import { useState, useEffect } from 'react';

const ObjectProperties = ({ activeObject, canvas }) => {
  const [opacity, setOpacity] = useState(1);
  const [strokeWidth, setStrokeWidth] = useState(1);
  const [fontSize, setFontSize] = useState(20);
  const [fontFamily, setFontFamily] = useState('Arial');

  // Set initial values when active object changes
  useEffect(() => {
    if (activeObject) {
      setOpacity(activeObject.opacity || 1);
      setStrokeWidth(activeObject.strokeWidth || 1);
      
      if (activeObject.type === 'i-text') {
        setFontSize(activeObject.fontSize || 20);
        setFontFamily(activeObject.fontFamily || 'Arial');
      }
    }
  }, [activeObject]);

  // Handle opacity change
  const handleOpacityChange = (e) => {
    const value = parseFloat(e.target.value);
    setOpacity(value);
    
    if (activeObject && canvas) {
      activeObject.set('opacity', value);
      canvas.renderAll();
    }
  };

  // Handle stroke width change
  const handleStrokeWidthChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setStrokeWidth(value);
    
    if (activeObject && canvas && activeObject.type !== 'i-text') {
      activeObject.set('strokeWidth', value);
      canvas.renderAll();
    }
  };

  // Handle font size change
  const handleFontSizeChange = (e) => {
    const value = parseInt(e.target.value, 10);
    setFontSize(value);
    
    if (activeObject && canvas && activeObject.type === 'i-text') {
      activeObject.set('fontSize', value);
      canvas.renderAll();
    }
  };

  // Handle font family change
  const handleFontFamilyChange = (e) => {
    const value = e.target.value;
    setFontFamily(value);
    
    if (activeObject && canvas && activeObject.type === 'i-text') {
      activeObject.set('fontFamily', value);
      canvas.renderAll();
    }
  };

  if (!activeObject) return null;

  return (
    <div className="p-3 bg-white rounded-md shadow-sm">
      <h3 className="text-sm font-medium text-gray-700 mb-3">Object Properties</h3>
      
      <div className="space-y-3">
        {/* Opacity control */}
        <div>
          <label className="block text-xs text-gray-600 mb-1">Opacity: {opacity.toFixed(2)}</label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={opacity}
            onChange={handleOpacityChange}
            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
          />
        </div>
        
        {/* Stroke width for shapes and paths */}
        {activeObject.type !== 'i-text' && (
          <div>
            <label className="block text-xs text-gray-600 mb-1">Line Width: {strokeWidth}px</label>
            <input
              type="range"
              min="1"
              max="20"
              value={strokeWidth}
              onChange={handleStrokeWidthChange}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
          </div>
        )}
        
        {/* Font properties for text */}
        {activeObject.type === 'i-text' && (
          <>
            <div>
              <label className="block text-xs text-gray-600 mb-1">Font Size: {fontSize}px</label>
              <input
                type="range"
                min="8"
                max="72"
                value={fontSize}
                onChange={handleFontSizeChange}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            
            <div>
              <label className="block text-xs text-gray-600 mb-1">Font Family</label>
              <select
                value={fontFamily}
                onChange={handleFontFamilyChange}
                className="w-full p-1 text-xs border border-gray-300 rounded-md"
              >
                <option value="Arial">Arial</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Georgia">Georgia</option>
                <option value="Verdana">Verdana</option>
                <option value="Helvetica">Helvetica</option>
              </select>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ObjectProperties; 