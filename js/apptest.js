$(document).ready(function () {
	$('.unanswered-getter').submit(function (e) { //submission elements are listened for on the unanswered-getter element
		e.preventDefault();
		// zero out results if previous search has run
		$('.results').html(''); //The ' ' is used to clear the .results container in case there have been any prior searches
		// get the value of the tags the user submitted
		var tags = $(this).find("input[name='tags']").val(); //sets the value to what the user submitted. 'this' refers to the unanswered-getter div
		getUnanswered(tags);
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
	
	var date = new Date(1000 * question.creation_date); //date returned in decimal
	var questionObject = 
	{
		title: '<b>Question</b>: ' + '<a href=' + question.link + '>' + question.title + '<a>',
		name: 'Name: ' + question.owner.display_name,
		date: 'Date Asked: ' + date.toString() + '</p>',
		answerCount: "Number of Answers: " + question.answer_count,
	}
	
	
	$('.results')
	.append( 
		'<div class = display-container>'
	  +	'<p>' + questionObject.title + '</p>'
	  + '<p>' + questionObject.name + '</p>'
	  + '<p>' + questionObject.date + '</p>'
	  + '<p>' + questionObject.answerCount + '</p>'
	  + '</n>'
	  + '</div>')
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
};


function showUser(object){
	
	console.log(object);
	
	var displayobject = {
	name:"Profile: " + "<a href =" + object.user.link + ">" +"<b>" +object.user.display_name + "</b>" + "</a>",
	picture: '<img src=' + object.user.profile_image + '/>',
	rep_points: "Reputation points: " + object.user.reputation.toString(),
	postcount: "Post Count: " + object.post_count,
	score: "Score: " + object.score
	};
	
	var display =$('.results')
	.append(
		'<div class=display-container>'
		+'<p>' + displayobject.picture + '</p>'
		+ '<p>' + displayobject.name + '</p>' 
		+'<p>' + displayobject.rep_points + '</p>'
		+'<p>' + displayobject.postcount + '</p>'
		+'<p>' + displayobject.score + '</p>'
		+'</n>'
		+'</div>'
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