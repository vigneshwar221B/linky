$(document).ready(function () {
    $('.modal').modal();

});


var openModal = (postid) => {
    
    $('#modal2').modal('open')
    console.log(postid);
    $('#postId').val(postid)
    
}

var bookmark = (id, isBookmarked, csrf) => {

    $.ajaxSetup({
        headers: {
            'X-CSRF-Token': csrf
        }
    });
    $.post('/favoriteHandler', {id, isBookmarked}, (data) => {
        
        if (data == 'removed') {
            $(`#csbookmark${id}`).html(`
            <i class="material-icons" id="csbookmark<%el._id%>">bookmark_border</i>
        `)
            M.toast({ html: 'removed from favorites ❤️', classes: 'rounded' });
        } else {
            $(`#csbookmark${id}`).html(`
            <i class="material-icons" id="csbookmark<%el._id%>">bookmark</i>
        `)
            M.toast({ html: 'added to favorites ❤️', classes: 'rounded' });
        }
    })

    
}
