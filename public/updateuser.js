function updateUser(id){
    console.log("ABOUT TO DO AJAX CALL $%^$%    " + id);
    $.ajax({
        url: '/users/' + id,
        type: 'PUT',
        data: $('#update-user').serialize(),
        success: function(result){
            window.location.replace("/users");
        }
    })
};
