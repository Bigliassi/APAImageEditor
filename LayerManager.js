import { useEffect, useState } from 'react';
import { FiEye, FiEyeOff, FiArrowUp, FiArrowDown, FiLayers } from 'react-icons/fi';

const LayerManager = ({ canvas, activeObject }) => {
  const [layers, setLayers] = useState([]);
  
  // Update layers list when canvas objects change
  useEffect(() => {
    if (canvas) {
      const updateLayers = () => {
        const objects = canvas.getObjects();
        setLayers([...objects].map(obj => ({
          id: obj.id || Math.random().toString(36).substr(2, 9),
          type: obj.type,
          visible: obj.visible !== false,
          object: obj,
        })));
      };
      
      // Assign unique IDs to all objects
      canvas.getObjects().forEach(obj => {
        if (!obj.id) {
          obj.id = Math.random().toString(36).substr(2, 9);
        }
      });
      
      updateLayers();
      
      // Listen for object added/removed/modified
      canvas.on('object:added', updateLayers);
      canvas.on('object:removed', updateLayers);
      canvas.on('object:modified', updateLayers);
      
      return () => {
        canvas.off('object:added', updateLayers);
        canvas.off('object:removed', updateLayers);
        canvas.off('object:modified', updateLayers);
      };
    }
  }, [canvas]);
  
  // Toggle object visibility
  const toggleVisibility = (layer) => {
    if (canvas) {
      layer.object.visible = !layer.object.visible;
      layer.object.set('opacity', layer.object.visible ? 1 : 0);
      canvas.renderAll();
      
      // Update layers state
      setLayers(prevLayers => 
        prevLayers.map(l => 
          l.id === layer.id 
            ? { ...l, visible: layer.object.visible } 
            : l
        )
      );
    }
  };
  
  // Move layer up
  const moveLayerUp = (index) => {
    if (canvas && index < layers.length - 1) {
      const objects = canvas.getObjects();
      const itemToMove = objects[index];
      canvas.moveTo(itemToMove, index + 1);
      
      // Update layers after reordering
      const updatedLayers = [...layers];
      const temp = updatedLayers[index];
      updatedLayers[index] = updatedLayers[index + 1];
      updatedLayers[index + 1] = temp;
      setLayers(updatedLayers);
    }
  };
  
  // Move layer down
  const moveLayerDown = (index) => {
    if (canvas && index > 0) {
      const objects = canvas.getObjects();
      const itemToMove = objects[index];
      canvas.moveTo(itemToMove, index - 1);
      
      // Update layers after reordering
      const updatedLayers = [...layers];
      const temp = updatedLayers[index];
      updatedLayers[index] = updatedLayers[index - 1];
      updatedLayers[index - 1] = temp;
      setLayers(updatedLayers);
    }
  };
  
  // Select a layer
  const selectLayer = (layer) => {
    if (canvas) {
      canvas.setActiveObject(layer.object);
      canvas.renderAll();
    }
  };
  
  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden">
      <div className="p-3 border-b flex items-center">
        <FiLayers className="mr-2 text-gray-600" />
        <h3 className="text-sm font-medium text-gray-700">Layers</h3>
      </div>
      
      <div className="max-h-64 overflow-y-auto">
        {layers.length === 0 ? (
          <div className="p-4 text-xs text-gray-500 text-center">
            No layers available
          </div>
        ) : (
          <ul>
            {layers.map((layer, index) => (
              <li 
                key={layer.id}
                className={`p-2 flex items-center justify-between border-b hover:bg-gray-50 cursor-pointer text-xs ${
                  activeObject && activeObject.id === layer.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => selectLayer(layer)}
              >
                <div className="flex items-center">
                  {layer.visible ? (
                    <FiEye 
                      className="mr-2 text-gray-600 hover:text-blue-600" 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleVisibility(layer);
                      }}
                    />
                  ) : (
                    <FiEyeOff 
                      className="mr-2 text-gray-400 hover:text-blue-600" 
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleVisibility(layer);
                      }}
                    />
                  )}
                  <span>
                    {layer.type === 'i-text' 
                      ? `Text: ${layer.object.text.substring(0, 15)}${layer.object.text.length > 15 ? '...' : ''}`
                      : layer.type === 'rect' 
                      ? 'Rectangle'
                      : layer.type === 'circle'
                      ? 'Circle'
                      : layer.type === 'path'
                      ? 'Drawing'
                      : layer.type === 'image'
                      ? 'Background Image'
                      : layer.type}
                  </span>
                </div>
                
                <div className="flex space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveLayerUp(index);
                    }}
                    disabled={index === layers.length - 1}
                    className={`p-1 rounded hover:bg-gray-200 ${
                      index === layers.length - 1 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <FiArrowUp size={14} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      moveLayerDown(index);
                    }}
                    disabled={index === 0}
                    className={`p-1 rounded hover:bg-gray-200 ${
                      index === 0 ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    <FiArrowDown size={14} />
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default LayerManager; 