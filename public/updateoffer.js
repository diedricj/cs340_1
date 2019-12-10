function updateOffer(pid, tid){
    $.ajax({
        url: '/offer/' + pid + "/" + tid,
        type: 'PUT',
        data: $('#update-offer').serialize(),
        success: function(result){
            window.location.replace("/offer");
        }
    })
};
