import * as path from "path";
import * as vscode from "vscode";

export function activate(context: vscode.ExtensionContext) {
  let disposable = vscode.commands.registerCommand(
    "extension.copyFileContentWithHeader",
    async (uri?: vscode.Uri) => {
      try {
        // Determine the file URI:
        // If invoked from the Explorer, `uri` is provided.
        // Otherwise, try to get the active editor's document.
        let fileUri: vscode.Uri | undefined = uri;
        if (!fileUri && vscode.window.activeTextEditor) {
          fileUri = vscode.window.activeTextEditor.document.uri;
        }
        if (!fileUri || fileUri.scheme !== "file") {
          vscode.window.showErrorMessage("No file is currently selected.");
          return;
        }

        // Read the file's content
        const fileContent = await vscode.workspace.fs.readFile(fileUri);
        const fileText = Buffer.from(fileContent).toString("utf8");

        // Extract file name and parent folder using Node's path module
        const fileName = path.basename(fileUri.fsPath);
        const parentFolder = path.basename(path.dirname(fileUri.fsPath));

        // Create the header and final content string
        const header = `===== ${parentFolder}/${fileName} =====`;
        const finalContent = `${header}\n\n${fileText}\n`;

        // Write the final content to the system clipboard
        await vscode.env.clipboard.writeText(finalContent);

        vscode.window.showInformationMessage(
          "Contents of the file have been copied to the clipboard."
        );
      } catch (error: any) {
        vscode.window.showErrorMessage(`Error: ${error.message}`);
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
