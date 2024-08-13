

import $ from 'jquery';
import 'jquery-ui-dist/jquery-ui.js';




import freqEn from './freq_en';
import freqFr from './freq_fr';

// import Worker from 'worker-loader!./anagramworker.worker.js';


// Ajout du script Buy Me a Coffee
const script = document.createElement('script');
script.setAttribute('src', 'https://cdnjs.buymeacoffee.com/1.0.0/widget.prod.min.js');
script.setAttribute('data-name', 'BMC-Widget');
script.setAttribute('data-id', 'lasoeurdupape');
script.setAttribute('data-description', 'Support me on Buy me a coffee!');
script.setAttribute('data-message', 'Merci de votre soutien !');
script.setAttribute('data-color', '#40DCA5');
script.setAttribute('data-position', 'Right');
script.setAttribute('data-x_margin', '18');
script.setAttribute('data-y_margin', '18');
document.body.appendChild(script);


var freqMots

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


var freq

function getScoreFrequenceMot(mot) {
    freq = freqMots[mot]
    if (freq === undefined) {
        return 0
    }
    const maxValue = 30000;
    const scaledValue = Math.log(freq + 1) / Math.log(maxValue + 1) * maxValue;
    return Math.round(scaledValue / 300);
}




var exclus = []

var worker = new Worker(new URL('./anagramworker.worker.js', import.meta.url));
var grosMots = [
    "merde", "con", "bordel", "chiant", "putain", "chier", "cul", "chiotte", "chiottes",
    "culs", "bites", "couilles", "couillons", "putes", "putains", "putasses", "couillonne", "couillonnes", "baise", "baiser", "niquer",
    "conne", "cons", "connes", "ducon", "abruti", "abrutie", "abrutis", "abruties",
    "zob", "foutre", "pine", "piner", "pines", "prout", "prouts", "pignouf", "troufion", "fion",
    "salope", "salopes", "saloperie", "saloperies", "salaud", "salopard", "bite", "couille", "couillon",
    "zob", "caca", "pipi", "etron", "pute", "putasse",
    "anus", "anal", "pochtron", "pochtrons", "murge", "murger", "bouseux", "bifle", "nichon", "nichons", "nibard", "nibards",
    "enculer", "encule", "encules", "enculons", "enculera", "enculeur",
    "putes", "putains", "putasses", "petasse", "feignasse", "laidron", "chaudasse", "poufiasse",
    "connard", "connasse", "connards", "connasses", "connerie",
    "chiure", "chiasse", "chieur", "chieuse", "chiee",
    "merdes", "merder", "merdasse", "merdasses", "emmerder", "emmerdeur", "emmerdant", "emmerdeurs", "merdier", "merdiers"
]
var motsAbsentsDuDico = [

]


let nbPropositions = 0
let nbPropositionsVisibles = 0

let singleLetters = ["C", "D", "J", "L", "M", "N", "S", "T"]
let voyelles = ["A", "E", "I", "O", "U", "Y"]

let imposes = []

var input

function passesFilters(phrase) {
    let contientExclu = false
    phrase.split(' ').forEach(function (word, index) {
        if (exclus.indexOf(word) != -1) {
            contientExclu = true
        }
    })
    if (contientExclu) {
        return false
    }
    let scoreFrequence = Math.round(getScoreFrequencePhrase(phrase))
    // let scoreVariance = Math.round(getVariance(phrase))
    let visible = scoreFrequence >= Number($("#filterBelowFrequence").val())
    if (!visible) return false
    visible = visible
        && phrase.split(' ').length <= $("#nbMotsMax").val()
        && phrase.split(' ').length >= $("#nbMotsMin").val()

    if (!visible) return false
    // visible = visible && isSentenceLegit(phrase)
    let aTousImposes = true
    imposes.forEach(function (impose) {
        if (phrase.indexOf(impose) == -1) {
            aTousImposes = false
        }
    })
    visible = visible && aTousImposes
    visible = visible && (!$("#filtreExigeant").is(":checked") || scoreFrequence > 0)
    return visible
}

function isSentenceLegit(sentence) {
    let words = sentence.split(' ')
    let nCommencantParVoyelles = 0
    let nConsonneSeule = 0
    words.forEach(word => {
        if (singleLetters.indexOf(word) != -1) {
            nConsonneSeule++
        }
        if (voyelles.indexOf(word[0]) != -1 && word.length > 1) {
            nCommencantParVoyelles++
        }
    });
    return nCommencantParVoyelles >= nConsonneSeule
}
let nombrePropositions = $("#nombrePropositions")
function updateNbPropositions() {
    nombrePropositions.html(nbPropositionsVisibles + " / " + nbPropositions)
}
let wrapProgressFilter = $("#wrapProgressFilter")
let progressFilter = $("#progressFilter")
function filtrer(forceSuppr = false) {
    let propositions = $(".proposition")
    wrapProgressFilter.show()
    let progress = 0
    let target = propositions.length
    propositions.each(function () {
        setTimeout(() => {
            let wasVisible = !$(this).hasClass('propositionCachee')
            if (forceSuppr) {
                if (!passesFilters($(this).attr('data-phrase'))) {
                    $(this).remove()
                    nbPropositions--
                    nbPropositionsVisibles--
                } else {

                }

            } else {
                let visible = passesFilters($(this).attr('data-phrase'))
                $(this).toggleClass('propositionCachee', !visible)
                if (visible) {
                    if (wasVisible) {
                    } else {
                        nbPropositionsVisibles++
                    }
                } else {
                    if (wasVisible) {
                        nbPropositionsVisibles--
                    }
                }
            }
            updateNbPropositions()
            progress++
            progressFilter.css({
                width: 100 * progress / target + '%'
            })
            if (progress == target) {
                wrapProgressFilter.hide()
            }
        }, 0);
    })


}


$(function () {

    $(".elementDeMenu").hide()
    $("#motsBoostes").val(grosMots.join(' '))

    $("#motsAjoutes").val(motsAbsentsDuDico.join(' '))



    $("#zoomMoinsText").click(function () {
        $("#resultatAuto").css('font-size', (Number($("#resultatAuto").css('font-size').replace('px', '')) - 1) + "px")
    })
    $("#zoomPlusText").click(function () {
        $("#resultatAuto").css('font-size', (Number($("#resultatAuto").css('font-size').replace('px', '')) + 1) + "px")
    })
    $("#exclureDuDico").change(function () {
        updateExclus()
        filtrer(false)
    });
    function updateExclus() {
        exclus = $("#exclureDuDico").val().toUpperCase().split(" ")
    }
    updateExclus()
    $("#expressionsObligatoires").change(function () {
        updateImposes()
        filtrer(false)
    });
    function updateImposes() {
        imposes = $("#expressionsObligatoires").val().toUpperCase().split(" ")
    }
    updateImposes()
    freqMots = freqFr

    $("#stopWorker").click(function () {
        worker.terminate()
        $(this).hide()
    })



    $("#helpClasser").click(function () {
        classerPropositions($('#resultatAuto'))
    });
    $("#helpClasserTaille").click(function () {
        classerPropositionsTaille($('#resultatAuto'))
    });

    $("#helpClasserTailleEtNbMots").click(function () {
        classerPropositionsTailleEtNbMots($('#resultatAuto'))
    });
    $("#helpClasserFiltrerQualiteVarianceFrequence").click(function () {
        let critere2 = "data-scorefrequence"
        let critere1 = "data-scorevariance"
        filtrerQualiteVariance(critere1, critere2)
    });
    $("#helpClasserFiltrerQualiteFrequenceVariance").click(function () {
        let critere1 = "data-scorefrequence"
        let critere2 = "data-scorevariance"
        filtrerQualiteVariance(critere1, critere2)
    });
    function classerPropositions(wrapper) {
        var motsBoostes = $("#motsBoostes").val().split(' ')
        var boost = $("#activerBoost").is(':checked')
        wrapper.children(".proposition").each(function () {

            if ($(this).attr('data-rangfreq') === undefined) {
                var text = $(this).attr('data-phrase').split(" ")
                var score = 0
                $.each(text, function (i, elt) {
                    if (elt.indexOf("(") == -1 && motsBoostes.indexOf(elt.toLowerCase()) != -1 && boost) {
                        score += 1000000
                    } else {
                        if (elt.indexOf("(") == -1 && freqMots[elt] === undefined) {
                            score = 0;
                            return false;
                        }
                        if (elt.indexOf("(") == -1 && freqMots[elt] !== undefined) {
                            score += freqMots[elt]
                        }
                    }
                })
                var score = score / text.length
                $(this).attr('data-rangfreq', score)
            }
        });
        var $wrapper = wrapper;
        $wrapper.find('.proposition').sort(function (a, b) {
            return +b.getAttribute('data-rangfreq') - +a.getAttribute('data-rangfreq');
        })
            .appendTo($wrapper);
    }
    function classerPropositionsTaille(wrapper) {
        wrapper.children(".proposition").each(function () {
            if ($(this).attr('data-rangtaille') === undefined) {

                var text = $(this).attr('data-phrase').split(" ")
                var score = Number.MAX_SAFE_INTEGER
                $.each(text, function (i, elt) {
                    if (elt.indexOf("(") == -1 && freqMots[elt] === undefined) {
                        score = 0;
                    }
                    if (elt.indexOf("(") == -1 && freqMots[elt] !== undefined) {
                        var length = Math.max(2, elt.length)
                        score = Math.min(score, freqMots[elt] * Math.pow(length, 8))
                    }
                })
                $(this).attr('data-rangtaille', score)
            }
        });

        var $wrapper = wrapper;

        $wrapper.find('.proposition').sort(function (a, b) {
            return +b.getAttribute('data-rangtaille') - +a.getAttribute('data-rangtaille');
        })
            .appendTo($wrapper);
    }



    function filtrerQualiteVariance(critere1, critere2) {
        const elements = Array.from(document.querySelectorAll('[' + critere1 + '][' + critere2 + ']'));
        elements.sort((b, a) => {
            const scoreFrequenceA = parseFloat(a.getAttribute(critere1));
            const scoreFrequenceB = parseFloat(b.getAttribute(critere1));

            if (scoreFrequenceA !== scoreFrequenceB) {
                return scoreFrequenceA - scoreFrequenceB;
            } else {
                const scoreVarianceA = parseFloat(a.getAttribute(critere2));
                const scoreVarianceB = parseFloat(b.getAttribute(critere2));
                return scoreVarianceA - scoreVarianceB;
            }
        });

        const parentElement = elements[0].parentElement;
        elements.forEach(element => parentElement.appendChild(element));
    }


    function classerPropositionsTailleEtNbMots(wrapper) {

        var motsBoostes = $("#motsBoostes").val().split(' ')
        var boost = $("#activerBoost").is(':checked')
        wrapper.children(".proposition").each(function () {

            if ($(this).attr('data-rangfreq') === undefined) {
                var text = $(this).attr('data-phrase').split(" ")
                var score = 0
                $.each(text, function (i, elt) {
                    if (elt.indexOf("(") == -1 && motsBoostes.indexOf(elt.toLowerCase()) != -1 && boost) {
                        score += 1000000
                    } else {
                        if (elt.indexOf("(") == -1 && freqMots[elt] === undefined) {
                            score = 0;
                            return false;
                        }
                        if (elt.indexOf("(") == -1 && freqMots[elt] !== undefined) {
                            score += freqMots[elt]
                        }
                    }
                })
                var score = score / text.length
                $(this).attr('data-rangfreq', score)
            }
            if ($(this).attr('data-rangtaille') === undefined) {
                var text = $(this).attr('data-phrase').split(" ")
                if (text.indexOf("(") == -1) {
                    var score = Number.MAX_SAFE_INTEGER
                    $.each(text, function (i, elt) {
                        if (freqMots[elt] === undefined) {
                            score = 0;
                        }
                        if (freqMots[elt] !== undefined) {
                            score = Math.min(score, freqMots[elt] * Math.pow(elt.length, 8))
                        }
                    })
                    $(this).attr('data-rangtaille', score)
                }
            }
            if ($(this).attr('data-nbmots') === undefined) {
                var text = $(this).attr('data-phrase').split(" ")
                if (text.indexOf("(") == -1) {
                    var nbMots = text.length
                    $(this).attr('data-nbmots', nbMots)
                }
            }
        });
        wrapper.children(".proposition").each(function () {
            $(this).attr('data-rangnbmots', $(this).attr('data-rangfreq') / Math.pow($(this).attr('data-nbmots'), 8))
        });

        var $wrapper = wrapper;

        $wrapper.find('.proposition').sort(function (a, b) {
            return +a.getAttribute('data-nbmots') - +b.getAttribute('data-nbmots') || +b.getAttribute('data-rangfreq') - +a.getAttribute('data-rangfreq')
        })
            .appendTo($wrapper);
    }











    function ecrireAutoAnagramme(text) {
        $(".blocPhonemeOblig").removeClass('blocPhonemeOblig')
        $("#original").find(".blocPhoneme").addClass("phonemeAutoAnagrammes")
        $.each(text.split(""), function (i, lettre) {
            $("#original").find(".phonemeAutoAnagrammes>.phonemeAnagrammes").each(function () {
                if ($(this).html().toUpperCase() == lettre.toUpperCase()) {
                    $(this).parent().removeClass('phonemeAutoAnagrammes')
                    return false;
                }
            })
        })
    }

    $(".lgSelecter").click(function () {
        $(".lgSelecter").toggleClass('lgSelected')
        $("#help,#helpFirst,.elementDeMenu").prop('disabled', 'disabled')
        if ($(".lgSelected").attr('data-lg') == "en") {
            freqMots = freqEn
        } else {
            freqMots = freqFr
        }
        $("#help,#helpFirst,.elementDeMenu").prop('disabled', '')
    })
    $("#help,#helpFirst,.elementDeMenu").prop('disabled', '')
    var tailleMotMini = 1
    $("#tailleMotMini").val(tailleMotMini)


    $("body").on('contextmenu', '.blocPhoneme', function (e) {
        e.preventDefault()
        $(this).toggleClass("blocPhonemeOblig")
    });


    $("#filterBelowFrequence").change(function () {
        $("#buttonFiltrerBelowFrequence").trigger('click')
    })

    $("body").on("click", "#buttonFiltrerBelowFrequence", function (e) {
        filtrer(e.ctrlKey)
    })

    $("#help").click(function () {
        $(".boutonClassementVarianceFrequence").show()

        $("#resultatAuto").html("...")
        nbPropositions = 0
        nbPropositionsVisibles = 0
        updateNbPropositions()
        tailleMotMini = $("#tailleMotMini").val()
        changeSelecting(false)
        $("#resultatAuto").addClass('waiting');
        setTimeout(function () {
            $("#resultatAuto").html("")
            nbPropositions = 0
            nbPropositionsVisibles = 0
            //chercheParMots()

            var sonsATraiter = [];
            $(".phonemeAutoAnagrammes").each(function () {
                sonsATraiter.push(phonemesAnagrammes[$(this).find('.phonemeAnagrammes').html().toLowerCase()][0]);
            });
            input = sonsATraiter.join('').toUpperCase()


            $("#stopWorker").show()
            worker.terminate()
            worker = undefined
            worker = new Worker(new URL('./anagramworker.worker.js', import.meta.url));
            $(".elementDeMenu").show()
            worker.addEventListener('message', function (e) {
                if (e.data == "calcultermine") {
                    $("#stopWorker").hide()
                    return false;
                }
                if (!isSentenceLegit(e.data)) return
                let valide = passesFilters(e.data)
                if (valide || !$("#filterBelowFrequenceAutoRemove").is(':checked')) {


                    let motsElts = []
                    e.data.split(' ').forEach(function (elt) {
                        motsElts.push('<span class="motDePhrase">' + elt.toLowerCase() + '</span>')
                    })
                    let scoreFrequence = Math.round(getScoreFrequencePhrase(e.data))
                    let scoreVariance = Math.round(getVariance(e.data))
                    let proposition = $(
                        '<div class="proposition phraseEntiere last' + (valide || !$("#filterBelowFrequenceAuto").is(':checked') ? "" : " propositionCachee") + '" data-phrase="' + e.data + '" title="' + "v" + scoreVariance + ", f" + scoreFrequence + '" data-scorevariance="' + scoreVariance + '" data-scorefrequence="' + scoreFrequence + '">' +
                        '<span class="captionSuggestion">' +
                        motsElts.join(' ') +
                        '</span> ' +
                        '<span class="visuFrequenceWrap">' +
                        '<span class="visuFrequenceBar" style="width:' + scoreFrequence + '%">' + scoreFrequence + " - " + scoreVariance + '</span>' +
                        '</span>' +
                        '</div > '
                    )
                    proposition.find('.visuFrequence').html(scoreFrequence)
                    $("#resultatAuto").append(proposition)
                    nbPropositions++
                    if (valide || !$("#filterBelowFrequenceAuto").is(':checked')) nbPropositionsVisibles++
                    updateNbPropositions()
                }
            }, false);

            var l = $(".lgSelected").attr('data-lg')
            var motsAjoutes = $("#motsAjoutes").val().toUpperCase().split(' ')
            worker.postMessage(["chercheParMots", [input, $("#tailleMotMini").val(), exclus], l, motsAjoutes]); // Send data to our worker.






            $("#resultatAuto").removeClass('waiting');
        }, 100);
    });
    $("#helpFirst").on("click", function () {
        $("#resultatAuto").html("...")
        nbPropositions = 0
        nbPropositionsVisibles = 0
        tailleMotMini = $("#tailleMotMini").val()
        changeSelecting(false)
        $("#resultatAuto").addClass('waiting');
        setTimeout(function () {
            $("#resultatAuto").html("")
            nbPropositions = 0
            nbPropositionsVisibles = 0
            var sonsATraiter = [];
            $(".phonemeAutoAnagrammes").each(function () {
                sonsATraiter.push(phonemesAnagrammes[$(this).find('.phonemeAnagrammes').html().toLowerCase()][0]);
            });
            input = sonsATraiter.join('').toUpperCase()
            var obligs = ""
            $(".blocPhonemeOblig").each(function () {
                obligs = obligs + phonemesAnagrammes[$(this).find('.phonemeAnagrammes').html().toLowerCase()][0].toUpperCase()
            });


            $("#stopWorker").show()
            worker.terminate()
            worker = undefined
            worker = new Worker(new URL('./anagramworker.worker.js', import.meta.url));
            $(".elementDeMenu").show()
            $(".boutonClassementVarianceFrequence").hide()
            worker.addEventListener('message', function (e) {
                if (e.data == "calcultermine") {
                    $("#stopWorker").hide()
                    return false;
                }

                let scoreFrequence = Math.round(getScoreFrequencePhrase(e.data[0]))
                updateNbPropositions()



                $("#resultatAuto").append('<div class="proposition last propositionHelpFirst" data-reste="' + e.data[1] + '" data-phrase="' + e.data[0] + '">' +
                    '<span class="captionSuggestion">' +
                    '<span class="motDePhrase">' + e.data[0].toLowerCase() + '</span> (' + e.data[1] + ')' +
                    '</span > ' +
                    '<span class="visuFrequenceWrap">' +
                    '<span class="visuFrequenceBar" style="width:' + scoreFrequence + '%">' + scoreFrequence + '</span>' +
                    '</span>' +
                    '</div > ')
                nbPropositions++
                nbPropositionsVisibles++
                updateNbPropositions()
            }, false);
            var l = $(".lgSelected").attr('data-lg')
            var motsAjoutes = $("#motsAjoutes").val().toUpperCase().split(' ')
            worker.postMessage(["findFirsts", [input, obligs, exclus], l, motsAjoutes]); // Send data to our worker.
            $("#resultatAuto").removeClass('waiting');
        }, 100);
    });

    $("body").on('click', '.motDePhrase', function (e) {
        if ($(this).closest('.proposition').hasClass('propositionHelpFirst')) {
            return
        }
        e.preventDefault()
        if (e.shiftKey) {
            e.preventDefault()
            ecrireAutoAnagramme($(this).html())
        } else {
            $("#exclureDuDico").val($("#exclureDuDico").val() + " " + $(this).html())
            $("#exclureDuDico").trigger('change')

        }
    });
    $("body").on('click', '.proposition:not(".last .phraseEntiere")>.captionSuggestion', function (e) {
        e.stopPropagation()
        e.preventDefault()
        if (e.ctrlKey) {
            classerPropositions($(this).parent())
            return false
        }
        if (e.shiftKey) {
            e.preventDefault()
            return false
        }
        $(this).parent().find('.proposition').remove()
        $(this).parent().addClass('last')
    });
    $("body").on('click', '.proposition.last', function (e) {
        e.preventDefault()
        if (e.ctrlKey) {
            return false
        }
        if (e.shiftKey) {
            e.preventDefault()
            if ($(this).find('.captionSuggestion').html().indexOf('(') !== -1) {
                ecrireAutoAnagramme($(this).attr('data-phrase'))
            }
            return false
        }
        var prop = $(this)
        prop.removeClass("last")
        if (prop.attr('data-reste') == 0) {
            return false
        }
        //var soluces = findFirsts(prop.attr('data-reste').toUpperCase());


        $("#stopWorker").show()
        worker.terminate()
        worker = undefined
        worker = new Worker(new URL('./anagramworker.worker.js', import.meta.url));
        $(".elementDeMenu").show()
        worker.addEventListener('message', function (e) {
            if (e.data == "calcultermine") {
                $("#stopWorker").hide()
                return false;
            }
            var newProp = $('<div class="proposition last" data-reste="' + e.data[1] + '" data-phrase="' + e.data[0] + '"><span class="captionSuggestion">' + e.data[0].toLowerCase() + '</span> (' + e.data[1] + ')<span class="reduireProposition">-</span></div>')
            prop.append(newProp)
            newProp.css('padding-left', newProp.parents().length * 2 + "px");
        }, false);
        var l = $(".lgSelected").attr('data-lg')
        var motsAjoutes = $("#motsAjoutes").val().toUpperCase().split(' ')
        worker.postMessage(["findFirsts", [prop.attr('data-reste').toUpperCase(), "", exclus], l, motsAjoutes]);
    });

    /*
        $("body").on('click','.proposition:not(.last)',function(e){
            e.stopPropagation()
            e.preventDefault()
            if (e.ctrlKey) {
                classerPropositions($(this))
            }
        })*/


    $("body").on('click', '.reduireProposition', function () {
        $(this).parent().find('.proposition').remove()
        $(this).parent().addClass('last')
    });

    $("body").on('contextmenu', '.proposition.last', function (e) {
        e.preventDefault()
        var prop = $(this)
        prop.removeClass("last")
        if (prop.attr('data-reste') == 0) {
            return false
        }

        $("#stopWorker").show()
        worker.terminate()
        worker = undefined
        worker = new Worker(new URL('./anagramworker.worker.js', import.meta.url));
        $(".elementDeMenu").show()
        worker.addEventListener('message', function (e) {
            if (e.data == "calcultermine") {
                $("#stopWorker").hide()
                return false;
            }
            var newProp = $('<div class="proposition last" data-phrase="' + e.data + '"><span class="captionSuggestion">' + e.data.toLowerCase() + '</span></div>')
            prop.append(newProp)
            newProp.css('padding-left', newProp.parents().length * 2 + "px");
        }, false);
        var l = $(".lgSelected").attr('data-lg')
        var motsAjoutes = $("#motsAjoutes").val().toUpperCase().split(' ')
        worker.postMessage(["getChercheParMots", [prop.attr('data-reste').toUpperCase(), $("#tailleMotMini").val(), exclus], l, motsAjoutes]); // Send data to our worker.

    });

    $("body").on('contextmenu', '.proposition:not(.last)', function (e) {
        e.stopPropagation()
        e.preventDefault()
        if (e.ctrlKey) {
            classerPropositionsTaille($(this))
        }
    })











































    var isLocked = false;

    var phonemesAnagrammes = {

        "a": ["a"],
        "z": ["z"],
        "e": ["e"],
        "r": ["r"],
        "t": ["t"],
        "y": ["y"],
        "u": ["u"],
        "i": ["i"],
        "o": ["o"],
        "p": ["p"],

        "q": ["q"],
        "s": ["s"],
        "d": ["d"],
        "f": ["f"],
        "g": ["g"],
        "h": ["h"],
        "j": ["j"],
        "k": ["k"],
        "l": ["l"],
        "m": ["m"],

        "w": ["w"],
        "x": ["x"],
        "c": ["c"],
        "v": ["v"],
        "b": ["b"],
        "n": ["n"]
    }



    $("#invertHelp").click(function () {
        $("#original>.blocPhoneme").toggleClass('phonemeAutoAnagrammes')
    });

    $("#selectTout").click(function () {
        $("#original>.blocPhoneme").addClass('phonemeAutoAnagrammes')
    });
    var isSelecting = false;
    function changeSelecting(bool) {
        if (bool) {
            $(".phonemeAutoAnagrammes").removeClass('phonemeAutoAnagrammes')
            $("#selectHelp").css('background-color', 'lightblue')
            $(".lignePhonemesWrap>.blocPhoneme").addClass('selectable')
        } else {
            $("#selectHelp").css('background-color', 'white')
            $(".lignePhonemesWrap>.blocPhoneme").removeClass('selectable')
        }
        isSelecting = bool;
    }

    $("#selectHelp").click(function () {
        if (isSelecting) {
            changeSelecting(false)
        } else {
            changeSelecting(true)
        }
    });

    $("body").on('mouseup', '.blocPhoneme', function () {
        var $this = $(this)
        var pho = $this.find('.phonemeAnagrammes').html()
        if (isSelecting && $(this).parent().attr('id') != "original") {
            var phoneme = $("#original>.blocPhoneme").not(".phonemeAutoAnagrammes").filter(function () {
                return $(this).find('.phonemeAnagrammes').html() == pho
            }).eq(0)
            phoneme.closest('.blocPhoneme').addClass('phonemeAutoAnagrammes')
            $(this).removeClass('selectable')
        }
    });

    $("#original").sortable()
    $("body").on("click", "#original>.blocPhoneme", function () {
        if (isLocked && !isSelecting) {
            $(this).toggleClass("phonemeAutoAnagrammes");
        }
    })


    $("#phraseOriginale").keyup(function () {
        if (!isLocked) {
            var str = $(this).val()
            str = str.replace(/[èéêë]/g, "e")
            str = str.replace(/[à]/g, "a")
            str = str.replace(/[ç]/g, "c")
            str = str.replace(/[^a-zA-Z]+/g, '')
            $("#original").sortable("destroy").html('')
            $.each(str.split(''), function (i, elt) {
                $("#original").append(getEltPhoneme(elt, "deletable"));
            });
            $("#original").sortable()
        }

    });



    $(".toggleAide").click(function () {
        $("#aide").slideToggle();
    });
    $("#wrapIdees").sortable({
        delay: 150,
        "handle": ".enteteLigne"
    });
    $("#clear").click(function () {
        $("#motDeDepart").html('');
    });

    $("#reinit").click(function () {
        $("#anagScore").html('')
        $("#original").html('');
        $("#original").sortable()
        $("#wrapIdees").html('');
        $("#creerOriginal").show();
        $("#phraseOriginale").show()
        $("#reinit,#selectLettresParTexte,#nouvelleLigne,#help,#resultatAuto,#selectHelp,#invertHelp,#tailleMotMini,#nbCandidats,#helpFirst,.elementDeMenu").hide();
        isLocked = false
        $("#phraseOriginale").prop('disabled', false).val('')
    });
    $("#nouvelleLigne").click(function () {
        appendLigne(lignetoJson($("#original")), "prepend")
    });
    $("#creerOriginal").click(function (evt) {
        var contrepet = "";
        var phosInContrepet = []
        $("#original").find('.phonemeAnagrammes').each(function () {
            phosInContrepet.push($(this).html())
        });
        contrepet = phosInContrepet.join('')


        isLocked = true
        $("#original").find('.deletePhoneme').remove();
        $("#original").sortable("destroy")
        appendLigne(lignetoJson($("#original")))
        $("#creerOriginal").hide();
        $("#resultatAuto").removeClass('waiting').html('')
        $("#reinit,#selectLettresParTexte,#nouvelleLigne,#help,#resultatAuto,#selectHelp,#invertHelp,#tailleMotMini,#nbCandidats,#helpFirst, #selectTout").show();
        $("#phraseOriginale").hide()
        $("#original>.blocPhoneme").trigger('click')
        $("#shareUrl").html(contrepet)
        $("#phraseOriginale").prop('disabled', true)
        $("#tailleMotMini").trigger('change')
    });
    $("body").on("keyup change", "#selectLettresParTexte", function () {
        $("#original").find(".blocPhoneme").addClass('phonemeAutoAnagrammes')
        let string = $(this).val()
        for (let index = 0; index < string.length; index++) {
            $(".phonemeAutoAnagrammes[data-lettre='" + string[index] + "']").eq(0).removeClass('phonemeAutoAnagrammes')
        }
    })

    $("body").on("click", ".deletePhoneme", function () {
        $(this).closest('.blocPhoneme').remove();
    })
    $("body").on("mouseup", ".modeLigne", function () {
        var ligne = $(this).closest('.ligne')
        var modeActuel = ligne.attr('data-mode');
        if (modeActuel == "tri") {
            ligne.find('.lignePhonemesWrap').sortable("destroy");
            ligne.animate({ "height": "300px" }, 500, function () {
                ligne.resizable()
            });

            ligne.find('.blocPhoneme').draggable({
                delay: 20,
                containment: ligne
            })
            ligne.find('.modeLigne').html('Sort')
            ligne.attr('data-mode', 'dessin')
        } else {
            ligne.find('.blocPhoneme').draggable("destroy");
            ligne.resizable("destroy")
            ligne.animate({ "height": "" }, 500, function () {
                ligne.css('height', '');
            });
            //
            var phonemesAnagrammes2 = [];
            ligne.find('.blocPhoneme').each(function () {
                phonemesAnagrammes2.push([$(this).find('.phonemeAnagrammes').html(), parseInt($(this).position().left)]);
            });
            phonemesAnagrammes2.sort(function (a, b) {
                return a[1] - b[1]
            });
            ligne.find('.lignePhonemesWrap').html('');
            $.each(phonemesAnagrammes2, function (i, elt) {
                ligne.find('.lignePhonemesWrap').append(getEltPhoneme(elt[0], "notDeletable"))
            })
            ligne.find('.lignePhonemesWrap').sortable();
            ligne.find('.modeLigne').html('Draw')
            ligne.attr('data-mode', 'tri')
        }
    })

    $("body").on("mouseup", ".dupliquerLigne", function () {
        appendLigne(lignetoJson($(this).closest('.ligne')), $(this).closest('.ligne'))
    })
    $("body").on("mouseup", ".supprimerLigne", function () {
        $(this).closest('.ligne').remove();
    })

    function appendLigne(data, after) {
        var ligne = $('<div class="ligne" data-mode="tri"><div class="enteteLigne"><input type="text" class="aideMemoire"><div class="blocCommandesLigne"><div class="modeLigne">Draw</div><div class="dupliquerLigne">+</div><div class="supprimerLigne">X</div></div></div><div class="lignePhonemesWrap"></div></div>')
        $.each(data, function (i, elt) {
            ligne.find('.lignePhonemesWrap').append(getEltPhoneme(elt, "notDeletable"));
        });
        ligne.find('.lignePhonemesWrap').sortable();
        if (after == "prepend") {
            $("#wrapIdees").prepend(ligne);
        } else if (after === undefined) {
            $("#wrapIdees").append(ligne);
        } else {
            after.after(ligne);
        }
    }

    function lignetoJson(ligne) {
        var retour = [];
        ligne.find('.phonemeAnagrammes').each(function () {
            retour.push($(this).html());
        });
        return retour;
    }
    function getEltPhoneme(phoneme, deletable) {
        var deleteStr = "";
        if (deletable == "deletable") {
            deleteStr = '<div class="deletePhoneme">x</div>'
        }
        return $('<div class="blocPhoneme" data-lettre="' + phoneme.toLowerCase() + '"><div class="phonemeAnagrammes">' + phoneme + '</div>' + deleteStr + '</div>')
    }



    var getUrlParameter = function getUrlParameter(sParam) {
        var sPageURL = decodeURIComponent(window.location.search.substring(1)),
            sURLVariables = sPageURL.split('&'),
            sParameterName,
            i;

        for (i = 0; i < sURLVariables.length; i++) {
            sParameterName = sURLVariables[i].split('=');

            if (sParameterName[0] === sParam) {
                return sParameterName[1] === undefined ? true : sParameterName[1];
            }
        }
    };
    $("#tailleMotMini").contextmenu(function (e) {
        e.preventDefault()
        if ($(this).val() == 1) {
            $(this).val(4)
        } else {
            $(this).val(1)
        }
    })
    if (getUrlParameter('lettres') !== undefined) {
        $("#creerOriginal").trigger('click')
        //$("#help").trigger('click')
        $(".modeLigne").eq(0).trigger('click');
    }
    $("#phraseOriginale").trigger('keyup')
});

$("#help,#helpFirst,.elementDeMenu").prop('disabled', 'disabled')
