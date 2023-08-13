self.addEventListener('message', function (e) {




    importScripts("dico_fr.js");
    importScripts("dico_en.js");

    var dicoAnagrammes;

    var tailleMotMini;
    var exclus;

    function findAllWords(inputS) {

        var words = [];


        for (var aaa = 0, len = dicoAnagrammes.length; aaa < len; aaa++) {
            var w = dicoAnagrammes[aaa]
            var S = inputS;
            var ICW = true;
            var i = 0;
            while (i < w.length && ICW) {
                var index = S.indexOf(w[i]);
                if (index == -1) { ICW = false; }
                else { S = S.substring(0, index) + S.substring(index + 1); }
                i++;
            }
            if (ICW && w.length >= tailleMotMini) { words.push(w); }
        }

        return (words);
    }

    function findNextDico(inputS, startWord, dicoLocal) {

        var newDico = [];
        var restList = [];
        var startIndex = dicoLocal.indexOf(startWord);


        for (var wInd = startIndex; wInd < dicoLocal.length; wInd++) {

            var w = dicoLocal[wInd];
            var i = 0;
            var OK = true;
            if (w.length > inputS.length || w.length < tailleMotMini) {
                OK = false;
            } else {
                var S = inputS;
            }

            while (i < w.length && OK) {
                var index = S.indexOf(w[i]);
                if (index == -1) { OK = false; }
                else { S = S.substring(0, index) + S.substring(index + 1); }//delete char
                i++;
            }// end while

            if (OK && exclus.indexOf(w) === -1) {
                newDico.push(w);
                restList.push(S);
            }
        }// end for
        return [newDico, restList];

    }// end fn


    function findSentences(inputS, startWord, dicoLocal, expectedLength) {

        var dicos = findNextDico(inputS, startWord, dicoLocal);
        var newDico = dicos[0];
        var restList = dicos[1];

        var words = [];
        for (var i = 0, len = newDico.length; i < len; i++) {
            var S = restList[i];
            var w = newDico[i];
            if (S) {
                var sentences = findSentences(S, w, newDico, expectedLength)
                for (var bbb = 0, len2 = sentences.length; bbb < len2; bbb++) {
                    if ((w + " " + sentences[bbb]).replace(/ /g, "").length == expectedLength) self.postMessage(w + " " + sentences[bbb]);
                    words.push(w + " " + sentences[bbb])
                }
            } else {
                if ((w).length == expectedLength) self.postMessage(w);
                words.push(w);
            }
        }
        return words;
    }


    function chercheParMots(input, tailleMotMiniIn, exclusIn, expectedLength) {
        exclus = exclusIn
        tailleMotMini = tailleMotMiniIn
        var localDico = findAllWords(input);
        var soluces = findSentences(input, localDico[0], localDico, expectedLength);
        if (soluces.length == 0) self.postMessage("<span style='font-style:italic'>pas de résultat</span>")
    }



    function getChercheParMots(input, tailleMotMiniIn, exclusIn, expectedLength) {

        exclus = exclusIn
        tailleMotMini = tailleMotMiniIn
        var localDico = findAllWords(input);
        var soluces = findSentences(input, localDico[0], localDico, expectedLength);
        return soluces
    }


    function findFirsts(inputS, oblig, exclus) {
        if (oblig === undefined) oblig = ""
        var words = [];
        for (var aaa = 0, len = dicoAnagrammes.length; aaa < len; aaa++) {
            var w = dicoAnagrammes[aaa]
            var S = inputS;
            var ICW = true;
            var i = 0;
            while (i < w.length && ICW) {
                var index = S.indexOf(w[i]);
                if (index == -1) { ICW = false; }
                else {
                    S = S.substring(0, index) + S.substring(index + 1);
                }
                i++;
            }
            var S2 = w.split("").join("");
            var autorise = true;
            var i = 0;
            while (i < oblig.length && autorise) {
                var index = S2.indexOf(oblig[i]);
                if (index == -1) { ICW = false; }
                else {
                    S2 = S2.substring(0, index) + S2.substring(index + 1);
                }
                i++;
            }
            if (ICW && autorise && exclus.indexOf(w) === -1) {
                self.postMessage([w, S.toLowerCase()]);
                words.push([w, S.toLowerCase()]);
            }
        }
        return words;

    }




    if (e.data[0] == "findFirsts") {
        if (e.data[2] == "fr") {
            dicoAnagrammes = dicoAnagrammesFr
        } else {
            dicoAnagrammes = dicoAnagrammesEn
        }
        dicoAnagrammes = dicoAnagrammes.concat(e.data[3])
        dicoAnagrammes.sort(function (a, b) {
            return b.length - a.length || a.localeCompare(b)
        })
        findFirsts(e.data[1][0], e.data[1][1], e.data[1][2]);
        self.postMessage("calcultermine");
    }
    if (e.data[0] == "chercheParMots") {
        if (e.data[2] == "fr") {
            dicoAnagrammes = dicoAnagrammesFr
        } else {
            dicoAnagrammes = dicoAnagrammesEn
        }
        dicoAnagrammes = dicoAnagrammes.concat(e.data[3])
        dicoAnagrammes.sort(function (a, b) {
            return b.length - a.length || a.localeCompare(b)
        })
        chercheParMots(e.data[1][0], e.data[1][1], e.data[1][2], e.data[1][0].length);
        self.postMessage("calcultermine");
    }
    if (e.data[0] == "getChercheParMots") {
        if (e.data[2] == "fr") {
            dicoAnagrammes = dicoAnagrammesFr
        } else {
            dicoAnagrammes = dicoAnagrammesEn
        }
        dicoAnagrammes = dicoAnagrammes.concat(e.data[3])
        dicoAnagrammes.sort(function (a, b) {
            return b.length - a.length || a.localeCompare(b)
        })
        getChercheParMots(e.data[1][0], e.data[1][1], e.data[1][2], e.data[1][0].length);
        self.postMessage("calcultermine");
    }




    //self.postMessage(e.data);
}, false);


