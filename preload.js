const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  openFile: () => ipcRenderer.invoke('open-file-dialog'),
  saveFile: (options) => ipcRenderer.invoke('save-file-dialog', options),
}); 