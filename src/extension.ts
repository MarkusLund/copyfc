import { promises as fs } from "fs";
import * as path from "path";
import * as vscode from "vscode";

// Recursively searches upward for a directory containing a ".vscode" or ".git" folder.
async function findProjectRoot(
  currentDir: string
): Promise<string | undefined> {
  const vscodeDir = path.join(currentDir, ".vscode");
  try {
    const stat = await fs.stat(vscodeDir);
    if (stat.isDirectory()) {
      return currentDir;
    }
  } catch {}

  const gitDir = path.join(currentDir, ".git");
  try {
    const stat = await fs.stat(gitDir);
    if (stat.isDirectory()) {
      return currentDir;
    }
  } catch {}

  const parentDir = path.dirname(currentDir);
  return parentDir === currentDir ? undefined : findProjectRoot(parentDir);
}

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "extension.copyFileContentWithHeader",
    async (...args: any[]) => {
      try {
        let uris: vscode.Uri[] = [];

        // Determine the selected files from explorer context or active editor.
        if (args.length > 1 && Array.isArray(args[1])) {
          uris = args[1] as vscode.Uri[];
        } else if (args.length === 1 && args[0] instanceof vscode.Uri) {
          uris = [args[0]];
        } else if (vscode.window.activeTextEditor) {
          uris = [vscode.window.activeTextEditor.document.uri];
        }

        if (uris.length === 0) {
          vscode.window.showErrorMessage("No file is currently selected.");
          return;
        }

        const results: string[] = [];
        for (const fileUri of uris) {
          if (fileUri.scheme !== "file") {
            continue;
          }

          const fileContent = await vscode.workspace.fs.readFile(fileUri);
          const fileText = Buffer.from(fileContent).toString("utf8");
          const filePath = fileUri.fsPath;
          const fileDir = path.dirname(filePath);

          let projectRoot = await findProjectRoot(fileDir);
          if (!projectRoot) {
            const workspaceFolder =
              vscode.workspace.getWorkspaceFolder(fileUri);
            projectRoot = workspaceFolder ? workspaceFolder.uri.fsPath : "";
          }
          const relativePath = projectRoot
            ? path.relative(projectRoot, filePath)
            : filePath;
          const header = `===== ${relativePath} =====`;
          results.push(`${header}\n\n${fileText}\n`);
        }

        if (results.length === 0) {
          vscode.window.showErrorMessage("No valid file(s) selected.");
          return;
        }

        const combinedContent = results.join("\n\n");
        await vscode.env.clipboard.writeText(combinedContent);
        vscode.window.showInformationMessage(
          "Contents of the selected file(s) have been copied to the clipboard."
        );
      } catch (error: any) {
        vscode.window.showErrorMessage(`Error: ${error.message}`);
      }
    }
  );

  context.subscriptions.push(disposable);
}

export function deactivate() {}
