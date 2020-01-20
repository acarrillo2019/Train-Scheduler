  // Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyBLzUUhgIhHAxPc__xEcRUaZQ_AjqH4SYs",
    authDomain: "train-scheduler-3145d.firebaseapp.com",
    databaseURL: "https://train-scheduler-3145d.firebaseio.com",
    projectId: "train-scheduler-3145d",
    storageBucket: "train-scheduler-3145d.appspot.com",
    messagingSenderId: "352699456061",
    appId: "1:352699456061:web:7e914cde9a7f1548df6854",
    measurementId: "G-S1PLPX9JZB"
  };



  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  //firebase.analytics();

  var database = firebase.database();

  console.log(database);

  const isEmpty = function(str) {
 return str.trim() === '';
};

  $("#submitButton").on("click", function(event) {
    event.preventDefault();
    
    var trainName = $("#trainNameInput").val().trim();
    var destination = $("#destinationInput").val().trim();
    var firstTrain = $("#firstTrainInput").val().trim();
    var frequency = $("#frequencyInput").val().trim();

    const invalid = [trainName, destination, firstTrain, frequency].filter(isEmpty);

    if (invalid.length) {
        alert("Invalid Input")
        return;
      };

database.ref().push({
    trainName,
    destination,
    firstTrain,
    frequency
  });
console.log("hello")
  
});

database.ref().on("child_added", function(snapshot) {
 console.log(snapshot.val());
 var data = snapshot.val();
// var tableRow = $("<tr>");

var today = moment();
//moment.duration().asMinutes()
moment(firstTrain).format("HH:mm")
var trainFreq = moment(data.firstTrain);

//var monthDiff = today.diff(startDate, 'months');
//console.log("Month:", monthDiff);
 
//var totalBilled = data.monthlyInput * monthDiff;

var tableRow = $("<tr>").append(
    $("<td>").text(data.trainName),
    $("<td>").text(data.destination),
    $("<td>").text(data.firstTrain),
    $("<td>").text(data.frequency),
//    $("<td>").text(monthDiff),
//   $("<td>").text(monthDiff * data.rate)
  );


 $("#trainTable").append(tableRow);
  });
