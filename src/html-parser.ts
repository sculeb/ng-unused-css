import { loadFile } from "./file-loader"
import { Parser } from "htmlparser2"

const classRegex = new RegExp(/'[a-z-\d\s]+'/)

export function extractUsedCssClassesFromFile(fileName: string): Set<string> {
	const html = loadFile(fileName)
	return extractUsedCssClassesFromHtml(html)
}

export function extractUsedCssClassesFromHtml(html?: string): Set<string> {
	if (!html) return new Set()
	const usedCssClasses: string[] = []
	const parser = new Parser(
		{
			onopentag(_name, attrs): void {
				usedCssClasses.push(...extractCssClasses(attrs))
			}
		},
		{
			lowerCaseAttributeNames: false
		}
	)
	parser.write(html)
	parser.end()
	parser.reset()
	return new Set(usedCssClasses)
}


function extractCssClasses(attrs: { [s: string]: string }): string[] {
	if (!attrs) {
		return []
	}
	return [
		...extractFromClassAttribute(attrs),
		...extractFromNgClassAttribute(attrs),
		...extractFromClassDotNotation(attrs)
	]
}

function extractFromClassAttribute(attrs: { [s: string]: string }): string[] {
	if (!attrs.class) {
		return []
	}
	return attrs.class.split(" ")
}

function extractFromNgClassAttribute(attrs: { [s: string]: string }): string[] {
	if (!attrs["[ngClass]"]) {
		return []
	}
	const ngClassValue = attrs["[ngClass]"]
	const match = ngClassValue.match(classRegex)
	if (!match) {
		return []
	}
	return match
		.flatMap(val => val.split(" "))
		.map(className => className.substring(1, className.length - 1))
}

function extractFromClassDotNotation(attrs: { [s: string]: string }): string[] {
	return Object.keys(attrs)
		.filter(key => key.startsWith("[class."))
		.map(key => key.substring("[class.".length, key.length - 1))
}
