import { getSourceFile, getDecoratorPropertyValue, getDecorator } from "./ts-parser"
import type { Decorator } from "typescript"
import { loadFile, buildPath } from "./file-loader"

interface Source {
	source: string;
}

interface HtmlInfo extends Source {
	html?: string;
}

interface CssInfo extends Source {
	css: string;
}

export class ComponentInfo {
	readonly component: string
	readonly htmlInfo: HtmlInfo
	readonly cssInfo: CssInfo[]

	constructor(component: string, cssInfo: CssInfo[], htmlInfo: HtmlInfo) {
		this.component = component
		this.cssInfo = cssInfo
		this.htmlInfo = htmlInfo
	}

}

export function getComponentInfo(componentPath: string): ComponentInfo | undefined {
	const tsSourceFile = getSourceFile(componentPath)
	const componentDecorator = getDecorator(tsSourceFile, "Component")
	if (!componentDecorator) return undefined
	const htmlInfo = getHtmlInfo(componentPath, componentDecorator)
	const cssInfo = getCssInfo(componentPath, componentDecorator)
	return new ComponentInfo(componentPath, cssInfo, htmlInfo)
}


function getHtmlInfo(componentPath: string, decorator: Decorator): HtmlInfo {

	const templateUrl = getDecoratorPropertyValue(decorator, "templateUrl")
	if (templateUrl) {
		const fullPath = buildPath(componentPath, templateUrl as string)
		return {
			source: fullPath,
			html: loadFile(fullPath)
		}
	}
	const template = getDecoratorPropertyValue(decorator, "template")
	if (template) {
		return {
			source: componentPath,
			html: template as string
		}
	}
	return {
		source: componentPath
	}
}

function getCssInfo(componentPath: string, decorator: Decorator): CssInfo[] {

	const styleUrls = getDecoratorPropertyValue(decorator, "styleUrls")
	if (styleUrls) {
		return (styleUrls as string[])
			.map(styleUrl => buildPath(componentPath, styleUrl))
			.map(path => {
				return {
					source: path,
					css: loadFile(path)
				}
			})
	}
	const styles = getDecoratorPropertyValue(decorator, "styles")
	if (styles) {
		return (styles as string[])
			.map(css => {
				return {
					source: componentPath,
					css: css
				}
			})
	}
	return []
}
