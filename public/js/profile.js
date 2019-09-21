$(document).ready(function () {
    $('.modal').modal();

});


var openModal = (postid) => {
    
    $('#modal2').modal('open')
    console.log(postid);
    $('#postId').val(postid)
    
}
