const { app, BrowserWindow, ipcMain, dialog } = require('electron');
const path = require('path');
const fs = require('fs');
const url = require('url');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    show: false,
  });

  const startUrl = process.env.NODE_ENV === 'development' 
    ? 'http://localhost:3000' 
    : url.format({
        pathname: path.join(__dirname, '../out/index.html'),
        protocol: 'file:',
        slashes: true,
      });

  console.log('Loading URL:', startUrl);
  mainWindow.loadURL(startUrl);

  // Open DevTools in development mode
  if (process.env.NODE_ENV === 'development') {
    mainWindow.webContents.openDevTools();
  }

  // Log any loading errors
  mainWindow.webContents.on('did-fail-load', (event, errorCode, errorDescription) => {
    console.error('Failed to load:', errorCode, errorDescription);
  });

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  // Set NODE_ENV if not already set
  process.env.NODE_ENV = process.env.NODE_ENV || 'development';
  console.log('Starting in mode:', process.env.NODE_ENV);
  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// File handling
ipcMain.handle('open-file-dialog', async () => {
  const { canceled, filePaths } = await dialog.showOpenDialog({
    properties: ['openFile'],
    filters: [
      { name: 'Images', extensions: ['png', 'jpg', 'jpeg', 'svg'] }
    ]
  });
  
  if (canceled) {
    return null;
  }
  
  try {
    const filePath = filePaths[0];
    const fileName = path.basename(filePath);
    const fileData = fs.readFileSync(filePath).toString('base64');
    const fileExt = path.extname(filePath).substring(1);
    
    return {
      path: filePath,
      name: fileName,
      data: `data:image/${fileExt};base64,${fileData}`,
      extension: fileExt
    };
  } catch (error) {
    console.error('Error reading file:', error);
    return null;
  }
});

ipcMain.handle('save-file-dialog', async (event, { defaultPath, data }) => {
  const { canceled, filePath } = await dialog.showSaveDialog({
    defaultPath,
    filters: [
      { name: 'PNG Image', extensions: ['png'] }
    ]
  });
  
  if (canceled) {
    return { success: false };
  }
  
  try {
    // Convert base64 data to buffer and save
    const base64Data = data.replace(/^data:image\/png;base64,/, '');
    fs.writeFileSync(filePath, Buffer.from(base64Data, 'base64'));
    
    return { success: true, path: filePath };
  } catch (error) {
    console.error('Error saving file:', error);
    return { success: false, error: error.message };
  }
}); 