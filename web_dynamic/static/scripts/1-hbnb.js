$(function () {
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
