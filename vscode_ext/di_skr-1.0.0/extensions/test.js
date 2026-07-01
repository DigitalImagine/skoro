// node /PRT/R/digitalimagine/I/SKORO/1710979200000/vscode_ext/di_skr-1.0.0/extensions/test.js /PRT/R/digitalimagine/I/SKORO/1710979200000/SKORO__SKR.skr

const
	fs = require("fs")
	,path = require("path")
	,render = require("./render") // Парсер стерт из импортов нахуй
	,{ darkRules, lightRules } = require("./themes")
;
const file = process.argv[2] || "example.skr";
const srcPath = path.isAbsolute(file) ? file : path.join(__dirname, file);

// Читаем чистый исходный текст (строку)
const src = fs.readFileSync(srcPath, "utf8");

const
	dPath = path.join("/PRT/R/digitalimagine/K/x86_64/SKORO/1710979200000/TEST/out-dark.html")
	,lPath = path.join("/PRT/R/digitalimagine/K/x86_64/SKORO/1710979200000/TEST/out-light.html")
;

// Передаем напрямую сырую строку src вместо ублюдских tokens
fs.writeFileSync(dPath, render(src, darkRules, true));
fs.writeFileSync(lPath, render(src, lightRules, false));

console.log(`generated:\n\x1b[36m${dPath}\x1b[0m\n\x1b[36m${lPath}\x1b[0m`);
