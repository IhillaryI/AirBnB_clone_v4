$(function () {
    $.get('http://0.0.0.0:5001/api/v1/status/', function (data, statusCode) {
        if (data.status === 'OK') $('#api_status').addClass('available');
        else $('#api_status').removeClass('available');
    });

    const amenity_checks = $('.a_check')
    let amenities = [];
    const h4 = $('.amenities h4');

    
    amenity_checks.on('change', function (e) {
        const target = e.target;
        if (target.checked) {
            amenities.push(target.dataset.name);
        }
        else {
            amenities = amenities.filter(a => a != target.dataset.name);
        }
        text = amenities.join(', ');
        if (text.length >= 37) text = text.slice(0,37) + '...';
        h4.text(text);
    });

})
