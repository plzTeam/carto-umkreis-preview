window.onload = function () {

    let apiKey = '8y5KtxHPfbjApEakUI07Ww';
    let apiUrl = 'https://toad.geodb.host/user/plzteam/api/v2/sql?api_key=' + apiKey;

    let max_entity_count = 2000;

    let center_lat = 50.7684,
        center_lon = 9.1061;
    let min_x = 48.64, max_x = 52.25,
        min_y = 5.68, max_y = 11.31
    let bbox = [[min_x, min_y],[max_x, max_y]];

    faker.locale = "de";

    cartodb.createVis('map', 'https://toad.geodb.host/user/plzteam/api/v2/viz/e630c259-362d-4a2f-869f-2867c7c3bc48/viz.json', {
        shareable: false,
        search: false,
        center_lat: center_lat,
        center_lon: center_lon,
        zoom: 9
    }).done(function(vis, layers){
        vis.map.set({
            minZoom: 7
        })
        let map = vis.getNativeMap();
        let marker = L.marker();

        // get entity count
        function refreshEntityCount () {
            setTimeout(() => {
                let q = `SELECT COUNT(*) AS count FROM addr001`;
                $.getJSON(apiUrl + '&q=' + q, function(data) {
                    let eCount =  data.rows[0].count;
                    $("#entity-count").html('')
                    let eCountHtml = $("<b><span class='text-primary'>" + eCount + "</span> <span>&#47;</span> "+max_entity_count+"</b>");
                    $("#entity-count").append(eCountHtml);
                    let diff = (eCount-max_entity_count);
                    if(diff > 0) {
                        let q = `DELETE FROM addr001 WHERE ctid IN (SELECT ctid FROM addr001 WHERE locked IS NOT TRUE ORDER BY cartodb_id DESC LIMIT ${diff})`;
                        $.getJSON(apiUrl + '&q=' + q, () => {
                            refreshEntityCount();
                        });
                    }else {
                        refreshEntityCount();
                    }
                });
            }, 2000);
        };
        refreshEntityCount();

        // Draw Function
        let circle = L.circle();
        function redrawMap(lat = false, lon = false) {
            // init center
            center_lat = (lat) ? lat : center_lat,
            center_lon = (lon) ? lon : center_lon;
            // clear map layers
            map.removeLayer(circle);
            $.map(layers, function(layer, key) {
                layer.redraw();
            });
            // build map layers
            let radius = $("#form-radius").val();
            circle = L.circle([center_lat, center_lon], radius * 1000, {color: '#0d6efd', 'clickable': false}).addTo(map);
            // get table data
            $("#list").find("tbody").html('');
            let category = $("#form-category").val();
            let q_cat = (category !== 'all') ? `AND category = ${category} ` : '';
            let q_point = `ST_SetSRID(ST_MakePoint(${center_lon}, ${center_lat}), 4326)`;
            let q_distance = `ROUND((ST_Distance(ST_Transform(${q_point}, 26986), ST_Transform(the_geom, 26986))*0.001)::numeric, 1)`;
            // let q_distance = `ST_Distance(${q_point}, the_geom)`;
            let q = `SELECT *, ${q_distance} as distance FROM addr001 WHERE ST_DWithin(${q_point}, the_geom, 300000) AND ${q_distance} <= ${radius} ${q_cat} ORDER BY ${q_distance} LIMIT ${max_entity_count}`;
            $.getJSON(apiUrl + '&q=' + q, function(data) {
                $.each(data.rows, function(key, val) {
                    // build table
                    let catColors = {
                        1: '#d4191c',
                        2: '#faac60',
                        3: '#a4d669'
                    }
                    let catColor = catColors[val.category];
                    let trow = $('<tr><td></td><th scope="row">' + val.distance + ' Km</th><td><i class="bi bi-geo-alt-fill" style="color:'+catColor+'"></i> <a class="change-center" data-lat="' + val.x + '" data-lon="' + val.y + '" href="#" title="als Mittelpunkt setzen">' + val.city + '</a></td><td>' + val.name + '</td><td><i title="Gruppe #' + val.category + '" class="bi bi-dice-' + val.category + '-fill" style="color:'+catColor+'"></i></td><td><i class="bi bi-pencil" data-bs-toggle="modal" data-bs-target="#editModal"></i></td></tr>');
                    $("#list").find("tbody").append(trow);
                });
                // city click: change center
                $(".change-center").on('click', (e) => {
                    let el = $(e.target);
                    redrawMap(el.data('lat'), el.data('lon'));
                })
                // hover city
                $(".change-center").on('mouseover', (e) => {
                    let el = $(e.target);
                    map.removeLayer(marker)
                    marker = L.marker([el.data('lat'), el.data('lon')]).addTo(map);
                })
                $(".change-center").on('mouseout', (e) => {
                    let el = $(e.target);
                    map.removeLayer(marker)
                })
            });
        }
        // init layers
        redrawMap();
        $("#btn-run").on('click', () => {
            redrawMap();
        });
        // onclose cartoModal: redraw()
        $("#cartoModal").on("hidden.bs.modal", function () {
            redrawMap();
        });

        // add-data
        $(".btn-add").on('click', function(e, index) {
            let loops = $(this).data('val');
            for(let i = 0;i<=loops;i++) {
                let city = faker.address.zipCode() + ' ' + faker.address.city();
                let name = faker.company.companyName();
                let category = faker.datatype.number({'min': 1,'max': 3}).toString()
                let x = faker.datatype.float({'min': min_x,'max': max_x}).toString()
                let y = faker.datatype.float({'min': min_y,'max': max_y}).toString()
                let q = `INSERT INTO addr001 (city, name, category, x, y, the_geom) VALUES ('${city}', '${name}', '${category}', '${x}', '${y}', ST_SetSRID(ST_MakePoint(${y}, ${x}), 4326))`;
                console.log(q)
                $.getJSON(apiUrl + '&q=' + q, function(data) {
                    $.each(data.rows, function(key, val) {
                        // do something!
                    });
                });
            }
        });
        // delete data
        $("#btnDelete").on('click', () => {
            let q = `DELETE FROM addr001 WHERE locked IS NOT TRUE`;
            $.getJSON(apiUrl + '&q=' + q, function(data) {
                $.each(data.rows, function(key, val) {
                    // do something!
                });
            });
        });
    });
}