const renderData = function (dataToBeRendered) {
    $("#mainContainer").empty(); // empties the container before appending data
    // generate title dynamically
    var nameEl = $("<h3>").text(dataToBeRendered.name);
    nameEl.attr("class", "title")
    var genresEl = $("<p>").text(dataToBeRendered.genres.join(", "));
    $("#mainContainer").append(nameEl)
    $("#mainContainer").append(genresEl)
};

// for making an api call
const getSearchData = function (searchTerm) {
    const url = `https://api.tvmaze.com/singlesearch/shows?q=${searchTerm}`
    fetch(url)
    .then(function(res) {
        return res.json()
    })
    .then(function(data) {
        const dataToRender = {
            name: data.name,
            genres: data.genres,
            country: data.network.country,
            rating: data.rating.average,
        }
        renderData(dataToRender)
    })
};

// on landing - check if there is something in localstorage
// render based on that
// add event listner to search button
$("#search").on('click', function() {
    // grab the value from text
    const searchInputValue = $("#text-inp").val();
    // pass it to api
    getSearchData(searchInputValue)
})


  