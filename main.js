const { app, BrowserWindow, ipcMain, screen } = require('electron');
const path = require('path');
 
let mainWindow;
 
function createWindow() {
  const { width } = screen.getPrimaryDisplay().workAreaSize;
 
  mainWindow = new BrowserWindow({
    width: 340,
    height: 480,
    x: width - 360,
    y: 40,
    transparent: true,
    frame: false,
    resizable: true,
    minWidth: 240,
    minHeight: 200,
    alwaysOnTop: true,
    skipTaskbar: false,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });
 
  mainWindow.loadFile('index.html');
}
 
app.whenReady().then(createWindow);
app.on('window-all-closed', () => { if (process.platform !== 'darwin') app.quit(); });
app.on('activate', () => { if (BrowserWindow.getAllWindows().length === 0) createWindow(); });
 
ipcMain.on('close-window', () => mainWindow.close());
ipcMain.on('minimize-window', () => mainWindow.minimize());
ipcMain.on('toggle-always-on-top', (event) => {
  const current = mainWindow.isAlwaysOnTop();
  mainWindow.setAlwaysOnTop(!current);
  event.reply('always-on-top-changed', !current);
});
ipcMain.on('get-always-on-top', (event) => {
  event.reply('always-on-top-changed', mainWindow.isAlwaysOnTop());
});
