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
        $("<td class='row_data'>").text(data.trainName),
        $("<td class='row_data text-center'>").text(data.destination),
        $("<td class='row_data text-center'>").text(data.frequency),
        $("<td class='arrTime text-center'>").text(moment(nextTrain).format("HH:mm")),
        $("<td class='mins text-center'> data-key="+snapshot.key+"").text(tMinutesTillTrain),
        $("<td class='text-center'><i class='far fa-edit edit' id='editIcon'></i></td>"),
        $("<td class='text-center'><i class='far fa-save btn_save' id='saveIcon'></i></td>"),
        $("<td class='text-center'><i class='fas fa-eject btn_cancel' id='cancelIcon'></i></td>"),
        $("<td class='text-center'><i class='far fa-trash-alt trash' id='trashIcon' data-key="+snapshot.key+"></i></tr>")
    );

    $("#trainTable").append(tableRow);
});


$(document).on("click",".edit", function(event) {
  let currKey = $(this).attr("data-key");
  let trainRef=database.ref(currKey);
 // trainRef.remove();
  $(this).closest('tr').val(function( i, val ) {
    return val;
  });
}); 




// Deletes data from Firebase and website
$(document).on("click",".trash", function(event) {
    let currKey = $(this).attr("data-key");
    let trainRef=database.ref(currKey);
    trainRef.remove();
    $(this).closest('tr').remove()
});


// Edit, Save & Cancel Button Functionality
$(document).ready(function($)
{
	var random_id = function  () 
	{
		var id_num = Math.random().toString(9).substr(2,3);
		var id_str = Math.random().toString(36).substr(2);
		
		return id_num + id_str;
	}



	//--->make div editable > start
	$(document).on('click', '.row_data', function(event) 
	{
		event.preventDefault(); 

		if($(this).attr('edit_type') == 'button')
		{
			return false; 
		}

		//make div editable
	//	$(this).closest('div').attr('contenteditable', 'true');
		//add bg css
	//	$(this).addClass('bg-warning').css('padding','5px');

	//	$(this).focus();
	})	
	//--->make div editable > end


	//--->save single field data > start
/*	$(document).on('focusout', '.row_data', function(event) 
	{
		event.preventDefault();

		if($(this).attr('edit_type') == 'button')
		{
			return false; 
		}

		var row_id = $(this).closest('tr').attr('row_id'); 
		
		var row_div = $(this)				
		.removeClass('bg-warning') //add bg css
		.css('padding','')

		var col_name = row_div.attr('col_name'); 
		var col_val = row_div.html(); 

		var arr = {};
		arr[col_name] = col_val;

		//use the "arr"	object for your ajax call
		$.extend(arr, {row_id:row_id});

		//out put to show
		$('.post_msg').html( '<pre class="bg-success">'+JSON.stringify(arr, null, 2) +'</pre>');
		
	})	
	//--->save single field data > end */

 
	//--->button > edit > start	
	$(document).on('click', '.edit', function(event) 
	{
		event.preventDefault();
		var tbl_row = $(this).closest('tr');

	//	var row_id = tbl_row.attr('row_id');

    
		//tbl_row.find('.btn_save').show();
		//tbl_row.find('.btn_cancel').show();

		//hide edit button
		//tbl_row.find('.edit').hide(); 

		//make the whole row editable
		tbl_row.find('.row_data')
		.attr('contenteditable', 'true')
		.attr('edit_type', 'button')
		.addClass('bg-warning')
		.css('padding','3px')

		//--->add the original entry > start
		tbl_row.find('.row_data').each(function(index, val) 
		{  
			//this will help in case user decided to click on cancel button
			$(this).attr('original_entry', $(this).html());
		}); 		
		//--->add the original entry > end

	});
	//--->button > edit > end


	//--->button > cancel > start	
	$(document).on('click', '.btn_cancel', function(event) 
	{
		event.preventDefault();

		var tbl_row = $(this).closest('tr');

//		var row_id = tbl_row.attr('row_id');

		//hide save and cacel buttons
		//tbl_row.find('.btn_save').hide();
	//	tbl_row.find('.btn_cancel').hide();

		//show edit button
		//tbl_row.find('.edit').show();

		//make the whole row editable
		tbl_row.find('.row_data')
	//	.attr('edit_type', 'click')
		.removeClass('bg-warning')
		.css('padding','') 

		tbl_row.find('.row_data').each(function(index, val) 
		{   
			$(this).html( $(this).attr('original_entry') ); 
		});  
	});
	//--->button > cancel > end

	
	//--->save whole row entery > start	
	$(document).on('click', '.btn_save', function(event) 
	{
		event.preventDefault();
		var tbl_row = $(this).closest('tr');

		var row_id = tbl_row.attr('row_id');

		
		//hide save and cacel buttons
		//tbl_row.find('.btn_save').hide();
	//	tbl_row.find('.btn_cancel').hide();

		//show edit button
	//	tbl_row.find('.edit').show();


		//make the whole row editable
		tbl_row.find('.row_data')
		.attr('edit_type', 'click')
		.removeClass('bg-warning')
		.css('padding','') 

		//--->get row data > start
		var arr = {}; 
		tbl_row.find('.row_data').each(function(index, val) 
		{   
			var col_name = $(this).attr('col_name');  
			var col_val  =  $(this).html();
			arr[col_name] = col_val;
		});
		//--->get row data > end

		//use the "arr"	object for your ajax call
		$.extend(arr, {row_id:row_id});

		//out put to show
		$('.post_msg').html( '<pre class="bg-success">'+JSON.stringify(arr, null, 2) +'</pre>')
		 

	});
	//--->save whole row entery > end


}); 
