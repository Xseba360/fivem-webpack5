const webpack = require('webpack');
const path = require('path');
const fs = require('fs');

function getStat(path) {
	try {
		const stat = fs.statSync(path);

		return stat ? {
			mtime: stat.mtimeMs,
			size: stat.size,
			inode: stat.ino,
			isDirectory: stat.isDirectory()
		} : null;
	} catch {
		return null;
	}
}

class SaveStatePlugin {
	constructor(inp) {
		this.cache = new Map();
		this.cachePath = inp.cachePath;
	}

	apply(compiler) {
		compiler.hooks.afterCompile.tap('SaveStatePlugin', (compilation) => {
			for (const file of compilation.fileDependencies) {
				const stats = getStat(file)
				if (stats && !stats.isDirectory) {
					this.cache.set(file, {
						name: file,
						stats: {
							mtime: stats.mtime,
							size: stats.size,
							inode: stats.inode
						}
					});
				}
			}
		});

		compiler.hooks.done.tap('SaveStatePlugin', (stats) => {
			if (stats.hasErrors()) {
				return;
			}

			fs.writeFile(this.cachePath, JSON.stringify(Array.from(this.cache.values()).sort((a, b) => {
					if (a.name < b.name) {
						return -1;
					}
					if (a.name > b.name) {
						return 1;
					}
					return 0;
				})), () => {

			});
		});
	}
}

module.exports = (inp, callback) => {
	const config = require(inp.configPath);
	
	config.context = inp.resourcePath;
	
	if (config.output && config.output.path) {
		config.output.path = path.resolve(inp.resourcePath, config.output.path);
	}

	if (!config.plugins) {
		config.plugins = [];
	}

	config.plugins.push(new SaveStatePlugin(inp));
	
	webpack(config, (err, stats) => {
		if (err) {
			callback(err);
			return;
		}
		
		if (stats.hasErrors()) {
			callback(null, stats.toJson());
			return;
		}
		
		callback(null, {});
	});
};