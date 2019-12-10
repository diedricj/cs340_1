function deleteDiscord(id){
    $.ajax({
        url: '/discord/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
