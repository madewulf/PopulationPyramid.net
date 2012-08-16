var canvas_size = 420,
    multiplier = 5,
    curveWidth = 400,
    curveHeight = 100,
    c,
    curve,
    paper,
    paper2,
    alphabet,
    lettersToCountriesList,
    populations,
    years,
    countriesHumanNames,
    ageLabels,
    currentCountryData,

    cross,
    axes;


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

function generatePath()
{
    var
        h_increment = canvas_size / (22),
        pathString = "",
        pathString2 = "",
        i,
        male_value,
        female_value,
        totalPop = populations[currentCountry][currentYear];

    for (i = 0; i < 22; i++) {
        if (i === 0) {
            pathString += "L";
            pathString2 += "M";
        }
        else {
            pathString += "L";
            pathString2 += "L";
        }

        male_value = currentCountryData[currentYear]['male'][''+i]/totalPop;
        female_value = currentCountryData[currentYear]['female'][''+21-i]/totalPop;

        pathString += Math.round(canvas_size / 2 - female_value* canvas_size * multiplier) + " " + Math.round((i) * h_increment);
        pathString2 += Math.round(canvas_size / 2 + male_value * canvas_size * multiplier) + " " + Math.round((21 - i) * h_increment);
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


function setLabels()
{
    $('#current_year').text(currentYear);
    currentCountryName = countriesHumanNames[currentCountry];
    $("#currentCountry").text(currentCountryName);
    var pop = populations[currentCountry][currentYear]*1000+'';
    var stringPop="";
    for (var i = 0, l = pop.length; i < l; i++) {
          if ((l - i) % 3 === 0 && i !== 0) {
              stringPop += ".";
          }
        stringPop += pop.charAt(i);

      }
      $('#tot_pop').text(stringPop);
}

function changeUrl() {
    _gaq.push(['_trackEvent', 'country', currentCountry]);
    _gaq.push(['_trackEvent', 'year', currentYear + ""]);
    _gaq.push(['_trackEvent', 'country-year', currentCountry + "-" + currentYear]);
    history.pushState({"coucou":"coucou"}, "", "/" + currentCountry + "/" + currentYear);
}

function changePyramidInfo()
{
    setLabels();
    changeUrl();
    drawPopulationCurve();
}

function drawPopulationCurve()
{
    var curveString = "";
    var l = years.length;
    var minP=20000000;
    var maxP = 0 ;
    var year, x, y;
    var curvePadding = 3;
    var useableWidth = curveWidth -curvePadding*2;
    var useableHeight = curveHeight -curvePadding*2;
    for (var i=0;i<l;i++)
    {
        year = years[i];
        var currentVal =  populations[currentCountry][year];
        if (currentVal < minP)
            minP = currentVal;
        if (currentVal > maxP)
            maxP = currentVal;
    }
    var spanP = maxP ;
    var spacing = useableWidth/(l);

    /*axes drawing*/
    var axesPath = "M " + curvePadding + " " + (curvePadding + useableHeight) + "H" +  (curvePadding*2 + useableWidth);// horizontal axis
    axesPath += "M "+   ((curvePadding *2+ useableWidth)- curvePadding) + " " + ((curvePadding + useableHeight) -curvePadding) + "L" + (curvePadding*2 + useableWidth) + ' ' + (curvePadding + useableHeight) ;
    axesPath += "M "+   ((curvePadding *2+ useableWidth)- curvePadding) + " " + ((curvePadding + useableHeight) +curvePadding) + "L" + (curvePadding*2 + useableWidth) + ' ' + (useableHeight + curvePadding) ;

    axesPath += "M " + curvePadding + " " + curvePadding + "V "+ (curvePadding + useableHeight); // vertical axis
    axes = paper2.path(axesPath);
    axes.attr({stroke:'#07669d', 'stroke-width':1});
    /*cross drawing*/
    var currentPopValue = populations[currentCountry][currentYear];
       var index = (currentYear - 1945)/5;
       y = (1- ((currentPopValue) /spanP))*useableHeight +curvePadding/2 ;
       x = index*spacing + curvePadding;
       var crossPath = "M  "+curvePadding + ' '  + y + "H" + (useableWidth + curvePadding) + "M " + x  +" " + curvePadding +  " V" + (useableHeight+curvePadding);
       console.log("crosspath" + crossPath);
       if (cross )
           cross.remove();
       cross = paper2.path(crossPath);
       cross.attr({stroke:'#07669d', 'stroke-width':1,'stroke-opacity':'0.2','stroke-dasharray': "-"});

    /*curve drawing*/
    for (var i=0;i<l;i++)
    {
        year = years[i];
        var popValue = populations[currentCountry][year];
        y = (1- ((popValue) /spanP))*useableHeight +curvePadding ;
        x = (i+1)*spacing + curvePadding;
        if (i==0)
            curveString +="M";
        else
            curveString +="L";
        curveString += x +" " + y;
    }


    if (curve)
        curve.remove();
    curve = paper2.path(curveString);
    curve.attr({stroke:'#D156BF', 'stroke-width':2, 'stroke-linecap':'round'});
}
$(function () {
    $.getJSON("/static/data/mainData.json", function (mainData) {
        alphabet = mainData.alphabet,
            lettersToCountriesList = mainData.lettersToCountriesList,
            populations = mainData.populations,
            years = mainData.years,
            countriesHumanNames = mainData.countriesHumanNames,
            ageLabels = mainData.ageLabels;
        drawAxes();
        paper2 = new Raphael(document.getElementById('canvas_container2'), curveWidth, curveHeight);
        $.getJSON("/static/data/generated/" + currentCountry + ".json", function (data) {
                  currentCountryData = data;
                  var p1 = generatePath( );
                  c = paper.path(p1);
                  c.attr({stroke:'#fff', 'stroke-width':2, 'stroke-linecap':'round', fill:'#fff', 'fill-opacity':'0.8'});
                  changePyramidInfo();
              });
    });

    $("#country_list_div ul").on("click", 'a',function (event) {
        event.preventDefault();
        $(".country_link").removeClass("selected_link");
        $(this).addClass("selected_link");
        var country = $(this).attr("id");
        currentCountry = country;
        changePyramidInfo();
        $.getJSON("/static/data/generated/" + country + ".json", function (data) {
            currentCountryData = data;
            var p2 = generatePath( );
            c.animate({path:p2}, 1000);
            changePyramidInfo();
        });
    });



    $("#year_list_div ul").on("click", "a", function (event) {
        $(".year_link").removeClass("selected_link");
        $(this).addClass("selected_link");
        event.preventDefault();
        var year = $(this).attr("id");
        currentYear = year;
        $('#currentYear').text(year);
        var p2 = generatePath( );
        c.animate({path:p2}, 1000);
        changePyramidInfo();
    });

    $("#alpha_list_div ul").on("click", "a", function (event) {
        event.preventDefault();
        $(".alpha_link").removeClass("selected_link");
        $(this).addClass("selected_link");

        var letter = $(this).attr("id");
        currentLetter = letter;
        $('#country_list').hide();
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
        $('#country_list').show(300);

    });

});
