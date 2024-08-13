import $ from 'jquery';
import freqFr from './freq_fr';
import dicoAnagrammesFr from './dico_fr';
import dicoPendu from './dico_pendu.js';
import dicoContrepets from './dico_contrepets.js';

let findings = {};
window.findings = findings;
let sources
// sources = dicoAnagrammesFr.slice(100000, 105000);
sources = dicoAnagrammesFr.filter(w => {
    return freqFr[w] > 1
})
const removeAccents = str => str.normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-zA-Z]/g, '')
// sources = dicoPendu.map(word => {
//     return removeAccents(word)
// });
// sources = Object.keys(dicoContrepets)
//     // .filter(w => {
//     //     return freqFr[removeAccents(dicoContrepets[w][0]).toUpperCase()] > 0.5
//     // })
//     .filter(w => w.length > 7)


let totalCount = sources.length;


console.log(sources)

async function findCompleteFirsts(inputS) {
    return new Promise(resolve => {
        let localFindings = []
        const sorted_inputS = inputS.split('').sort().join('');
        for (var aaa = 0, len = sources.length; aaa < len; aaa++) {
            var w = sources[aaa]
            if (w.length !== inputS.length || w === inputS || findings[w]) continue
            const sorted_w = w.split('').sort().join('');
            if (sorted_w === sorted_inputS) {
                localFindings.push(w);
            }
        }
        resolve(localFindings)
    })
}



$("body").append('<div id="progress"></div>');
let progressDiv = $("#progress");
$("body").append('<div id="json"></div>');
let jsonDiv = $("#json");

for (let index = 0; index < sources.length; index++) {
    const source = sources[index];
    setTimeout(async () => {
        progressDiv.html(Math.round(index / totalCount * 10000) / 100 + '%');
        let finds = await findCompleteFirsts(source);
        if (finds.length > 0) {
            // let result = [
            //     {
            //         son: source,
            //         mot: dicoContrepets[source][0]
            //     }
            // ]
            // finds.forEach(f => {
            //     result.push({
            //         son: f,
            //         mot: dicoContrepets[f][0]
            //     })
            // })
            findings[source] = finds;
            // jsonDiv.append(JSON.stringify(result) + ",<br>");
            jsonDiv.append('"' + source + '" : ' + JSON.stringify(finds) + ", <br>");

        }
    }, 0)
}
console.log(findings);
