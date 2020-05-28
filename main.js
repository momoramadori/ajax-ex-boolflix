$(document).ready(function() {

    var api_key = '0c5280dc3d5b58e1162d83dd9b44e7d5';
    var url_base = 'https://api.themoviedb.org/3/search/';

    var source   = $("#entry-template").html();
    var template = Handlebars.compile(source);
    //intercetto il click sul bottone
    $('i.fa-search').click(all_search)
    //stesso evento con invio
    $('header input').keypress(function(event) {
        // verifico se l'utente ha digitato "ENTER"
        if(event.which == 13) {
            all_search();
        }
    });

    //funzione per le la ricerca utente
    function all_search() {
        $('input').addClass('active');
        //creo una variabile per salvare l'input dell'utente
        var testo_utente = $('input').val();
        //se l'input non ha caratteri non faccio la chiamata ajax
        if (!($('input').val()).trim() == '') {
            reset_iniziale();
            ajax_call(testo_utente,'movie',' Movie');
            ajax_call(testo_utente,'tv',' Serie tv');
        } else {
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
    function ajax_call(ricerca, url, tipo) {
        $.ajax({
            'url': url_base + url,
            'method':'GET',
            'data':{
                'api_key': api_key,
                'query': ricerca,
                'language':'it'
            },
            'success': function(data) {
                var founded_elements = data.results;                
                genera_dati(founded_elements,tipo);
                hide_original_title();
                info_extra(ricerca);
            },
            'error': function(){
                alert('error!')
            }
        })
    }

    //funzione per scorrere i singoli risultati della ricerca
    function genera_dati(film_trovati,tipo) {
        //utilizzo un ciclo per scorrere gli oggetti e reperire ciò che mi interessa
        for (var i = 0; i < film_trovati.length; i++) {
            //utilizzo una variabile per salvare gli oggetti
            var risultati = film_trovati[i];
            disegna_film(risultati,tipo)
        }
    }

    //funzione per cancellare il titolo originale
    function hide_original_title() {
        $('.entry').each(function(){
            //se il titolo è uguale al titolo originale li nascondo
            if($(this).find('p:first-of-type').attr('value') == $(this).find('p:nth-of-type(2)').attr('value')) {
                $(this).find('p:nth-of-type(2)').remove();
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
    function disegna_film(risultati,tipologia) {
        //creo un oggetto da poter inserire nel template di handlebars con i corrispondenti valori
        
        var context = {
            'title': risultati.title || risultati.name,
            'original_title': risultati.original_title || risultati.original_name,
            'vote': genera_stelle(risultati.vote_average),
            'language': bandiere_lingua(risultati.original_language),
            'immagine': genera_immagini(risultati.poster_path),
            'id': risultati.id,
            'riassunto': riassunto(risultati.overview),
            'tipo': tipologia
        }
        var html = template(context);
        $('main').append(html);
        genera_cast(risultati.id,risultati)
    }

    
    //funzione per recuperare  il cast dei film
    function genera_cast(id,risultati) {
        if ( risultati.hasOwnProperty('original_title')) {
            var url = 'https://api.themoviedb.org/3/movie/' + id + '/credits'
        } else {
            var url = 'https://api.themoviedb.org/3/tv/' + id + '/credits'
        }
        $.ajax({
            'url': url,
            'method':'GET',
            'data':{
                'api_key': api_key,
            },
            'success': function(data) {
                var pippo = genera_credits(data);
                if (pippo != '') {
                    $('.entry[data-id='+id+'] p.cast').append(pippo);
                } else {
                    $('.entry[data-id='+id+'] p.cast').append('no cast availale!');
                }
            },
            'error': function() {
                alert('error!')
            }
        }) 
    }
        
    //funzione che restitutisce i credits dei singoli film/serie
    function genera_credits(data) {
        var array = [];
        var index = 0;
            do {
                if(data.cast[index] != undefined && data.cast[index].name != undefined) {
                    if (data.cast[index].hasOwnProperty('name')) {
                        var cast = data.cast[index].name;
                        array.push(cast)
                        index++
                    } 
                }
            } while (array.length < 5 && array.length < data.cast.length);
            var cast = array.toString();
            return cast
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
        } return lingua;
    }

    //funzione per generare immagine sostitutiva nelle immagini senza path
    function genera_immagini(img) {
        if (img === null) {
            return 'img/netflix_black.png'
        } return 'https://image.tmdb.org/t/p/w342' + img
    }

    //funzione per generare testo
    function riassunto(testo) {
        var contenuto='';
        if (testo.length != 0) {
            if (testo.length > 150) {
                contenuto = testo.substr(0,150) + '...'
            } else {
                contenuto = testo
            }
        } else {
            contenuto = 'no overview available!'
        } return contenuto
    }
})




