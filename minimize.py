from jsmin import jsmin

result = open("all_min.js",'w')
for f in ['raphael.js','jquery.js','pyramid.js']:
    content = open(f).read()
    result.write(jsmin(content))
result.close()

