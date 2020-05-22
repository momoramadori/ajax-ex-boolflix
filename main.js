$(document).ready(function() {
    var source   = $("#entry-template").html();
    var template = Handlebars.compile(source);

    //intercetto il click sul bottone
    $('button').click(function() {
        //nascondo tutti i film
        $('div.entry').hide();
        //nascondo l'avviso di nessun risultato
        $('.no-results').removeClass('active')
        //creo una variabile per salvare l'input dell'utente
        var testo_utente = $('input').val();
        $.ajax({
            'url':'https://api.themoviedb.org/3/search/movie',
            'method':'GET',
            'data':{
                'api_key':'0c5280dc3d5b58e1162d83dd9b44e7d5',
                'query': testo_utente
            },
            'success': function(data) {
                var founded_films = data.results;
                genera_dati(founded_films);

                //scorro i singoli risultati ottenuti e
                $('.entry').each(function(){
                    // se il titolo è uguale al titolo originale li nascondo
                    if($(this).find('h4').attr('value') == $(this).find('p:first-of-type').attr('value')) {
                        $(this).find('p:first-of-type').remove();
                    }
                })
                //se l'oggetto di array dei risultati è vuoto rendo visibile l'avviso di nessun risultato
                if(data.results.length == 0) {
                    $('.no-results').addClass('active');
                }
            },
            'error': function(){
                alert('error!')
            }
        })
    })

    function disegna_film(risultati) {
        //salvo i valori delle chiavi che mi interessano
        var titolo = risultati.title;
        var titolo_originale = risultati.original_title;
        var lingua = risultati.original_language;
        var voto_medio = risultati.vote_average;
        //creo un oggetto da poter inserire nel template di handlebars con i corrispondenti valori
        var context = {
            'title': titolo,
            'original_title': titolo_originale,
            'language': lingua,
            'vote': voto_medio,
        }
        var html = template(context);
        $('main').append(html)
    }

    function genera_dati(film_trovati) {
        //utilizzo un ciclo per scorrere gli oggetti e reperire ciò che mi interessa
        for (var i = 0; i < film_trovati.length; i++) {
            //utilizzo una variabile per salvare gli oggetti
            var risultati = film_trovati[i];
            disegna_film(risultati)
        }
    }
})
