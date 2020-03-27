import type { Report, Result } from "./css-analyzer"
import * as symbols from "log-symbols"

const RESET = "\x1b[0m"

enum Color {
	RED = "\x1b[31m",
	GREEN = "\x1b[32m",
}

export function printReport(report: Report): void {
	printDetails(report.results)
	printOverallCountResult(report.totalUnusedClasses)
	if (report.totalUnusedClasses > 0) {
		error("Linting failed!")
		process.exit(1)
	}
	success("Linting successful!")
	console.log("")
	process.exit(0)
}

function printOverallCountResult(count: number): void {
	const countColor = count > 0 ? Color.RED : Color.GREEN
	const countOutput = colorize(count, countColor)
	console.log("")
	console.log(`Found ${countOutput} unused css ${classOrClasses(count)}`)
}

function printDetails(results: Result[]): void {
	results.forEach(res => printComponentDetail(res))
}

function printComponentDetail(result: Result): void {
	console.log("")
	console.group(`${symbols.error} ${result.classes.join(", ")}`)
	console.log(`- declared in:     ${result.cssSource}`)
	console.log(`- but not used in: ${result.templateSource}`)
	console.groupEnd()
}

function colorize(output: string | number, color: Color): string {
	return `${color}${output}${RESET}`
}

function classOrClasses(count: number): string {
	return count === 1 ? "class" : "classes"
}

function success(text: string): void {
	console.log(`${symbols.success} ${colorize(text, Color.GREEN)}`)
}

function error(text: string): void {
	console.log(`${symbols.error} ${colorize(text, Color.RED)}`)
}

export function info(text: string): void {
	console.log(`${symbols.info} ${text}`)
}
