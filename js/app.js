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

function showQuestion(question) {
	// clone our result template code
	var result = $('.templates .question').clone(); //.clone() creates a deep copy of the .templates and .question elements, to be duplicated

	// Set the question properties in result
	var questionElem = result.find('.question-text a'); // the find method of the first element of an array that passes a test. Here we are trying to find the question-text a element, I can see the question-text element, but what is a?
	questionElem.attr('href', question.link); //returns link to the question. attr() sets or returns attributes and values of the selected elements.
	questionElem.text(question.title); //changes the questionElem text to question.title

	// set the date asked property in result
	var asked = result.find('.asked-date'); //Finds the date in the (.templates .question) clone
	var date = new Date(1000 * question.creation_date); //date returned in decimal
	asked.text(date.toString()); //changes the text on asked to date

	// set the .viewed for question property in result
	var viewed = result.find('.viewed');
	viewed.text(question.view_count);

	// set some properties related to asker
	var asker = result.find('.asker');
	asker.html('<p>Name: <a target="_blank" ' +
		'href=https://stackoverflow.com/users/' + question.owner.user_id + ' >' +
		question.owner.display_name +
		'</a></p>' +
		'<p>Reputation: ' + question.owner.reputation + '</p>'
	);

	return result;
};

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

			$('.search-results').html(searchResults);
			//$.each is a higher order function. It takes an array and a function as an argument.
			//The function is executed once for each item in the array.
			$.each(result.items, function (i, item) {
				var question = showQuestion(item);
				$('.results').append(question);
			});
		})
		.fail(function (jqXHR, error) { //this waits for the ajax to return with an error promise object
			var errorElem = showError(error);
			$('.search-results').append(errorElem);
		});
};


function showUser(object){
	
	var displayobject = {
	name: "Name: " +"<b>" +object.user.display_name + "</b>",
	rep_points: "Reputation points: " + object.user.rep,
	profile_image:"Profile Image: " + "<a href =" + object.user.profile_image+">"+"link to profile image:</a> ",
	post_count: "Post Count: " + object.post_count,
	score: "Score: " + object.score
	};
	
	var display =$('.results-container')
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
		var searchResults = showSearchResults(result, result.items.length);
		console.log(searchResults);
		$.each(result.items, function (key, value) {
			var question = showUser(value);
			//$('.results').append(value);
		});


	}).fail(function (jqXHR, error) {
		var errorElem = showError(error);
		$('.results').append(errorElem);
	});
};

