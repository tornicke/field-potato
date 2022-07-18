const renderData = function (dataToBeRendered) {
    $("#mainContainer").empty(); // empties the container before appending data
    // generate title dynamically
    var nameEl = $("<h3>").text(dataToBeRendered.name);
    nameEl.attr("class", "title") //just a test
    var genresEl = $("<p>").text(dataToBeRendered.genres.join(", ")); // because this element has multiple results (genres)
    var premieredEl = $("<p>").text(dataToBeRendered.premiered);
    var statusEl = $("<p>").text(dataToBeRendered.status);
    var ratingEl = $("<p>").text(dataToBeRendered.rating);
    var summaryEl = $("<p>").text(dataToBeRendered.summary);
    $("#mainContainer").append(nameEl)
    $("#mainContainer").append(genresEl)
    $("#mainContainer").append(premieredEl)
    $("#mainContainer").append(statusEl)
    $("#mainContainer").append(ratingEl)
    $("#mainContainer").append(summaryEl)
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
            status: data.status,
            premiered: data.premiered,
            rating: data.rating.average,
            summary: data.summary,
        }
        renderData(dataToRender)
    })
};

// on landing - check if there is something in localstorage
// render based on that
// add event listener to search button
$("#search").on('click', function() {
    // grab the value from text
    const searchInputValue = $("#text-inp").val();
    // pass it to api
    getSearchData(searchInputValue)
})


  