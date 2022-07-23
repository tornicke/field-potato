function checkLocalStorage() {
  var myShows = JSON.parse(localStorage.getItem("myShows"));

  if (!myShows) {
    localStorage.setItem("myShows", JSON.stringify([]));
  }
}
checkLocalStorage();

function renderShowOrActivity(name) {
  var showNameEl = $("<div>").attr("class", "o-grid-text").text(name);
  var showContainer = $("<div>")
    .attr("class", "o-grid__cell o-grid__cell--width-30")
    .append(showNameEl);
  var orEl = $(`<div class="o-grid__cell o-grid__cell--width-10">
    <div class="o-grid-text">OR</div>
  </div>`);
  var buttonsEl = $(`<div class="o-grid__cell o-grid__cell--width-30">
    <button type="button" id="newActivity" class="c-button c-button--success u-small">
      new activity
    </button>
    <button type="button" class="c-button c-button--success u-small">
      finished
    </button>
    <button type="button" class="c-button c-button--success u-small">
      delete
    </button>
  </div>`);

  var tableEl = $("<div>").attr(
    "class",
    "table o-grid o-grid--small-fit o-grid--medium-fit o-grid--large-fit"
  );

  tableEl.append(showContainer);
  tableEl.append(orEl);
  tableEl.append(buttonsEl);

  $("#my-list").append(tableEl);
}

function addShowToMyList(showName) {
  var myShows = localStorage.getItem("myShows")
    ? JSON.parse(localStorage.getItem("myShows"))
    : [];

  if (myShows.includes(showName)) {
    //if the list already includes the show with the same name
    console.log("already exists");
    return;
  }

  //Removing the oldest search from the list, the new search replaces the removed one
  if (myShows.length >= 5) {
    myShows.splice(0, 1);
    myShows.push(showName);
  } else {
    myShows.push(showName);
  }
  localStorage.setItem("myShows", JSON.stringify(myShows));
  //
  // we want to create a table element
  // add these values
  renderShowOrActivity(showName);
  /// add activity
}

const renderData = function (dataToBeRendered) {
  $("#mainContainer").empty(); // empties the container before appending data
  // generate title dynamically
  // applying template literals to create a mix of static category names and dynamically updated search results
  // spanning the category names to apply special styles to them + spanning the "showName" for bigger font
  var nameEl = $("<p>").html(
    `<span id="showNameCategory">Show name:</span> <span id="showName">${dataToBeRendered.name}</span>`
  );
  nameEl.attr("class", "title"); //just a test
  var genresEl = $("<p>").html(
    `<span id="genres">Genre(s):</span> ${dataToBeRendered.genres.join(", ")}`
  ); // because this element has multiple results (genres)
  var premieredEl = $("<p>").html(
    `<span id="premiered">Premiered (Y/M/D):</span> ${dataToBeRendered.premiered}`
  );
  var statusEl = $("<p>").html(
    `<span id="status">Status:</span> ${dataToBeRendered.status}`
  );
  var ratingEl = $("<p>").html(
    `<span id="rating">Rating (out of 10):</span> ${dataToBeRendered.rating}`
  );
  var summaryEl = $("<p>").html(
    `<span id="summary">Summary: </span>${dataToBeRendered.summary}`
  );
  var saveToMyListButton = $("<button>")
    .attr("id", "saveToMyList")
    .attr("class", "c-button c-button--success u-small")
    .text("Save");
  $("#mainContainer").append(nameEl);
  $("#mainContainer").append(genresEl);
  $("#mainContainer").append(premieredEl);
  $("#mainContainer").append(statusEl);
  $("#mainContainer").append(ratingEl);
  $("#mainContainer").append(summaryEl);
  $("#mainContainer").append(saveToMyListButton);

  $("#saveToMyList").click(function () {
    addShowToMyList(dataToBeRendered.name);
  });
};

renderRandomActivity = function (activityToBeRendered) {
  let activityEl = $("<h3>").text(activityToBeRendered.activity);
  $("#activity").text(activityToBeRendered.activity);
};

// for making an api call
const getSearchData = function (searchTerm) {
  const url = `https://api.tvmaze.com/singlesearch/shows?q=${searchTerm}`;
  fetch(url)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      const dataToRender = {
        name: data.name,
        genres: data.genres,
        status: data.status,
        premiered: data.premiered,
        rating: data.rating.average,
        summary: data.summary,
      };
      renderData(dataToRender);
      $(mainContainer).css({
        border: "3px solid #2b0c8f",
        "box-sizing": "border-box",
      }); /*adding a dynamic border using jQuery*/
    });
};

const getRandomActivity = function () {
  const activityUrl = "http://www.boredapi.com/api/activity/";

  fetch(activityUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const randomActivity = {
        activity: data.activity,
      };

      renderRandomActivity(randomActivity);
    });
};

// on landing - check if there is something in localstorage
// render based on that - my list
// add event listener to search button
$("#search").on("click", function () {
  // grab the value from text
  const searchInputValue = $("#text-inp").val();
  // pass it to api
  getSearchData(searchInputValue);

  // show container
  $(".container").css("display", "block");
});

$("#newActivity").on("click", getRandomActivity);

// TODO: check if localstorage is present - show container
if (localStorage.getItem("myShows")) {
  // show the container
  $(".container").css("display", "block");
  //
  var myShows = JSON.parse(localStorage.getItem("myShows"));
  for (let index = 0; index < myShows.length; index++) {
    const showName = myShows[index];
    renderShowOrActivity(showName);
  }
}
