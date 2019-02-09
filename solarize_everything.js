// ==UserScript==
// @name         Solarize Everything
// @namespace    https://georgewatson.me
// @version      0.1
// @description  Makes everything Solarized
// @author       George Watson
// @match        *://*/*
// @grant        none
// ==/UserScript==

function rgbToLab(rgb){
    // Based on https://github.com/antimatter15/rgb-lab/blob/master/color.js
    var r = rgb[0] / 255,
        g = rgb[1] / 255,
        b = rgb[2] / 255,
        x, y, z;

    r = (r > 0.04045) ? Math.pow((r + 0.055) / 1.055, 2.4) : r / 12.92;
    g = (g > 0.04045) ? Math.pow((g + 0.055) / 1.055, 2.4) : g / 12.92;
    b = (b > 0.04045) ? Math.pow((b + 0.055) / 1.055, 2.4) : b / 12.92;

    x = (r * 0.4124 + g * 0.3576 + b * 0.1805) / 0.95047;
    y = (r * 0.2126 + g * 0.7152 + b * 0.0722) / 1.00000;
    z = (r * 0.0193 + g * 0.1192 + b * 0.9505) / 1.08883;

    x = (x > 0.008856) ? Math.pow(x, 1/3) : (7.787 * x) + 16/116;
    y = (y > 0.008856) ? Math.pow(y, 1/3) : (7.787 * y) + 16/116;
    z = (z > 0.008856) ? Math.pow(z, 1/3) : (7.787 * z) + 16/116;

    return [(116 * y) - 16, 500 * (x - y), 200 * (y - z)]
};


function colorDistance(rgb1, rgb2) {
    if(rgb1 && rgb2) {
        var v1 = rgbToLab(rgb1);
        var v2 = rgbToLab(rgb2);
        return Math.sqrt(Math.pow(v1[0] - v2[0], 2) + Math.pow(v1[1] - v2[1], 2) + Math.pow(v1[2] - v2[2], 2));
    }
    return 10000;
};


function colorToArray(color) {
    var digits = /rgb\((\d+), (\d+), (\d+)\).*/.exec(color);
    if (digits) {
        var red = parseInt(digits[1]);
        var green = parseInt(digits[2]);
        var blue = parseInt(digits[3]);
        return [red, green, blue];
    }
    return color;
};


function arrayToColor(rgb) {
    return "rgb(" + rgb[0] + ", " + rgb[1] + ", " + rgb[2] + ")"
};


function closestColor(color) {
    const solarizedColors = [[0, 43, 54], // "#002b36",
                             [7, 54, 66], // "#073642",
                             [88, 110, 117], // "#586e75",
                             [101, 123, 131], // "#657b83",
                             [131, 148, 150], // "#839496",
                             [147, 161, 161], // "#93a1a1",
                             [238, 232, 213], // "#eee8d5",
                             [253, 246, 227], // "#fdf6e3",
                             [181, 137, 0], // "#b58900",
                             [203, 75, 22], // "#cb4b16",
                             [220, 50, 47], // "#dc322f",
                             [211, 54, 130], // "#d33682",
                             [108, 113, 196], // "#6c71c4",
                             [38, 139, 210], // "#268bd2",
                             [42, 161, 152], // "#2aa198",
                             [133, 153, 0] // "#859900"
                            ];

    var minDist = 9999;
    var bestMatch = color;
    for (const solarizedColor of solarizedColors) {
        var thisDist = colorDistance(solarizedColor, color);
        if (thisDist < minDist) {
            minDist = thisDist;
            bestMatch = solarizedColor;
        }
    }
    return arrayToColor(bestMatch);
};


(function() {
    'use strict';

    // Based on https://stackoverflow.com/a/18858254/1873444
    var elements = document.getElementsByTagName('*');
    for (var i=0;i<elements.length;i++) {
        var color = window.getComputedStyle(elements[i]).color;
        elements[i].style.color=closestColor(colorToArray(color));
        var backgroundColor = window.getComputedStyle(elements[i]).backgroundColor;
        if (backgroundColor.indexOf('rgba')<0) {
            elements[i].style.backgroundColor=closestColor(colorToArray(backgroundColor));
        }
        var borderColor = window.getComputedStyle(elements[i]).borderColor;
        if (borderColor.indexOf('rgba')<0) {
            elements[i].style.borderColor=closestColor(colorToArray(borderColor));
        }

    }
})();
