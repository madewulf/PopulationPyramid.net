from flask import Flask, url_for, request
from flask import render_template, make_response
import pickle
import logging, sys
logging.basicConfig(stream=sys.stderr)

app = Flask(__name__)

@app.route('/')
@app.route('/<country>/<int:year>/')
@app.route('/<country>/<int:year>/<currentLetter>/')
def pyramid(country="WORLD",year="2010",currentLetter=None):

    app.logger.error('request received %s %s',country, year)

    years = range(1950,2101,5)
    alphabet = map(chr, range(65, 91))
    f = open('2010/letters_to_countries_list_dict.pickle')
    letters_to_countries_list_dict = pickle.load(f)

    f.close()
    f = open('2010/countries_dict.pickle')
    countries_dict = pickle.load(f)
    f.close()
    currentCountryName = countries_dict.get(country,None)
    app.logger.error('files read')

    if currentCountryName is None:
        return make_response(render_template('404.html'), 404)
    else :
        if (currentLetter is None):
            currentLetter = currentCountryName[0]
        alphabet = map(chr, range(97, 123))
        alphabet.remove('x')
        alphabet = map(lambda x:x.upper(),alphabet)
        countries_lists  =[]
        for letter in alphabet:
            country_list = letters_to_countries_list_dict[letter.upper()]
            country_tuples = []
            for c in country_list:
                country_tuples.append((c,unicode(countries_dict[c])))
            big_tuple = (letter,country_tuples)
            countries_lists.append(big_tuple)
        return  render_template("index.html",
                            currentCountry=country,
                            currentCountryName=currentCountryName,
                            currentYear=year,
                            currentLetter = currentLetter,
                            years = years,
                            alphabet = alphabet,
                            countries_lists = countries_lists
                            )


@app.errorhandler(404)
def page_not_found(e):
    return render_template('404.html'), 404
import os
if __name__ == '__main__':

        # Bind to PORT if defined, otherwise default to 5000.
        port = int(os.environ.get('PORT', 5000))
<<<<<<< HEAD
        app.debug = True
        app.run(host='0.0.0.0', port=port)
=======
        app.run(host='0.0.0.0', port=port, debug=True)
>>>>>>> 3727bb3f98af3c33b4d332c29465e50c5641526f
