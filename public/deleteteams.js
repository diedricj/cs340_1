function deleteTeams(id){
    $.ajax({
        url: '/teams/' + id,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
