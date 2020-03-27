const classRegex = new RegExp(/\.([a-z\d-]+)(?=.*\{$)/, "gm")

export function extractDeclaredClasses(css: string): Set<string> {
	return getClasses(css)
}

function getClasses(css: string): Set<string> {
	const match = css.match(classRegex)
	if (!match) {
		return new Set()
	}
	const cssClassesArr = match.map(cssClass => cssClass.substring(1))
	return new Set(cssClassesArr)
}
