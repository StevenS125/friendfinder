$(document).ready(function() {

    //select2 plugin
    $('select').select2({
        placeholder: "Select an Option"
    });

    $("#submit").on('click', function() {

        //Validation to make sure there is a user input for every field.
        function validator() {
            var valid = true;

            //Validation for first two name/img inputs
            $('.form-control').each(function() {
                if ($(this).val() === '')
                    valid = false;
            });

            //Validation for <select> inputs.
            $('.questions').each(function() {
                if ($(this).val() === "")
                    valid = false
            })
            return valid;
        }

        //If fields are valid run logic
        if (validator() == true) {

            //Grab user' answers in an array.
            var userAnswer = [$("#q1").val(), $("#q2").val(), $("#q3").val(), $("#q4").val(), $("#q5").val(), $("#q6").val(), $("#q7").val(), $("#q8").val(), $("#q9").val(), $("#q10").val()]


            //Creates user object and converts result array from string --> number array.
            var newUser = {
                name: $("#name").val().trim(),
                image: $("#image").val().trim(),
                result: userAnswer.map(Number)
            }

            var currentURL = window.location.origin;
            //Array of all results for all users in friends.js
            var resultArray = []

            var matchName;
            var matchImage;

            //API call to friends.js
            $.get(currentURL + "/api/friends", function(data) {
                for (var i = 0; i < data.length; i++) {
                    compareMatches(newUser.result, data[i].result);
                }
                //When all calculations are complete, find the best match.
                if (resultArray.length == data.length) {
                    var indexOfMatch = resultArray.indexOf(Math.min.apply(Math, resultArray));
                    matchName = data[indexOfMatch].name;
                    matchImage = data[indexOfMatch].image;
                    displayModal();
                }
            })

            //Comparison calculation to find all results.
            function compareMatches(arr1, arr2) {
                var diff = 0;
                for (var i = 0; i < arr1.length; i++) {
                    var num = Math.abs(arr1[i] - arr2[i]);
                    diff += num
                }
                resultArray.push(diff);
            }

            //Display modal with match
            function displayModal() {
                $("#user-name").text(newUser.name);
                $("#match-name").text(matchName);
                $("#match-img").attr("src", matchImage);
                $("#myModal").modal();
            }

        } else {
            //If fields not complete display alert
            alert("Please complete all questions before submitting!");
        }

    })

});
