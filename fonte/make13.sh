#!/bin/sh
# Refaz a v13 do zero a partir da v12: costura, monta e confere a sintaxe do script.
set -e
cp src-v12.html src.html
python3 integrate13.py
python3 build.py
python3 - <<'PY'
s=open('index.html',encoding='utf-8').read()
a=s.index('<script type="module">')+len('<script type="module">'); b=s.index('</script>',a)
open('check.mjs','w',encoding='utf-8').write(s[a:b])
PY
node --check check.mjs && rm check.mjs && echo SYNTAX_OK
