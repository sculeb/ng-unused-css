# ng unused css

Linter that detects unused css classes in Angular applications.

Finds css classes that are defined in
- stylesheets referenced via `styleUrls`
- inline styles via `styles`

but are never used in 
- templates referenced via `templateUrl`
- inline template via `template`

like 
- `class=some-class`
- `[ngClass]="{'some-class': booleanVar}"`
- `[class.some-class]="booleanVar"`.

## caveat
- does not interpret style rules, only occurance of classes
- can never support fully dynamic classes like `[ngClass]="getClassNameFromComponent()"`

## requirements & getting started

- node >= 11.0.0
- `npm install ng-unused-css --save-dev`
- package-json: 
   ```json
	...
	"scripts": {
		...
		"lint-unused-css": "ng-unused-css .",
		...
	}
	...
   ```
   `npm run lint-unused-css`
- you can check out this repo and play around with the sample project

## way it works

- scan project for `.component.ts` files
- collect html and css referenced from those Components
- analyse declared and used css classes
- exit with exit code 1 if linting fails, 0 otherwise
