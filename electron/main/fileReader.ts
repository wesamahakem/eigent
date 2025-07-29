import { ipcMain, BrowserWindow, app } from 'electron'
import fs from 'fs'
import path from 'path'
import mammoth from 'mammoth'
import Papa from 'papaparse'
import * as unzipper from 'unzipper'
import { parseStringPromise } from 'xml2js'


export class FileReader {
	private win: BrowserWindow | null = null
	constructor(window: BrowserWindow) {
		this.win = window
	}

	// Remove automatic IPC handler registration from constructor
	// IPC handlers should be registered once in the main process

	private async parseDocx(filePath: string): Promise<string> {
		try {
			const result = await mammoth.convertToHtml({ path: filePath })
			return result.value // The generated HTML
		} catch (error) {
			console.error('DOCX parsing error:', error)
			throw error
		}
	}

	private async parseDoc(filePath: string): Promise<string> {
		try {
			const result = await mammoth.convertToHtml({ path: filePath })
			return result.value // The generated HTML
		} catch (error) {
			console.error('DOC parsing error:', error)
			throw error
		}
	}

	private async parsePptx(filePath: string): Promise<string> {
		try {
			const directory = await unzipper.Open.file(filePath)
			const slideFiles = directory.files.filter((f: any) => f.path.match(/^ppt\/slides\/slide\d+\.xml$/))

			let html = '<div style="font-family: sans-serif;">'

			for (let i = 0; i < slideFiles.length; i++) {
				const file = slideFiles[i]
				const contentBuffer = await file.buffer()
				const content = contentBuffer.toString('utf-8')
				const parsed = await parseStringPromise(content)

				html += `<h3>Slide ${i + 1}</h3><ul>`

				const texts = parsed['p:sld']['p:cSld'][0]['p:spTree'][0]['p:sp'] || []

				for (const textNode of texts) {
					const paras = textNode?.['p:txBody']?.[0]?.['a:p'] || []
					for (const para of paras) {
						const runs = para?.['a:r'] || []
						for (const run of runs) {
							const text = run?.['a:t']?.[0]
							if (text) {
								html += `<li>${text}</li>`
							}
						}
					}
				}

				html += '</ul><hr/>'
			}

			html += '</div>'
			return html
		} catch (error) {
			console.error('PPTX unzip parse error:', error)
			throw error
		}
	}

	private async parseCsv(filePath: string): Promise<string> {
		try {
			const fileContent = fs.readFileSync(filePath, 'utf-8')
			const result = Papa.parse(fileContent, {
				header: true,
				skipEmptyLines: true,
				delimiter: ","
			})

			// Convert to HTML table
			if (result.data && result.data.length > 0) {
				const headers = Object.keys(result.data[0] as string[])
				let html = '<table style="border-collapse: collapse; width: 100%; font-family: monospace;">'

				// Header row
				html += '<thead><tr style="background-color: #f5f5f5;">'
				headers.forEach(header => {
					html += `<th style="border: 1px solid #ddd; padding: 8px; text-align: left;">${header}</th>`
				})
				html += '</tr></thead>'

				// Data rows
				html += '<tbody>'
				result.data.forEach((row: any) => {
					html += '<tr>'
					headers.forEach(header => {
						html += `<td style="border: 1px solid #ddd; padding: 8px;">${row[header] || ''}</td>`
					})
					html += '</tr>'
				})
				html += '</tbody></table>'

				return html
			}
			return '<p>Empty CSV file</p>'
		} catch (error) {
			console.error('CSV parsing error:', error)
			throw error
		}
	}

	public openFile(type: string, filePath: string, isShowSourceCode: boolean) {
		return new Promise(async (resolve, reject) => {
			try {
				if (type === 'md') {
					const content = fs.readFileSync(filePath, 'utf-8')
					resolve(content)
				} else if (isShowSourceCode && type === 'html') {
					const content = fs.readFileSync(filePath, 'utf-8')
					resolve(content)
				} else if (["pdf", "html"].includes(type)) {
					resolve(filePath)
				} else if (type === "csv") {
					try {
						const htmlContent = await this.parseCsv(filePath)
						resolve(htmlContent)
					} catch (error) {
						console.warn('CSV parsing failed, reading as text:', error)
						const content = fs.readFileSync(filePath, 'utf-8')
						resolve(content)
					}
				} else if (type === "docx") {
					try {
						const htmlContent = await this.parseDocx(filePath)
						resolve(htmlContent)
					} catch (error) {
						console.warn('DOCX parsing failed, reading as text:', error)
						const content = fs.readFileSync(filePath, 'utf-8')
						resolve(content)
					}
				} else if (type === "doc") {
					try {
						const htmlContent = await this.parseDoc(filePath)
						resolve(htmlContent)
					} catch (error) {
						console.warn('DOC parsing failed, reading as text:', error)
						const content = fs.readFileSync(filePath, 'utf-8')
						resolve(content)
					}
				} else if (type === 'pptx') {
					try {
						const htmlContent = await this.parsePptx(filePath)
						resolve(htmlContent)
					} catch (error) {
						console.warn('PPTX parsing failed, reading as binary string:', error)
						const content = fs.readFileSync(filePath, 'base64') //  backup processing
						resolve(`<pre>${content}</pre>`)
					}
				} else {
					const content = fs.readFileSync(filePath, 'utf-8')
					resolve(content)
				}
			} catch (error) {
				reject(error)
			}
		})
	}

	public getFileList(email: string, taskId: string): FileInfo[] {

		const safeEmail = email.split('@')[0].replace(/[\\/*?:"<>|\s]/g, "_").replace(/^\.+|\.+$/g, "");

		const userHome = app.getPath('home');
		const dirPath = path.join(userHome, "eigent", safeEmail, `task_${taskId}`);

		try {
			if (!fs.existsSync(dirPath)) {
				return [];
			}
			const files = fs.readdirSync(dirPath);

			return files.filter(file=>!file.startsWith(".")).map(file => {
				return {
					path: path.join(dirPath, file),
					name: file,
					type: file.split('.').pop()?.toLowerCase() || '',
				}
			});
		} catch (err) {
			console.error("Load file failed:", err);
			return [];
		}
	}
}

