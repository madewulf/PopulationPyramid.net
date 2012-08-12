import csv
from collections import defaultdict
files = {
    "male":
            {
            "old": "UN_POP/UN_POP_FEMALE/ESTIMATES-Table 1.csv",
            "prev": "UN_POP/UN_POP_FEMALE_PREV/MEDIUM-Table 1.csv"
        },
    "female":
            {
            "old": "UN_POP/UN_POP_MALE/ESTIMATES-Table 1.csv",
            "prev": "UN_POP/UN_POP_MALE_PREV/MEDIUM-Table 1.csv",
            }
}

ages = set([])
years = set([])
country_set = set([])
country_key_set = set([])

#dict['burundi'][2010][male][0]
f = lambda: defaultdict(f)
res_dict = defaultdict(f)

count =0
for sex in files:
    for typ in files[sex]:
        reader = csv.reader(open(files[sex][typ], 'rb'), delimiter=';')
        for row in reader:
            year = row[5]
            country = row[2]
            i=0
            for v in row[6:]:
                res_dict[country][year][sex][i]=v
                i = i+1
                count = count +1


print res_dict['EUROPE']['2095']['male'][0]
print "woohhooo -----------------------------------", count
def age_to_int(age):
    if not age.strip().startswith("100"):
        return int(age.split('-')[0])
    else:
        return 100

age_list.sort(key=age_to_int)

year_list = list(years)
year_list.sort()

data = {}
for year in dict:
    total_pop = sum([dict[year]['Total'][age] for age in age_list])

    data[year] = {}

    data[year]['M'] = [dict[year]['Male'][age] / total_pop for age in age_list]
    data[year]['F'] = [dict[year]['Female'][age] / total_pop for age in age_list]

data_file = open("data.js", "w")
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