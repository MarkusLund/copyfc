import { promises as fs } from "fs";
import * as path from "path";
import * as vscode from "vscode";

/**
 * Recursively searches upward from `currentDir` to find a directory
 * that contains either a ".vscode" folder or a ".git" folder.
 *
 * @param currentDir The starting directory.
 * @returns The path to the project root if found, or undefined.
 */
async function findProjectRoot(
  currentDir: string
): Promise<string | undefined> {
  // Check for .vscode
  const vscodeDir = path.join(currentDir, ".vscode");
  try {
    const stat = await fs.stat(vscodeDir);
    if (stat.isDirectory()) {
      return currentDir;
    }
  } catch (_) {
    // .vscode not found in this directory
  }

  // Check for .git (fallback)
  const gitDir = path.join(currentDir, ".git");
  try {
    const stat = await fs.stat(gitDir);
    if (stat.isDirectory()) {
      return currentDir;
    }
  } catch (_) {
    // .git not found in this directory
  }

  const parentDir = path.dirname(currentDir);
  if (parentDir === currentDir) {
    // Reached the filesystem root without finding a project root
    return undefined;
  }
  return findProjectRoot(parentDir);
}

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

        // Read the file's content.
        const fileContent = await vscode.workspace.fs.readFile(fileUri);
        const fileText = Buffer.from(fileContent).toString("utf8");

        // Determine the file's absolute path and its directory.
        const filePath = fileUri.fsPath;
        const fileDir = path.dirname(filePath);

        // Try to find the project root by looking for a .vscode or .git folder.
        let projectRoot = await findProjectRoot(fileDir);
        if (!projectRoot) {
          // Fallback to the workspace folder, if available.
          const workspaceFolder = vscode.workspace.getWorkspaceFolder(fileUri);
          projectRoot = workspaceFolder ? workspaceFolder.uri.fsPath : "";
        }

        // Compute the relative path from the project root to the file.
        const relativePath = projectRoot
          ? path.relative(projectRoot, filePath)
          : filePath;

        // Create the header and final content string.
        const header = `===== ${relativePath} =====`;
        const finalContent = `${header}\n\n${fileText}\n`;

        // Write the final content to the system clipboard.
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
