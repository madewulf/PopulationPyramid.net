from flask import Flask, url_for
from flask import render_template

app = Flask(__name__)



@app.route('/<country>/<int:year>')
def pyramid(country,year):
    print "" + country + str(year)
    return  render_template("index.html")

if __name__ == '__main__':
    with app.test_request_context():
        #print url_for('/')
        print "url_for %s"% url_for('static', filename='css/base.css')
        print "pyramid %s"% url_for('pyramid', country='brol', year=2010)
    app.debug = True
    app.run()
