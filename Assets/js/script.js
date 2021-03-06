function checkLocalStorage() {
  var myShows = JSON.parse(localStorage.getItem("myShows"));

  if (!myShows) {
    localStorage.setItem("myShows", JSON.stringify([]));
  }
}

//function to make sure the special characters do not ruin the functions
function formatName(name) {
  // remove all special characters
  return name.replace(/[^a-zA-Z0-9]/g, "");
}
//checkLocalStorage();

function renderShowOrActivity(name) {
  const formattedName = formatName(name);
  var showNameEl = $("<div>").attr("class", "o-grid-text").text(name);
  var showContainer = $("<div>")
    .attr("class", "o-grid__cell o-grid__cell--width-30")
    .append(showNameEl);
  var orEl = $(`<div class="o-grid__cell o-grid__cell--width-10">
    <div class="o-grid-text">OR</div>
  </div>`);
  var activityEl =
    $(`<div class="activity-${formattedName} o-grid__cell o-grid__cell--width-30">
    <div class="o-grid-text">Activity</div>
  </div>`);
  var buttonsEl = $(`<div class="o-grid__cell o-grid__cell--width-30">
    <button type="button" data-show="${formattedName}" class="newActivity c-button c-button--success u-small">
      generate activity
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
  tableEl.append(activityEl);
  tableEl.append(buttonsEl);

  $("#my-list").append(tableEl);
}

function addShowToMyList(showName) {
  var myShows = localStorage.getItem("myShows")
    ? JSON.parse(localStorage.getItem("myShows"))
    : [];

  if (myShows.includes(showName)) {
    //if the list already includes the show with the same name
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
  //renderShowOrActivity(showName);
  /// add activity

  renderShows();
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

  $("#saveToMyList").click(showModal);

  $("#confirm-save").click(function () {
    addShowToMyList(dataToBeRendered.name);
    closeModal();
  });
  $(".close-modal").on("click", closeModal);
};

function showModal() {
  $(".c-overlay").attr("class", "c-overlay c-overlay--visible");
  $(".o-modal").attr("class", "o-modal o-modal--visible");
}
function closeModal() {
  $(".c-overlay").attr("class", "c-overlay c-overlay--hidden");
  $(".o-modal").attr("class", "o-modal o-modal--hidden");
}

renderRandomActivity = function (activityToBeRendered, showName) {
  //let activityEl = $("<h3>").text(activityToBeRendered.activity);
  $(`.activity-${showName}`).text(activityToBeRendered.activity);
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

function getRandomActivity(e) {
  var showName = $(e.target).data("show");
  const activityUrl = "https://www.boredapi.com/api/activity/";

  fetch(activityUrl)
    .then(function (response) {
      return response.json();
    })
    .then(function (data) {
      const randomActivity = {
        activity: data.activity,
      };

      renderRandomActivity(randomActivity, showName);
    });
}

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

// TODO: check if localstorage is present - show container
function renderShows() {
  if (localStorage.getItem("myShows")) {
    // show the container
    $(".container").css("display", "block");
    $(".table").remove();

    var myShows = JSON.parse(localStorage.getItem("myShows"));
    for (let index = 0; index < myShows.length; index++) {
      const showName = myShows[index];
      renderShowOrActivity(showName);
    }
    $(".newActivity").on("click", getRandomActivity);
  }
}

renderShows();
