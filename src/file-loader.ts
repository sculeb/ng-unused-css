import { readFileSync, readdirSync } from "fs"
import { info } from "./output"
import { Observable, from } from "rxjs"

export function loadFile(fileName: string): string {
	return readFileSync(fileName, { encoding: "utf-8" })
}

export function findAll(dir: string, suffix: string): Observable<string> {
	const start = Date.now()
	const hits = findAllRecursivley(dir, suffix)
	const duration = Date.now() - start
	info(`Found ${hits.length} *${suffix} files in ${duration}ms`)
	return from(hits)
}

export function buildPath(rootFilePath: string, relativePath: string): string {
	relativePath = relativePath.startsWith("./") ? relativePath.substring(2) : relativePath
	return `${stripFileName(rootFilePath)}/${relativePath}`
}

function findAllRecursivley(dir: string, suffix: string): string[] {
	const hits: string[] = []
	readdirSync(dir, { encoding: "utf-8", withFileTypes: true })
		.forEach(entry => {
			if (entry.isFile() && entry.name.endsWith(suffix)) {
				hits.push(`${dir}/${entry.name}`)
				return
			}
			if (entry.isDirectory()) {
				hits.push(...findAllRecursivley(`${dir}/${entry.name}`, suffix))
			}
		})
	return hits
}

function stripFileName(filePath: string): string {
	const lastPathSeparatorIdx = filePath.lastIndexOf("/")
	return filePath.substring(0, lastPathSeparatorIdx)
}
