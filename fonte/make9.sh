#!/bin/sh
set -e
cp src-v8.html src.html
python3 integrate9.py
python3 build.py
python3 - <<'PY'
s=open('index.html',encoding='utf-8').read()
a=s.index('<script type="module">')+len('<script type="module">'); b=s.index('</script>',a)
open('../check.mjs','w',encoding='utf-8').write(s[a:b])
PY
node --check ../check.mjs && echo SYNTAX_OK
