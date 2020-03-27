import { loadFile } from "./file-loader"
import { createSourceFile, ScriptTarget, SourceFile, Node, SyntaxKind, Decorator, Identifier, CallExpression, ObjectLiteralExpression, NodeArray, PropertyAssignment, ArrayLiteralExpression, StringLiteral } from "typescript"


export function getSourceFile(path: string): SourceFile {
	const file = loadFile(path)
	return createSourceFile(path, file, ScriptTarget.Latest)
}

export function getDecoratorPropertyValue(decorator: Decorator, propertyName: string): string | string[] | undefined {
	if (!decorator) return undefined
	return getPropertyValue(decorator, propertyName)
}

export function getDecorator(sourceFile: SourceFile, decoratorName: string): Decorator | undefined {

	let decorator: Decorator | undefined
	sourceFile.forEachChild(child => {
		if (isClassDeclaration(child) && hasDecorator(child, decoratorName)) {
			decorator = getDecorator(child, decoratorName)
		}
	})

	return decorator

	function isClassDeclaration(child: Node): boolean {
		return child.kind === SyntaxKind.ClassDeclaration
	}

	function hasDecorator(child: Node, decoratorName: string): boolean {
		if (!child.decorators) {
			return false
		}
		return child.decorators.some(decorator => ((decorator.expression as CallExpression).expression as Identifier).escapedText === decoratorName)
	}

	function getDecorator(child: Node, decoratorName: string): Decorator | undefined {
		if (!child.decorators) {
			return undefined
		}
		return child.decorators
			.find(decorator => ((decorator.expression as CallExpression).expression as Identifier).escapedText === decoratorName)
	}
}

/**
 * Only support 1 argument in decorator
 * Only support String or Array of Strings as property values
 * @param {*} decorator 
 * @param {*} propertyName 
 */
function getPropertyValue(decorator: Decorator, propertyName: string): undefined | string | string[] {
	const properties = (((decorator.expression as CallExpression).arguments as NodeArray<ObjectLiteralExpression>))[0].properties
	const property = properties.find(prop => ((prop as PropertyAssignment).name as Identifier).escapedText === propertyName)
	if (!property) {
		return undefined
	}
	const initializer = (property as PropertyAssignment).initializer
	switch (initializer.kind) {
		case SyntaxKind.StringLiteral:
			return (initializer as StringLiteral).text
		case SyntaxKind.ArrayLiteralExpression:
			return (initializer as ArrayLiteralExpression).elements.map(el => (el as StringLiteral).text)
		default:
			return undefined
	}
}
