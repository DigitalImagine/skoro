// --- 1. ВАШИ ИЗНАЧАЛЬНЫЕ СОЧНЫЕ ЦВЕTA ДЛЯ ЧЕРНОГО ФОНА ---
const darkRules = [
    {
        "scope": "invalid.illegal.trailing-whitespace.skr",
        "settings": {
            "background": "#FF0000",
            "foreground": "#ff3333",
            "fontStyle": "bold strikethrough underline"
        }
    },
    {
        "comment": "Знак @ перед группами: сочный ярко-розовый",
        "scope": ["k.grp.skr", "z.grp.skr"],
        "settings": { "foreground": "#EB608E", "fontStyle": "bold" }
    },
    {
        "comment": "Шаблоны многоразовых ТЕМ внутри @tm и значения свойства obrz: сочный ярко-голубой ЖИРНЫЙ",
        "scope": "obj.tm.skr",
        "settings": { "foreground": "#e0e0e0", "fontStyle": "bold" }
    },
    {
        "comment": "Шаблоны многоразовых ТЕМ внутри @obrz и значения свойства obrz: сочный ярко-голубой ЖИРНЫЙ КУРСИВ",
        "scope": "vdm.obj.tm.skr",
        "settings": { "foreground": "#e0e0e0", "fontStyle": "bold italic" }
    },
    {
        "comment": "ПРОФИЛИ ЖЕЛЕЗА внутри @ustrv (device, DESKTOP): сочный ментолово-бирюзовый",
        "scope": "obj.ustrv.skr",
        "settings": { "foreground": "#4EC9B0", "fontStyle": "bold" }
    },
    {
        "comment": "ПРОФИЛИ ЖЕЛЕЗА внутри @ustrv (device, DESKTOP): сочный ментолово-бирюзовый",
        "scope": "vdm.obj.ustrv.skr",
        "settings": { "foreground": "#4EC9B0", "fontStyle": "bold italic" }
    },
    {
        "comment": "УЗЛЫ И ЭЛЕМЕНТЫ ТОПОЛОГИИ внутри @elmnt: сочный neo-оранжевый макетный",
        "scope": "obj.elmnt.skr",
        "settings": { "foreground": "#B9B9B9", "fontStyle": "bold" }
    },
    {
        "comment": "УЗЛЫ И ЭЛЕМЕНТЫ ТОПОЛОГИИ внутри @elmnt: сочный neo-оранжевый макетный",
        "scope": "vdm.obj.elmnt.skr",
        "settings": { "foreground": "#B9B9B9", "fontStyle": "bold italic" }
    },
    {
        "comment": "Значения уникальных elmnt_k элементов: золотисто-оранжевый ЖИРНЫЙ КУРСИВ",
        "scope": ["obj.elmnt_k.skr"],
        "settings": { "foreground": "#42C76C", "fontStyle": "bold" }
        //"settings": { "foreground": "#42C76C", "fontStyle": "bold" }
    },
    {
        "comment": "Значения уникальных elmnt_k элементов: золотисто-оранжевый ЖИРНЫЙ КУРСИВ",
        "scope": ["vdm.obj.elmnt_k.skr"],
        "settings": { "foreground": "#42C76C", "fontStyle": "bold italic" }
        //"settings": { "foreground": "#42C76C", "fontStyle": "bold italic" }
    },
    {
        "comment": "Шаблоны многоразовых КЛАССОВ внутри @obrz и значения свойства obrz: сочный ярко-голубой ЖИРНЫЙ",
        "scope": "obj.obrz.skr",
        "settings": { "foreground": "#39adec", "fontStyle": "bold" }
    },
    {
        "comment": "Шаблоны многоразовых КЛАССОВ внутри @obrz и значения свойства obrz: сочный ярко-голубой ЖИРНЫЙ КУРСИВ",
        "scope": "vdm.obj.obrz.skr",
        "settings": { "foreground": "#39adec", "fontStyle": "bold italic" }
    },
    {
        "comment": "",
        "scope": "k.sugar_dot.skr",
        "settings": { "foreground": "#e0e0e0", "fontStyle": "bold italic" }
    },
    {
        "comment": "",
        "scope": "vdm.ustrv.srvn.skr",
        "settings": { "foreground": "#e0e0e0", "fontStyle": "bold" }
    },
    {
        "comment": "Встраиваемые статические параметры $: ваш фирменный мягкий зеленый оттенок",
        "scope": "vstvlm.prm.skr",
        "settings": { "foreground": "#55ca72" }
    },
    {
        "comment": "Встраиваемые статические параметры $: ваш фирменный мягкий зеленый оттенок",
        "scope": "vdm.vstvlm.prm.skr",
        "settings": { "foreground": "#55ca72", "fontStyle": "bold italic" }
    },
    {
        "comment": "Указательные рантайм-переменные &: ваш глубокий цвет морской волны",
        "scope": "ukz.prm.skr",
        "settings": { "foreground": "#55b7bc" }
    },
    {
        "comment": "Указательные рантайм-переменные &: ваш глубокий цвет морской волны",
        "scope": "vdm.ukz.prm.skr",
        "settings": { "foreground": "#55b7bc", "fontStyle": "bold italic" }
    },
    {
        "comment": "Константы заглавными буквами (BLOCK, FIXED): темно-синий #define из C++",
        "scope": "pstn.prm.skr",
        "settings": { "foreground": "#1764b5", "fontStyle": "bold" }
    },
    {
        "comment": "Критически важное системное свойство vdm: фирменный сочный пурпурно-фиолетовый",
        "scope": "keyword.vdm.prm.skr",
        "settings": { "foreground": "#C586C0", "fontStyle": "bold" }
    },
    {
        "comment": "Абсолютно все типы свойств на всех уровнях (width:, obrz:, s_cvt:, vdm:): ТВОЙ ЛАВАНДОВЫЙ КУРСИВ",
        "scope": ["k.prm.skr", "sub.k.prm.skr", "strk.prm.skr"],
        "settings": { "foreground": "#B48EAD", "fontStyle": "italic" }
    },
    {
        "comment": "Цвета 0x и числа: стандартный салатовый VS Code",
        "scope": "cvt.prm.skr",
        "settings": { "foreground": "#c7c7c7" }
    },
    {
        "comment": "Цвета 0x и числа: стандартный салатовый VS Code",
        "scope": "chsl.prm.skr",
        "settings": { "foreground": "#B5CEA8", "fontStyle": "normal" }
    },
    {
        "comment": "Строки id и device в кавычках: мягкий песочно-желтый",
        "scope": "str.prm.skr",
        "settings": { "foreground": "#CE9178" }
    },
    {
        "comment": "Фигурные, квадратные и круглые скобки |: контрастный золотистый",
        "scope": ["rzdl_2t.skr", "skb.skr", "skb.grp.skr", "rscht.oprc.skr", "k__s.elmnt.skr"],
        "settings": { "foreground": "#F5A623", "fontStyle": "bold" }
    },
    {
        "comment": "Комментарии //: аккуратный матовый зеленый",
        "scope": "kmntr.skr",
        "settings": { "foreground": "#5C6573" }
    },
    {
        "comment": "Запрет подсветки операторов и фигурных скобок, если они оказались внутри комментариев",
        "scope": ["comment rscht.oprc.skr", "comment.block rscht.oprc.skr"],
        "settings": { "foreground": "#5C6573", "fontStyle": "" }
    },
    {
        "comment": "Принудительный запрет на покраску HEX/символа цвета внутри комментариев",
        "scope": ["comment cvt.prm.skr", "comment.block cvt.prm.skr"],
        "settings": { "foreground": "#5C6573", "fontStyle": "" }
    }
];

// --- 2. КОНТРАСТНЫЕ ЧИТАЕМЫЕ ЦВЕТА ДЛЯ БЕЛОГО ФОНА ---
const lightRules = [
  { "scope": "invalid.illegal.trailing-whitespace.skr", "settings": { "background": "#FFD0D0", "foreground": "#CC0000", "fontStyle": "bold strikethrough underline" } },
  { "scope": ["k.grp.skr", "z.grp.skr"], "settings": { "foreground": "#A31515", "fontStyle": "bold" } },
  { "scope": "obj.tm.skr", "settings": { "foreground": "#222222", "fontStyle": "bold" } }, 
  { "scope": "vdm.obj.tm.skr", "settings": { "foreground": "#222222", "fontStyle": "bold italic" } }, 
  { "scope": "obj.ustrv.skr", "settings": { "foreground": "#005F4B", "fontStyle": "bold" } }, // Глубокий бирюзовый железа
  { "scope": "vdm.obj.ustrv.skr", "settings": { "foreground": "#005F4B", "fontStyle": "bold italic" } },
  { "scope": "obj.elmnt.skr", "settings": { "foreground": "#B15C00", "fontStyle": "bold" } },
  { "scope": "vdm.obj.elmnt.skr", "settings": { "foreground": "#B15C00", "fontStyle": "bold italic" } }, // Добавлен для симметрии с темной темой
  { "scope": "obj.obrz.skr", "settings": { "foreground": "#006699", "fontStyle": "bold" } },
  { "scope": "vdm.obj.obrz.skr", "settings": { "foreground": "#006699", "fontStyle": "bold italic" } },
  { "scope": ["obj.elmnt_k.skr"], "settings": { "foreground": "#3A69B3", "fontStyle": "bold" } },
  { "scope": ["vdm.obj.elmnt_k.skr"], "settings": { "foreground": "#3A69B3", "fontStyle": "bold italic" } },
  { "scope": "vstvlm.prm.skr", "settings": { "foreground": "#1B7A31" } },
  { "scope": "vdm.vstvlm.prm.skr", "settings": { "foreground": "#1B7A31", "fontStyle": "bold italic" } }, // Добавлен для симметрии
  { "scope": "ukz.prm.skr", "settings": { "foreground": "#44494aff" } },
  { "scope": "vdm.ukz.prm.skr", "settings": { "foreground": "#1A6F73", "fontStyle": "bold italic" } }, // Добавлен для симметрии
  { "scope": "pstn.prm.skr", "settings": { "foreground": "#0431FA", "fontStyle": "bold" } },
  { "scope": "keyword.vdm.prm.skr", "settings": { "foreground": "#AF00DB", "fontStyle": "bold" } },
  { "scope": ["k.prm.skr", "sub.k.prm.skr", "strk.prm.skr"], "settings": { "foreground": "#744B70", "fontStyle": "italic" } },
  { "scope": "cvt.prm.skr", "settings": { "foreground": "#444444" } }, 
  { "scope": "chsl.prm.skr", "settings": { "foreground": "#098658" } },
  { "scope": "str.prm.skr", "settings": { "foreground": "#A31515" } },
  { "scope": ["skb.skr", "skb.grp.skr", "rscht.oprc.skr", "k__s.elmnt.skr"], "settings": { "foreground": "#A46600", "fontStyle": "bold" } },
  { "scope": "kmntr.skr", "settings": { "foreground": "#7F7F7F" } },
  { "scope": ["comment rscht.oprc.skr", "comment.block rscht.oprc.skr", "comment cvt.prm.skr", "comment.block cvt.prm.skr"], "settings": { "foreground": "#008000", "fontStyle": "" } },
  { "scope": "k.sugar_dot.skr", "settings": { "foreground": "#444444", "fontStyle": "bold italic" } },
  { "scope": "vdm.ustrv.srvn.skr", "settings": { "foreground": "#7A0060", "fontStyle": "bold" } }
];



module.exports = { 
    darkRules,
    lightRules
};
