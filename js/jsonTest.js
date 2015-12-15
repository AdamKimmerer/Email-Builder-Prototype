function pullData(brand) {
    setTimeout(function() {
        $.getJSON( 'js/gmcEmail.json', function( emailFill ) {
          $('#buildPreview td').each(function() {
            if ($(this).children('table').length === 0) {
                if ($(this).text().length > 0) {
                    if (/TEXT\d\d/.test($(this).text())) {
                        var text = $(this).text().trim();
                        $(this).html(emailFill[text]);
                    } else {
                        var $img = $(this).find('img');
                        var imageVar = $img.attr("src");
                        $img.attr("src", emailFill[imageVar]);
                    }
                }
            }
          });
        });
    }, 1000);
}; 
    