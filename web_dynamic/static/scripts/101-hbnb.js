$(function () {
    $.get('http://0.0.0.0:5001/api/v1/status/', function (data, textStatus) {
        if (data.status === 'OK') $('#api_status').addClass('available');
        else $('#api_status').removeClass('available');
    });

    data = JSON.stringify({});
    const places = $('.places');


    function useData(data) {
        for (const place of data) {
            const article = $('<article></article>')
            const title = $('<div></div>').addClass('title_box').append($('<h2></h2>').text(place.name));
            title.append($('<div></div>').addClass('price_by_night').text('$' + place.price_by_night));
            article.append(title);

            const information = $('<div>').addClass('information');
            const guests = (place.max_guest !== 1) ? 'Guests': 'Guest';
            information.append($('<div>').addClass('max_guest').text(place.max_guest + ' ' + guests));
            let rooms = (place.number_rooms !== 1) ? 'Bedrooms': 'Bedroom';
            information.append($('<div>').addClass('number_rooms').text(place.number_rooms + ' ' + rooms));
            rooms = (place.number_bathrooms !== 1) ? 'Bathrooms': 'Bathroom';
            information.append($('<div>').addClass('number_bathrooms').text(place.number_bathrooms + ' ' + rooms));
            article.append(information);

            const description = $('<div>').addClass('description');
            const desc_text = (place.description === null) ? 'None': place.description;
            description.html(desc_text);
            article.append(description);


            const place_reviews = $.get('http://0.0.0.0:5001/api/v1/places/' + place.id + '/reviews', function (data) {
                const reviews = $('<div>').addClass('reviews');
                const text = (data.length != 1) ? data.length + ' Reviews ' : data.length + ' Review ';
                function handle_show_reviews (e) {
                    if (e.target.parentElement.nextElementSibling.style.display === 'none') {
                        e.target.parentElement.nextElementSibling.style.display = '';
                        e.target.textContent = 'hide';
                    }
                    else {
                        e.target.parentElement.nextElementSibling.style.display = 'none';
                        e.target.textContent = 'show';
                    }
                }
                reviews.append($('<h2>').text(text).append($(' <span class="show">hide</span>').on('click',handle_show_reviews)));
                const review_list = $('<ul>');
                for (const review of data) {
                    $.get('http://0.0.0.0:5001//api/v1/users/' + review.user_id, function (user) {
                        const date = new Date(review.created_at).toLocaleDateString() ;
                        const text = 'From ' + user.first_name + ' ' + user.last_name + ' ' + date;
                        review_list.append($('<li><b>' + text + '</b></li>').append($('<p>').text(review.text)));
                    });
                }
                reviews.append(review_list);

                article.append(reviews);
            });

            places.append(article);
        }
    }
    
    $.ajax({
        url: 'http://0.0.0.0:5001/api/v1/places_search',
        method: 'POST',
        data: data,
        contentType: 'application/json',
        success: useData, 
    });


    const amenity_checks = $('.a_check')
    const s_check = $('.s_check');
    const c_check = $('.c_check');
    let amenities = {};
    let states = {};
    let cities = {};
    const h4_amenities = $('.amenities h4');
    const h4_state_cities = $('.locations h4');
    let text = [];

    
    amenity_checks.on('change', function (e) {
        const target = e.target;
        if (target.checked) {
            amenities[target.dataset.id] = target.dataset.name;
        }
        else {
            delete amenities[target.dataset.id];
        }
        let text = Object.values(amenities).join(', ');
        if (text.length >= 37) text = text.slice(0,37) + '...';
        h4_amenities.text(text);
    });


    s_check.on('change', function (e) {
        const target = e.target;
        if (target.checked) {
            states[target.dataset.id] = target.dataset.name;
            text.push(target.dataset.name);
        }
        else {
            delete states[target.dataset.id];
            text = text.filter(a => a != target.dataset.name);
        }
        let string = text.join(', ');
        if (string.length >= 30) string = string.slice(0,30) + '...';
        h4_state_cities.text(string);
    });



    c_check.on('change', function (e) {
        const target = e.target;
        if (target.checked) {
            cities[target.dataset.id] = target.dataset.name;
            text.push(target.dataset.name);
        }
        else {
            delete cities[target.dataset.id];
            text = text.filter(a => a != target.dataset.name);
        }
        let string = text.join(', ');
        if (string.length >= 30) string = string.slice(0,30) + '...';
        h4_state_cities.text(string);
    });


    $('button').on('click', function (e) {
        places.children().remove();
        const data = JSON.stringify({amenities: Object.keys(amenities), states: Object.keys(states), cities: Object.keys(cities)});
        $.ajax({
            url: 'http://0.0.0.0:5001/api/v1/places_search',
            method: 'POST',
            data: data,
            contentType: 'application/json',
            success: useData, 
        });

    });


});
