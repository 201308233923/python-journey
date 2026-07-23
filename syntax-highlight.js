// 一个简化版的Python语法高亮：只处理这个网站实际会出现的语法子集
// （字符串/f-string、注释、数字、关键字、常见内置函数名），不追求覆盖
// Python全部语法——课程里的代码都是教学用的短例子，没有复杂到需要一个
// 完整的词法分析器。
//
// 用正则做单遍扫描，按"字符串 > 注释 > 数字 > 标识符"这个顺序尝试匹配
// （字符串必须比注释先试，不然字符串里出现的#会被误判成注释开头）；
// 都不匹配的字符（括号、运算符、空格、换行）原样输出，不上色。
//
// 关键的正确性要求：把highlightPython()返回的HTML里所有<span>标签去掉、
// 再把HTML转义字符换回来，必须能精确复原出原始的code字符串——因为这只是
// 叠在真正的<textarea>后面的一层"背景装饰"，源数据(textarea.value)完全
// 不受影响，但装饰层如果漏字/多字，看起来就会跟真实代码对不上，等于
// 帮倒忙。scripts/verify.mjs里有专门校验这条不变量的测试。

const PY_KEYWORDS = new Set([
  "False", "None", "True", "and", "as", "assert", "async", "await", "break",
  "class", "continue", "def", "del", "elif", "else", "except", "finally",
  "for", "from", "global", "if", "import", "in", "is", "lambda", "nonlocal",
  "not", "or", "pass", "raise", "return", "try", "while", "with", "yield",
]);

const PY_BUILTINS = new Set([
  "print", "input", "len", "range", "int", "str", "float", "bool", "list",
  "dict", "set", "tuple", "sum", "max", "min", "abs", "sorted", "reversed",
  "enumerate", "zip", "type", "isinstance", "open", "round", "map", "filter",
  "any", "all", "ord", "chr", "self",
]);

function escapeHtmlForHighlight(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// 字符串token涵盖：可选的f/F/r/R前缀（包括fr/rf组合）+ 三引号或单/双引号，
// 三引号允许跨行（[\s\S]*?非贪婪），单/双引号版本不允许裸换行（一行内没闭合
// 引号就不当字符串处理，避免忘记闭合引号时把后面一大段代码都吞掉染色）。
const STRING_RE =
  /(?:f|F|r|R|rf|fr|Rf|fR|FR|RF)?(?:"""[\s\S]*?"""|'''[\s\S]*?'''|"(?:[^"\\\n]|\\.)*"|'(?:[^'\\\n]|\\.)*')/;

const TOKEN_RE = new RegExp(
  `(#[^\\n]*)|(${STRING_RE.source})|(\\b\\d+\\.?\\d*\\b)|([A-Za-z_][A-Za-z0-9_]*)`,
  "g"
);

function highlightPython(code) {
  let html = "";
  let lastIndex = 0;
  let match;
  TOKEN_RE.lastIndex = 0;
  while ((match = TOKEN_RE.exec(code)) !== null) {
    if (match.index > lastIndex) {
      html += escapeHtmlForHighlight(code.slice(lastIndex, match.index));
    }
    const comment = match[1];
    const str = match[2];
    const num = match[3];
    const word = match[4];
    if (comment) {
      html += `<span class="tok-comment">${escapeHtmlForHighlight(comment)}</span>`;
    } else if (str) {
      html += `<span class="tok-string">${escapeHtmlForHighlight(str)}</span>`;
    } else if (num) {
      html += `<span class="tok-number">${escapeHtmlForHighlight(num)}</span>`;
    } else if (word) {
      if (PY_KEYWORDS.has(word)) {
        html += `<span class="tok-keyword">${escapeHtmlForHighlight(word)}</span>`;
      } else if (PY_BUILTINS.has(word)) {
        html += `<span class="tok-builtin">${escapeHtmlForHighlight(word)}</span>`;
      } else {
        html += escapeHtmlForHighlight(word);
      }
    }
    lastIndex = TOKEN_RE.lastIndex;
  }
  if (lastIndex < code.length) {
    html += escapeHtmlForHighlight(code.slice(lastIndex));
  }
  return html;
}
