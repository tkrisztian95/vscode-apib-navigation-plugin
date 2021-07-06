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

	function getChildren(parentIdx, symbols, nodes) {
		for (var j = parentIdx + 1; j < symbols.length; j++) {
			var parentRank = symbols[parentIdx].name.split(" ", 1)[0].length;
			var nextRank = symbols[j].name.split(" ", 1)[0].length;
			//Child
			if (parentRank + 1 == nextRank) {
				nodes.push(symbols[j]);
			}
			if (nextRank <= parentRank) {
				return;
			}
		}
	}

	ApibConfigDocumentSymbolProvider.prototype.provideDocumentSymbols = function (document, token) {
		return new Promise(function (resolve, reject) {
			vscode.DocumentSymbol
			var symbols = [];
			for (var i = 0; i < document.lineCount; i++) {
				var line = document.lineAt(i);
				if (line.text.startsWith("#")) {
					var symbol = new vscode.DocumentSymbol(line.text, 'Component', vscode.SymbolKind.Package, line.range, line.range);
					symbols.push(symbol);
				}
			}

			for (var i = 0; i < symbols.length; i++) {
				var childs = [];
				getChildren(i, symbols, childs);
				for (var j = 0; j < childs.length; j++) {
					symbols[i].children.push(childs[j]);
				}
			}

			var roots = [];
			for (var i = 0; i < symbols.length; i++) {
				var rank = symbols[i].name.split(" ", 1)[0].length;
				if (rank === 1) {
					roots.push(symbols[i]);
				}
			}
			resolve(roots);
		});
	};
	return ApibConfigDocumentSymbolProvider;
}());
