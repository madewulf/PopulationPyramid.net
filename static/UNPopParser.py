import csv
reader = csv.reader(open('UNPop.csv', 'rb'), delimiter=',')
current_year = 0000

dict ={}
ages = set([])
years = set([])
for row in reader :
    year = row[4]
    sex = row[2]
    age = row[5]
    size = row[6]
    ages.add(age)
    years.add(year)
    if not dict.get(year):
        dict[year]={}
    if not dict[year].get(sex):
        dict[year][sex]={}
    if not dict[year][sex].get(age):
        dict[year][sex][age]={}
    dict[year][sex][age]=float(size)


age_list = list(ages)

def age_to_int(age):
    if not age.strip().startswith("100"):
        return int(age.split('-')[0])
    else :
        return 100
age_list.sort(key=age_to_int)

year_list =list(years)
year_list.sort()

data={}
for year in dict :
    total_pop=sum([dict[year]['Total'][age] for age in age_list ])

    data[year]={}

    data[year]['M']=[dict[year]['Male'][age]/total_pop for age in age_list  ]
    data[year]['F']=[dict[year]['Female'][age]/total_pop for age in age_list  ]



data_file = open("data.js","w")
data_file.write("var data = ")
data_file.write(str(data))
data_file.write(";\n")
data_file.write("labels = ")
data_file.write(str(age_list))
data_file.write(";\n")
data_file.write("years = ")
data_file.write(str(year_list))
data_file.write(";")
data_file.close()