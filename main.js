$(document).ready(function() {
    var source   = $("#entry-template").html();
    var template = Handlebars.compile(source);

    $('button').click(function() {
        var testo_utente = $('input').val();
        $.ajax({
            'url':'https://api.themoviedb.org/3/search/movie',
            'method':'GET',
            'data':{
                'api_key':'0c5280dc3d5b58e1162d83dd9b44e7d5',
                'query': testo_utente
            },
            'success': function(data) {
                for (var i = 0; i < data.results.length; i++) {
                    var risultati = data.results[i];
                    var titolo = risultati.title;
                    var titolo_originale = risultati.original_title;
                    var lingua = risultati.original_language;
                    var voto_medio = risultati.vote_average;
                    var img = risultati.poster_path;
                    var context = {
                        'title': titolo,
                        'original_title': titolo_originale,
                        'language': lingua,
                        'vote': voto_medio,
                    }
                    var html = template(context);
                    $('main').append(html)
                }
            },
            'error': function(){
                alert('error!')
            }

        })
    })
})
