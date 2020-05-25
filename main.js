$(document).ready(function() {

    var source   = $("#entry-template").html();
    var template = Handlebars.compile(source);

    //intercetto il click sul bottone
    $('button').click(all_search)
    //stesso evento con invio
    $('header input').keypress(function(event) {
        // verifico se l'utente ha digitato "ENTER"
        if(event.which == 13) {
            all_search();
        }
    });

    function disegna_film(risultati) {
        //creo un oggetto da poter inserire nel template di handlebars con i corrispondenti valori
        var context = {
            'title': risultati.title,
            'original_title': risultati.original_title,
            'language': risultati.original_language,
            'vote': risultati.vote_average,
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

    function all_search() {
        //se l'input non ha caratteri non faccio la chiamata ajax
        if (!($('input').val()).trim() == '') {
            //nascondo tutti i film
            $('div.entry').remove();
            //nascondo l'avviso di nessun risultato
            $('.no-results').removeClass('active')
            //creo una variabile per salvare l'input dell'utente
            var testo_utente = $('input').val();
            //svuoto l'input
            $('input').val('');
            $.ajax({
                'url':'https://api.themoviedb.org/3/search/movie',
                'method':'GET',
                'data':{
                    'api_key':'0c5280dc3d5b58e1162d83dd9b44e7d5',
                    'query': testo_utente,
                    'language':'it'
                },
                'success': function(data) {
                    var founded_films = data.results;
                    genera_dati(founded_films);

                    //scorro i singoli risultati ottenuti e
                    $('.entry').each(function(){
                        //se il titolo è uguale al titolo originale li nascondo
                        if($(this).find('h4').attr('value') == $(this).find('p:first-of-type').attr('value')) {
                            $(this).find('p:first-of-type').remove();
                        }
                    })
                    //se l'oggetto di array dei risultati è vuoto rendo visibile l'avviso di nessun risultato
                    if(data.results.length == 0) {
                        $('.no-results').addClass('active');
                        $('.search').removeClass('active')
                    } else {
                        $('.search').addClass('active');
                        $('.search h2 span').text(testo_utente)
                    }
                },
                'error': function(){
                    alert('error!')
                }
            })
        } else {
            alert('devi digitare almeno 2 caratteri')
        }
    }
})
