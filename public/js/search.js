
const onSearch = () => {
    var searchword = $("#search-box").val();
    $.ajax({
        type: "GET",
        url: "http://localhost:8080/searchRes?keyString="+searchword,
        cache: false,
        success:  (data) => {
            $("#resArea").text(data);
        }
    })
}