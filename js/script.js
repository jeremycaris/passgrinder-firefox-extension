jQuery( document ).ready( function($) {

    // Field focus on load
    $('#pg-password').focus();


    // Auto select all on generated pass field on click
    $('#pg-result-pass').on('touchstart click', function(){ 
        $(this).select(); 
    });


    // Toggle password field visibility
    $("body").on('click', '.toggle-password', function() {
        $("i", this).toggleClass("fa-eye-slash");
        $("i", this).toggleClass("fa-eye");
        
        var input = $(this).prev();
        
        if (input.attr("type") === "password") {
            input.attr("type", "text");
        } else {
            input.attr("type", "password");
        }
    });


    // Use current tab domain as salt
    browser.tabs.query({currentWindow: true, active: true}).then((tabs) => {
        let tab = tabs[0];
        let url = new URL(tab.url);
        let domain = url.hostname;
        $('#pg-autofill-domain').click(function(){
            // Toggle link icon and salt value
            $("i", this).toggleClass("fa-unlink");
            $('#pg-salt').val($('#pg-salt').val() == domain ? '' : domain);
            // Toggle eye icon and salt field visibility
            $('#pg-salt-toggle i').removeClass("fa-eye").addClass("fa-eye-slash");
            $('#pg-salt').attr("type", "text");
        });
    });


    // Hide generated password field and response on reset
    $("input[type='reset']").closest('form').on('reset', function(event) {
        $("#pg-result").hide();
        $("#pg-result-pass").val("");
        $('#pg-message #success').html("");
        $('#pg-message #fail').html("");
        $('#pg-message #reset').html("");
        $('#pg-password-toggle i').removeClass("fa-eye-slash").addClass("fa-eye");
        $('#pg-salt-toggle i').removeClass("fa-eye-slash").addClass("fa-eye");
        $('#pg-autofill-domain i').removeClass("fa-unlink");
        $('#pg-autofill-domain i').addClass("fa-link");
    });


    // Form functionality
    $( '#passgrinder-form' ).submit(function(e){
        e.preventDefault();
        
        // Hash the password/s
        var md5;
        if ( $.md5($('#pg-password').val(), null, true) !== '' ) {
            md5 = $.md5($('#pg-password').val(), null, true);
        }
        if ( $.md5($('#pg-salt').val(), null, true) !== '' ) {
            md5 = md5 + $.md5($('#pg-salt').val(), null, true);
        }
        if ( $.md5($('[name="pg-variation"]:checked').val(), null, true) !== '0' ) {
            md5 = md5 + $.md5($('[name="pg-variation"]:checked').val(), null, true);
        }
        if ( md5 !== '' ) {
            md5 = $.md5(md5, null, true);
        }
        var pg_z85=encodeZ85.encode(md5);
        
        $("#pg-result").show();
        $("#pg-result-pass").val(pg_z85);
        
        // Clipboard.js, copy on click
        var clipboard = new ClipboardJS('.toggle-copy');
        
        clipboard.on('success', function() {
            $('#pg-message #success').show();
            $('#pg-message #success').html( 'Copied to the clipboard!' );
            $('#pg-message #success').delay(3000).fadeOut();
        });
        
        clipboard.on('error', function() {
            $('#pg-message #fail').show();
            $('#pg-message #fail').html( 'Something went wrong. Please manually copy your password.' );
        });
        
        // Auto reset form after 5 minutes
        if ( $("#pg-result-pass").val() ) { // Double check that it is necessary
            setTimeout( function() { 
                $("#passgrinder-form").trigger('reset'); 
                $('#pg-message #reset').html("PassGrinder has automatically reset to protect your password.");
            }, 300000);
        }
        
    });


});