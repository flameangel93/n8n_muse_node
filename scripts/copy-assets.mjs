import fs from 'node:fs';
import path from 'node:path';

function copyAssets(srcDir, destDir) {
	if (!fs.existsSync(srcDir)) return;
	for (const entry of fs.readdirSync(srcDir, { withFileTypes: true })) {
		const srcPath = path.join(srcDir, entry.name);
		const destPath = path.join(destDir, entry.name);
		if (entry.isDirectory()) {
			copyAssets(srcPath, destPath);
		} else if (/\.(svg|png|json)$/i.test(entry.name)) {
			fs.mkdirSync(path.dirname(destPath), { recursive: true });
			fs.copyFileSync(srcPath, destPath);
		}
	}
}

copyAssets('nodes', path.join('dist', 'nodes'));
copyAssets('credentials', path.join('dist', 'credentials'));
