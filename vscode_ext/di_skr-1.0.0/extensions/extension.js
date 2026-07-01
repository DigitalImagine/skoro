const vscode = require('vscode');
const fs = require('fs');

const render = require('./render');
const { darkRules, lightRules } = require("./themes");

function print_activate(context) {
	let disposablePrint = vscode.commands.registerCommand('di_skr.saveAsHtml', async () => {
		const editor = vscode.window.activeTextEditor;

		if (!editor) {
			vscode.window.showErrorMessage('Нет активного файла для экспорта!');
			return;
		}

		const items = [
			{
				label: 'ТЁМНАЯ ТЕМА',
				description: 'darkRules',
				rules: darkRules,
				isDark: true
			},
			{
				label: 'СВЕТЛАЯ ТЕМА',
				description: 'lightRules',
				rules: lightRules,
				isDark: false
			}
		];

		const selected = await vscode.window.showQuickPick(items, {
			placeHolder: 'Выберите тему HTML'
		});

		if (!selected) return;

		// ❗ ВАЖНО: render ждёт RAW STRING, не tokens
		const src = editor.document.getText();

		const finalHtmlPage = render(src, selected.rules, selected.isDark);

		const fileUri = await vscode.window.showSaveDialog({
			saveLabel: 'Сохранить HTML',
			filters: { 'HTML': ['html'] }
		});

		if (fileUri) {
			fs.writeFileSync(fileUri.fsPath, finalHtmlPage, 'utf8');
			vscode.window.showInformationMessage('HTML успешно сгенерирован');
		}
	});

	context.subscriptions.push(disposablePrint);
}

function print_deactivate() {}

function themes_activate(context) {
	const themeButton = vscode.window.createStatusBarItem(
		vscode.StatusBarAlignment.Right,
		100
	);

	themeButton.tooltip = "Переключение темы";

	async function updateSkrTokens(themeName) {
		const config = vscode.workspace.getConfiguration('editor');

		const isLight = themeName && themeName.includes('Light');

		themeButton.text = isLight
			? "$(moon) LIGHT"
			: "$(sun) DARK";

		await config.update(
			'tokenColorCustomizations',
			{
				[`[${themeName}]`]: {
					textMateRules: isLight ? lightRules : darkRules
				}
			},
			vscode.ConfigurationTarget.Global
		);
	}

	const initialTheme =
		vscode.workspace.getConfiguration('workbench')
			.get('colorTheme');

	updateSkrTokens(initialTheme);

	const commandId = 'di_skr.toggleSmartTheme';

	themeButton.command = commandId;

	const disposableCommand = vscode.commands.registerCommand(commandId, async () => {
		const workbenchConfig = vscode.workspace.getConfiguration('workbench');
		const theme = workbenchConfig.get('colorTheme');

		await workbenchConfig.update(
			'colorTheme',
			theme && theme.includes('Light')
				? 'Default Dark Modern'
				: 'Default Light Modern',
			vscode.ConfigurationTarget.Global
		);
	});

	const disposableListener =
		vscode.window.onDidChangeActiveColorTheme(() => {
			const updatedTheme =
				vscode.workspace.getConfiguration('workbench')
					.get('colorTheme');

			updateSkrTokens(updatedTheme);
		});

	themeButton.show();

	context.subscriptions.push(
		themeButton,
		disposableCommand,
		disposableListener
	);
}

function themes_deactivate() {}

function activate(context) {
	themes_activate(context);
	print_activate(context);
}

function deactivate() {
	themes_deactivate();
	print_deactivate();
}

module.exports = { activate, deactivate };