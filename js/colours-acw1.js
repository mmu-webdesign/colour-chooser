// To do
// this code seems to be crashing Firefox Dev Edition a lot?
// rewrite so that all browsers update the colour as it's being chosen (firefox only updates when the colour chooser is closed) - DONE, use 'input' instead of 'change'.
// rewrite in a class-based way so that the same UI can be used on multiple divs
// can't copy and paste from http Alert boxes
// Run the code onLoad so that it makes sense with the current values

var bg_colour = document.getElementById('nav-colour-chooser');
var hover_colour = document.getElementById('nav-hover-colour-chooser');


// calculates the luminosity of an given RGB color
// the color code must be in the format of RRGGBB
// the luminosity equations are from the WCAG 2 requirements
// http://www.w3.org/TR/WCAG20/#relativeluminancedef

function hexdec(hexString) {
    //  discuss at: http://locutus.io/php/hexdec/
    // original by: Philippe Baumann
    //   example 1: hexdec('that')
    //   returns 1: 10
    //   example 2: hexdec('a0')
    //   returns 2: 160

    hexString = (hexString + '').replace(/[^a-f0-9]/gi, '')
    return parseInt(hexString, 16)
}

calculateLuminosity = function(color) {

    var r = hexdec(color.substr(0, 2)) / 255; // red value
    var g = hexdec(color.substr(2, 2)) / 255; // green value
    var b = hexdec(color.substr(4, 2)) / 255; // blue value
    if (r <= 0.03928) {
        r = r / 12.92;
    } else {
        r = Math.pow(((r + 0.055) / 1.055), 2.4);
    }

    if (g <= 0.03928) {
        g = g / 12.92;
    } else {
        g = Math.pow(((g + 0.055) / 1.055), 2.4);
    }

    if (b <= 0.03928) {
        b = b / 12.92;
    } else {
        b = Math.pow(((b + 0.055) / 1.055), 2.4);
    }

    luminosity = 0.2126 * r + 0.7152 * g + 0.0722 * b;
    return luminosity;
}

// calculates the luminosity ratio of two colors
// the luminosity ratio equations are from the WCAG 2 requirements
// http://www.w3.org/TR/WCAG20/#contrast-ratiodef

calculateLuminosityRatio = function(color1, color2) {
    var l1 = calculateLuminosity(color1);
    var l2 = calculateLuminosity(color2);

    if (l1 > l2) {
        ratio = ((l1 + 0.05) / (l2 + 0.05));
    } else {
        ratio = ((l2 + 0.05) / (l1 + 0.05));
    }
    return ratio;
}

// returns an array with the results of the color contrast analysis
// it returns akey for each level (AA and AAA, both for normal and large or bold text)
// it also returns the calculated contrast ratio
// the ratio levels are from the WCAG 2 requirements
// http://www.w3.org/TR/WCAG20/#visual-audio-contrast (1.4.3)
// http://www.w3.org/TR/WCAG20/#larger-scaledef

evaluateColorContrast = function(color1, color2) {
    var ratio = calculateLuminosityRatio(color1, color2);

    var colorEvaluation = new Object();

    colorEvaluation.levelAANormal = (ratio >= 4.5 ? 'pass' : 'fail');
    colorEvaluation.levelAALarge = (ratio >= 3 ? 'pass' : 'fail');
    colorEvaluation.levelAAMediumBold = (ratio >= 3 ? 'pass' : 'fail');
    colorEvaluation.levelAAANormal = (ratio >= 7 ? 'pass' : 'fail');
    colorEvaluation.levelAAALarge = (ratio >= 4.5 ? 'pass' : 'fail');
    colorEvaluation.levelAAAMediumBold = (ratio >= 4.5 ? 'pass' : 'fail');
    colorEvaluation.ratio = ratio;

    return colorEvaluation;
}


checkContrast = function() {

    var text_colour = "ffffff"; // white

    var bg_colour = document.getElementById('nav-colour-chooser');
    var hover_colour = document.getElementById('nav-hover-colour-chooser');

    var bg_colour = document.getElementById('nav-colour-chooser').value.substr(1);
    var hover_colour = document.getElementById('nav-hover-colour-chooser').value.substr(1);

    //console.log(bg_colour);
    //console.log(hover_colour);
    // var text_colour = document.getElementById('text-colour-chooser').value.substr(1);
    // var link_colour = document.getElementById('link-colour-chooser').value.substr(1);

    //var  = evaluateColorContrast(bg_colour, heading_colour);
    var bg_link = evaluateColorContrast(text_colour, bg_colour);
    var bg_hover = evaluateColorContrast(text_colour, hover_colour);

    // console.log('background to heading: ' + bg_heading.levelAAALarge + ' ratio: ' + bg_heading.ratio);
    // console.log('background to text: ' + bg_text.levelAAANormal + ' ratio: ' + bg_text.ratio);
    // console.log('background to link: ' + bg_link.levelAAANormal + ' ratio: ' + bg_link.ratio);

    var nav_readout = document.getElementById('nav-ratio');
    var hover_readout = document.getElementById('hover-ratio');
    // var link_readout = document.getElementById('link-ratio');

    nav_readout.innerHTML = "<i class=\"palette__indicator\">AAA Normal</i> " + bg_link.ratio.toPrecision(3) + '<b class=\"palette__hex\">Use this: #' + bg_colour + '</b>';
    hover_readout.innerHTML = "<i class=\"palette__indicator\">AAA Normal</i> " + bg_hover.ratio.toPrecision(3) + '<b class=\"palette__hex\">Use this: #' + hover_colour + '</b>';
    // link_readout.innerHTML = "<i class=\"palette__indicator\">AAA Normal</i> " + bg_link.ratio.toPrecision(3);

    nav_readout.classList.remove("pass");
    nav_readout.classList.remove("fail");
    nav_readout.classList.add(bg_link.levelAAANormal);

    hover_readout.classList.remove("pass");
    hover_readout.classList.remove("fail");
    hover_readout.classList.add(bg_hover.levelAAANormal);

    // link_readout.classList.remove("pass");
    // link_readout.classList.remove("fail");
    // link_readout.classList.add(bg_link.levelAAANormal);


}

bg_colour.addEventListener('input', (event) => {
    var chosen_colour = event.target.value;
    var toChange = document.querySelectorAll('.navigation ul li a:not(.hover)');
    for (i = 0; i < toChange.length; i++) {
        toChange[i].style.backgroundColor = chosen_colour;
        toChange[i].onmouseover = function() {
            this.style.backgroundColor = hover_colour.value;
        }
        toChange[i].onmouseout = function() {
            this.style.backgroundColor = chosen_colour;
        }
    }
    checkContrast();
});

hover_colour.addEventListener('input', (event) => {
    var chosen_colour = event.target.value;
    var toChange = document.querySelectorAll('.navigation ul li a.hover');
    toChange[0].style.backgroundColor = chosen_colour;
    checkContrast();
});



var bg_colour = document.getElementById('nav-colour-chooser').value.substr(1);
var hover_colour = document.getElementById('nav-hover-colour-chooser').value.substr(1);



var toChange = document.querySelectorAll('.navigation ul li a.hover');
toChange[0].style.backgroundColor = '#' + hover_colour;


var toChange = document.querySelectorAll('.navigation ul li a:not(.hover)');
for (i = 0; i < toChange.length; i++) {
    toChange[i].style.backgroundColor = '#' + bg_colour;
    toChange[i].onmouseover = function() {
        this.style.backgroundColor = '#' + hover_colour;
    }
    toChange[i].onmouseout = function() {
        this.style.backgroundColor = '#' + bg_colour;
    }
}

checkContrast();


// text_colour.addEventListener('input', (event) => {
//     var chosen_colour = event.target.value;
//     var toChange = document.querySelectorAll('.content p');
//     toChange[0].style.color = chosen_colour;
//     checkContrast();
// });

// link_colour.addEventListener('input', (event) => {
//     var chosen_colour = event.target.value;
//     var toChange = document.querySelectorAll('.content a');
//     toChange[0].style.color = chosen_colour;
//     checkContrast();
// });

// var copyButton = document.getElementById('getValues');

// copyButton.onclick = function() {
//     var bg_colour = document.getElementById('background-colour-chooser').value;
//     var heading_colour = document.getElementById('heading-colour-chooser').value;
//     var text_colour = document.getElementById('text-colour-chooser').value;
//     var link_colour = document.getElementById('link-colour-chooser').value;

//     alert('Copy and paste these values into your stylesheet.\r\n\r\n/*\r\nBackground colour: ' + bg_colour + '\r\nHeading colour: ' + heading_colour + '\r\nParagraph text: ' + text_colour + '\r\nHyperlink: ' + link_colour + '\r\n*/');
// }

// updateUI(); - this will have to be refactored so you can call a function to update the visible state of the app.