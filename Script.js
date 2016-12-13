/*
* every array[*] is correspondent to a video.
*
* eg. video_keys[1] is the key to the video with the tags tag_sets[1]
*/
var video_keys = [];
var tag_sets = [];
var titles = [];
var descriptions = [];

var API_URL = "http://138.68.78.193/videos";

var selected_topics = [];

$(document).ready(function () {

    /*
    * Hides video view from the get-go
     */
    $('#video-view').hide();

    /*
    *  Gets videos from API
     */
    $.ajax({
        dataType: "json",
        url: API_URL,
        type: 'GET',
        'data':{
        },
        'success': function (data) {
            $.each(data, function (key, value) {
                video_keys.push(value.video_key);

                var tags = [];
                tags = value.tag_set.toUpperCase().split(",");
                tag_sets.push(tags);
                console.log(tags);

                titles.push(value.title);
                descriptions.push(value.description);
            });
            /*
             * INSERT VIDEOS TO LIST FROM DATA
             */
            var video_divs = $();
            for(i = 0; i < video_keys.length; i++) {

                /*
                *  Shortens description if over 225 chars, currently 225 chars, probably need tuning.
                 */
                var concat_description = "";

                if(descriptions[i].length > 225) {
                    concat_description = descriptions[i].substring(0,225) + "...";
                } else {
                    concat_description = descriptions[i];
                }

                video_divs = video_divs.add(
                    '<div class="video-list">' +
                    '<div class="video-container" id="'+i+'">' +
                    '<div class="thumbnail-container"><img src="https://img.youtube.com/vi/'+ video_keys[i] +'/mqdefault.jpg" class="video-thumbnail"></div>' +
                    '<div class="video-details"><h3 class="video-title">'+titles[i]+'</h3>' +
                    '<p class="video-description-paragraph">'+concat_description+'</p>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '</div>');
            }
            $('#videos-list').append(video_divs);

            /*
            * We run setupPage() after we have fetched our data from the API.
             */
            setupPage();
        }
    });

    function setupPage() {
        /*
         *  TAKES ALL LIST ELEMENTS IN VID-TOPICS DIV.
         *  MAKES ON CLICK FUNCTION THAT CHANGES CSS OF ELEMENT.
         *  SORTS VIDEOS DEPENDING ON WHAT TOPICS SELECTED.
         */
        $('.vid-topics').each(function () {
            $(this).find('li').each(function () {
                /*
                 * On select topic
                 */
                $(this).click(function () {
                    if (!$(this).hasClass("selected-topic")) {
                        $(this).addClass('selected-topic');
                        selected_topics.push($(this).text());
                    } else {
                        $(this).removeClass('selected-topic');
                        var selected = selected_topics.indexOf($(this).text());
                        selected_topics[selected] = null;
                        /*
                         * Filters all selected_topics that are null out.
                         */
                        selected_topics = selected_topics.filter(function (e) {
                            return e;
                        });
                    }

                    /*
                     * Shows all videos before hiding those we dont want
                     */
                    for(i = 0; i < video_keys.length; i++){
                        $('#'+i).show();
                    }

                    /*
                    * Filters all videos who dont match selected topics
                     */
                    for(i = 0; i < selected_topics.length; i++){
                        for(j = 0; j < video_keys.length; j++){
                            var hideVideo = false;
                            if($.inArray(selected_topics[i], tag_sets[j]) == -1){
                                hideVideo = true;
                            }
                            if(hideVideo){
                                $('#'+j).hide();
                            }
                        }
                    }

                    /*
                     * If no videos with selected topics are available
                     */
                    var allHidden = true;
                    for(i = 0; i < video_keys.length; i++){
                        if($('#'+i).is(":visible")){
                            allHidden = false;
                        }
                    }

                    $('#no_videos_text').remove();
                    if(allHidden){
                        var no_videos = $();
                        no_videos = no_videos.add(
                            '<p id="no_videos_text">No videos with matching topics</p>'
                        );
                        $('#videos-list').append(no_videos);
                    }

                });
            });
        });

        /*
         * SELECT VIDEO
         */
        $('.video-container').click(function () {

            /*
             * Scrolls to top when video is selected
             */
            $('html, body').animate({
                scrollTop: 0
            }, 200);

            var id = $(this).attr('id');

            $('#list-view').fadeOut(200, function () {
                $('#video-view').fadeIn(200);
            });

            /*
            * Removes previous video layout
             */
            $('#youtube-iframe').remove();

            $('.youtube-container').prepend('<iframe id="youtube-iframe" width="100%" height="600px" src="https://www.youtube.com/embed/'+video_keys[id]+'?rel=0" frameborder="0" allowfullscreen></iframe>');
            $('.video-title-view').text(titles[id]);
            $('.video-description').text(descriptions[id]);


            /*
             *  Overrides <- back function
             */
            if (window.history && window.history.pushState) {

                window.history.pushState('forward', null, '#');

                $(window).on('popstate', function () {

                    $('#video-view').fadeOut(200, function () {
                        $('#list-view').fadeIn(200);
                    });

                });

            }

        });
    }

});