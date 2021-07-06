# vscode-apib-navigation-plugin

VS Code extension for API Blueprint files.

- [Get it from Marketplace](https://marketplace.visualstudio.com/items?itemName=ktothdev.ktoth-apib-navigation)

It helps you to navigate in large API doc files easier using the VS Code Outline view. This extension adds the sections of the API doc to the Outline view in a hierarchical tree structure. On clicking an item in the tree will quickly jump the cursor to the line in the active editor tab where editing the `.apib` file.

## Features

Add hierarchical document tree in the VS Code Outline view.

Works with:

- Sections: `# <identifier>`
  - Nested sections
- Requests: `+ Request <identifier>`
- Data Structures
  - Object: `## <named-type> (object)`
  - Enum: `## <named-type> (enum)`

![Screenshot](https://github.com/tkrisztian95/vscode-apib-navigation-plugin/blob/main/images/screenshot-1.png?raw=true)

## Requirements

No requirements or dependencies to use this extension.

## Extension Settings

This extension contributes the following settings:

* None

## Known Issues

There are no known issues, yet.

## Release Notes

Users appreciate release notes, so here is some:

### 0.0.1

Initial release of this extension...

---

## Useful links

- [API Blueprint Specification](https://apiblueprint.org/documentation/specification.html)

