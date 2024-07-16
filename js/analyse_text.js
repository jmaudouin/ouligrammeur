function getVariance(phrase) {
    const words = phrase
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, "")
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toUpperCase()
        .split(" ")
    const averageWordLength = words.reduce((total, word) => total + word.length, 0) / words.length
    const variance = words.reduce((total, word) => {
        return total + Math.pow(word.length - averageWordLength, 2)
    }, 0) / words.length

    return variance
}



function getScoreFrequencePhrase(phrase) {
    let score = 0
    let hasUndefinedWord = false
    let words = phrase.split(" ")
    words.forEach(word => {
        let scoreMot = getScoreFrequenceMot(word)
        if (scoreMot === 0) {
            hasUndefinedWord = true
        } else {
            score += scoreMot
        }
    })
    if (hasUndefinedWord) {
        return 0
    }
    return score / words.length
}




function getScoreFrequenceMot(mot) {
    freq = freqMots[mot]
    if (freq === undefined) {
        return 0
    }
    const maxValue = 30000;
    const scaledValue = Math.log(freq + 1) / Math.log(maxValue + 1) * maxValue;
    return Math.round(scaledValue / 300);
}



