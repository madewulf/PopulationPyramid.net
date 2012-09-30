var canvas_size = 450,
    multiplier = 5,
    curveWidth = 452,
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
    pyramidClickZones,
    crossSet,
    axes,
    previousCountry,
    previousYear,
    yearsDict,
    yearsSet;

/*variables used for the population size graph*/
var curvePadding;
var useableWidth ;
var useableHeight;
var spanP;
var spacing;

var pyramidLabelSet;

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
    var state = event.state;
    currentCountry = state.currentCountry;
    currentYear = state.currentYear;
};


function drawPyramidCanvas() {
    paper = new Raphael(document.getElementById('canvas_container'), canvas_size, canvas_size);

    var male_rect = paper.rect(0, 0, canvas_size / 2, canvas_size);
    var female_rect = paper.rect(canvas_size / 2, 0, canvas_size / 2, canvas_size);
    male_rect.attr({'fill':'#07669d', 'fill-opacity':'1'});//#4e81ba
    female_rect.attr({'fill':'#D156BF', 'fill-opacity':'1'});//#d85898
    var l = ageLabels.length;
    var h_increment = canvas_size / (l + 1);
    pyramidClickZones = paper.set();

    for (i = 0; i < l; i++) {
        var height = Math.round((i + 1) * h_increment);
        var line = paper.path("M 0 " + height + "H  " + canvas_size);
        line.attr({stroke:'#fff', 'stroke-width':1});
        var text = paper.text(15, height - 7, ageLabels[l - 1 - i]);
        text.attr({fill:'#fff'});

        var rect = paper.rect(0,height-h_increment+h_increment/2,canvas_size,h_increment);

        rect.attr({fill:'#f0f', 'fill-opacity':'0.0',stroke:'#fff','stroke-opacity':'0.0'})
        $(rect.node).attr("index",l-i-1);
        $(rect.node).hover(getHoverHandlerPyramid(rect));

        $(rect.node).mouseout(function(event){
            if (pyramidLabelSet)
                pyramidLabelSet.remove();
        });
        pyramidClickZones.push(rect);
    }
    var v_increment = canvas_size / 8;
    for (i = 1; i < 4; i++) {
        var x1 = Math.round(canvas_size / 2 + (i * v_increment));
        var x2 = Math.round(canvas_size / 2 - (i * v_increment));
        line = paper.path("M " + x1 + " " + canvas_size + "  V" + (canvas_size - 10));
        line.attr({stroke:'#fff', 'stroke-width':1});

        line = paper.path("M " + x2 + " " + canvas_size + "  V" + (canvas_size - 10));
        line.attr({stroke:'#fff', 'stroke-width':1});
        var text = paper.text(x1, canvas_size - 10, (i * 2.5) + "%");
        text.attr({fill:'#fff','font': '10px Helvetica, Arial'});
        text = paper.text(x2, canvas_size - 10, (i * 2.5) + "%");
        text.attr({fill:'#fff',font: '10px Helvetica, Arial'});
    }
}


function formatPopSizeString(popSize)
{
    var pop = popSize*1000+'';
    var stringPop="";
    for (var i = 0, l = pop.length; i < l; i++) {
          if ((l - i) % 3 === 0 && i !== 0) {
              stringPop += ".";
          }
        stringPop += pop.charAt(i);
      }
    return stringPop;
}

function setTopLabels()
{
    $('#currentYear').text(currentYear);
    currentCountryName = countriesHumanNames[currentCountry];
    $("#currentCountry").text(currentCountryName);
    var stringPop = formatPopSizeString(populations[currentCountry][currentYear]);
    $('#tot_pop').text(stringPop);
}

function changeUrl() {
    _gaq.push(['_trackEvent', 'country', currentCountry]);
    _gaq.push(['_trackEvent', 'year', currentYear + ""]);
    _gaq.push(['_trackEvent', 'country-year', currentCountry + "-" + currentYear]);
    var currentUrl = "http://populationpyramid.net/"+currentCountry+"/"+currentYear+"/";
    $("#urlSpan").html("<a href='"+currentUrl+"'>"+currentUrl+"</a>");

    
    if (history.pushState)
        history.pushState({"currentYear":previousYear,"currentCountry":previousCountry}, "", "/" + currentCountry + "/" + currentYear);
}

function changePyramidInfo()
{
    setTopLabels();
    changeUrl();
}

function drawPyramidLabel(x,y,arrowPointingLeft)
{
    var path = [];
    var m = arrowPointingLeft? 1:-1;
    path = path.concat(["M ", x+m*5,y-10, "H", x+m*40 ]);
    path = path.concat(["Q ", x+m*43,y-10,x+m*43,y-7 ]);
    path = path.concat(["V ", y+7,"Q",x+m*43,y+10,x+m*40,y+10 ]);
    path = path.concat(["H ", x+m*5, "Q",x+m*3,y+10,x+m*3,y+7  ]);
    path = path.concat(["V ", y+3,"L",x,y,"L",x+m*3,y-3   ]);
    path = path.concat(["V ", y-7, "Q",x+m*3, y-10,x+m*5,y-10   ]);
    var label= paper.path(path);
    label.attr({stroke:"#07669d", fill:"#fff"});
    return label;
}

function getHoverHandlerPyramid(rect)
{
    return function(event)
          {
             //rect.animate({"fill":"#07669d",'fill-opacity':'0.8'},333);
              var i =  $(rect.node).attr("index");
              var
                  h_increment = canvas_size / (22),

                  male_value,
                  female_value,
                  totalPop = populations[currentCountry][currentYear];
                  male_value = currentCountryData[currentYear]['male'][''+i]/totalPop;
                  female_value = currentCountryData[currentYear]['female'][''+i]/totalPop;

                  var x_female = Math.round(canvas_size / 2 - female_value* canvas_size * multiplier);
                  var y_female = Math.round((21-i) * h_increment);
                  var x_male = Math.round(canvas_size / 2 + male_value * canvas_size * multiplier);
                  var y_male = Math.round((21 - i) * h_increment);

                  var rf =drawPyramidLabel(x_female-2,y_female,false);
                  var textf = paper.text(x_female-24, y_female,(female_value*100).toFixed(1)+ "%");
                  textf.attr({font: '10px Helvetica, Arial', fill: "#07669d"});

                  var cf = paper.circle(x_female,y_female,2);
                  cf.attr({ fill: "#fff",stroke:"#fff"});

                  var rm = drawPyramidLabel(x_male+2,y_male,true);
                  rm.attr({stroke:"#07669d", fill:"#fff"});
                  var textm = paper.text(x_male+24, y_male,(male_value*100).toFixed(1)+ "%");
                  textm.attr({font: '10px Helvetica, Arial', fill: "#07669d"});

                  var cm = paper.circle(x_male,y_male,2);
                  cm.attr({ fill: "#fff",stroke:"#fff"});

                  //pyramidLabelSet.animate({'opacity':0},333);
                  if (pyramidLabelSet)
                      pyramidLabelSet.remove();
                  pyramidLabelSet= paper.set();
                  pyramidLabelSet.push(rf);
                  pyramidLabelSet.push(cf);
                  pyramidLabelSet.push(textf);
                  pyramidLabelSet.push(rm);
                  pyramidLabelSet.push(cm);
                  pyramidLabelSet.push(textm);
                  pyramidClickZones.toFront();
                  //pyramidLabelSet.attr({'opacity':0});
                  //pyramidLabelSet.animate({'opacity':1},300);
          }
}


function getHoverHandlerPopGraph(rect)
{
    return function(event)
          {
              var year =  $(rect.node).attr("year")
              drawCrossOnPopGraph(year);
              yearsDict[year].attr({fill:'#D156BF',fontWeight:'bold'});
              rect.toFront();
          }
}

function getMouseoutHandlerPopGraph(rect)
{
    return function(event)
          {
              drawCrossOnPopGraph(currentYear);
              var year = $(rect.node).attr("year");
              if (year != currentYear)
                  yearsDict[year].attr({fill:'#07669d',fontWeight:'bold'});
              if (year!=currentYear)
                $("#"+year).removeClass("temp_selected_link");
          }
}

function onYearPicked(year)
{
    previousYear = currentYear;
    currentYear = year;
    yearsSet.attr({fill:'#07669d'});
    yearsDict[year].attr({fill:'#D156BF',fontWeight:'bold'});
    var p2 = generatePath( );
    $("#yearSelect").val(year);
    c.animate({path:p2}, 1000);
    changePyramidInfo();
}

function getClickHandlerPopGraph(rect)
{
    return function(event)
            {
                var year = $(rect.node).attr("year");
                onYearPicked(year);
            }
}

function updatePopGraph()
{
    drawPopulationCurve();
    drawCrossOnPopGraph(currentYear);
}

function drawCrossOnPopGraph (year)
{
    var currentPopValue = populations[currentCountry][year];
       var index = (year - 1945)/5;
       var y = (1- ((currentPopValue) /spanP))*useableHeight +curvePadding/2 ;
       x = index*spacing + curvePadding;
       var crossPath = "M  "+curvePadding + ' '  + y + "H" + (useableWidth + curvePadding) + "M " + x  +" " + curvePadding +  " V" + (useableHeight+curvePadding);
       if (crossSet )
           crossSet.remove();
       var cross = paper2.path(crossPath);
       cross.attr({stroke:'#07669d', 'stroke-width':1,'stroke-opacity':'0.2','stroke-dasharray': "-"});
    var xt = x +35;
    var yt = y<60?y +10:y-10;
    var t = paper2.text(452 -30  ,yt,formatPopSizeString(currentPopValue));
    t.attr({fill:'#07669d','font': '10px Helvetica, Arial'});
    crossSet = paper2.set();
    crossSet.push(cross);
    crossSet.push(t);
}

function drawPopulationCurve()
{
    var l = years.length;
    var curveString = "";
    var minP = 20000000;
    var maxP = 0 ;
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
    if (!curve)
    {
        curve = paper2.path(curveString);
        curve.attr({stroke:'#D156BF', 'stroke-width':2, 'stroke-linecap':'round'});
    }
    else
     curve.animate({path:curveString}, 1000);
}


function drawPopGraphCanvas()
{
    paper2 = new Raphael(document.getElementById('canvas_container2'), curveWidth+25, curveHeight+30);
    var l = years.length;


    var year, x;
    curvePadding = 3;
    useableWidth = curveWidth -curvePadding*2;
    useableHeight = curveHeight -curvePadding*2;

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

    /*click zones*/
    yearsDict = {};
    yearsSet = paper2.set();
    for (var i=0;i<l;i++)
    {
        year = years[i];
        x = (i+1/2)*spacing + curvePadding;
       var rect =  paper2.rect(x,0,spacing, curveHeight+25);
       
       rect.attr({fill:'#f0f', 'fill-opacity':'0.0',stroke:'#fff',fill:"#f00",'stroke-opacity':'0.0'})

       $(rect.node).attr("year",year);
       $(rect.node).hover(getHoverHandlerPopGraph(rect));
       $(rect.node).click(getClickHandlerPopGraph(rect));
       $(rect.node).mouseout(getMouseoutHandlerPopGraph(rect));
        $(rect.node).attr("class","pointer");
       var t = paper2.text((i+1)*spacing+10 ,curveHeight+13,year);
       t.attr({transform: "r" +(45)});
       t.attr({fill:'#fff','font': '10px Helvetica, Arial'});
       yearsDict[year]=t;
       yearsSet.push(t);
    }
    yearsSet.attr({fill:'#07669d','font': '10px Helvetica, Arial'});
}

$(function () {
    $(".countryList").hide();
    $("#years").hide();
    $("#yearSelect").change(function(){
	var year = $(this).val();
        onYearPicked(year);
        drawCrossOnPopGraph(year);
    });
    $('#tabs-'+currentLetter).show();
    $.getJSON("/static/data/mainData.json", function (mainData) {
        alphabet = mainData.alphabet,
            lettersToCountriesList = mainData.lettersToCountriesList,
            populations = mainData.populations,
            years = mainData.years,
            countriesHumanNames = mainData.countriesHumanNames,
            ageLabels = mainData.ageLabels;
        drawPyramidCanvas();
        drawPopGraphCanvas();
        $.getJSON("/static/data/generated/" + currentCountry + ".json", function (data) {
                  currentCountryData = data;
                  var p1 = generatePath( );
                  c = paper.path(p1);
                  c.attr({stroke:'#fff', 'stroke-width':2, 'stroke-linecap':'round', fill:'#fff', 'fill-opacity':'0.8'});
                  drawPopulationCurve();
                  pyramidClickZones.toFront();
                  drawCrossOnPopGraph(currentYear);
                  setTopLabels();
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
           previousCountry = currentCountry;
           currentCountry = $(this).attr("id");
        $(".country_link").removeClass("selected_link");
              $(this).addClass("selected_link");
        $.getJSON("/static/data/generated/" + currentCountry + ".json", function (data) {
                         currentCountryData = data;

                       var p2 = generatePath( );
                        c.animate({path:p2}, 1000);
                        changePyramidInfo();
                        updatePopGraph();
        });
    });
});
