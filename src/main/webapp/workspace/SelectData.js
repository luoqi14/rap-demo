/**
 * Created by dashuai on 17-6-30.
 */
function apiSection() {
    $('#api-section').show();
    $('#custom-section').hide();
    if (!$('#api-li').hasClass("active")) {
        $('#api-li').addClass('active');
    }
    $("#custom-li").removeClass("active")
}

function customSection() {
    $('#api-section').hide();
    $('#custom-section').show();
    if (!$('#custom-li').hasClass("active")) {
        $('#custom-li').addClass('active');
    }
    $("#api-li").removeClass("active")
}

var jsonList = [];

window.onload = function () {
    $.ajax({
        method: "POST",
        url: '/org/group/getCommonJson.do',
        data: 'productlineId=' + window.projectlineId + '&id=' + window.teamId,
        dataType: "json",
        success: function (data) {
            jsonList = data;
            for (let i = 0; i < data.length; i++) {
                $("#json-list").append("<li class='list-group-item'>" + data[i].name + "</li>");
            }
        },
        error: function (error) {
            console.log(JSON.stringify(error));
        }
    });


    $('#json-list').on("click",'.list-group-item',function () {
        let i=$(this).index();
        let json = jsonList[i].data;
        $('#json-display-area').text('');
        $('#json-display-area').append(json);

        window.customJson = json;
        window.customJsonName = jsonList[i].name;

        $('.list-group-item.active').removeClass('active');
        if (!$(this).hasClass('active')) {
            $(this).addClass('active');
        };
    })
}