$(document).ready(function () {
	$('.unanswered-getter').submit(function (e) { //submission elements are listened for on the unanswered-getter element
		e.preventDefault();
		// zero out results if previous search has run
		$('.results').html(''); //The ' ' is used to clear the .results container in case there have been any prior searches
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='tags']").val(); //sets the value to what the user submitted. 'this' refers to the unanswered-getter div
		getUnanswered(tags);
		console.log(this);
	});
	$('.inspiration-getter').submit(function (e) { //listens for inspiration-getter element.
		e.preventDefault();
		//zero out results if previous search has run
		$('.results').html('');
		$('.search-results').html('');
		getTopUsers($("#ig-input").val());
	});
});


// this function takes the question object returned by the StackOverflow request
// and returns new result to be appended to DOM

// this function takes the results object from StackOverflow
// and returns the number of results and tags to be appended to DOM

function showSearchResults(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query + '</strong>';
	return results;
};

// takes error string and turns it into displayable DOM element

function showError(error) {
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

function showQuestion(question) {
	console.log(question);
	var result = $('.templates .question').clone();
	
	var questionElem = result.find('.question-text a');
	questionElem.attr('href', question.link);
	questionElem.text(question.title);
	
	var asked = result.find('.asked-date'); //Finds the date in the array element
	var date = new Date(1000 * question.creation_date); //date returned in decimal
	
	console.log("questionElem: " + questionElem);
	$('.results').append('<p> <b>Title:</b> ' + "<a href="+ question.link + ">" + question.title +"</a>" + '</p>')
	.append('<p>Name: '+ question.owner.display_name + '</p>')
	.append('<p> Date asked: ' + date.toString() + '</p>')
	.append('<p>' + 'Number of Answers: '+question.answer_count + '<p>');
	console.log(question.answer_count);
	console.log(question.owner.display_name);
};

// takes a string of semi-colon separated tags to be searched
// for on StackOverflow
function getUnanswered(tags) {
	//this function calls the other functions in the middle of the file.
	// the parameters we need to pass in our request to StackOverflow's API
	var request = { //This object contains the parameters which will be passed in the GET request on the stackexchange API
		tagged: tags,
		site: 'stackoverflow',
		order: 'desc', //descending order
		sort: 'creation' //sorder by creation date in descending order
	};
	$.ajax({ //This creates a variable whose value is a deferred object.
		url: "https://api.stackexchange.com/2.2/questions/unanswered", //Here is the endpoint
		data: request,
		dataType: "jsonp", //use jsonp to avoid cross origin issues
		type: "GET", //Set the method to "GET"
	})
		.done(function (result) { //this waits for the ajax to return with a succesful promise object. fires when the ajax is finished
			var searchResults = showSearchResults(request.tagged, result.items.length);
			$.each(result.items, function (i,item) {
				showQuestion(item);
			});
		})
		.fail(function (jqXHR, error) { //this waits for the ajax to return with an error promise object
			var errorElem = showError(error);
			$('.search-results').append(errorElem);
		});
	console.log();
};


function showUser(object){
	
	console.log(object);
	
	var displayobject = {
	name: "Name: " +"<b>" +object.user.display_name + "</b>",
	rep_points: "Reputation points: " + object.user.rep,
	profile_image:"Profile Image: " + "<a href =" + object.user.profile_image+">"+"link to profile image:</a> ",
	post_count: "Post Count: " + object.post_count,
	score: "Score: " + object.score
	};
	
	var display =$('.results')
	.append(
		 '<p>' + displayobject.name + '</p>' 
		+'<p>' + displayobject.rep_points + '</p>'
		+'<p>' + displayobject.profile_image + '</p>'
		+'<p>' + displayobject.post_count + '</p>'
		+'<p>' + displayobject.score + '</p>'
		+'</n>'
	);
	return display;
}

function getTopUsers(tags) {

	$.ajax({
		url: "https://api.stackexchange.com/2.2/tags/{" + tags + "}/top-answerers/all_time?site=stackoverflow",
		dataType: "jsonp",
		type: "GET",
	}).done(function (result) {

		$.each(result.items, function (key, value) {
		   showUser(value);
		});


	}).fail(function (jqXHR, error) {
		var errorElem = showError(error);
		$('.results').append(errorElem);
	});
	
	
	
};