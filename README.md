# CopyFC - VS Code Extension

**CopyFC** is a lightweight Visual Studio Code extension that copies file content to the clipboard with a header containing the file’s relative path.

## Features

- **Copies File Content with Context** – Adds a header with the file's relative path.
- **Supports Multiple Selections** – Works with single or multiple files.
- **Project Root Detection** – Uses `.vscode` or `.git` folders to determine the root.
- **Easy Access** – Available via the editor and Explorer context menus.

## Usage

- **From the Editor**: Right-click and select **Copy File Content with Header**.
- **From the Explorer**: Right-click a file and choose **Copy File Content with Header**.
- The copied content includes the file's relative path and its content.

## Development

- **Compile:** `npm run compile`
- **Watch for changes:** `npm run watch`
- **Lint:** `npm run lint`
- **Test:** `npm run test`
- **Package for release:** `npm run package`

## Contributing

Contributions are welcome! Open an issue or submit a pull request on [GitHub](https://github.com/MarkusLund/CopyFC/issues).

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/MarkusLund/CopyFC.git
   cd CopyFC
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Build the extension:
   ```bash
   npm run compile
   ```
4. Launch in VS Code:
   - Open the folder in VS Code.
   - Press `F5` to start a development instance.

## License

MIT License. See `LICENSE` for details.
