import { Editor, MarkdownView, Plugin } from 'obsidian';
import lunr from 'lunr';

declare module "obsidian" {
    interface App {
        isMobile: boolean;
    }
}

// Call this method inside your plugin's `onLoad` function
function monkeyPatchConsole(plugin: Plugin) {
  if (!plugin.app.isMobile) {
    return;
  }
  
  const logFile = `${plugin.manifest.dir}/logs.txt`;
  console.log(logFile);
  const logs: string[] = [];
  const logMessages = (prefix: string) => (...messages: unknown[]) => {
    logs.push(`\n[${prefix}]`);
    for (const message of messages) {
      logs.push(String(message));
    }
    plugin.app.vault.adapter.write(logFile, logs.join(" "));
  };

  console.debug = logMessages("debug");
  console.error = logMessages("error");
  console.info = logMessages("info");
  console.log = logMessages("log");
  console.warn = logMessages("warn");
}

export default class FullTextSearchPlugin extends Plugin {
	async onload() {
		monkeyPatchConsole(this);

		this.addCommand({
			id: 'anselmwang-test-command',
			name: 'Anselm Wang Test Command',
			icon: 'pencil',
			hotkeys: [{ modifiers: ['Ctrl', 'Shift'], key: '2' }],
			editorCallback: (editor: Editor, view: MarkdownView) => {
				console.log(editor.getCursor());
			}
		});
		console.log("FullTextSearchPlugin load successfully.")

		const idx = lunr(function () {
			this.field('title')
			this.field('body')

			this.add({
				"title": "Twelfth-Night",
				"body": "If music be the food of love, play on: Give me excess of it…",
				"author": "William Shakespeare",
				"id": "1"
			})
		})


		console.log(idx.search("love"));


	}

	onunload() {

	}

}
