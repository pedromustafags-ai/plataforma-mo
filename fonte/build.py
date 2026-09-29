import json,re,os
# os dois SVGs do logo da M&O ficam em fonte/logo/ (2.svg = logo completo, 7.svg = só o símbolo)
D=os.path.join(os.path.dirname(os.path.abspath(__file__)),"logo")+os.sep
def recolor(path, classes):
    svg=open(D+path).read().strip(); it=iter(classes)
    return re.sub(r'fill="([^"]+)"', lambda m: m.group(0) if m.group(1).lower()=='none' else 'class="%s"'%next(it), svg)
logo=recolor('2.svg',['lc','lm','lw']).replace('<svg ','<svg role="img" aria-label="M&amp;O Company" ',1)
icon=recolor('7.svg',['lc','lm']).replace('<svg ','<svg aria-hidden="true" ',1)
s=open('src.html',encoding='utf-8').read().replace('__LOGO__',json.dumps(logo)).replace('__ICON__',json.dumps(icon))
open('index.html','w',encoding='utf-8').write(s)
open('test.html','w',encoding='utf-8').write('<meta charset="utf-8">\n'+s)
print('built', len(s))
