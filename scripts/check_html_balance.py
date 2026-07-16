#!/usr/bin/env python3
# 简单的HTML标签闭合校验：不是真的HTML解析器，只是数常见标签的开始/结束数量
# 是否配对。够用来在CI里挡住"手滑漏了个</div>"这种低级错误，不追求完整解析
# self-closing标签（<br>/<img>/<input>等本来就不需要闭合，不在检查范围内）。
import glob
import re
import sys
from collections import Counter

TAGS = ["div", "p", "ul", "ol", "li", "h1", "h2", "h3", "span", "a", "button", "section", "main", "aside", "label"]

failed = False

for path in sorted(glob.glob("*.html")):
    content = open(path, encoding="utf-8").read()
    opens = Counter()
    closes = Counter()
    for tag in TAGS:
        opens[tag] = len(re.findall(rf"<{tag}\b", content))
        closes[tag] = len(re.findall(rf"</{tag}>", content))
    mismatches = {t: (opens[t], closes[t]) for t in TAGS if opens[t] != closes[t]}
    if mismatches:
        failed = True
        print(f"FAIL: {path}: 标签数量不匹配 {mismatches}")
    else:
        print(f"ok: {path}")

sys.exit(1 if failed else 0)
