// this function takes the question object returned by the StackOverflow request
// and returns new result to be appended to DOM
var showQuestion = function(question) {
	
	// clone our result template code
	var result = $('.templates .question').clone(); //.clone() creates a deep copy of the .templates and .question elements
	
	// Set the question properties in result
	var questionElem = result.find('.question-text a');
	questionElem.attr('href', question.link);
	questionElem.text(question.title);

	// set the date asked property in result
	var asked = result.find('.asked-date');
	var date = new Date(1000*question.creation_date);
	asked.text(date.toString());

	// set the .viewed for question property in result
	var viewed = result.find('.viewed');
	viewed.text(question.view_count);

	// set some properties related to asker
	var asker = result.find('.asker');
	asker.html('<p>Name: <a target="_blank" '+
		'href=https://stackoverflow.com/users/' + question.owner.user_id + ' >' +
		question.owner.display_name +
		'</a></p>' +
		'<p>Reputation: ' + question.owner.reputation + '</p>'
	);

	return result;
};


// this function takes the results object from StackOverflow
// and returns the number of results and tags to be appended to DOM
var showSearchResults = function(query, resultNum) {
	var results = resultNum + ' results for <strong>' + query + '</strong>';
	return results;
};

// takes error string and turns it into displayable DOM element
var showError = function(error){
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

// takes a string of semi-colon separated tags to be searched
// for on StackOverflow
var getUnanswered = function(tags) {							//
	//this function calls the other functions in the middle of the file.
	// the parameters we need to pass in our request to StackOverflow's API
	var request = { 			//This object contains the parameters which will be passed in the GET request on the stackexchange API
		tagged: tags,			
		site: 'stackoverflow',
		order: 'desc',
		sort: 'creation'
	};
	
	$.ajax({	//This creates a variable whose value is a deferred object.
		url: "https://api.stackexchange.com/2.2/questions/unanswered",		//Here is the endpoint
		data: request,
		dataType: "jsonp",//use jsonp to avoid cross origin issues
		type: "GET",//Set the method to "GET"
	})
	.done(function(result){ //this waits for the ajax to return with a succesful promise object
		var searchResults = showSearchResults(request.tagged, result.items.length);

		$('.search-results').html(searchResults);
		//$.each is a higher order function. It takes an array and a function as an argument.
		//The function is executed once for each item in the array.
		$.each(result.items, function(i, item) {
			var question = showQuestion(item);
			$('.results').append(question);
		});
	})
	.fail(function(jqXHR, error){ //this waits for the ajax to return with an error promise object
		var errorElem = showError(error);
		$('.search-results').append(errorElem);
	});
};


$(document).ready( function() {
	$('.unanswered-getter').submit( function(e){ //submission elements are listened for on the unanswered-getter element
		e.preventDefault();
		// zero out results if previous search has run
		$('.results').html('');								//The ' ' is used to clear the .results container in case there have been any prior searches
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='tags']").val();  //sets the value to what the user submitted
		getUnanswered(tags);
	});
});