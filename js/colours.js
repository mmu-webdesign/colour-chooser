// To do
// this code seems to be crashing Firefox Dev Edition a lot?
// rewrite so that all browsers update the colour as it's being chosen (firefox only updates when the colour chooser is closed)
// rewrite so that the same UI can be used on multiple divs

var bg_colour = document.getElementById('background-colour-chooser');
var heading_colour = document.getElementById('heading-colour-chooser');
var text_colour = document.getElementById('text-colour-chooser');
var link_colour = document.getElementById('link-colour-chooser');

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

    var bg_colour = document.getElementById('background-colour-chooser').value.substr(1);
    var heading_colour = document.getElementById('heading-colour-chooser').value.substr(1);
    var text_colour = document.getElementById('text-colour-chooser').value.substr(1);
    var link_colour = document.getElementById('link-colour-chooser').value.substr(1);

    var bg_heading = evaluateColorContrast(bg_colour, heading_colour);
    var bg_text = evaluateColorContrast(bg_colour, text_colour);
    var bg_link = evaluateColorContrast(bg_colour, link_colour);

    console.log('background to heading: ' + bg_heading.levelAAANormal + ' ratio: ' + bg_heading.ratio);
    console.log('background to text: ' + bg_text.levelAAANormal + ' ratio: ' + bg_text.ratio);
    console.log('background to link: ' + bg_link.levelAAANormal + ' ratio: ' + bg_link.ratio);

    var heading_readout = document.getElementById('heading-ratio');
    var text_readout = document.getElementById('text-ratio');
    var link_readout = document.getElementById('link-ratio');

    heading_readout.innerText = bg_heading.ratio.toPrecision(3);
    text_readout.innerText = bg_text.ratio.toPrecision(3);
    link_readout.innerText = bg_link.ratio.toPrecision(3);

    heading_readout.classList.remove("pass");
    heading_readout.classList.remove("fail");
    heading_readout.classList.add(bg_heading.levelAAANormal);

    text_readout.classList.remove("pass");
    text_readout.classList.remove("fail");
    text_readout.classList.add(bg_text.levelAAANormal);

    link_readout.classList.remove("pass");
    link_readout.classList.remove("fail");
    link_readout.classList.add(bg_link.levelAAANormal);


}

bg_colour.addEventListener('change', (event) => {
    var chosen_colour = event.target.value;
    var toChange = document.querySelectorAll('.container');
    toChange[0].style.backgroundColor = chosen_colour;
    checkContrast();
});

heading_colour.addEventListener('change', (event) => {
    var chosen_colour = event.target.value;
    var toChange = document.querySelectorAll('.content h2');
    toChange[0].style.color = chosen_colour;
    checkContrast();
});

text_colour.addEventListener('change', (event) => {
    var chosen_colour = event.target.value;
    var toChange = document.querySelectorAll('.content p');
    toChange[0].style.color = chosen_colour;
    checkContrast();
});

link_colour.addEventListener('change', (event) => {
    var chosen_colour = event.target.value;
    var toChange = document.querySelectorAll('.content a');
    toChange[0].style.color = chosen_colour;
    checkContrast();
});

var copyButton = document.getElementById('getValues');

copyButton.onclick = function() {
    var bg_colour = document.getElementById('background-colour-chooser').value;
    var heading_colour = document.getElementById('heading-colour-chooser').value;
    var text_colour = document.getElementById('text-colour-chooser').value;
    var link_colour = document.getElementById('link-colour-chooser').value;

    alert('Copy and paste these values into your stylesheet.\r\n\r\nBackground colour: ' + bg_colour + '\r\nHeading colour: ' + heading_colour + '\r\nParagraph text: ' + text_colour + '\r\nHyperlink: ' + link_colour);
}