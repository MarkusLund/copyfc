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

// Recursively retrieves all files from the given URI (file or folder).
async function getAllFiles(uri: vscode.Uri): Promise<vscode.Uri[]> {
  const files: vscode.Uri[] = [];
  try {
    const stat = await vscode.workspace.fs.stat(uri);
    if (stat.type === vscode.FileType.Directory) {
      const entries = await vscode.workspace.fs.readDirectory(uri);
      for (const [name, type] of entries) {
        const entryUri = vscode.Uri.joinPath(uri, name);
        if (type === vscode.FileType.Directory) {
          files.push(...(await getAllFiles(entryUri)));
        } else if (type === vscode.FileType.File) {
          files.push(entryUri);
        }
      }
    } else if (stat.type === vscode.FileType.File) {
      files.push(uri);
    }
  } catch (error) {
    // Optionally log or handle errors here.
  }
  return files;
}

export function activate(context: vscode.ExtensionContext) {
  const disposable = vscode.commands.registerCommand(
    "extension.copyFileContentWithHeader",
    async (...args: any[]) => {
      try {
        let uris: vscode.Uri[] = [];

        // Determine the selected file(s) or folder(s) from the explorer context or active editor.
        if (args.length > 1 && Array.isArray(args[1])) {
          uris = args[1] as vscode.Uri[];
        } else if (args.length === 1 && args[0] instanceof vscode.Uri) {
          uris = [args[0]];
        } else if (vscode.window.activeTextEditor) {
          uris = [vscode.window.activeTextEditor.document.uri];
        }

        if (uris.length === 0) {
          vscode.window.showErrorMessage(
            "No file or folder is currently selected."
          );
          return;
        }

        // Collect all file URIs (if a folder is selected, get all files recursively)
        let fileUris: vscode.Uri[] = [];
        for (const uri of uris) {
          const collectedFiles = await getAllFiles(uri);
          fileUris.push(...collectedFiles);
        }

        if (fileUris.length === 0) {
          vscode.window.showErrorMessage(
            "No valid file(s) found in the selected item(s)."
          );
          return;
        }

        const results: string[] = [];
        for (const fileUri of fileUris) {
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
