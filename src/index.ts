#!/usr/bin/env node

import { analyze } from "./css-analyzer"
import { printReport, info } from "./output"

const args = process.argv
if (args.length < 3) {
	info("No project directory given! Using .")
}

const projectRoot = process.argv[2] || "."

analyze(projectRoot).subscribe(report => printReport(report))
