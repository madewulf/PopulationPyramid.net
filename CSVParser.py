import csv

def parse(country):
    reader = csv.reader(open('data/'+country+'.csv', 'rU'), delimiter=',')

    dict ={}
    ages = set([])
    years = set([])
    years_totals=  {}
    for row in reader :

        if len(row)>0 and not row[0].startswith("Source") and not row[0].startswith(" ") and not row[0].startswith("Country"):
            year = row[4]
            sex = row[2]
            age = row[5]
            size = row[6]
            ages.add(age)
            years.add(year)
            if sex=='Total':
                if not years_totals.get(year):
                    years_totals[year]=float(size)
                else:
                    years_totals[year]=years_totals[year]+float(size)

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

    data_file = open("data/"+country+".js","w")
    #data_file.write("var data = ")
    data_file.write(str(data))
    #data_file.write(";\n")
    #data_file.write("labels = ")
    #data_file.write(str(age_list))
    #data_file.write(";\n")
    #data_file.write("years = ")
    #data_file.write(str(year_list))
    #data_file.write(";")
    data_file.close()
    return years_totals
import os
tot_pop_dict={}
for file in os.listdir("data") :

    if file.endswith("csv"):
        country= file.split(".")[0]
        #print country
        years_totals= parse(country)
        tot_pop_dict[country]=years_totals
import json
print json.dumps(tot_pop_dict)


