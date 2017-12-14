import { app, BrowserWindow } from 'electron' // eslint-disable-line
import YougetGUI from './sys/YougetGUI';
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

let win;
let sys;
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`;

function createWindow() {
  /**
   * Initial window options
   */
  win = new BrowserWindow({
    height: 500,
    useContentSize: true,
    width: 800,
    minHeight: 300,
    minWidth: 500,
  });
  win.setMenu(null);
  win.loadURL(winURL);

  win.on('closed', () => {
    win = null;
  });
  /**
   * 启动后端程序
   */
  sys = new YougetGUI();
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  sys.exit();
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});
