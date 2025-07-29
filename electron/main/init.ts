import { getBackendPath, getBinaryPath, isBinaryExists, runInstallScript } from "./utils/process";
import { spawn } from 'child_process'
import log from 'electron-log'
import fs from 'fs'
import path from 'path'
import * as net from "net";
import { ipcMain, BrowserWindow } from 'electron'

// helper function to get main window
function getMainWindow(): BrowserWindow | null {
    const windows = BrowserWindow.getAllWindows();
    return windows.length > 0 ? windows[0] : null;
}


export async function checkToolInstalled() {
    return new Promise(async (resolve, reject) => {
        if (!(await isBinaryExists('uv'))) {
            resolve(false)
        }

        if (!(await isBinaryExists('bun'))) {
            resolve(false)
        }

        resolve(true)
    })

}

/**
 * Check if command line tools are installed, install if not
 */
export async function installCommandTool() {
    return new Promise(async (resolve, reject) => {
        let isAllInstalled = true
        console.log('Checking if command line tools are installed, installing if not')
        if (!(await isBinaryExists('uv'))) {
            console.log('start install uv')
            await runInstallScript('install-uv.js')
            const uv_installed = await isBinaryExists('uv')
            const mainWindow = getMainWindow();
            if (mainWindow && !mainWindow.isDestroyed()) {
                if (uv_installed) {

                    mainWindow.webContents.send('install-dependencies-log', { type: 'stdout', data: '' });
                } else {
                    isAllInstalled = false
                    mainWindow.webContents.send('install-dependencies-complete', { success: false, code: 2, error: `Script exited with code ${2}` });
                }
            }
        }

        if (!(await isBinaryExists('bun'))) {
            console.log('start install bun')
            await runInstallScript('install-bun.js')
            const bun_installed = await isBinaryExists('bun')
            const mainWindow = getMainWindow();
            if (mainWindow && !mainWindow.isDestroyed()) {
                if (bun_installed) {
                    mainWindow.webContents.send('install-dependencies-log', { type: 'stdout', data: '' });
                } else {
                    isAllInstalled = false
                    mainWindow.webContents.send('install-dependencies-complete', { success: false, code: 2, error: `Script exited with code ${2}` });
                }
            }
        }
        resolve(isAllInstalled)
    })

}

export async function installDependencies() {
    return new Promise<boolean>(async (resolve, reject) => {
        console.log('start install dependencies')

        // notify frontend start install
        const mainWindow = getMainWindow();
        if (mainWindow && !mainWindow.isDestroyed()) {
            mainWindow.webContents.send('install-dependencies-start');
        }

        const isInstalCommandTool = await installCommandTool()
        if (!isInstalCommandTool) {
            resolve(false)
            return
        }
        const uv_path = await getBinaryPath('uv')
        const backendPath = getBackendPath()

        // ensure backend directory exists and is writable
        if (!fs.existsSync(backendPath)) {
            fs.mkdirSync(backendPath, { recursive: true })
        }

        // touch installing lock file
        const installingLockPath = path.join(backendPath, 'uv_installing.lock')
        fs.writeFileSync(installingLockPath, '')
        const proxy = ['--default-index', 'https://pypi.tuna.tsinghua.edu.cn/simple']
        function isInChinaTimezone() {
            const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
            return timezone === 'Asia/Shanghai';
        }
        console.log('isInChinaTimezone@@@@@', isInChinaTimezone())
        const node_process = spawn(uv_path, ['sync', '--no-dev', ...(isInChinaTimezone() ? proxy : [])], { cwd: backendPath })
        node_process.stdout.on('data', (data) => {
            log.info(`Script output: ${data}`)
            // notify frontend install log
            const mainWindow = getMainWindow();
            if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.webContents.send('install-dependencies-log', { type: 'stdout', data: data.toString() });
            }
        })

        node_process.stderr.on('data', (data) => {
            log.error(`Script error: uv ${data}`)
            // notify frontend install error log
            const mainWindow = getMainWindow();
            if (mainWindow && !mainWindow.isDestroyed()) {
                mainWindow.webContents.send('install-dependencies-log', { type: 'stderr', data: data.toString() });
            }
        })

        node_process.on('close', async (code) => {
            // delete installing lock file 
            if (fs.existsSync(installingLockPath)) {
                fs.unlinkSync(installingLockPath)
            }

            if (code === 0) {
                log.info('Script completed successfully')

                // touch installed lock file
                const installedLockPath = path.join(backendPath, 'uv_installed.lock')
                fs.writeFileSync(installedLockPath, '')
                console.log('end install dependencies')


                spawn(uv_path, ['run', 'task', 'babel'], { cwd: backendPath })
                resolve(true);
                // resolve(isSuccess);
            } else {
                log.error(`Script exited with code ${code}`)
                // notify frontend install failed
                const mainWindow = getMainWindow();
                if (mainWindow && !mainWindow.isDestroyed()) {
                    mainWindow.webContents.send('install-dependencies-complete', { success: false, code, error: `Script exited with code ${code}` });
                    resolve(false);
                }
            }
        })
    })
}


export async function startBackend(setPort?: (port: number) => void): Promise<any> {
    console.log('start fastapi')
    const uv_path = await getBinaryPath('uv')
    const backendPath = getBackendPath()
    const port = await findAvailablePort(5001);
    if (setPort) {
        setPort(port);
    }

    const env = {
        ...process.env,
        SERVER_URL: "https://dev.eigent.ai/api",
        PYTHONIOENCODING: 'utf-8'
    }
    return new Promise((resolve, reject) => {
        const node_process = spawn(
            uv_path,
            ["run", "uvicorn", "main:api", "--port", port.toString(), "--loop", "asyncio"],
            { cwd: backendPath, env: env, detached: false }
        );


        let started = false;


        node_process.stdout.on('data', (data) => {
            log.info(`fastapi output: ${data}`);
            // check output content, judge if start success
            if (!started && data.toString().includes("Uvicorn running on")) {
                started = true;
                resolve(node_process);
            }
        });

        node_process.stderr.on('data', (data) => {
            log.error(`fastapi stderr output: ${data}`);
            if (!started && data.toString().includes("Uvicorn running on")) {
                started = true;
                resolve(node_process);
            }
        });

        node_process.on('close', (code) => {
            if (!started) {
                reject(new Error(`fastapi exited with code ${code}`));
            }
        });
    });
    // const node_process = spawn(
    //     uv_path,
    //     ["run", "uvicorn", "main:api", "--port", port.toString(), "--loop", "asyncio"],
    //     { cwd: backendPath, env: env, detached: false }
    // );

    // node_process.stdout.on('data', (data) => {
    //     log.info(`fastapi output: ${data}`)
    // })

    // node_process.stderr.on('data', (data) => {
    //     log.error(`fastapi stderr output: ${data}`)
    // })

    // node_process.on('close', (code) => {
    //     if (code === 0) {
    //         log.info('fastapi start success')
    //     } else {
    //         log.error(`fastapi exited with code ${code}`)

    //     }
    // })
    // return node_process
}

function checkPortAvailable(port: number): Promise<boolean> {
    return new Promise((resolve) => {
        const server = net.createServer();

        server.once('error', (err: any) => {
            if (err.code === 'EADDRINUSE') {
                resolve(false); // port occupied
            } else {
                resolve(false);
            }
        });

        server.once('listening', () => {
            server.close(() => {
                console.log('try port', port)
                resolve(true)
            }); // port available, close then return
        });

        // force listen all addresses, prevent judgment
        server.listen({ port, host: "127.0.0.1", exclusive: true });
    });
}

export async function findAvailablePort(startPort: number, maxAttempts = 50): Promise<number> {
    let port = startPort;
    for (let i = 0; i < maxAttempts; i++) {
        const available = await checkPortAvailable(port);
        if (available) {
            return port;
        }
        port++;
    }
    throw new Error('No available port found');
}