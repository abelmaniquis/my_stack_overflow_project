$(document).ready(function () {

	search('.unanswered-getter', "#uq-input", getData);
	search('.inspiration-getter', "#ig-input", getTopUsers);

});

function search(element, input, fn) {
	$(element).submit(function (e) {
		e.preventDefault();
		$('.results').html('');
		$('.search-results').html('');
		fn($(input).val(),fn);
	});
}

function showError(error) {
	var errorElem = $('.templates .error').clone();
	var errorText = '<p>' + error + '</p>';
	errorElem.append(errorText);
};

function getData(tags){
	console.log(tags);
	 if("#ig-input"){
	 	console.log("ig-input!");
	 		var link = "https://api.stackexchange.com/2.2/questions/unanswered";
	 		var request = {
			tagged: tags,
		    site: 'stackoverflow',
		    order: 'desc',
		    sort: 'creation'}
	 }
	 else if("#uq-input"){
	 	console.log("ug-input!");
	 	    var link = "https://api.stackexchange.com/2.2/tags/{" + tags + "}/top-answerers/all_time?site=stackoverflow";
	 	    var request = null;
	 }
	 	
	$.ajax({
		url: link, //link
		data: request, //link
		dataType: "jsonp",
		type: "GET",
	})
		.done(function (result) {

			$.each(result.items, function (key, value) {
				show(value);
			});
		})
		.fail(function (jqXHR, error) {
			var errorElem = showError(error);
			$('.search-results').append(errorElem);
		});
}


function show(object) {
	if (object.user) {

		var user = object.user;
		var obj = {
			name: "Profile: " + "<a href =" + user.link + ">" + "<b>" + user.display_name + "</b>" + "</a>",
			picture: '<img src=' + user.profile_image + '/>',
			rep_points: "Reputation points: " + user.reputation.toString(),
			postcount: "Post Count: " + object.post_count,
			score: "Score: " + object.score
		};

	} else {

		var obj = {
			title: '<b>Question</b>: ' + '<a href=' + object.link + '>' + object.title + '<a>',
			name: 'Name: ' + object.owner.display_name,
			date: 'Date Asked: ' + new Date(1000 * object.creation_date) + '</p>',
			answerCount: "Number of Answers: " + object.answer_count,
		}

	}

	for (var prop in obj) {
		$('.results').append('<p>' + obj[prop] + '</p>');
	}
};


function getUnanswered(tags) {
	console.log(tags);
	var link = "https://api.stackexchange.com/2.2/questions/unanswered"
	var request = {
		tagged: tags,
		site: 'stackoverflow',
		order: 'desc',
		sort: 'creation'
	};
	$.ajax({
		url: link,
		data: request,
		dataType: "jsonp",
		type: "GET",
	})
		.done(function (result) {

			$.each(result.items, function (i, item) {
				show(item);
			});
		})
		.fail(function (jqXHR, error) {
			var errorElem = showError(error);
			$('.search-results').append(errorElem);
		});
};

function getTopUsers(tags){
	console.log(tags);
	
	var link = "https://api.stackexchange.com/2.2/tags/{" + tags + "}/top-answerers/all_time?site=stackoverflow"
	$.ajax({
		url: link,
		data:null,
		dataType: "jsonp",
		type: "GET",
	}).done(function (result) {

		$.each(result.items, function (key, value) {
			show(value);
		});

	}).fail(function (jqXHR, error) {
		var errorElem = showError(error);
		$('.results').append(errorElem);
	});

};
