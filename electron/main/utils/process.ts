import { spawn } from 'child_process'
import log from 'electron-log'
import fs from 'fs'
import os from 'os'
import path from 'path'
import { app } from 'electron'


export function getResourcePath() {
  return path.join(app.getAppPath(), 'resources')
}

export function getBackendPath() {
  if (app.isPackaged) {
    //  after packaging, backend is in extraResources
    return path.join(process.resourcesPath, 'backend')
  } else {
    // development environment
    return path.join(app.getAppPath(), 'backend')
  }
}

export function runInstallScript(scriptPath: string): Promise<boolean> {
  return new Promise<boolean>((resolve, reject) => {
    const installScriptPath = path.join(getResourcePath(), 'scripts', scriptPath)
    log.info(`Running script at: ${installScriptPath}`)

    const nodeProcess = spawn(process.execPath, [installScriptPath], {
      env: { ...process.env, ELECTRON_RUN_AS_NODE: '1' }
    })

    nodeProcess.stdout.on('data', (data) => {
      log.info(`Script output: ${data}`)
    })

    nodeProcess.stderr.on('data', (data) => {
      log.error(`Script error: ${data}`)
    })

    nodeProcess.on('close', (code) => {
      if (code === 0) {
        log.info('Script completed successfully')
        resolve(true)
      } else {
        log.error(`Script exited with code ${code}`)
        reject(false)
      }
    })
  })
}

export async function getBinaryName(name: string): Promise<string> {
  if (process.platform === 'win32') {
    return `${name}.exe`
  }
  return name
}

export async function getBinaryPath(name?: string): Promise<string> {
  if (!name) {
    return path.join(os.homedir(), '.eigent', 'bin')
  }
  const binaryName = await getBinaryName(name)
  const binariesDir = path.join(os.homedir(), '.eigent', 'bin')
  const binariesDirExists = await fs.existsSync(binariesDir)

  return binariesDirExists ? path.join(binariesDir, binaryName) : binaryName
}

export function getCachePath(folder: string): string {
  const cacheDir = path.join(os.homedir(), '.eigent', 'cache', folder)
  console.log('cacheDir+++++++++++++++++++++++++++')
  console.log('Cache directory:', cacheDir)
  console.log('cacheDir--------------------')
  return cacheDir
}

export async function isBinaryExists(name: string): Promise<boolean> {
  const cmd = await getBinaryPath(name)

  return await fs.existsSync(cmd)
}
