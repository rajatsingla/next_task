let colors = require('nice-color-palettes/200');
let cachedColors;

const getRandomInt = (min, max) => {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

const getBackgroundColour = () => {
    if (cachedColors) { return cachedColors }
    let colour = colors[getRandomInt(0, 199)][getRandomInt(0, 4)]
    colour = colour + '18'
    cachedColors = {
        'background-color': colour
    }
    return cachedColors
}

export {
    getBackgroundColour
}