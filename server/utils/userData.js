function updateEntries(username) {
  // check container states
  // and disable/ enable / color buttons
  //document.getElementById('state-' + username).innerHTML = "Pending";
  let stateLabel = document.getElementById("state-" + username);
  let startButton = document.getElementById("startContainer-" + username);
  let stopButton = document.getElementById("stopContainer-" + username);
  let deleteButton = document.getElementById("deleteAccount-" + username);

  getContainerState(username)
    .then((state) => {
      stateLabel.innerHTML = state;
      switch (state) {
        case "Started":
          stopButton.disabled = true;
          break;
        case "Stopped":
          //document.getElementById('state-' + username).innerHTML = "Stopped";
          startButton.disabled = false;
          deleteButton.disabled = false;
          break;

        case "Running":
          stopButton.disabled = false;
          break;
        default:
          console.log("undefined state " + state);
          break;
      }
    })
    .catch((error) => {
      stateLabel.innerHTML = "Not Found";
      startButton.classList.remove("btn-primary");
      startButton.classList.add("btn-secondary");
      stopButton.classList.remove("btn-primary");
      stopButton.classList.add("btn-secondary");
      deleteButton.disabled = false;
    });
}

function getContainerState(username) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "/container/state",
      type: "post",
      dataType: "JSON",
      data: { username: username },
      success: function (result) {
        console.log(result);
        resolve(result);
      },
      error: function (error) {
        reject(error);
      },
    });
  });
}

function getUsernames(username) {
  return new Promise((resolve, reject) => {
    $.ajax({
      url: "/user/usernames",
      type: "get",
      dataType: "JSON",
      data: { username: username },
      success: function (result) {
        //console.log(result);
        resolve(result);
      },
      error: function (error) {
        reject(error);
      },
    });
  });
}

function startContainer(username) {
  console.log("start " + username);
  document.getElementById("startContainer-" + username).disabled = true;
  document.getElementById("deleteAccount-" + username).disabled = true;

  document.getElementById("startContainer-" + username).classList.remove("btn-primary");
  document.getElementById("startContainer-" + username).classList.add("btn-success");

  $.ajax({
    url: "/container/start",
    type: "post",
    dataType: "JSON",
    data: { username: username },
    success: function (result) {
      console.log(result);
      //resolve(result);
    },
    error: function (error) {
      console.log(error);
      //reject(error);
    },
  });
}

function stopContainer(username) {
  console.log("stop " + username);
  document.getElementById("stopContainer-" + username).disabled = true;
  document.getElementById("deleteAccount-" + username).disabled = true;

  document.getElementById("stopContainer-" + username).classList.remove("btn-primary");
  document.getElementById("stopContainer-" + username).classList.add("btn-success");

  $.ajax({
    url: "/container/stop",
    type: "post",
    dataType: "JSON",
    data: { username: username },
    success: function (result) {
      console.log(result);
      //resolve(result);
    },
    error: function (error) {
      console.log(error);
      //reject(error);
    },
  });
}

function deleteAccount(username) {
  console.log("delete " + username);
  document.getElementById("deleteAccount-" + username).disabled = true;
  document.getElementById("startContainer-" + username).disabled = true;
  document.getElementById("stopContainer-" + username).disabled = true;

  $.ajax({
    url: "/user/users",
    type: "delete",
    dataType: "JSON",
    data: { username: username },
    success: function (result) {
      console.log("ajax result");
      console.log(result);
    },
    error: function (error) {
      console.log(error);
    },
  });
}

function timedRefresh(time) {
  setTimeout("location.reload(true);", time);
}

function tableCreate(users) {
  table.innerHTML = "";
  headerInfos = ["Name", "State", "Time", "Player"];

  //Add the header row.
  var row = table.insertRow(0);
  for (var i = 0; i < headerInfos.length; i++) {
    var headerCell = document.createElement("TH");
    headerCell.innerHTML = headerInfos[i];
    row.appendChild(headerCell);
  }
  var headerCell = document.createElement("TH");
  headerCell.colSpan = "3";
  headerCell.innerHTML = "Container Functions";
  row.appendChild(headerCell);

  //Add the data rows.
  for (var i = 1; i < users.length; i++) {
    row = table.insertRow(-1);
    var cell = row.insertCell(-1);
    cell.innerHTML = users[i].name;

    for (var j = 1; j < headerInfos.length; j++) {
      var cell = row.insertCell(-1);
      cell.setAttribute("id", headerInfos[j].toLowerCase() + "-" + users[i].name);
      cell.innerHTML = cell.getAttribute("id");
    }
    cell = row.insertCell(-1);
    var button = document.createElement("button");
    button.innerHTML = "Do Something";
    cell.appendChild(button);

    cell = row.insertCell(-1);
    button = document.createElement("button");
    button.innerHTML = "Do Something Else";
    cell.appendChild(button);
  }
}

window.onload = function () {
  console.log("onload");
  getUsernames().then((result) => {
    //tableCreate(result);
    /*
                    for (let i = 0; i < result.length; i++) {
                       console.log(result[i].name);
                        
                    }
                    */
  });

  //timedRefresh(8000);
  //var test = '<%- JSON.stringify(users) %>';

  let users = JSON.parse("<%- JSON.stringify(users) %>");

  for (var i = 0; i < users.length; i++) {
    //console.log(users[i].name);
    updateEntries(users[i].name);
  }
};

function test() {
  console.log("ahoi");
}
