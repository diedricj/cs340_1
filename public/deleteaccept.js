function deleteAccept(pid, tid){
    console.log("ASDFASDJFAJSDFJA" + pid + tid);
    $.ajax({
        url: '/accept/' + pid + "/" + tid,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
