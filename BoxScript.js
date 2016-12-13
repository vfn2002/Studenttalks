// Email regex, checks if email is valid.
var API_URL = "http://138.68.78.193/user";


$(document).ready(function () {

    /*
    * Toggle content on click
     */
    $('#box-header').click(function () {
        $('#box-content').slideToggle();
    });

    /*
    * On click submit
     */
    $('.submit-button').click(function () {

        /*
        * Checks if fields are valid
         */
        var name = $('#name-field').val();
        var email = $('#email-field').val();
        var event_id = $('.event_id').attr('id');
        var message = $('#message');


        if(validateFields( name, email )){

            $('#content-form').slideUp(600);

            /*
             *  Sends request to API
             */
            $.ajax({
                dataType: "json",
                url: API_URL,
                type: 'POST',
                'data': {
                    "name":name,
                    "email":email,
                    "event_id":event_id
                },
                statusCode: {
                    201: function (data) {
                        console.log(data);
                        message.text("Ticket sent!");
                        $('#return_message').slideDown(200);
                    },
                    400: function (data) {
                        var responseText = $.parseJSON(data.responseText);
                        message.text(responseText["errors"]);
                        $('#return_message').slideDown(200);
                    },
                    422: function (data) {
                        var responseText = $.parseJSON(data.responseText);
                        message.text(responseText["errors"]);
                        $('#return_message').SlideDown(200);
                    }
                }
            });
        } else {

        }

    });

    function validateFields( name, email ) {

        var validName;
        var validEmail;

        /*
         * validate name field
         */
        if (name.length > 0){
            validName = true;
        } else {
            $('#name-field').addClass("warning");
            validName = false;
        }

        /*
         * validate email field
         */
        if(isValidEmailAddress(email)){
            validEmail = true;
        } else {
            $('#email-field').addClass("warning");
            validEmail = false;
        }


        return validEmail == true && validName == true;
    }

    function isValidEmailAddress(emailAddress) {
        var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
        return pattern.test(emailAddress);
    }
});