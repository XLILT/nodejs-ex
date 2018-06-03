$(document).ready(function() {
    $('.site').click(function() {
        $.ajax({
            type: 'POST',
            contentType: 'application/x-www-form-urlencoded',
            url: '/sit_down',
            data: '',
            dataType: 'text',
            async: false,
            success: function(data) {
				console.log(data);
                var data_obj = JSON.parse(data);
                on_sync_site(data_obj);
            },
            error: function() {

            }
        });
    });
});

function on_sync_site(data) {
    if(data.length !== 3) {
        return;
    }

    var i = 0;
    const seat_class = ['.left-seat', '.bottom-seat', '.right-seat'];
    data.forEach(function(seat) {
        if(seat && seat.name) {
            $(seat_class[i++]).html(seat.name);
        }
    });
}
