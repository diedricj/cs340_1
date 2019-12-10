function updatePokedex(pid){
    console.log("ABOUT TO DO AJAX CALL $%^$%    " + pid);
    $.ajax({
        url: '/pokedex/' + pid,
        type: 'PUT',
        data: $('#update-pokedex').serialize(),
        success: function(result){
            window.location.replace("/pokedex");
        }
    })
};
