// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "ktoth-apib-navigation" is now active!');

	context.subscriptions.push(vscode.languages.registerDocumentSymbolProvider(
		{ scheme: "file", language: "apiblueprint" }, new ApibConfigDocumentSymbolProvider()
	))
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}

/**
 * 
 * # Node 1 
 * 	## Node 2
 * 		### Node 3
 * 		### Node 3
 * 	## Node 2
 * 		### Node 3
 * 		### Node 3
 * 	## Node 2
 * 
 * # Node 1
 * 	## Node 2
 *  + Request
 *  + Request
 * 		### Node 3
 *  + Request
 *	 		#### Node 4
 *  + Request
 *	 		#### Node 4
 *      ### Node 3
 *      ### Node 3
 * 	## Node 2
 *	## Node 2
 * 	## Node 2 
 */
var ApibConfigDocumentSymbolProvider = /** @class */ (function () {
	function ApibConfigDocumentSymbolProvider() {
	}

	function isSectionSymbol(symbol) {
		return getSectionRank(symbol) > 0;
	}

	function getSectionRank(symbol) {
		const regex = /^#*/g;
		const found = symbol.name.match(regex);
		if (found == null) {
			return 0;
		}
		return found[0].length;
	}

	function isRootSection(symbol) {
		return getSectionRank(symbol) == 1;
	}

	function isRequest(text) {
		return text.startsWith("+ Request")
	}

	function findNestedSections(parentIdx, symbols) {

		var parentRank = getSectionRank(symbols[parentIdx]);

		var nodes = [];
		for (var j = parentIdx + 1; j < symbols.length; j++) {
			var next = symbols[j];

			if (!isSectionSymbol(next)) {
				continue;
			}

			var nextRank = getSectionRank(next);
			if (parentRank + 1 == nextRank) {
				nodes.push(next); //Node is a child
				continue;
			}
			if (nextRank <= parentRank) {
				break; // No more child
			}
		}
		return nodes;
	}

	function findRequests(parentIdx, symbols) {
		var nodes = [];
		for (var j = parentIdx + 1; j < symbols.length; j++) {
			var next = symbols[j];

			if (!isRequest(next.name)) {
				return nodes;
			}

			nodes.push(next); //Node is a child request
		}
		return nodes;
	}

	ApibConfigDocumentSymbolProvider.prototype.provideDocumentSymbols = function (document) {
		return new Promise(function (resolve) {
			vscode.DocumentSymbol
			var symbols = [];
			for (var i = 0; i < document.lineCount; i++) {
				var line = document.lineAt(i);
				if (line.text.startsWith("#")) {
					var section = new vscode.DocumentSymbol(line.text, 'Section', vscode.SymbolKind.Package, line.range, line.range);

					if (line.text.includes("(object)")) {
						section.detail = 'Named Type';
						section.kind = vscode.SymbolKind.Class;
					}

					if (line.text.includes("(enum)")) {
						section.detail = 'Named Type';
						section.kind = vscode.SymbolKind.Enum;
					}
					symbols.push(section);
				}

				if (isRequest(line.text)) {
					var request = new vscode.DocumentSymbol(line.text, 'Request', vscode.SymbolKind.Method, line.range, line.range);
					symbols.push(request);
				}
			}

			for (var i = 0; i < symbols.length; i++) {
				if (isSectionSymbol(symbols[i])) {
					var childs = [];
					childs = findNestedSections(i, symbols);
					for (var j = 0; j < childs.length; j++) {
						symbols[i].children.push(childs[j]);
					}

					var requests = [];
					requests = findRequests(i, symbols);
					for (var j = 0; j < requests.length; j++) {
						symbols[i].children.push(requests[j]);
					}
				}
			}

			var roots = [];
			symbols.forEach(symbol => {
				if (isRootSection(symbol)) {
					roots.push(symbol);
				}
			});

			resolve(roots);
		});
	};
	return ApibConfigDocumentSymbolProvider;
}());
