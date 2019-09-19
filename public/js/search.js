$(document).ready(function () {
    $('select').formSelect();
});

const onSearch = () => {
    var searchword = $("#search-box").val();
    var type = $('#type').val()

    $.ajax({
        type: "GET",
        url: "http://localhost:8080/searchRes?keyString="+searchword+"&type="+type,
        cache: false,
        success:  (data) => {
            console.log(data);
            $('#resArea').html('')
            data.forEach(el => {
                
                $('#resArea').append(`
                    <div class="col s12 m4" style="padding: 10px">
                        <div class="card deep-purple accent-3 hoverable" style="margin: 0; padding: 10px">
                            <div class="card-content white-text">
                                <span class="card-title">
                                    <a href="" 
                                    style="color:white; "><u>${el.name}</u></a>
                                </span>
                                <p>- ${el.body}</p>
                            </div>
                            <div class="card-action">
                                <a href="${el.groupLink}" 
                                class="modal-close waves-effect waves-light btn pulse red accent-2">join</a>
                            </div>
                        </div>
                    </div>
                `)
            })
        }
    })
}