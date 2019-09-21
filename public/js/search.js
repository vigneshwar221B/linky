$(document).ready(function () {
    $('select').formSelect()
});


const onSearch = () => {
    var searchword = $("#search-box").val()
    var type = $('#type').val()

    var qtype = $('input[name=radioName]:checked', '#myForm').val()
    //console.log(temp)

    $.ajax({
        type: "GET",
        url: "http://localhost:8080/searchRes?keyString="+searchword+"&type="+type+"&qtype="+qtype,
        cache: false,
        success:  (data) => {
            //console.log(data);
            $('#resArea').html('')
            $('#pagination').html(`

        <script>$('.dropdown-trigger').dropdown();</script>

        <div class="col s4 left-align">
            <a class="waves-effect waves-light btn deep-purple accent-3 left" 
                        id="loginbtn" href="">
                <i class="material-icons left">arrow_back</i>
                prev
            </a>
        </div>

        <div class="col s4 ">

            <div class="row center-align">
                page 1 of 4 
            </div>

            <div class="row center-align">
                <!-- Dropdown Trigger -->
                <a class='dropdown-trigger btn deep-purple accent-3' href='#' data-target='dropdown1'>Drop Me!</a>

                <!-- Dropdown Structure -->
                <ul id='dropdown1' class='dropdown-content'>

                    <li><a href="#!">one</a></li>
                    <li><a href="#!">two</a></li>
                    
                </ul>
            </div>
            
        </div>

        <div class="col s4 left-align">
            <a class="waves-effect waves-light btn deep-purple accent-3 right" 
                        id="loginbtn" href="">
                <i class="material-icons right">arrow_forward</i>
                next
            </a>
        </div>
            `)


            data.forEach(el => {
                
                $('#resArea').append(`
                    <div class="col s12 m4" style="padding: 10px">
                        <div class="card hoverable" style="margin: 0; padding: 10px">
                        
                            <div class="card-image waves-effect waves-block waves-light">
                                <img class="activator" src="${el.img}">
                            </div>
                            <div class="card-content">
                                <span class="card-title activator grey-text text-darken-4">${el.name || el.username}<i class="material-icons right">more_vert</i></span>
                                <p><a href="${  el.groupLink || "/profile/" + el._id }">view</a></p>
                            </div>
                            <div class="card-reveal">
                                <span class="card-title grey-text text-darken-4">${el.name || el.username}<i class="material-icons right">close</i></span>
                                <p>${el.about || el.body}</p>
                            </div>
                        </div>
                    </div>
                `)
            })
        }
    })
}