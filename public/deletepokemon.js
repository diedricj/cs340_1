function deletePokemon(id){
    $.ajax({
        url: '/pokedex/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
