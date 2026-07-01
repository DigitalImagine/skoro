const err = txt => `<span class="invalid_illegal_skr">${txt}</span>`;
const spaceErr = txt => `<span class="invalid_illegal_trailing-whitespace_skr">${txt}</span>`;

function getCss(rules, dark) {
	if (!rules || !Array.isArray(rules)) return '';
	let res = `body{background-color:${dark?'#1e1e1e':'#ffffff'};font-family:'Courier New',monospace;font-size:14px;line-height:1.5;padding:20px;margin:0;}pre{margin:0;white-space:pre-wrap;word-wrap:break-word;tab-size: 4;-moz-tab-size: 4;}.sys_prm_skr{font-weight:bold;}
.color_preview_skr { display:inline-block; width: 12px; height: 12px; margin-right: 5px; border: 1px solid #7F7F7F; vertical-align: middle; margin-bottom: 4px; border-radius: 4px; box-shadow: 0 0 2px rgba(0, 0, 0, 0.2); }\n`;
	rules.forEach(r => {
		if (!r || !r.scope) return;
		(Array.isArray(r.scope) ? r.scope : [r.scope]).forEach(s => {
			if (!s) return;
			let c = s.replace(/[\s\.]+/g, '_'), st = '';
			if (r.settings.foreground) st += `color:${r.settings.foreground};`;
			if (r.settings.background) st += `background-color:${r.settings.background};`;
			if (r.settings.fontStyle) {
				let f = r.settings.fontStyle.toLowerCase();
				st += `font-weight:${f.includes('bold')?'bold':'normal'};`;
				if (f.includes('italic')) st += 'font-style:italic;';
				if (f.includes('underline') || f.includes('strikethrough')) st += `text-decoration:${f.includes('underline')?'underline':''} ${f.includes('strikethrough')?'line-through':''};`;
			}
			if (st) res += `.${c}{${st}}\n`;
		});
	});
	return res;
}

const findEnd = (txt, start) => {
	let count = 1, i = start;
	while (i < txt.length && count > 0) {
		if (txt[i] === '{') count++; else if (txt[i] === '}') count--;
		if (count === 0) return i;
		i++;
	}
	return txt.length;
};

// Функция-помощник для покраски конструкций вида @space.значение (они общие для всех блоков)
function renderSpaceDotValue(space, value) {
	let valClass = "pstn_prm_skr";
	const spl = space.toLowerCase();
	if (spl === "prm") valClass = "vdm_vstvlm_prm_skr";
	else if (spl === "tm") valClass = "vdm_obj_tm_skr";
	else if (spl === "ustrv") valClass = "vdm_obj_ustrv_skr";
	else if (spl === "obrz") valClass = "vdm_obj_obrz_skr";
	else if (spl === "elmnt") valClass = "vdm_obj_elmnt_k_skr";

	return `<span class="k_grp_skr">@</span>` +
	       `<span class="z_grp_skr">${space}</span>` +
	       `<span class="rscht_oprc_skr">.</span>` +
	       `<span class="${valClass}">${value}</span>`;
}

// РЕГУЛЯРКА ДЛЯ ПОДВЕТКИ СИНТАКСИСА (Общая схема групп)
// m[1]-Комменты, m[2]-Строки, m[3]+m[4]+m[5]-@space.значение, m[6]-Числа, m[7]-Вставляемые, m[8]-Чистые свойства, m[9]-Хэш-цвет, m[10]-Пробелы, m[11]-Операторы
const rxSyntax = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("[^"\\]*(?:\\.[^"\\]*)*")|(@)(prm|tm|ustrv|obrz|elmnt)\.([\$&]?[a-zA-Z0-9_а-яА-ЯёЁ_]+)|(0x[0-9a-fA-F]+\b|\b\d+(?:\.\d+)?\b)|([\$&][a-zA-Z0-9_а-яА-ЯёЁ_]+)|([a-zA-Z_а-яА-ЯёЁ][a-zA-Z0-9_а-яА-ЯёЁ_]*)|(#[0-9a-fA-F]{6,8}\b)|([ \t]+(?=\r?\n))|(>=|<=|==|!=|\?|[><!:{}[\]()|%,\.+\-\*\/])/g;

// ГЛАВНАЯ ФУНКЦИЯ RENDER
module.exports = function(src, themeRules, isDark) {
	if (!src) return "";

	let htmlContent = "", last = 0, m;

	// УРОВЕНЬ 1: РЕГУЛЯРКА ИСКЛЮЧИТЕЛЬНО ДЛЯ ТВОИХ ГРУПП ВЕРХНЕГО УРОВНЯ
	const rxGroups = /@(prm|tm|ustrv|obrz|elmnt)\s*\{/gi;

	while ((m = rxGroups.exec(src)) !== null) {
		// Код вне групп (outside)
		if (m.index > last) {
			let outsideCode = src.substring(last, m.index);
			let result = "", lastIdx = 0, match;
			rxSyntax.lastIndex = 0;
			while ((match = rxSyntax.exec(outsideCode)) !== null) {
				if (match.index > lastIdx) result += outsideCode.substring(lastIdx, match.index).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
				switch (true) {
					case !!match[1]: result += `<span class="kmntr_skr">${match[1].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</span>`; break;
					case !!match[2]: result += `<span class="str_prm_skr">${match[2].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</span>`; break;
					case (!!match[3] && !!match[4] && !!match[5]): result += renderSpaceDotValue(match[4], match[5]); break;
					case !!match[6]: result += `<span class="chsl_prm_skr">${match[6]}</span>`; break;
					case !!match[7]: result += `<span class="vstvlm_prm_skr">${match[7]}</span>`; break;
					case !!match[8]: result += `<span class="pstn_prm_skr">${match[8]}</span>`; break;
					case !!match[9]: result += `<span class="color_preview_skr" style="background-color: ${match[9]};"></span><span class="cvt_prm_skr">${match[9]}</span>`; break;
					case !!match[10]: result += spaceErr(match[10]); break;
					case !!match[11]: result += match[11] === ':' ? `<span class="rscht_oprc_skr">:</span>` : ('{}[]()'.includes(match[11]) ? `<span class="skb_skr">${match[11]}</span>` : `<span class="rscht_oprc_skr">${match[11]}</span>`); break;
				}
				lastIdx = rxSyntax.lastIndex;
			}
			if (lastIdx < outsideCode.length) result += outsideCode.substring(lastIdx).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
			htmlContent += result;
		}

		const groupName = m[1].toLowerCase(); 
		const start = rxGroups.lastIndex;
		const end = findEnd(src, start);
		const rawInner = src.substring(start, end);

		// Заголовок группы верхнего уровня
		htmlContent += `<span class="sys_prm_skr"><span class="k_grp_skr">@</span><span class="z_grp_skr">${m[1]}</span></span> <span class="skb_skr">{</span>`;
		htmlContent += `<span class="space_block_${groupName}">`;

		// УРОВЕНЬ 2: ЧЕСТНЫЙ ИЗОЛИРОВАННЫЙ SWITCH ДЛЯ КАЖДОГО ТИПА БЛОКА ГРУППЫ
		let blockResult = "", lastBlockIdx = 0, bMatch;
		rxSyntax.lastIndex = 0;

		switch (groupName) {
			// ==========================================
			// ЛОКАЛЬНЫЙ SWITCH ДЛЯ БЛОКА @prm
			// ==========================================
			case "prm":
				let isAfterColon = false; // Флаг отслеживания двоеточия
				while ((bMatch = rxSyntax.exec(rawInner)) !== null) {
					if (bMatch.index > lastBlockIdx) {
						let skippedText = rawInner.substring(lastBlockIdx, bMatch.index);
						
						// ХАРДКОРНЫЙ ФИКС: Если между токенами был перенос строки (\n), гасим флаг констант!
						if (skippedText.includes('\n')) {
							isAfterColon = false;
						}
						
						blockResult += skippedText.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
					}

					switch (true) {
						case !!bMatch[1]: blockResult += `<span class="kmntr_skr">${bMatch[1].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</span>`; isAfterColon = false; break;
						case !!bMatch[2]: blockResult += `<span class="str_prm_skr">${bMatch[2].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</span>`; isAfterColon = false; break;
						case (!!bMatch[3] && !!bMatch[4] && !!bMatch[5]): blockResult += renderSpaceDotValue(bMatch[4], bMatch[5]); isAfterColon = false; break;
						case !!bMatch[6]: blockResult += `<span class="chsl_prm_skr">${bMatch[6]}</span>`; isAfterColon = false; break;
						case !!bMatch[7]: blockResult += `<span class="vstvlm_prm_skr">${bMatch[7]}</span>`; isAfterColon = false; break;
						
						case !!bMatch[8]: // Чистые свойства / буквы
							// Если мы справа от двоеточия НА ТОЙ ЖЕ СТРОКЕ — это константа (pstn), иначе — имя свойства (k_prm_skr)
							if (isAfterColon) {
								blockResult += `<span class="pstn_prm_skr">${bMatch[8]}</span>`;
							} else {
								blockResult += `<span class="k_prm_skr">${bMatch[8]}</span>`;
							}
							break;
							
						case !!bMatch[9]: blockResult += `<span class="color_preview_skr" style="background-color: ${bMatch[9]};"></span><span class="cvt_prm_skr">${bMatch[9]}</span>`; isAfterColon = false; break;
						case !!bMatch[10]: blockResult += spaceErr(bMatch[10]); break;
						case !!bMatch[11]: 
							if (bMatch[11] === ':') {
								blockResult += `<span class="rscht_oprc_skr">:</span>`;
								isAfterColon = true; // Взвели флаг — дальше ждем константу
							} else {
								blockResult += ('{}[]()'.includes(bMatch[11]) ? `<span class="skb_skr">${bMatch[11]}</span>` : `<span class="rscht_oprc_skr">${bMatch[11]}</span>`);
								// Операторы вектора и разделители элементов не сбрасывают ожидание значений
								if (bMatch[11] !== ',' && bMatch[11] !== '[' && bMatch[11] !== ']') isAfterColon = false;
							}
							break;
					}
					lastBlockIdx = rxSyntax.lastIndex;
				}
				break;



			// ==========================================
			// ЛОКАЛЬНЫЙ SWITCH ДЛЯ БЛОКА @tm
			// ==========================================
			case "tm":
				while ((bMatch = rxSyntax.exec(rawInner)) !== null) {
					if (bMatch.index > lastBlockIdx) blockResult += rawInner.substring(lastBlockIdx, bMatch.index).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
					switch (true) {
						case !!bMatch[1]: blockResult += `<span class="kmntr_skr">${bMatch[1].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</span>`; break;
						case !!bMatch[2]: blockResult += `<span class="str_prm_skr">${bMatch[2].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</span>`; break;
						case (!!bMatch[3] && !!bMatch[4] && !!bMatch[5]): blockResult += renderSpaceDotValue(bMatch[4], bMatch[5]); break;
						case !!bMatch[6]: blockResult += `<span class="chsl_prm_skr">${bMatch[6]}</span>`; break;
						case !!bMatch[7]: blockResult += `<span class="vstvlm_prm_skr">${bMatch[7]}</span>`; break;
						case !!bMatch[8]: blockResult += `<span class="vdm_obj_tm_skr">${bMatch[8]}</span>`; break; // Чистые свойства внутри tm всегда темы!
						case !!bMatch[9]: blockResult += `<span class="color_preview_skr" style="background-color: ${bMatch[9]};"></span><span class="cvt_prm_skr">${bMatch[9]}</span>`; break;
						case !!bMatch[10]: blockResult += spaceErr(bMatch[10]); break;
						case !!bMatch[11]: blockResult += bMatch[11] === ':' ? `<span class="rscht_oprc_skr">:</span>` : ('{}[]()'.includes(bMatch[11]) ? `<span class="skb_skr">${bMatch[11]}</span>` : `<span class="rscht_oprc_skr">${bMatch[11]}</span>`); break;
					}
					lastBlockIdx = rxSyntax.lastIndex;
				}
				break;

			// ==========================================
			// ЛОКАЛЬНЫЙ SWITCH ДЛЯ БЛОКА @ustrv
			// ==========================================
						// ==========================================
			// ЛОКАЛЬНЫЙ SWITCH ДЛЯ БЛОКА @ustrv
			// ==========================================
			case "ustrv":
				// Локальный монолит синтаксиса для устройств:
				// m[1]-Комменты, m[2]-Строки, m[3]+m[4]+m[5]-Конструкции @space.значение, 
				// m[6]-Переменные $, m[7]-Числа, m[8]-Чистые свойства и варианты (vrnt_1, rzm_h), m[9]-Пробелы, m[10]-Операторы
				const rxUstrvSyntax = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("[^"\\]*(?:\\.[^"\\]*)*")|(@)(prm|tm|ustrv|obrz|elmnt)\.([\$&]?[a-zA-Z0-9_а-яА-ЯёЁ_]+)|(0x[0-9a-fA-F]+\b|\b\d+(?:\.\d+)?\b)|([\$&][a-zA-Z0-9_а-яА-ЯёЁ_]+)|([a-zA-Z_а-яА-ЯёЁ][a-zA-Z0-9_а-яА-ЯёЁ_]*)|([ \t]+(?=\r?\n))|(>=|<=|==|!=|\?|[><!:{}[\]()|%,\.+\-\*\/])/g;

				let ustrvAfterColon = false; // Режим значения справа от двоеточия
				let ustrvInsideVariantParens = false; // Режим нахождения внутри круглых скобок варианта варианта
				
				rxUstrvSyntax.lastIndex = 0; // Сброс индекса перед проходом блока

				while ((bMatch = rxUstrvSyntax.exec(rawInner)) !== null) {
					if (bMatch.index > lastBlockIdx) {
						let skippedText = rawInner.substring(lastBlockIdx, bMatch.index);
						
						// Если перешли на новую строку — сбрасываем состояние двоеточия
						if (skippedText.includes('\n')) {
							ustrvAfterColon = false;
						}
						
						blockResult += skippedText.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
					}

					switch (true) {
						case !!bMatch[1]: // Комментарий
							blockResult += `<span class="kmntr_skr">${bMatch[1].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</span>`;
							break;

						case !!bMatch[2]: // Строка
							blockResult += `<span class="str_prm_skr">${bMatch[2].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</span>`;
							break;

						case (!!bMatch[3] && !!bMatch[4] && !!bMatch[5]): // Конструкции @space.значение
							let dotValClass = getSpaceClass(bMatch[4].toLowerCase());
							blockResult += `<span class="k_grp_skr">${bMatch[3]}</span>` +
							               `<span class="z_grp_skr">${bMatch[4]}</span>` +
							               `<span class="rscht_oprc_skr">.</span>` +
							               `<span class="${dotValClass}">${bMatch[5]}</span>`;
							break;

						case !!bMatch[6]: // Числа (включая условия сравнения вроде 100 или 80)
							blockResult += `<span class="chsl_prm_skr">${bMatch[6]}</span>`;
							break;

						case !!bMatch[7]: // Динамические переменные ($prm_8)
							blockResult += `<span class="vstvlm_prm_skr">${bMatch[7]}</span>`;
							break;

						case !!bMatch[8]: // ИДЕНТИФИКАТОРЫ И ВАРИАНТЫ УСТРОЙСТВ
							const ustrvText = bMatch[8];
							
							// Если мы за двоеточием — это значение свойства
							if (ustrvAfterColon) {
								blockResult += `<span class="pstn_prm_skr">${ustrvText}</span>`;
							} 
							// Если мы находимся ДО круглых скобок на уровне блока — это имя варианта (например, vrnt_1)
							else if (!ustrvInsideVariantParens) {
								blockResult += `<span class="vdm_obj_ustrv_skr">${ustrvText}</span>`; // Железобетонный цвет устройства!
							} 
							// Если внутри круглых скобок, но до двоеточия — это имя свойства (например, okn_rzm_h)
							else {
								blockResult += `<span class="k_prm_skr">${ustrvText}</span>`;
							}
							break;

						case !!bMatch[9]: // Лишние пробелы в конце строк
							blockResult += spaceErr(bMatch[9]);
							break;

						case !!bMatch[10]: // Операторы, знаки сравнения, скобки и двоеточия
							const op = bMatch[10];
							
							if (op === ':') {
								blockResult += `<span class="rscht_oprc_skr">:</span>`;
								ustrvAfterColon = true; // Ждем значение свойства
							} else if (op === '(') {
								blockResult += `<span class="skb_skr">(</span>`;
								ustrvInsideVariantParens = true; // Зашли внутрь параметров варианта устройства
								ustrvAfterColon = false;
							} else if (op === ')') {
								blockResult += `<span class="skb_skr">)</span>`;
								ustrvInsideVariantParens = false; // Вышли из параметров варианта устройства
								ustrvAfterColon = false;
							} else if ('{}[]'.includes(op)) {
								blockResult += `<span class="skb_skr">${op}</span>`;
								if (op !== '[' && op !== ']') ustrvAfterColon = false;
							} else {
								blockResult += `<span class="vdm_ustrv_srvn_skr">${op}</span>`; // Подсветка знаков сравнения ?>, ?==
								if (op !== ',' && op !== '?' && op !== '>' && op !== '<' && op !== '=') ustrvAfterColon = false;
							}
							break;
					}
					lastBlockIdx = rxUstrvSyntax.lastIndex;
				}
				break;



			// ==========================================
			// ЛОКАЛЬНЫЙ SWITCH ДЛЯ БЛОКА @obrz
			// ==========================================
			case "obrz":
				// СВОЯ ЛОКАЛЬНАЯ РЕГУЛЯРКА СИНТАКСИСА ДЛЯ ОБРАЗОВ
				const rxObrzSyntax = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("[^"\\]*(?:\\.[^"\\]*)*")|(@)(prm|tm|ustrv|obrz|elmnt)\.([\$&]?[a-zA-Z0-9_а-яА-ЯёЁ_]+)|([a-zA-Z_а-яА-ЯёЁ][a-zA-Z0-9_а-яА-ЯёЁ_]*)(?=\s*\()|(0x[0-9a-fA-F]+\b|\b\d+(?:\.\d+)?\b)|([\$&][a-zA-Z0-9_а-яА-ЯёЁ_]+)|([a-zA-Z_а-яА-ЯёЁ][a-zA-Z0-9_а-яА-ЯёЁ_]*)|(#[0-9a-fA-F]{6,8}\b)|([ \t]+(?=\r?\n))|(>=|<=|==|!=|\?|[><!:{}[\]()|%,\.+\-\*\/])/g;

				let obrzAfterColon = false;
				rxObrzSyntax.lastIndex = 0; 

				while ((bMatch = rxObrzSyntax.exec(rawInner)) !== null) {
					if (bMatch.index > lastBlockIdx) {
						let skippedText = rawInner.substring(lastBlockIdx, bMatch.index);
						if (skippedText.includes('\n')) obrzAfterColon = false;
						blockResult += skippedText.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
					}

					switch (true) {
						case !!bMatch[1]: blockResult += `<span class="kmntr_skr">${bMatch[1].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</span>`; obrzAfterColon = false; break;
						case !!bMatch[2]: blockResult += `<span class="str_prm_skr">${bMatch[2].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</span>`; obrzAfterColon = false; break;
						case (!!bMatch[3] && !!bMatch[4] && !!bMatch[5]): blockResult += renderSpaceDotValue(bMatch[4], bMatch[5]); obrzAfterColon = false; break;
						
						case !!bMatch[6]: // Коды образов перед скобкой (например main_viewport3)
							blockResult += `<span class="vdm_obj_obrz_skr">${bMatch[6]}</span>`;
							break;

						case !!bMatch[7]: blockResult += `<span class="chsl_prm_skr">${bMatch[7]}</span>`; obrzAfterColon = false; break;
						case !!bMatch[8]: blockResult += `<span class="vstvlm_prm_skr">${bMatch[8]}</span>`; obrzAfterColon = false; break;
						
						case !!bMatch[9]: // Чистые свойства, константы и коды без скобок
							const obrzWord = bMatch[9];
							
							// ФИКС: Если слово написано КАПСОМ (только заглавные, цифры и подчёркивания) — это ВСЕГДА pstn!
							if (/^[A-Z0-9_]+$/.test(obrzWord)) {
								blockResult += `<span class="pstn_prm_skr">${obrzWord}</span>`;
							} else if (obrzAfterColon) {
								blockResult += `<span class="vdm_obj_obrz_skr">${obrzWord}</span>`;
							} else {
								blockResult += `<span class="k_prm_skr">${obrzWord}</span>`;
							}
							break;
							
						case !!bMatch[10]: blockResult += `<span class="color_preview_skr" style="background-color: ${bMatch[10]};"></span><span class="cvt_prm_skr">${bMatch[10]}</span>`; obrzAfterColon = false; break;
						case !!bMatch[11]: blockResult += spaceErr(bMatch[11]); break;
						case !!bMatch[12]: 
							if (bMatch[12] === ':') { 
								blockResult += `<span class="rscht_oprc_skr">:</span>`; 
								obrzAfterColon = true; 
							} else { 
								blockResult += ('{}[]()'.includes(bMatch[12]) ? `<span class="skb_skr">${bMatch[12]}</span>` : `<span class="rscht_oprc_skr">${bMatch[12]}</span>`); 
								if (bMatch[12] !== ',' && bMatch[12] !== '[' && bMatch[12] !== ']' && bMatch[12] !== '|' && bMatch[12] !== '(' && bMatch[12] !== ')') obrzAfterColon = false; 
							}
							break;
					}
					lastBlockIdx = rxObrzSyntax.lastIndex;
				}
				break;

			// ==========================================
			// ЛОКАЛЬНЫЙ SWITCH ДЛЯ БЛОКА @elmnt
			// ==========================================
						// ==========================================
			// ЛОКАЛЬНЫЙ SWITCH ДЛЯ БЛОКА @elmnt
			// ==========================================
			case "elmnt":
				// СВОЯ ЛОКАЛЬНАЯ РЕГУЛЯРКА СИНТАКСИСА ДЛЯ ЭЛЕМЕНТОВ
				// bMatch[1]-Комменты, bMatch[2]-Строки, bMatch[3]+bMatch[4]+bMatch[5]-@space.значение
				// bMatch[6]+bMatch[7]+bMatch[8]-СУПЕР-КОНСТРУКЦИЯ ТИП:КОД перед скобкой! (bMatch[6] - тип, bMatch[7] - двоеточие, bMatch[8] - код элемента)
				// bMatch[9]-Коды элементов без префикса типа (например elmnt_svz_1 перед скобкой)
				// bMatch[10]-Числа, bMatch[11]-Переменные $, bMatch[12]-Чистые свойства/буквы, bMatch[13]-Цвета, bMatch[14]-Пробелы, bMatch[15]-Операторы
				const rxElmntSyntax = /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("[^"\\]*(?:\\.[^"\\]*)*")|(@)(prm|tm|ustrv|obrz|elmnt)\.([\$&]?[a-zA-Z0-9_а-яА-ЯёЁ_]+)|([a-zA-Z_а-яА-ЯёЁ][a-zA-Z0-9_а-яА-ЯёЁ_]*)(:)([a-zA-Z_а-яА-ЯёЁ][a-zA-Z0-9_а-яА-ЯёЁ_]*)(?=\s*\()|([a-zA-Z_а-яА-ЯёЁ][a-zA-Z0-9_а-яА-ЯёЁ_]*)(?=\s*\()|(0x[0-9a-fA-F]+\b|\b\d+(?:\.\d+)?\b)|([\$&][a-zA-Z0-9_а-яА-ЯёЁ_]+)|(\.?[a-zA-Z_а-яА-ЯёЁ][a-zA-Z0-9_а-яА-ЯёЁ_]*)|(#[0-9a-fA-F]{6,8}\b)|([ \t]+(?=\r?\n))|(>=|<=|==|!=|\?|[><!:{}[\]()|%,\.+\-\*\/])/g;

				let k_prm_skr;
				let elmntAfterColon = false;
				rxElmntSyntax.lastIndex = 0; // Сброс индекса локальной регулярки

				while ((bMatch = rxElmntSyntax.exec(rawInner)) !== null) {
					if (bMatch.index > lastBlockIdx) {
						let skippedText = rawInner.substring(lastBlockIdx, bMatch.index);
						if (skippedText.includes('\n')) elmntAfterColon = false;
						blockResult += skippedText.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
					}

					switch (true) {
						case !!bMatch[1]: blockResult += `<span class="kmntr_skr">${bMatch[1].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</span>`; elmntAfterColon = false; break;
						case !!bMatch[2]: blockResult += `<span class="str_prm_skr">${bMatch[2].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</span>`; elmntAfterColon = false; break;
						case (!!bMatch[3] && !!bMatch[4] && !!bMatch[5]): blockResult += renderSpaceDotValue(bMatch[4], bMatch[5]); elmntAfterColon = false; break;
						
						case (!!bMatch[6] && !!bMatch[7] && !!bMatch[8]): // ХАРДКОРНЫЙ ФИКС: Конструкция krb:elmnt_svz_1 перед скобкой!
							blockResult += `<span class="obj_elmnt_skr">${bMatch[6]}</span>` + // krb (тип/префикс)
							               `<span class="rscht_oprc_skr">${bMatch[7]}</span>` + // двоеточие :
							               `<span class="obj_elmnt_k_skr">${bMatch[8]}</span>`; // elmnt_svz_1 (код элемента)
							break;

						case !!bMatch[9]: // Одиночный код элемента перед скобкой (без двоеточия типа)
							blockResult += `<span class="obj_elmnt_skr">${bMatch[9]}</span>`;
							break;

						case !!bMatch[10]: blockResult += `<span class="chsl_prm_skr">${bMatch[10]}</span>`; elmntAfterColon = false; break;
						case !!bMatch[11]: blockResult += `<span class="vstvlm_prm_skr">${bMatch[11]}</span>`; elmntAfterColon = false; break;
						
						case !!bMatch[12]: // Чистые свойства, константы и коды справа от обычных двоеточий
							const elmntWord = bMatch[12];
							
							if (/^[A-Z0-9_]+$/.test(elmntWord)) {
								// Капсовые константы
								blockResult += `<span class="pstn_prm_skr">${elmntWord}</span>`;
							} else if (elmntAfterColon) {
								// Если просто значение после двоеточия свойства (не перед скобкой)
								if (k_prm_skr.startsWith("elmnt_obrz")) {
									blockResult += `<span class="vdm_obj_obrz_skr">${elmntWord}</span>`;
								} else {
									blockResult += `<span class="vdm_obj_elmnt_k_skr">${elmntWord}</span>`;
								}
							} else if (elmntWord[0x0] === '.') {
								// Свойство через точку
								blockResult += `<span class="vdm_obj_elmnt_k_skr">${elmntWord}</span>`;
							} else {
								// Обычное свойство
								k_prm_skr = elmntWord;
								blockResult += `<span class="k_prm_skr">${elmntWord}</span>`;
							}
							break;
							
						case !!bMatch[13]: blockResult += `<span class="color_preview_skr" style="background-color: ${bMatch[13]};"></span><span class="cvt_prm_skr">${bMatch[13]}</span>`; elmntAfterColon = false; break;
						case !!bMatch[14]: blockResult += spaceErr(bMatch[14]); break;
						case !!bMatch[15]: 
							if (bMatch[15] === ':') { 
								blockResult += `<span class="rscht_oprc_skr">:</span>`; 
								elmntAfterColon = true; 
							} else { 
								blockResult += ('{}[]()'.includes(bMatch[15]) ? `<span class="skb_skr">${bMatch[15]}</span>` : `<span class="rscht_oprc_skr">${bMatch[15]}</span>`); 
								if (bMatch[15] !== ',' && bMatch[15] !== '[' && bMatch[15] !== ']' && bMatch[15] !== '|' && bMatch[15] !== '(' && bMatch[15] !== ')') elmntAfterColon = false; 
							}
							break;
					}
					lastBlockIdx = rxElmntSyntax.lastIndex;
				}
				break;

		}

		if (lastBlockIdx < rawInner.length) blockResult += rawInner.substring(lastBlockIdx).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
		htmlContent += blockResult;

		htmlContent += `</span><span class="skb_skr">}</span>`;
		
		rxGroups.lastIndex = end + 1; 
		last = rxGroups.lastIndex; 
	}
	
	// ====================================================================
	// КУСОК 3: Хвост файла за пределами последней закрытой группы
	// ====================================================================
	if (last < src.length) {
		let tailCode = src.substring(last);
		let result = "", lastIdx = 0, match;
		rxSyntax.lastIndex = 0;
		while ((match = rxSyntax.exec(tailCode)) !== null) {
			if (match.index > lastIdx) result += tailCode.substring(lastIdx, match.index).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
			switch (true) {
				case !!match[1]: result += `<span class="kmntr_skr">${match[1].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</span>`; break;
				case !!match[2]: result += `<span class="str_prm_skr">${match[2].replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")}</span>`; break;
				case (!!match[3] && !!match[4] && !!match[5]): result += renderSpaceDotValue(match[4], match[5]); break;
				case !!match[6]: result += `<span class="chsl_prm_skr">${match[6]}</span>`; break;
				case !!match[7]: result += `<span class="vstvlm_prm_skr">${match[7]}</span>`; break;
				case !!match[8]: result += `<span class="pstn_prm_skr">${match[8]}</span>`; break;
				case !!match[9]: result += `<span class="color_preview_skr" style="background-color: ${match[9]};"></span><span class="cvt_prm_skr">${match[9]}</span>`; break;
				case !!match[10]: result += spaceErr(match[10]); break;
				case !!match[11]: result += match[11] === ':' ? `<span class="rscht_oprc_skr">:</span>` : ('{}[]()'.includes(match[11]) ? `<span class="skb_skr">${match[11]}</span>` : `<span class="rscht_oprc_skr">${match[11]}</span>`); break;
			}
			lastIdx = rxSyntax.lastIndex;
		}
		if (lastIdx < tailCode.length) result += tailCode.substring(lastIdx).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
		htmlContent += result;
	}

	return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
${getCss(themeRules, isDark)}
</style>
</head>
<body>
<pre>${htmlContent}</pre>
</body>
</html>`;
};
