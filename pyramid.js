var canvas_size = 500;
var currentCountry = "World";
var currentCountryName = "World"
var currentYear = "2010";
var currentLetter="w";
var multiplier=5;
var labels = [' 0-4', ' 5-9', ' 10-14', ' 15-19', ' 20-24', ' 25-29', ' 30-34', ' 35-39', ' 40-44', ' 45-49', ' 50-54', ' 55-59', ' 60-64', ' 65-69', ' 70-74', ' 75-79', ' 80-84', ' 85-89', ' 90-94', ' 95-99', ' 100+'];
var years = ['1950', '1955', '1960', '1965', '1970', '1975', '1980', '1985', '1990', '1995', '2000', '2005', '2010', '2015', '2020', '2025', '2030', '2035', '2040', '2045', '2050'];
var country_dict = {"a": [["Afghanistan", "Afghanistan"], ["Albania", "Albania"], ["Algeria", "Algeria"], ["Angola", "Angola"], ["Argentina", "Argentina"], ["Armenia", "Armenia"], ["Aruba", "Aruba"], ["Australia", "Australia"], ["Austria", "Austria"], ["Azerbaijan", "Azerbaijan"], ["Africa", "Africa"], ["Asia", "Asia"], ["Australia/New_Zealand", "Australia/New Zealand"]], "c": [["Cambodia", "Cambodia"], ["Cameroon", "Cameroon"], ["Canada", "Canada"], ["Cape_Verde", "Cape Verde"], ["Central_African_Republic", "Central African Republic"], ["Chad", "Chad"], ["Channel_Islands", "Channel Islands"], ["Chile", "Chile"], ["China", "China"], ["China,_Hong_Kong_Special_Administrative_Region", "China, Hong Kong Special Administrative Region"], ["China,_Macao_Special_Administrative_Region", "China, Macao Special Administrative Region"], ["Colombia", "Colombia"], ["Comoros", "Comoros"], ["Congo", "Congo"], ["Costa_Rica", "Costa Rica"], ["Cote_d'Ivoire", "C\u00f4te d'Ivoire"], ["Croatia", "Croatia"], ["Cuba", "Cuba"], ["Cyprus", "Cyprus"], ["Czech_Republic", "Czech Republic"], ["Caribbean", "Caribbean"], ["Central_America", "Central America"]], "b": [["Bahamas", "Bahamas"], ["Bahrain", "Bahrain"], ["Bangladesh", "Bangladesh"], ["Barbados", "Barbados"], ["Belarus", "Belarus"], ["Belgium", "Belgium"], ["Belize", "Belize"], ["Benin", "Benin"], ["Bhutan", "Bhutan"], ["Bolivia", "Bolivia"], ["Bosnia_and_Herzegovina", "Bosnia and Herzegovina"], ["Botswana", "Botswana"], ["Brazil", "Brazil"], ["Brunei_Darussalam", "Brunei Darussalam"], ["Bulgaria", "Bulgaria"], ["Burkina_Faso", "Burkina Faso"], ["Burundi", "Burundi"]], "e": [["Ecuador", "Ecuador"], ["Egypt", "Egypt"], ["El_Salvador", "El Salvador"], ["Equatorial_Guinea", "Equatorial Guinea"], ["Eritrea", "Eritrea"], ["Estonia", "Estonia"], ["Ethiopia", "Ethiopia"], ["Eastern_Africa", "Eastern Africa"], ["Eastern_Asia", "Eastern Asia"], ["Europe", "Europe"], ["Eastern_Europe", "Eastern Europe"]], "d": [["Democratic_People's_Republic_of_Korea", "Democratic People's Republic of Korea"], ["Democratic_Republic_of_the_Congo", "Democratic Republic of the Congo"], ["Denmark", "Denmark"], ["Djibouti", "Djibouti"], ["Dominican_Republic", "Dominican Republic"]], "g": [["Gabon", "Gabon"], ["Gambia", "Gambia"], ["Georgia", "Georgia"], ["Germany", "Germany"], ["Ghana", "Ghana"], ["Greece", "Greece"], ["Grenada", "Grenada"], ["Guadeloupe", "Guadeloupe"], ["Guam", "Guam"], ["Guatemala", "Guatemala"], ["Guinea", "Guinea"], ["Guinea-Bissau", "Guinea-Bissau"], ["Guyana", "Guyana"]], "f": [["Federated_States_of_Micronesia", "Federated States of Micronesia"], ["Fiji", "Fiji"], ["Finland", "Finland"], ["France", "France"], ["French_Guiana", "French Guiana"], ["French_Polynesia", "French Polynesia"]], "i": [["Iceland", "Iceland"], ["India", "India"], ["Indonesia", "Indonesia"], ["Iran", "Iran (Islamic Republic of)"], ["Iraq", "Iraq"], ["Ireland", "Ireland"], ["Israel", "Israel"], ["Italy", "Italy"]], "h": [["Haiti", "Haiti"], ["Honduras", "Honduras"], ["Hungary", "Hungary"]], "k": [["Kazakhstan", "Kazakhstan"], ["Kenya", "Kenya"], ["Kuwait", "Kuwait"], ["Kyrgyzstan", "Kyrgyzstan"]], "j": [["Jamaica", "Jamaica"], ["Japan", "Japan"], ["Jordan", "Jordan"]], "m": [["Madagascar", "Madagascar"], ["Malawi", "Malawi"], ["Malaysia", "Malaysia"], ["Maldives", "Maldives"], ["Mali", "Mali"], ["Malta", "Malta"], ["Martinique", "Martinique"], ["Mauritania", "Mauritania"], ["Mauritius", "Mauritius"], ["Mayotte", "Mayotte"], ["Mexico", "Mexico"], ["Mongolia", "Mongolia"], ["Montenegro", "Montenegro"], ["Morocco", "Morocco"], ["Mozambique", "Mozambique"], ["Myanmar", "Myanmar"], ["More_developed_regions", "More developed regions"], ["Middle_Africa", "Middle Africa"], ["Melanesia", "Melanesia"], ["Micronesia", "Micronesia"]], "l": [["Lao", "Lao People's Democratic Republic"], ["Latvia", "Latvia"], ["Lebanon", "Lebanon"], ["Lesotho", "Lesotho"], ["Liberia", "Liberia"], ["Libyan_Arab_Jamahiriya", "Libyan Arab Jamahiriya"], ["Lithuania", "Lithuania"], ["Luxembourg", "Luxembourg"], ["Less_developed_regions", "Less developed regions"], ["Least_developed_countries", "Least developed countries"], ["Less_developed_regions,_excluding_least_developed_countries", "Less developed regions, excluding least developed countries"], ["Less_developed_regions,_excluding_China", "Less developed regions, excluding China"], ["Latin_America_and_the_Caribbean", "Latin America and the Caribbean"]], "o": [["Occupied_Palestinian_Territory", "Occupied Palestinian Territory"], ["Oman", "Oman"], ["Oceania", "Oceania"]], "n": [["Namibia", "Namibia"], ["Nepal", "Nepal"], ["Netherlands", "Netherlands"], ["Netherlands_Antilles", "Netherlands Antilles"], ["New_Caledonia", "New Caledonia"], ["New_Zealand", "New Zealand"], ["Nicaragua", "Nicaragua"], ["Niger", "Niger"], ["Nigeria", "Nigeria"], ["Norway", "Norway"], ["Northern_Africa", "Northern Africa"], ["Northern_Europe", "Northern Europe"], ["Northern_America", "Northern America"]], "q": [["Qatar", "Qatar"]], "p": [["Pakistan", "Pakistan"], ["Panama", "Panama"], ["Papua_New_Guinea", "Papua New Guinea"], ["Paraguay", "Paraguay"], ["Peru", "Peru"], ["Philippines", "Philippines"], ["Poland", "Poland"], ["Portugal", "Portugal"], ["Puerto_Rico", "Puerto Rico"], ["Polynesia", "Polynesia"]], "s": [["Saint_Lucia", "Saint Lucia"], ["Saint_Vincent_and_the_Grenadines", "Saint Vincent and the Grenadines"], ["Samoa", "Samoa"], ["Sao_Tome_and_Principe", "Sao Tome and Principe"], ["Saudi_Arabia", "Saudi Arabia"], ["Senegal", "Senegal"], ["Serbia", "Serbia"], ["Sierra_Leone", "Sierra Leone"], ["Singapore", "Singapore"], ["Slovakia", "Slovakia"], ["Slovenia", "Slovenia"], ["Solomon_Islands", "Solomon Islands"], ["Somalia", "Somalia"], ["South_Africa", "South Africa"], ["Spain", "Spain"], ["Sri_Lanka", "Sri Lanka"], ["Sudan", "Sudan"], ["Suriname", "Suriname"], ["Swaziland", "Swaziland"], ["Sweden", "Sweden"], ["Switzerland", "Switzerland"], ["Syrian_Arab_Republic", "Syrian Arab Republic"], ["Sub-Saharan_Africa", "Sub-Saharan Africa"], ["Southern_Africa", "Southern Africa"], ["South-Central_Asia", "South-Central Asia"], ["South-Eastern_Asia", "South-Eastern Asia"], ["Southern_Europe", "Southern Europe"], ["South_America", "South America"]], "r": [["Republic_of_Korea", "Republic of Korea"], ["Republic_of_Moldova", "Republic of Moldova"], ["Reunion", "R\u00e9union"], ["Romania", "Romania"], ["Russian_Federation", "Russian Federation"], ["Rwanda", "Rwanda"]], "u": [["Uganda", "Uganda"], ["Ukraine", "Ukraine"], ["United_Arab_Emirates", "United Arab Emirates"], ["United_Kingdom", "United Kingdom"], ["United_Republic_of_Tanzania", "United Republic of Tanzania"], ["United_States_of_America", "United States of America"], ["United_States_Virgin_Islands", "United States Virgin Islands"], ["Uruguay", "Uruguay"], ["Uzbekistan", "Uzbekistan"]], "t": [["Tajikistan", "Tajikistan"], ["Thailand", "Thailand"], ["The_former_Yugoslav_Republic_of_Macedonia", "The former Yugoslav Republic of Macedonia"], ["Timor-Leste", "Timor-Leste"], ["Togo", "Togo"], ["Tonga", "Tonga"], ["Trinidad_and_Tobago", "Trinidad and Tobago"], ["Tunisia", "Tunisia"], ["Turkey", "Turkey"], ["Turkmenistan", "Turkmenistan"]], "w": [["Western_Sahara", "Western Sahara"], ["World", "World"], ["Western_Africa", "Western Africa"], ["Western_Asia", "Western Asia"], ["Western_Europe", "Western Europe"]], "v": [["Vanuatu", "Vanuatu"], ["Venezuela", "Venezuela (Bolivarian Republic of)"], ["Viet_Nam", "Viet Nam"]], "y": [["Yemen", "Yemen"]], "z": [["Zambia", "Zambia"], ["Zimbabwe", "Zimbabwe"]]};

function getUrlVars()
{
    var vars = [], hash;
    var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
    for(var i = 0; i < hashes.length; i++)
    {
        hash = hashes[i].split('=');
        vars.push(hash[0]);
        vars[hash[0]] = hash[1];
    }
    return vars;
}

function generatePath(paper,male_tab,female_tab)
{
    var l = female_tab.length;
    var h_increment = canvas_size/(l+1);
    var pathString = "";
    var pathString2 = "";



    for (var i=0;i<l;i++)
    {
       if (i===0)
       {
           pathString+="L";
           pathString2+="M";
       }
        else
       {
           pathString+="L";
           pathString2+="L";
       }
        pathString += Math.round(canvas_size/2+female_tab[l-1-i]*canvas_size*multiplier)+ " " + Math.round((i+1)*h_increment);
        pathString2+= Math.round(canvas_size/2-male_tab[i]*canvas_size*multiplier)+ " " + Math.round((l-i)*h_increment);
    }

    pathString = pathString2 + pathString + "z";

    return pathString;

}
function keys(obj)
{
    var keys = [];

    for(var key in obj)
    {
        keys.push(key);
    }

    return keys;
}
function changeUrl()
{
    var url = "http://populationpyramid.net/?country="+currentCountry+"&year="+currentYear;
    $('#url').text(url);
    $('#page_url').attr("href",url);

    var pop=tot_pop[currentCountry][currentYear]*1000+"";
    var string_pop="";
    var l=pop.length;
    for (var i=0;i<l;i++)
    {
        if ((l-i)%3==0 && i!=0)
            string_pop+=".";
        string_pop+=pop[i];

    }
    $('#tot_pop').text(string_pop);
}

$(function() {
    var params=getUrlVars();
    if (params['country'])
        currentCountry=params['country'];
        currentLetter=currentCountry[0].toLowerCase();
    if (params['year'])
        currentYear= params['year'];
    changeUrl();
    var dat;
    $.getJSON( "data/"+currentCountry+".js",function(data){
        dat=data;
        $('#currentCountry').text(currentCountry);

        var paper = new Raphael(document.getElementById('canvas_container'), canvas_size, canvas_size);

        var male_rect= paper.rect(0,0,canvas_size/2,canvas_size);
        var female_rect= paper.rect(canvas_size/2,0,canvas_size/2,canvas_size);
        male_rect.attr({'fill':'#3600FF','fill-opacity':'1'});//#4e81ba
        female_rect.attr({'fill':'#D900FF','fill-opacity':'1'});//#d85898
        var l = labels.length;
        var h_increment = canvas_size/(l+1);
        for (var i=0;i<l;i++ )
        {
            var height = Math.round((i+1)*h_increment);
            var line = paper.path("M 0 "+ height  +"H  "+ canvas_size );
            line.attr({stroke:'#fff','stroke-width':1});
            var text= paper.text(15,height-7,labels[l-1-i]);
            text.attr({stroke:'#fff'});

        }
        var v_increment= canvas_size/8;
        for (var i=1;i<4;i++)
        {
            var x1 = Math.round(canvas_size/2+(i*v_increment));
            var x2 = Math.round(canvas_size/2-(i*v_increment));
            var line = paper.path("M "+x1+ " " + canvas_size +"  V" + (canvas_size-10));
            line.attr({stroke:'#fff','stroke-width':1});

            var line = paper.path("M "+x2+ " " + canvas_size +"  V" + (canvas_size-10));
            line.attr({stroke:'#fff','stroke-width':1});
            var text= paper.text(x1,canvas_size-10,(i*5)+"%");
            text.attr({stroke:'#fff'});
            var text= paper.text(x2,canvas_size-10,(i*5)+"%");
            text.attr({stroke:'#fff'});
        }
        var year_nr = years.length;
        for (var i=0;i<year_nr ; i++)
        {
            $("#year_list").append('<li><a class="year_link" href="" id="'+years[i]+'">'+years[i]+"</a></li>");

        }
        var alphabet=  keys(country_dict).sort();
        var alpha_length = alphabet.length;
        for (var i=0;i<alpha_length;i++)
        {

            $("#alpha_list").append('<li><a class="alpha_link" href="" id="'+alphabet[i]+'">'+alphabet[i].toUpperCase()+'</a></li>');
        }
        var country_list= country_dict[currentLetter];
         var country_count = country_list.length;
         for (var i=0;i<country_count;i++)
         {
             $("#country_list").append('<li><a class="country_link" href="" id="'+country_list[i][0]+'" na="'+country_list[i][1]+'">'+country_list[i][1]+"</a></li>");
         }

         $(".country_link").click(function()
         {
             var country= $(this).attr("id");
             currentCountryName  =$(this).attr("na");
             currentCountry = country;
             $('#currentCountry').text(currentCountryName);
             changeUrl();
             $.getJSON( "data/"+country+".js",function(data){
                 dat=data;
                 var p2 = generatePath(paper,dat[currentYear]['M'],dat[currentYear]['F']);
                 c.animate({path:p2},1000);
             });
             return false;
         });

        var p1= generatePath(paper,dat['1950']['M'],dat['1950']['F']);
        var c = paper.path(p1);
        c.attr({stroke:'#fff','stroke-width' :2,'stroke-linecap':'round',fill:'#fff','fill-opacity':'0.8'});
        $(".alpha_link").click(function()
        {

            var letter= $(this).attr("id");
            currentLetter = letter;
            $('#country_list').hide(300,function(){
                $(".country_link").remove();
                var country_list= country_dict[letter];
                var country_count = country_list.length;
                for (var i=0;i<country_count;i++)
                {
                    $("#country_list").append('<li><a class="country_link" href="" id="'+country_list[i][0]+'" na="'+country_list[i][1]+'">'+country_list[i][1]+"</a></li>");
                }

                $(".country_link").click(function()
                {
                    var country= $(this).attr("id");
                    currentCountryName  =$(this).attr("na");
                    currentCountry = country;
                    $('#currentCountry').text(currentCountryName);
                    changeUrl();
                    $.getJSON( "data/"+country+".js",function(data){
                        dat=data;
                        var p2 = generatePath(paper,dat[currentYear]['M'],dat[currentYear]['F']);
                        c.animate({path:p2},1000);
                    });

                    return false;
                });
                $('#country_list').show(300);
                return false;
            });
            return false;
        });
        $(".year_link").click(function()
        {
            var year= $(this).attr("id");
            currentYear = year;
             $('#currentYear').text(year);
            var p2 = generatePath(paper,dat[currentYear]['M'],dat[currentYear]['F']);
            c.animate({path:p2},1000);
            changeUrl();
            return false;
        });

    });




});
