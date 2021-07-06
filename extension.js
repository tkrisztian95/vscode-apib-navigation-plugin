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
 * 		### Node 3
 *	 		#### Node 4
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

	function getSymbolRank(symbol) {
		return symbol.name.split(" ", 1)[0].length;
	}

	function isRootSymbol(symbol) {
		var rank = getSymbolRank(symbol);
		return rank === 1;
	}

	function findChildNodes(parentIdx, symbols) {
		var nodes = [];
		var parentRank = getSymbolRank(symbols[parentIdx]);
		for (var j = parentIdx + 1; j < symbols.length; j++) {
			var nextRank = getSymbolRank(symbols[j]);
			if (parentRank + 1 == nextRank) {
				nodes.push(symbols[j]); //Node is a child
			}
			if (nextRank <= parentRank) {
				break; // No more child
			}
		}
		return nodes;
	}

	ApibConfigDocumentSymbolProvider.prototype.provideDocumentSymbols = function (document, token) {
		return new Promise(function (resolve, reject) {
			vscode.DocumentSymbol
			var symbols = [];
			for (var i = 0; i < document.lineCount; i++) {
				var line = document.lineAt(i);
				if (line.text.startsWith("#")) {
					var symbol = new vscode.DocumentSymbol(line.text, 'Component', vscode.SymbolKind.Package, line.range, line.range);
					
					if (line.text.includes("(object)")) {
						symbol.kind = vscode.SymbolKind.Class;
					}

					if (line.text.includes("(enum)")) {
						symbol.kind = vscode.SymbolKind.Enum;
					}
					
					symbols.push(symbol);
				}
			}

			for (var i = 0; i < symbols.length; i++) {
				var childs = [];
				childs = findChildNodes(i, symbols);
				for (var j = 0; j < childs.length; j++) {
					symbols[i].children.push(childs[j]);
				}
			}

			var roots = [];
			symbols.forEach(symbol => {
				if (isRootSymbol(symbol)) {
					roots.push(symbol);
				}
			});

			resolve(roots);
		});
	};
	return ApibConfigDocumentSymbolProvider;
}());
