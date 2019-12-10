function updateAccept(pid, tid){
    $.ajax({
        url: '/accept/' + pid + "/" + tid,
        type: 'PUT',
        data: $('#update-accept').serialize(),
        success: function(result){
            window.location.replace("/accept");
        }
    })
};
