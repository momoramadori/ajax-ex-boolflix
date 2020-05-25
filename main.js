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
            'title': risultati.title || risultati.name,
            'original_title': risultati.original_title || risultati.original_name,
            'vote': genera_stelle(risultati.vote_average),
            'language': function() {
                if (risultati.original_language == 'it') {
                    return '<img src="img/flag_it.png">'
                } else if (risultati.original_language == 'en') {
                    return '<img src="img/flag_en.png">'
                } else if  (risultati.original_language == 'fr'){
                    return '<img src="img/flag_fr.png">'
                } else if (risultati.original_language == 'es') {
                    return '<img src="img/flag_es.png">'
                } else if (risultati.original_language == 'de') {
                    return '<img src="img/flag_de.png">'
                } else if (risultati.original_language == 'el') {
                    return '<img src="img/flag_el.png">'
                } else if (risultati.original_language == 'fi') {
                    return '<img src="img/flag_fi.png">'
                } else {
                    return risultati.original_language;
                }
            }
        }
        var html = template(context);
        $('main').append(html);

    }

    function genera_stelle(voti) {
        var voto = Math.ceil(voti / 2);
        var stella = '';
        var stella_vuota ='';
        for (var i = 0; i < voto; i++) {
            stella += '<i class="fas fa-star"></i>';
        }
        for (var i = 0; i < 5-voto; i++) {
            stella_vuota +='<i class="far fa-star"></i>'
        }
        return stella + stella_vuota
    }

    function genera_dati(film_trovati) {
        //utilizzo un ciclo per scorrere gli oggetti e reperire ciò che mi interessa
        for (var i = 0; i < film_trovati.length; i++) {
            //utilizzo una variabile per salvare gli oggetti
            var risultati = film_trovati[i];
            disegna_film(risultati)
        }
    }

    function reset_iniziale() {
        //nascondo tutti i film
        $('div.entry').remove();
        //nascondo l'avviso di nessun risultato
        $('.no-results').removeClass('active')
        //svuoto l'input
        $('input').val('');
    }

    function hide_original_title() {
        $('.entry').each(function(){
            //se il titolo è uguale al titolo originale li nascondo
            if($(this).find('h4').attr('value') == $(this).find('p:first-of-type').attr('value')) {
                $(this).find('p:first-of-type').remove();
            }
        })
    }
    function all_search() {
        //creo una variabile per salvare l'input dell'utente
        var testo_utente = $('input').val();
        //se l'input non ha caratteri non faccio la chiamata ajax
        if (!($('input').val()).trim() == '') {
            reset_iniziale();
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
                    hide_original_title();
                },
                'error': function(){
                    alert('error!')
                }
            })
            $.ajax({
                'url':'https://api.themoviedb.org/3/search/tv',
                'method':'GET',
                'data':{
                    'api_key':'0c5280dc3d5b58e1162d83dd9b44e7d5',
                    'query':testo_utente,
                    'language':'it'
                },
                'success': function(data) {
                    var founded_series = data.results;
                    genera_dati(founded_series);
                    hide_original_title();
                },
                'error': function() {
                    alert('error!')
                }
            })
        } else {
            alert('devi digitare almeno 2 caratteri')
        }
    }
})

// if(risultati.length == 0) {
//     $('.no-results').addClass('active');
//     $('.search').removeClass('active')
// } else {
//     $('.search').addClass('active');
//     $('.search h2 span').text(testo_utente)
// }
