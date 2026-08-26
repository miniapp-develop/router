function warn() {
    console.warn.apply(console, ['[Router]', ...arguments]);
}

function error() {
    console.error.apply(console, ['[Router]', ...arguments]);
}

module.exports = {warn, error};