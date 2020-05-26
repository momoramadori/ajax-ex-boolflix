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

    //funzione per le la ricerca utente
    function all_search() {
        //creo una variabile per salvare l'input dell'utente
        var testo_utente = $('input').val();
        //se l'input non ha caratteri non faccio la chiamata ajax
        if (!($('input').val()).trim() == '') {
            reset_iniziale();
            ajax_call(testo_utente,'https://api.themoviedb.org/3/search/movie');
            ajax_call(testo_utente,'https://api.themoviedb.org/3/search/tv');
        } else {
            alert('devi digitare almeno 2 caratteri')
        }
    }

    //funzione per resettare il valore dell'input
    function reset_iniziale() {
        //nascondo tutti i film
        $('div.entry').remove();
        //nascondo l'avviso di nessun risultato
        $('.no-results').removeClass('active')
        //svuoto l'input
        $('input').val('');
    }

    //funzione per la singola chiamata ajax
    function ajax_call(ricerca, url) {
        $.ajax({
            'url':url,
            'method':'GET',
            'data':{
                'api_key':'0c5280dc3d5b58e1162d83dd9b44e7d5',
                'query': ricerca,
                'language':'it'
            },
            'success': function(data) {
                var founded_elements = data.results;
                genera_dati(founded_elements);
                hide_original_title();
                info_extra(ricerca);
            },
            'error': function(){
                alert('error!')
            }
        })
    }

    //funzione per scorrere i singoli risultati della ricerca
    function genera_dati(film_trovati) {
        //utilizzo un ciclo per scorrere gli oggetti e reperire ciò che mi interessa
        for (var i = 0; i < film_trovati.length; i++) {
            //utilizzo una variabile per salvare gli oggetti
            var risultati = film_trovati[i];
            disegna_film(risultati)
        }
    }

    //funzione per cancellare il titolo originale
    function hide_original_title() {
        $('.entry').each(function(){
            //se il titolo è uguale al titolo originale li nascondo
            if($(this).find('h4').attr('value') == $(this).find('p:first-of-type').attr('value')) {
                $(this).find('p:first-of-type').remove();
            }
        })
    }

    //funzione per generare le scritte relative ai risultati
    function info_extra(ricerca) {
        $('.no-results').removeClass('active');
        $('.search').removeClass('active');
        if( $('main').children().length == 1 ) {
            $('.no-results').addClass('active');
            $('.search').removeClass('active');
        } else if ($('main').children().length > 1){
            $('.search').addClass('active');
            $('.search h2 span').text(ricerca)
        }
    }

    //funzione per assegnare i valori dei risultati all'html con handlebars
    function disegna_film(risultati) {
        //creo un oggetto da poter inserire nel template di handlebars con i corrispondenti valori
        var context = {
            'title': risultati.title || risultati.name,
            'original_title': risultati.original_title || risultati.original_name,
            'vote': genera_stelle(risultati.vote_average),
            'language': bandiere_lingua(risultati.original_language),
            'immagine': risultati.poster_path,
            'riassunto': risultati.overview
        }
        var html = template(context);
        $('main').append(html);

    }

    //funzione per generare le stelle
    function genera_stelle(voti) {
        var voto = Math.ceil(voti / 2);
        var stella = '';
        for (var i = 1; i <= 5; i++) {
            if (i <= voto) {
                stella += '<i class="fas fa-star"></i>';
            } else {
                stella +='<i class="far fa-star"></i>'
            }
        } 
        return stella 
    }

    //funzione per generare le bandiere
    function bandiere_lingua(lingua) {
        var lingue = ['it','en','fr','de','el','fi','es']
        if (lingue.includes(lingua)) {
            return '<img src="img/flag_'+lingua+'.png">'
        } else {
            return lingua;
        }
    }
})
