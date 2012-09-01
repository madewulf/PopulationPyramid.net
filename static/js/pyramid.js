var canvas_size = 450,
    multiplier = 5,
    curveWidth = 477,
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

/*variables used for the population size graph*/
var curvePadding;
var useableWidth ;
var useableHeight;
var spanP;
var spacing;


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
    $('#currentYear').text(currentYear);
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
    initPopulationCurve();
}

function getHoverHandler(rect)
{
    return function(event)
          {
             //rect.animate({"fill":"#07669d",'fill-opacity':'0.8'},333);
              var year =  $(rect.node).attr("year")
              drawCrossOnPopGraph(year);
             $("#"+year).addClass("selected_link");
          }
}

function getMouseoutHandler(rect)
{
    return function(event)
          {
              drawCrossOnPopGraph(currentYear);
              var year = $(rect.node).attr("year");

              if (year!=currentYear)
                $("#"+year).removeClass("selected_link");
          }
}

function getClickHandler(rect)
{
    return function(event)
            {
                currentYear = $(rect.node).attr("year");
                $(".year_link").removeClass("selected_link");
                $("#"+currentYear).addClass("selected_link");
                $('#currentYear').text(year);
                var p2 = generatePath( );
                c.animate({path:p2}, 1000);
                changePyramidInfo();
            }
}

function drawCrossOnPopGraph (year)
{
    var currentPopValue = populations[currentCountry][year];
       var index = (year - 1945)/5;
       var y = (1- ((currentPopValue) /spanP))*useableHeight +curvePadding/2 ;
       x = index*spacing + curvePadding;
       var crossPath = "M  "+curvePadding + ' '  + y + "H" + (useableWidth + curvePadding) + "M " + x  +" " + curvePadding +  " V" + (useableHeight+curvePadding);
       if (cross )
           cross.remove();
       cross = paper2.path(crossPath);
       cross.attr({stroke:'#07669d', 'stroke-width':1,'stroke-opacity':'0.2','stroke-dasharray': "-"});
}

function drawPopulationCurve()
{
    var l = years.length;
    var curveString = "";
    for (var i=0;i<l;i++)
    {
        year = years[i];
        var popValue = populations[currentCountry][year];
        var y = (1- ((popValue) /spanP))*useableHeight +curvePadding ;
        var x = (i+1)*spacing + curvePadding;
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


function initPopulationCurve()
{

    var l = years.length;
    var minP = 20000000;
    var maxP = 0 ;
    var year, x, y;
    curvePadding = 3;
    useableWidth = curveWidth -curvePadding*2;
    useableHeight = curveHeight -curvePadding*2;
    for (var i=0;i<l;i++)
    {
        year = years[i];
        var currentVal =  populations[currentCountry][year];
        if (currentVal < minP)
            minP = currentVal;
        if (currentVal > maxP)
            maxP = currentVal;
    }
    spanP = maxP ;
    spacing = useableWidth/(l);

    /*axes drawing*/
    //first horizontal axis
    var axesPath = "M " + curvePadding + " " + (curvePadding + useableHeight) + "H" +  (curvePadding*2 + useableWidth);
    //with arrow
    axesPath += "M "+   ((curvePadding *2+ useableWidth)- curvePadding-1) + " " + ((curvePadding + useableHeight) -curvePadding) + "L" + (curvePadding*2 + useableWidth-1) + ' ' + (curvePadding + useableHeight) ;
    axesPath += "M "+   ((curvePadding *2+ useableWidth)- curvePadding-1) + " " + ((curvePadding + useableHeight) +curvePadding) + "L" + (curvePadding*2 + useableWidth-1) + ' ' + (useableHeight + curvePadding) ;
    //then vertical axis
    axesPath += "M " + curvePadding + " " + curvePadding + "V "+ (curvePadding + useableHeight); // vertical axis
    //with arrow
    axesPath += "M "+  0 + " " + (2*curvePadding +1) + "L" +curvePadding + ' ' + (curvePadding + 1) ;
    axesPath += "M "+  2*curvePadding + " " + (2*curvePadding +1) + "L" + curvePadding+ ' ' + (curvePadding + 1) ;

    axes = paper2.path(axesPath);
    axes.attr({stroke:'#07669d', 'stroke-width':1});


    drawCrossOnPopGraph(currentYear);
    drawPopulationCurve();
    /*click zones*/
    for (var i=0;i<l;i++)
    {
        year = years[i];
        x = (i+1/2)*spacing + curvePadding;
       var rect =  paper2.rect(x,0,spacing, curveHeight+20);
       rect.attr({fill:'#fff', 'fill-opacity':'0.0',stroke:'#fff','stroke-opacity':'0.0'})
       $(rect.node).attr("year",year);
       $(rect.node).hover(getHoverHandler(rect));
       $(rect.node).click(getClickHandler(rect));
       $(rect.node).mouseout(getMouseoutHandler(rect));
    }


}
$(function () {
    $(".countryList").hide();
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
                  initPopulationCurve();
                  setLabels();
                  $('#tabs-'+currentLetter).show();
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

    $(".alphaTab a").click(function(event)
    {
        event.preventDefault();
        var tabsToShow= $(this).attr("href");
        $(".countryList").hide();
        $(".alphaTab").removeClass("selectedTab");
        $(this).parent().addClass("selectedTab");
        $(tabsToShow).show();
    });

    $(".country_link").click(function (event) {
           event.preventDefault();
           currentCountry = $(this).attr("id");
           console.log("country_link " + currentCountry);
            var p2 = generatePath( );
           c.animate({path:p2}, 1000);
           changePyramidInfo();

    });
});
