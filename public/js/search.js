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
            $("#resArea").text(`text: ${data.keyString} and type: ${data.type}`);
        }
    })
}