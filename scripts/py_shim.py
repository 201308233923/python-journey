#!/usr/bin/env python3
# 跟 app.js 里 RUNNER_TEMPLATE 的逻辑保持一致(模拟输入/捕获stdout/捕获异常)，
# 用真实python3而不是Pyodide跑一遍，给 verify.mjs 校验关卡答案用。
# 输入：stdin 是 {"code": "...", "input": "..."} 的JSON。
# 输出：stdout 是 [stdout文本, 错误描述或null] 的JSON数组。
import sys
import io
import contextlib
import json


def run(user_code, input_raw):
    input_lines = input_raw.split("\n")
    if input_lines and input_lines[-1] == "":
        input_lines = input_lines[:-1]
    pos = {"i": 0}

    def shimmed_input(prompt=""):
        if pos["i"] >= len(input_lines):
            raise EOFError("没有更多模拟输入了，请在'模拟输入'框里再加一行")
        val = input_lines[pos["i"]]
        pos["i"] += 1
        print(str(prompt) + val)
        return val

    buf = io.StringIO()
    err = None
    try:
        with contextlib.redirect_stdout(buf):
            exec(compile(user_code, "<code>", "exec"), {"input": shimmed_input, "__name__": "__main__"})
    except Exception as e:
        err = f"{type(e).__name__}: {e}"
    return [buf.getvalue(), err]


if __name__ == "__main__":
    payload = json.load(sys.stdin)
    result = run(payload["code"], payload.get("input", ""))
    print(json.dumps(result))
