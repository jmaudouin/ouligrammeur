
$(function () {

    function chercheParMots() {
        console.log("pokpokpokpokp")
        $("#resultatAutoContrepet").html('')
        var sonsATraiter = [];
        $(".phonemeAutoContrepet").each(function () {
            sonsATraiter.push(phonemes[$(this).find('.phonemeContrepet').html()][0]);
        });
        input = sonsATraiter.join('')
        console.log(input)
        var soluces = allSoluces(input);
        console.log(soluces)
        $.each(soluces, function (i, val) {
            $("#resultatAutoContrepet").append('<div class="propositionContrepet lastContrepet" data-reste="' + val[1] + '"><span class="captionSuggestionContrepet">' + val[0].join(',') + '</span> (' + sonsToPho(val[1]) + ')<span class="reduirePropositionContrepet">-</span></div>')
        });
    }
    function sonsToPho(str) {
        var retour = []
        var arr = str.split('')
        $.each(arr, function (nth, dicoSon) {
            $.each(phonemes, function (humanPho, dicoPho) {
                if (dicoPho[0] == dicoSon) {
                    retour.push(humanPho)
                }
            });
        });
        console.log(retour.join(' '))
        return retour.join(' ')
    }
    $("body").on('click', '.reduirePropositionContrepet', function () {
        $(this).parent().find('.propositionContrepet').remove()
        $(this).parent().addClass('lastContrepet')
    });
    /*
        $("body").on('click','.propositionContrepet:not(".lastContrepet")',function(){
            $(this).find('.propositionContrepet').remove()
            $(this).addClass('lastContrepet')
        });
        */
    $("body").on('click', '.propositionContrepet:not(".lastContrepet")>.captionSuggestionContrepet', function () {
        $(this).parent().find('.propositionContrepet').remove()
        $(this).parent().addClass('lastContrepet')
    });

    $("body").on('click', '.propositionContrepet.lastContrepet', function () {
        var prop = $(this)
        prop.removeClass("lastContrepet")
        if (prop.attr('data-reste') == 0) {
            return false
        }
        var soluces = allSoluces(prop.attr('data-reste'));
        $.each(soluces, function (i, val) {
            var newProp = $('<div class="propositionContrepet lastContrepet" data-reste="' + val[1] + '"><span class="captionSuggestionContrepet">' + val[0].join(',') + '</span> (' + sonsToPho(val[1]) + ')<span class="reduirePropositionContrepet">-</span></div>')
            prop.append(newProp)
            newProp.css('padding-left', newProp.parents().length * 2 + "px");
        });
    });

    function allSoluces(inputSons) {
        var retour = []
        $.each(dico, function (son, mots) {
            var matching = inputAgainstSon(inputSons, son)
            if (matching) {
                retour.push(matching)
            }
        });
        function compare(a, b) {
            if (a[1].length < b[1].length)
                return -1;
            if (a[1].length > b[1].length)
                return 1;


            return 0;
        }

        retour.sort(compare);
        return retour;

    }

    function inputAgainstSon(input, son) {

        if (son.length > input.length) {
            return false
        }
        var resteInput = input;
        var resteSon = son;
        var result;
        function makeMatch() {
            if (resteInput.indexOf(resteSon[0]) > -1) {
                resteInput = resteInput.replace(resteSon[0], "");
                resteSon = resteSon.substring(1);
                if (resteSon.length == 0) {
                    result = [
                        $.unique(dico[son]),
                        resteInput
                    ]
                } else {
                    makeMatch()
                }
            } else {
                result = false
            }
        }
        makeMatch()
        return result

    }

    $("#helpContrepet").click(function () {

        console.log('pokpok')
        changeSelecting(false)
        $("#resultatAutoContrepet").addClass('waitingContrepet');

        chercheParMots()

        $("#resultatAutoContrepet").removeClass('waitingContrepet');
    });


    var isLocked = false;

    var phonemes = {

        "a": [
            "a", "tr<strong>a</strong>l<strong>a</strong>l<strong>a</strong>"
        ],
        "e": [
            "2", "ch<strong>e</strong>v<strong>eu</strong>x"
        ],
        "eu": [
            "9", "j<strong>eu</strong>ne"
        ],
        "é": [
            "e", "<strong>é</strong>t<strong>é</strong>"
        ],
        "è": [
            "E", "hiv<strong>er</strong>"
        ],
        "en": [
            "@", "tr<strong>an</strong>ch<strong>ant</strong>"
        ],
        "i": [
            "i", "f<strong>i</strong>n<strong>i</strong>"
        ],
        "in": [
            "1", "t<strong>in</strong>t<strong>in</strong>"
        ],
        "ô": [
            "o", "t<strong>o</strong>t<strong>o</strong>"
        ],
        "au": [
            "O", "h<strong>o</strong>mme"
        ],
        "ou": [
            "u", "p<strong>ou</strong>t<strong>ou</strong>"
        ],
        "on": [
            "$", "t<strong>on</strong>t<strong>on</strong>"
        ],
        "u": [
            "y", "t<strong>u</strong>t<strong>u</strong>"
        ],
        "oi": [
            "W", "v<strong>oix</strong>"
        ],
        "y": [
            "j", "nou<strong>ille</strong>"
        ],
        "b": [
            "b", "<strong>b</strong>o<strong>b</strong>o"
        ],
        "ch": [
            "S", "<strong>ch</strong>at"
        ],
        "d": [
            "d", "<strong>d</strong>é<strong>d</strong>ain"
        ],
        "f": [
            "f", "<strong>f</strong>an<strong>f</strong>an"
        ],
        "g": [
            "g", "<strong>g</strong>a<strong>g</strong>"
        ],
        "j": [
            "Z", "<strong>j</strong>eune"
        ],
        "k": [
            "k", "<strong>k</strong>a<strong>k</strong>i"
        ],
        "l": [
            "l", "tra<strong>l</strong>a<strong>l</strong>a"
        ],
        "m": [
            "m", "<strong>m</strong>a<strong>m</strong>an"
        ],
        "n": [
            "n", "<strong>n</strong>o<strong>n</strong>e"
        ],
        "p": [
            "p", "<strong>p</strong>a<strong>p</strong>a"
        ],
        "r": [
            "R", "ho<strong>r</strong>ai<strong>r</strong>e"
        ],
        "ss": [
            "s", "a<strong>s</strong>tu<strong>c</strong>e"
        ],
        "t": [
            "t", "<strong>t</strong>on<strong>t</strong>on"
        ],
        "v": [
            "v", "<strong>v</strong>ou<strong>v</strong>oie"
        ],
        "z": ["z", "oi<strong>s</strong>eu<strong>s</strong>e"]
    }

    $("body").on("mouseenter", "#wrapPhonemesContrepet>.blocPhonemeContrepet", function () {
        $("#exemplePhoContrepet").html(phonemes[$(this).find('.phonemeContrepet').html()][1].toUpperCase())
    }).on("mouseleave", "#wrapPhonemesContrepet>.blocPhonemeContrepet", function () {
        $("#exemplePhoContrepet").html('')
    })


    $("#invertHelpContrepet").click(function () {
        $("#originalContrepet>.blocPhonemeContrepet").toggleClass('phonemeAutoContrepet')
    });

    var isSelecting = false;
    function changeSelecting(bool) {
        if (bool) {
            $(".phonemeAutoContrepet").removeClass('phonemeAutoContrepet')
            $("#selectHelpContrepet").css('background-color', 'lightblue')
            $(".lignePhonemesWrapContrepet>.blocPhonemeContrepet").addClass('selectableContrepet')
        } else {
            $("#selectHelpContrepet").css('background-color', 'white')
            $(".lignePhonemesWrapContrepet>.blocPhonemeContrepet").removeClass('selectableContrepet')
        } isSelecting = bool;
    }

    $("#selectHelpContrepet").click(function () {
        if (isSelecting) {
            changeSelecting(false)
        } else {
            changeSelecting(true)
        }
    });

    $("body").on('click', '.blocPhonemeContrepet', function () {
        var $this = $(this)
        var pho = $this.find('.phonemeContrepet').html()
        if (isSelecting) {
            var phoneme = $("#originalContrepet>.blocPhonemeContrepet").not(".phonemeAutoContrepet").filter(function () {
                return $(this).find('.phonemeContrepet').html() == pho
            }).eq(0)
            phoneme.closest('.blocPhonemeContrepet').addClass('phonemeAutoContrepet')
        }
    });


    $.each(phonemes, function (key, val) {
        $("#wrapPhonemesContrepet").append(getEltPhoneme(key, "notDeletable"));
    });

    $("#wrapPhonemesContrepet").find('.blocPhonemeContrepet').eq(14).after('<br>')
    $("#originalContrepet").sortable()
    $("body").on("click", "#originalContrepet>.blocPhonemeContrepet", function () {
        if (isLocked) {
            $(this).toggleClass("phonemeAutoContrepet");
        }
    })

    $("#wrapPhonemesContrepet>.blocPhonemeContrepet").click(function () {
        if (!isLocked) {
            $("#originalContrepet").sortable("destroy")
            $("#originalContrepet").append(getEltPhoneme($(this).find('.phonemeContrepet').html(), "deletable"));
            $("#originalContrepet").sortable()
        }
    });
    $("#wrapPhonemesContrepet>.blocPhonemeContrepet").draggable({ containment: "body", revert: true });
    $(".toggleAideContrepet").click(function () {
        $("#aideContrepet").slideToggle();
    });
    $("#toggleChatonContrepet").click(function () {
        if ($("#logo").attr('data-img') == "logo") {
            $("#logo").attr('src', 'chaton_trop_mignon.jpg').attr('data-img', 'chaton')
        } else {
            $("#logo").attr('src', 'oulipo.jpg').attr('data-img', 'logo')
        }
    });
    $("#wrapIdeesContrepet").sortable({ "handle": ".enteteLigneContrepet" });
    $("#clear").click(function () {
        $("#motDeDepart").html('');
    });

    $("#reinitContrepet").click(function () {
        $("#originalContrepet").html('');
        $("#originalContrepet").sortable()
        $("#wrapIdeesContrepet").html('');
        $("#creerOriginalContrepet").show();
        $("#reinitContrepet,#nouvelleLigneContrepet,#helpContrepet,#resultatAutoContrepet,#selectHelpContrepet,#invertHelpContrepet").hide();
        isLocked = false
        $("#wrapPhonemesContrepet").slideDown();
    });
    $("#nouvelleLigneContrepet").click(function () {
        appendLigne(lignetoJson($("#originalContrepet")), "prepend")
    });
    $("#creerOriginalContrepet").click(function (evt) {
        var contrepet = "";
        var phosInContrepet = []
        $("#originalContrepet").find('.phonemeContrepet').each(function () {
            phosInContrepet.push($(this).html())
        });
        contrepet = phosInContrepet.join('-')
        if (!evt.ctrlKey) {
            $.ajax({
                url: "http://services.emerit.net/jean-marc/musique/pimp_my_neck/index.php?id=587",
                type: "POST",
                data: {
                    contrepet: contrepet
                },
                success: function (data) { }
            });
        }

        if ($("#originalContrepet").find('.phonemeContrepet').length == 0) {
            alert("Cliquez sur les phonèmes pour créer la phrase de départ")
            return false;
        }
        if ($("#originalContrepet").find('.phonemeContrepet').length == 1) {
            alert("Un seul phonème ? C'est une contrepèterie belge ? Caméra cachée ?")
            return false;
        }
        if ($("#originalContrepet").find('.phonemeContrepet').length == 2) {
            alert("Une contrepèterie à 2 phonèmes ? Trouvé !")
            return false;
        }


        isLocked = true
        $("#originalContrepet").find('.deletePhonemeContrepet').remove();
        $("#originalContrepet").sortable("destroy")
        appendLigne(lignetoJson($("#originalContrepet")))
        $("#creerOriginalContrepet").hide();
        $("#resultatAutoContrepet").removeClass('waitingContrepet').html('')
        $("#reinitContrepet,#nouvelleLigneContrepet,#helpContrepet,#resultatAutoContrepet,#selectHelpContrepet,#invertHelpContrepet").show();
        $("#wrapPhonemesContrepet").slideUp();
        $("#originalContrepet>.blocPhonemeContrepet").trigger('click')
        $("#shareUrlContrepet").html('http://www.megraph.net/oulipo/contrepeteur.html?phos=' + contrepet)
    });

    $("body").on("click", ".deletePhonemeContrepet", function () {
        $(this).closest('.blocPhonemeContrepet').remove();
    })
    $("body").on("click", ".modeLigneContrepet", function () {
        var ligne = $(this).closest('.ligneContrepet')
        var modeActuel = ligne.attr('data-mode');
        if (modeActuel == "tri") {
            ligne.find('.lignePhonemesWrapContrepet').sortable("destroy");
            ligne.animate({
                "height": "300px"
            }, 500, function () {
                ligne.resizable()
            });

            ligne.find('.blocPhonemeContrepet').draggable({ containment: ligne })
            ligne.find('.modeLigneContrepet').html('Mode tri')
            ligne.attr('data-mode', 'dessin')
        } else {
            ligne.find('.blocPhonemeContrepet').draggable("destroy");
            ligne.resizable("destroy")
            ligne.animate({
                "height": ""
            }, 500, function () {
                ligne.css('height', '');
            });
            //
            var phonemes2 = [];
            ligne.find('.blocPhonemeContrepet').each(function () {
                phonemes2.push([
                    $(this).find('.phonemeContrepet').html(), parseInt($(this).position().left)
                ]);
            });
            phonemes2.sort(function (a, b) {
                return a[1] - b[1]
            });
            ligne.find('.lignePhonemesWrapContrepet').html('');
            $.each(phonemes2, function (i, elt) {
                ligne.find('.lignePhonemesWrapContrepet').append(getEltPhoneme(elt[0], "notDeletable"))
            })
            ligne.find('.lignePhonemesWrapContrepet').sortable();
            ligne.find('.modeLigneContrepet').html('Mode dessin')
            ligne.attr('data-mode', 'tri')
        }
    })

    $("body").on("click", ".dupliquerLigneContrepet", function () {
        appendLigne(lignetoJson($(this).closest('.ligneContrepet')), $(this).closest('.ligneContrepet'))
    })
    $("body").on("click", ".supprimerLigneContrepet", function () {
        $(this).closest('.ligneContrepet').remove();
    })
    $.ajax({
        url: "http://services.emerit.net/jean-marc/musique/pimp_my_neck/index.php?id=587",
        type: "POST",
        data: {
            contrepet: "+"
        },
        success: function (data) { }
    });

    function appendLigne(data, after) {
        var ligne = $('<div class="ligneContrepet" data-mode="tri"><div class="enteteLigneContrepet"><input type="text" class="aideMemoireContrepet"><div class="blocCommandesLigneContrepet"><div class="modeLigneContrepet">mode dessin</div><div class="dupliquerLigneContrepet">Dupliquer</div><div class="supprimerLigneContrepet">Supprimer</div></div></div><div class="lignePhonemesWrapContrepet"></div></div>')
        $.each(data, function (i, elt) {
            ligne.find('.lignePhonemesWrapContrepet').append(getEltPhoneme(elt, "notDeletable"));
        });
        ligne.find('.lignePhonemesWrapContrepet').sortable();
        if (after == "prepend") {
            $("#wrapIdeesContrepet").prepend(ligne);
        } else if (after === undefined) {
            $("#wrapIdeesContrepet").append(ligne);
        } else {
            after.after(ligne);
        }
    }

    function lignetoJson(ligne) {
        var retour = [];
        ligne.find('.phonemeContrepet').each(function () {
            retour.push($(this).html());
        });
        return retour;
    }
    function getEltPhoneme(phoneme, deletable) {
        var deleteStr = "";
        if (deletable == "deletable") {
            deleteStr = '<div class="deletePhonemeContrepet">x</div>'
        }
        return $('<div class="blocPhonemeContrepet"><div class="phonemeContrepet">' + phoneme + '</div>' + deleteStr + '</div>')
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
    if (getUrlParameter('phos') !== undefined) {
        var phos = getUrlParameter('phos').split('-')
        $.each(phos, function (i, pho) {
            $("#wrapPhonemesContrepet>.blocPhonemeContrepet").filter(function () {
                return $(this).find('.phonemeContrepet').html() == pho
            }).trigger('click')
        });
        $("#creerOriginalContrepet").trigger('click')
        $("#helpContrepet").trigger('click')
        $(".modeLigneContrepet").eq(0).trigger('click');
    }


});
