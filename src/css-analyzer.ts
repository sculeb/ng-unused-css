import { extractDeclaredClasses } from "./css-parser"
import { extractUsedCssClassesFromHtml } from "./html-parser"
import { ComponentInfo, getComponentInfo } from "./ng-component-parser"
import { of, Observable } from "rxjs"
import { flatMap, map, filter, toArray } from "rxjs/operators"
import { findAll } from "./file-loader"

export interface Report {
	totalUnusedClasses: number;
	results: Result[];
}
export interface Result {
	cssSource: string;
	templateSource: string;
	classes: string[];
}

export function analyze(projectRoot: string): Observable<Report> {

	return of(projectRoot).pipe(
		flatMap(root => findAll(root, ".component.ts")),
		map(componentPath => getComponentInfo(componentPath)),
		filter(componentInfo => !!componentInfo),
		flatMap(componentInfo => mapToResults(componentInfo as ComponentInfo)),
		filter(result => result.classes.length > 0),
		toArray(),
		map(results => buildReport(results))
	)

}

function buildReport(results: Result[]): Report {
	const totalUnusedCount = results
		.map(r => r.classes.length)
		.reduce((prev, curr) => prev += curr, 0)

	return {
		totalUnusedClasses: totalUnusedCount,
		results: results
	}
}

function mapToResults(componentInfo: ComponentInfo): Result[] {
	const usedClasses = extractUsedCssClassesFromHtml(componentInfo.htmlInfo.html)
	return componentInfo.cssInfo.map(cssInfo => {
		const declaredClasses = extractDeclaredClasses(cssInfo.css)
		const unusedClasses = findUnusedClasses(declaredClasses, usedClasses)
		return {
			cssSource: cssInfo.source,
			templateSource: componentInfo.htmlInfo.source,
			classes: unusedClasses
		}
	})
}

function findUnusedClasses(declaredClasses: Set<string>, usedClasses: Set<string>): string[] {
	return [...declaredClasses].filter(cls => ![...usedClasses].includes(cls))
}
