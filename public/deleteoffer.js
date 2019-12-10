function deleteOffer(pid, tid){
    console.log("ASDFASDJFAJSDFJA" + pid + tid);
    $.ajax({
        url: '/offer/' + pid + "/" + tid,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
