# copyfc

**copyfc** is a simple yet powerful Visual Studio Code extension that copies the content of a file to your system clipboard, prefixed with a header that includes the file's parent folder and name. This can be very useful when you need to share code snippets or file contents with context.

## Features

- **Copy with Header**: When activated, the extension reads the file content and prepends a header in the format:

  ```
  ===== parentFolder/fileName =====
  ```

- **Easy Access**: The command is available both from the editor context menu and the Explorer context menu.
- **Seamless Integration**: Works with any file opened in VS Code that has a `file` scheme.

## Installation

1. **Clone or Download** the repository containing the extension source code.
2. **Install Dependencies**: Run the following command in the extension's root directory:
   ```bash
   npm install
   ```
3. **Build the Extension**: Compile the source code using:
   ```bash
   npm run compile
   ```
4. **Launch in VS Code**:
   - Open the extension folder in VS Code.
   - Press `F5` to launch an Extension Development Host instance.

## Usage

1. **From the Editor**:
   - Open a file in the editor.
   - Right-click anywhere in the editor window and select **Copy File Content with Header** from the context menu.
2. **From the Explorer**:
   - Right-click on a file in the Explorer view.
   - Select **Copy File Content with Header** from the context menu.

After executing the command, the file's content (prefixed with its header) will be copied to your system clipboard. You can then paste it wherever needed.

## Command Details

- **Command Name**: `extension.copyFileContentWithHeader`
- **Activation**: This command can be triggered from either the editor or Explorer context menus.
- **Behavior**:
  - If the command is invoked from the Explorer, it uses the file selected.
  - If the command is invoked from the editor, it uses the active document.
  - Displays an error message if no valid file is selected.

## Development

### Scripts

- **Compile the Extension**:
  ```bash
  npm run compile
  ```
- **Watch for Changes**:
  ```bash
  npm run watch
  ```
- **Lint the Code**:
  ```bash
  npm run lint
  ```
- **Package the Extension** (for production release):
  ```bash
  npm run package
  ```

### Testing

- **Compile Tests**:
  ```bash
  npm run compile-tests
  ```
- **Run Tests**:
  ```bash
  npm run test
  ```

## Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/your-repo/copyfc/issues) if you want to contribute.

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-branch`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add new feature'`).
5. Push to the branch (`git push origin feature-branch`).
6. Open a pull request.

## License

Distributed under the MIT License. See `LICENSE` for more information.

---

Enjoy using **copyfc** to streamline your workflow in VS Code!
