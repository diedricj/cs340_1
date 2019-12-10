function updateDiscord(id){
    console.log("ABOUT TO DO AJAX CALL $%^$%    " + id);
    $.ajax({
        url: '/discord/' + id,
        type: 'PUT',
        data: $('#update-discord').serialize(),
        success: function(result){
            window.location.replace("/discord");
        }
    })
};
