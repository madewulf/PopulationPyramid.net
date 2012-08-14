var canvas_size = 500,
    multiplier = 5,
    c,
    paper,
    alphabet,
    lettersToCountriesList,
    populations,
    years,
    countriesHumanNames,
    ageLabels;

function getUrlVars() {
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    var i = 0;
    for (i = 0; i < hashes.length; i++) {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function generatePath(paper, male_tab, female_tab) {
    var l = female_tab.length;
    var h_increment = canvas_size / (l + 1);
    var pathString = "";
    var pathString2 = "";
    var i;

    for (i = 0; i < l; i++) {
        if (i === 0) {
            pathString += "L";
            pathString2 += "M";
        }
        else {
            pathString += "L";
            pathString2 += "L";
        }
        pathString += Math.round(canvas_size / 2 + female_tab[l - 1 - i] * canvas_size * multiplier) + " " + Math.round((i + 1) * h_increment);
        pathString2 += Math.round(canvas_size / 2 - male_tab[i] * canvas_size * multiplier) + " " + Math.round((l - i) * h_increment);
    }

    pathString = pathString2 + pathString + "z";

    return pathString;

}

function keys(obj) {
    var keysList = [];
    var key;
    for (key in obj) {
        keysList.push(key);
    }

    return keysList;
}

function changeUrl() {
    _gaq.push(['_trackEvent', 'country', currentCountry]);
    _gaq.push(['_trackEvent', 'year', currentYear + ""]);
    _gaq.push(['_trackEvent', 'country-year', currentCountry + "-" + currentYear]);
    history.pushState({"coucou":"coucou"}, "", "/" + currentCountry + "/" + currentYear);
    var url = "http://populationpyramid.net/?country=" + currentCountry + "&year=" + currentYear;
    var pop = tot_pop[currentCountry][currentYear] * 1000 + "";
    var string_pop = "";
    var l = pop.length;
    var i;
    $('#url').text(url);

    $('#page_url').attr("href", url);
    $('#currentYear').text(currentYear);

    for (i = 0; i < l; i++) {
        if ((l - i) % 3 === 0 && i !== 0) {
            string_pop += ".";
        }
        string_pop += pop.charAt(i);

    }
    $('#tot_pop').text(string_pop);
}

window.onpopstate = function (event) {
    // alert("location: " + document.location + ", state: " + JSON.stringify(event.state));
};

function drawAxes() {
    paper = new Raphael(document.getElementById('canvas_container'), canvas_size, canvas_size);

    var male_rect = paper.rect(0, 0, canvas_size / 2, canvas_size);
    var female_rect = paper.rect(canvas_size / 2, 0, canvas_size / 2, canvas_size);
    male_rect.attr({'fill':'#07669d', 'fill-opacity':'1'});//#4e81ba
    female_rect.attr({'fill':'#D156BF', 'fill-opacity':'1'});//#d85898
    var l = ageLabels.length;
    var h_increment = canvas_size / (l + 1);
    for (i = 0; i < l; i++) {
        var height = Math.round((i + 1) * h_increment);
        line = paper.path("M 0 " + height + "H  " + canvas_size);
        line.attr({stroke:'#fff', 'stroke-width':1});
        text = paper.text(15, height - 7, ageLabels[l - 1 - i]);
        text.attr({stroke:'#fff'});

    }
    var v_increment = canvas_size / 8;
    for (i = 1; i < 4; i++) {
        var x1 = Math.round(canvas_size / 2 + (i * v_increment));
        var x2 = Math.round(canvas_size / 2 - (i * v_increment));
        line = paper.path("M " + x1 + " " + canvas_size + "  V" + (canvas_size - 10));
        line.attr({stroke:'#fff', 'stroke-width':1});

        line = paper.path("M " + x2 + " " + canvas_size + "  V" + (canvas_size - 10));
        line.attr({stroke:'#fff', 'stroke-width':1});
        text = paper.text(x1, canvas_size - 10, (i * 5) + "%");
        text.attr({stroke:'#fff'});
        text = paper.text(x2, canvas_size - 10, (i * 5) + "%");
        text.attr({stroke:'#fff'});
    }
}

/*var country_list = lettersToCountriesList[currentLetter.toUpperCase()];

      for (var i= 0, cl = country_list.length; i<cl; i++) {
          var country = country_list[i];
          $("#country_list").append('<li><a class="country_link" href="" id="' + country + '" na="' + country + '">' + countriesHumanNames[country] + "</a></li>");
      }*/

$(function () {
    $.getJSON("/static/data/mainData.json", function (mainData) {
        alphabet = mainData.alphabet,
        lettersToCountriesList = mainData.lettersToCountriesList,
        populations = mainData.populations,
        years = mainData.years,
        countriesHumanNames = mainData.countriesHumanNames,
        ageLabels = mainData.ageLabels;
        drawAxes();
       // $('#currentCountry').text(currentCountry);
        //var p1 = generatePath(paper, dat[currentYear]['M'], dat[currentYear]['F']);
        //c = paper.path(p1);
        //c.attr({stroke:'#fff', 'stroke-width':2, 'stroke-linecap':'round', fill:'#fff', 'fill-opacity':'0.8'});
    });

    $(".country_link").click(function (event) {
        event.preventDefault();
        $(".country_link").removeClass("selected_link");
        $(this).addClass("selected_link");
        var country = $(this).attr("id");
        currentCountryName = $(this).attr("na");
        currentCountry = country;
        $('#currentCountry').text(currentCountryName);
        changeUrl();
        $.getJSON("/static/data/" + country + ".js", function (data) {
            dat = data;
            var p2 = generatePath(paper, dat[currentYear]['M'], dat[currentYear]['F']);
            c.animate({path:p2}, 1000);
        });
    });


    $(".alpha_link").click(function (event) {
        event.preventDefault();
        $(".alpha_link").removeClass("selected_link");
        $(this).addClass("selected_link");

        var letter = $(this).attr("id");
        currentLetter = letter;
        $('#country_list').hide(300, function () {
            var i;
            $("#country_list").empty();
            $("#country_list").height(0);
            $(".country_link").remove();

            var country_list = lettersToCountriesList[letter];
            var country_count = country_list.length;
            for (i = 0; i < country_count; i++) {
                var humanName = countriesHumanNames[country_list[i]];
                $("#country_list").append('<li><a class="country_link" href="" id="' + country_list[i] + '">' + humanName + "</a></li>");
            }

            $(".country_link").click(function (event) {
                event.preventDefault();
                $(".country_link").removeClass("selected_link");
                $(this).addClass("selected_link");
                var country = $(this).attr("id");
                currentCountryName = $(this).attr("na");
                currentCountry = country;
                $('#currentCountry').text(currentCountryName);
                changeUrl();
                $.getJSON("/static/data/" + country + ".js", function (data) {
                    dat = data;
                    var p2 = generatePath(paper, dat[currentYear]['M'], dat[currentYear]['F']);
                    c.animate({path:p2}, 1000);
                });
            });
            $('#country_list').show(300);
        });
    });

    $("#year_list_div ul").on("click", "li", function(event){
        $(".year_link").removeClass("selected_link");
        $(this).addClass("selected_link");
        event.preventDefault();
        var year = $(this).attr("id");
        currentYear = year;
        $('#currentYear').text(year);
       // var p2 = generatePath(paper, dat[currentYear]['M'], dat[currentYear]['F']);
        //c.animate({path:p2}, 1000);
        //changeUrl();
    });
});
