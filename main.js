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
                        var titolo = data.results[i].title;
                        var titolo_originale = data.results[i].original_title;
                        var lingua = data.results[i].original_language;
                        var voto_medio = data.results[i].vote_average;
                        var context = {
                            'title': titolo,
                            'original_title': titolo_originale,
                            'language': lingua,
                            'vote': voto_medio
                        }
                        console.log(data.results[i]);
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
