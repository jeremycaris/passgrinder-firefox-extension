// Toggle password field visibility
jQuery( document ).ready( function($) {
    $("body").on('click', '.toggle-password', function() {
        $("i", this).toggleClass("fa-eye-slash");
        
        var input = $(this).prev();
        
        if (input.attr("type") === "password") {
            input.attr("type", "text");
        } else {
            input.attr("type", "password");
        }
    });
});



// Auto select all on generated pass field on click
jQuery( document ).ready( function($) {
    $('#pg-result-pass').on('touchstart click', function(){ 
        $(this).select(); 
    });
});


    
// Hide generated password field and response on reset
jQuery( document ).ready( function($) {
    $("input[type='reset']").closest('form').on('reset', function(event) {
        $("#pg-result").hide();
        $("#pg-result-pass").val("");
        $('#pg-message #success').html("");
        $('#pg-message #fail').html("");
        $('#pg-message #reset').html("");
    });
});



// Form functionality
jQuery( document ).ready( function($) {
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



// Field focus on load
jQuery( document ).ready( function($) {
    $('#pg-password').focus();
});