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
firebase.analytics();

  var database = firebase.database();

  console.log(database);

  var trainName = "";
  var destination = "";
  var firstTrain = "";
  var frequency = 0;

// Sets and displays current date and time on page
  function updateClock() {
    $("#currentDate").text(moment().format("MMMM Do YYYY HH:mm"));

    setTimeout(updateClock, 1000);
  };

  updateClock();

// Checks if string is empty
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

    document.getElementById("myform").reset();
  
});


// Manipulates and displays data from Firebase
database.ref().on("child_added", function(snapshot) {
   
    console.log(snapshot.val());
    let data = snapshot.val();

    // Frequency
    let tFrequency = data.frequency;

    // First train time
    let firstTime = data.firstTrain;

    // First Time (pushed back 1 year to make sure it comes before current time)
    let firstTimeConverted = moment(firstTime, "HH:mm").subtract(1, "years");
    console.log(firstTimeConverted);

    // Current Time
    let currentTime = moment();
    console.log("CURRENT TIME: " + moment(currentTime).format("HH:mm"));

    // Difference between the times
    let diffTime = moment().diff(moment(firstTimeConverted), "minutes");
    console.log("DIFFERENCE IN TIME: " + diffTime);

    // Time apart (remainder)
    let tRemainder = diffTime % tFrequency;
    console.log(tRemainder);

    // Minute Until Train
    var tMinutesTillTrain = tFrequency - tRemainder;
    console.log("MINUTES TILL TRAIN: " + tMinutesTillTrain);

    // Next Train
    let nextTrain = moment().add(tMinutesTillTrain, "minutes");
    console.log("ARRIVAL TIME: " + moment(nextTrain).format("HH:mm"));


// Appends data to website
    var tableRow = $("<tr id='row'>").append(
        $("<td>").text(data.trainName),
        $("<td>").text(data.destination),
        $("<td>").text(data.frequency),
        $("<td class='arrTime'>").text(moment(nextTrain).format("HH:mm")),
        $("<td class='mins'> data-key="+snapshot.key+"").text(tMinutesTillTrain),
        $("<td><i class='far fa-edit edit' id='editIcon'></i></td>"),
        $("<td><i class='far fa-trash-alt trash' id='trashIcon' data-key="+snapshot.key+"></i></tr>")
    );

    $("#trainTable").append(tableRow);
});


  

   
 


// Deletes data from Firebase and website
$(document).on("click",".trash", function(event) {
    let currKey = $(this).attr("data-key");
    let trainRef=database.ref(currKey);
    trainRef.remove();
    $(this).closest('tr').remove()
});
