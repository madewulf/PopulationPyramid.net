import commands
command = 'curl -d "startYear=1950&endYear=2050&Varient=2&Location=%s&Variable=-2&Panel=2&DoWhat=Download+as+.CSV+File" http://esa.un.org/unpp/p2k0data.asp HTTP/1.1 >%s.csv'
f=open('location_list.txt','rw')
for line in f:
    t=line.split('>')
    country= t[-1][:-1]
    code= t[0].split('"')[-2]
    country_underscore = country.replace(" ","_")
    print '<li><a class="country_link" href="" id="%s">%s</a></li>'%(country_underscore,country_underscore)
    #commands.getstatusoutput(command % (code,country_underscore))
#commands.getstatusoutput(command % (364,'Iran'))
#commands.getstatusoutput(command % (418,'Lao'))
#commands.getstatusoutput(command % (862,'Venezuela'))
