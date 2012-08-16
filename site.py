from flask import Flask, url_for
from flask import render_template, make_response
import pickle

app = Flask(__name__)

@app.route('/')
@app.route('/<country>/<int:year>/')
@app.route('/<country>/<int:year>/<currentLetter>/')
def pyramid(country="WORLD",year="2010",currentLetter=None):
    years = range(1950,2101,5)
    alphabet = map(chr, range(65, 91))
    f = open('2010/letters_to_countries_list_dict.pickle')
    letters_to_countries_list_dict = pickle.load(f)

    f.close()
    f = open('2010/countries_dict.pickle')
    countries_dict = pickle.load(f)
    f.close()
    currentCountryName = countries_dict.get(country,None)

    print "country", country
    if currentCountryName is None:
        return make_response(render_template('404.html'), 404)
    else :
        if (currentLetter is None):
            currentLetter = currentCountryName[0]
        country_list = letters_to_countries_list_dict[currentLetter.upper()]
        country_tuples = []
        for c in country_list:
            country_tuples.append((c,countries_dict[c]))
        print country, currentCountryName, year, currentLetter
        return  render_template("index.html",
                            currentCountry=country,
                            currentCountryName=currentCountryName,
                            currentYear=year,
                            currentLetter = currentLetter,
                            country_tuples= country_tuples,
                            years = years,
                            alphabet = alphabet
                            )


@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404

if __name__ == '__main__':
    with app.test_request_context():
        pass
        #print url_for('/')
        #print "url_for %s"% url_for('static', filename='css/base.css')
        #print "pyramid %s"% url_for('pyramid', country='brol', year=2010)
    app.debug = True
    app.run()
