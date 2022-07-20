const renderData = function (dataToBeRendered) {
    $("#mainContainer").empty(); // empties the container before appending data
    // generate title dynamically
    // applying template literals to create a mix of static category names and dynamically updated search results
    // spanning the category names to apply special styles to them + spanning the "showName" for bigger font
    var nameEl = $("<p>").html(`<span id="showNameCategory">Show name:</span> <span id="showName">${dataToBeRendered.name}</span>`);
    nameEl.attr("class", "title") //just a test
    var genresEl = $("<p>").html(`<span id="genres">Genre(s):</span> ${dataToBeRendered.genres.join(", ")}`); // because this element has multiple results (genres)
    var premieredEl = $("<p>").html(`<span id="premiered">Premiered (Y/M/D):</span> ${dataToBeRendered.premiered}`);
    var statusEl = $("<p>").html(`<span id="status">Status:</span> ${dataToBeRendered.status}`);
    var ratingEl = $("<p>").html(`<span id="rating">Rating (out of 10):</span> ${dataToBeRendered.rating}`);
    var summaryEl = $("<p>").html(`<span id="summary">Summary: </span>${dataToBeRendered.summary}`);
    $("#mainContainer").append(nameEl)
    $("#mainContainer").append(genresEl)
    $("#mainContainer").append(premieredEl)
    $("#mainContainer").append(statusEl)
    $("#mainContainer").append(ratingEl)
    $("#mainContainer").append(summaryEl)
};

renderRandomActivity = function(activityToBeRendered){
    let activityEl = $("<h3>").text(activityToBeRendered.activity);
    $("#activity").text(activityToBeRendered.activity);
  
  }

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

const getRandomActivity = function() {
    const activityUrl = 'http://www.boredapi.com/api/activity/';
  
    fetch(activityUrl)
    .then(function(response){
      return response.json()
    })
    .then(function(data){
      const randomActivity = {
          activity: data.activity,
      }
      
      renderRandomActivity(randomActivity)
    })
  }

// on landing - check if there is something in localstorage
// render based on that - my list 
// add event listener to search button
$("#search").on('click', function() {
    // grab the value from text
    const searchInputValue = $("#text-inp").val();
    // pass it to api
    getSearchData(searchInputValue)

    // show container
    $(".container").css("display", "block")
})

$("#newActivity").on("click", getRandomActivity)

// TODO: check if localstorage is present - show container
  