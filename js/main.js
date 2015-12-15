// Loading Screen
setTimeout(function() {
    $("#curtain").fadeOut("slow");
}, 2000);

// Variables
var totalElem = 0;
var originalPreview;
var em = 14;
var origArray = [];
var previewArray = [];
var editArray = [];
var scrubberArray = [];
var highlightSel;
var elems = 0;
var modalCounter = 0;
var imageOverlay = '<div class="imageOverlay"></div>';
var initWidth;
var moduleRatio;
var pickedColor = "#e5505f";
var textColor;

// Initialize Colour Picker, TinyMCE, and Side Menu
$("#custom").spectrum({
    showPalette: true,
    showSelectionPalette: true,
    palette: [],
    color: "#e5505f",
    preferredFormat: "hex",
    clickoutFiresChange: false,
    showInput: true,
    move: function(color) {
        pickedColor = color.toHexString();
        $("#buildBG").css("background", pickedColor);
    }
});

$(".colorButton").spectrum({
    containerClassName: 'testSpec',
    showPalette: true,
    showSelectionPalette: true,
    palette: [],
    color: "#e5505f",
    preferredFormat: "hex",
    clickoutFiresChange: false,
    showInput: true,
    change: function(color1) {
        textColor = color1.toHexString();
        tooltipUniv();
    }
});

var i = 0;

tinymce.init({
    selector: "#tinyMCE",
    min_height: 200,
    editor_selector: "modalEditor",
    plugins: [
        "advlist autolink lists link image charmap print preview anchor",
        "searchreplace visualblocks code fullscreen",
        "insertdatetime media table paste textcolor"
    ],
    setup: function(ed) {
        console.log("Tiny");
        ed.on("change keyup", function() {
            tinyTest();
        })
    },
    toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image forecolor"
});

$("#moduleProject").addClass("moduleNavShow");

arrowInit();

$(".navItem").click(function() {
    $(this).siblings().removeClass("navItemSelected");
    $(this).addClass("navItemSelected");
    var p = $(this);
    var position = p.position();
    var clickedPos = position.top;
    var finalPos = clickedPos + ($(this).height() / 2) - ($(".navArrow").height() / 2);
    $(".navArrow").css("top", finalPos);
});

$(".navItem").click(function() {
    var Id = $(this).attr("Id");
    var Id = "#" + Id.replace("navItem", "module");
    $(Id).siblings().removeClass("moduleNavShow");
    setTimeout(function() {
        $(Id).addClass("moduleNavShow");
    }, 200)


});

$("#clearTemplate").click(function() {
    $("#buildPreview").empty().append(origArray[0]);
    //buildSortable();
    buildEdit();
    //previewSortable();
    highlighterInit();
    createScrubber("#buildBG", "#scrubberCont", ".containerNon", false);
});

$("#buildCont").on('click', '.close', function() {
    $(this).parent().remove();
});

$("#buildPreview").on('click', '.refreshButton', function() {
    var item = $(this).parent().siblings(".buildElemItem");
    var className = item.children(":first").attr("Id");
    console.log(className);
    item.empty();
    item.append(eval(className));
    $(this).parent().parent().css("background-color", "");
});

$("#buildPreview").on('click', '.moduleDeleteButton', function() {
    console.log($(this));
    $(this).parent().remove();
    buildEdit();
    createScrubber("#buildBG", "#scrubberCont", ".containerNon", false);

});

$("#widthInput").change(function() {
    var width = $(this).val();
    $("#buildPreview").css("width", width + "px");
});

$("#paddingInput").change(function() {
    var padding = $(this).val();
    $("#buildPreview").css("padding", padding + "px");
});

//Set Recent Color Array
var totalColor = [];

$(".recentColor").each(function() {
    totalColor.push([]);
});

for (var i = 0; i < totalColor.length; i++) {
    var colorBox = "#colorBox" + (i + 1);
    totalColor[i].push(colorBox);
    totalColor[i].push($(colorBox).css("background-color"));
}

//Reorganize Color Array
$("#pickerBox").spectrum({
    showInput: true,
    color: "#5963dd",
    clickoutFiresChange: false,
    preferredFormat: "hex",
    change: function(color) {
        pickedColor = color.toHexString();
        console.log(pickedColor);
        $("#colorBox1").css("background-color", pickedColor);
        for (i = totalColor.length - 1; i > 0; i--) {
            totalColor[i][1] = totalColor[i - 1][1];
            $(totalColor[i][0]).css("background-color", totalColor[i][1]);
        }
        totalColor[0][1] = pickedColor;
    }
});

$(document).on('click', '.editButton', function() {
    var clone = $(this).parent().siblings(".buildElemItem").clone();
    $("#modalEdit").toggle();
    $("#currentDiv").append(clone);
    currentDivHeight();
});

$(".projectCard").click(function() {
    $("#projects").fadeOut('fast');
});

$(".boldButton").click(function(e) {
    toggleBold();
});

$(".italicButton").click(function() {
    toggleItalic();
});

$(".underlineButton").click(function() {
    toggleNewLink();
});

$(".subButton").click(function() {
    toggleSub();
});

$(".supButton").click(function() {
    toggleSup();
});

$(".testSpec").find(".sp-choose").click(function() {
    toggleColor();
});

$(".leftAlignButton").click(function() {
    alignSelection("left");
});

$(".rightAlignButton").click(function() {
    alignSelection("right");
});

$(".centerAlignButton").click(function() {
    alignSelection("center");
});

$(".headerOne").click(function() {
    toggleH1();
});

$(".headerTwo").click(function() {
    toggleH2();
});

$(".headerThree").click(function() {
    toggleH3();
});

$(".tooltipUniv, .testSpec .sp-choose").click(function() {
    getSelectionParentElement();
    tooltipUniv();
});

$(document).on('mouseenter', '#buildPreview .containerNon', function(e) {
    e.stopPropagation();

    var table = $(this);

    var mod_h = parseInt($(this).height()) / 2;

    var editButtons = '<div class="moduleCodeButton preventSelection popupButton" style="top: ' + mod_h + 'px">';
    editButtons += '<div class="codeButton">';
    editButtons += '</div>';
    editButtons += '</div>';
    editButtons += '<div class="moduleDuplicateButton preventSelection editButton popupButton" style="top: ' + mod_h + 'px">';
    editButtons += '<div class="duplicateButton">';
    editButtons += '</div>';
    editButtons += '</div>';
    editButtons += '<div class="moduleDragButton preventSelection popupButton" style="top: ' + mod_h + 'px">';
    editButtons += '<div class="dragButton">';
    editButtons += '</div>';
    editButtons += '</div>';
    editButtons += '<div class="moduleDeleteButton preventSelection popupButton" style="top: ' + mod_h + 'px">';
    editButtons += '<div class="deleteButton">';
    editButtons += '</div>';
    editButtons += '</div>';

    $(table).first('td').prepend(editButtons);

    $('.codeButton, .dragButton, .duplicateButton').delay(0).animate({

        opacity: 1,
        left: '10px'

    }, {
        duration: 400,
        easing: 'easeOutBack'
    });

    $('.deleteButton').delay(0).animate({

        opacity: 1,
        right: '10px'

    }, {
        duration: 400,
        easing: 'easeOutBack'
    });

}).on('mouseleave', '#buildPreview .containerNon', function(e) {
    e.stopPropagation();
    $('.moduleCodeButton, .moduleDragButton, .moduleDeleteButton, .moduleDuplicateButton').remove();
});

$('#buildPreview').on("input", "td[contentEditable='true']", function(e) {
    var Id = $(this).find(".noChild").attr("Id");
    var right = $(this).find(".noChild").html();
    var scrubberId = Id.replace("Preview", "Scrubber");
    var editId = Id.replace("Preview", "Edit");
    $("#" + scrubberId).html(right);
    $("#" + editId).html(right);
    console.log("right: " + right + " Id: " + Id);
});

//Scroll and Modal version of email

$("#buildPreview").on('click', '.moduleCodeButton', function() {
    var previewId = $(this).parent().attr("id");
    var modalId = previewId.replace("preview", "#edit");
    $("#modal").show();
    scroll(modalId, "#editPreview");
    selectFirst();
});

$("#buildPreview").on('click', '.imageOverlay', function() {
    var previewId = $(this).closest(".containerNon").attr("id");
    var modalId = previewId.replace("preview", "#edit");
    $("#modal").show();
    scroll(modalId, "#editPreview");

    var itemId = "#" + $(this).siblings(".noChild").attr("id");
    itemId = itemId.replace("Preview", "Edit");
    $(".noChild").removeClass("selected");
    $(itemId).addClass("selected");
    $("#modalLeftImage").show();

    if ($(".selected").find('a').length > 0) {
        var link = $(".selected").find('a').attr("href");
        console.log(link);
        $("#imageLink").val(link);
    } else {
        $("#imageLink").val('');
    }
});

$("#header").click(function() {
    $("#modal").hide();
});

$("#closePreview").click(function() {
    $("#previewModal").hide();
});

$(document).on('click', '#editPreview .containerNon', function() {
    scroll(this, "#editPreview");
});

$("#editPreview").on("click", ".noChild", function() {
    $("#editPreview").find(".containerNon").find(".selected").removeClass("selected");

    console.log("select Test");
    $(this).addClass("selected");

    console.log("Text Test");
    $("#modalLeftImage").hide();
    $("#modalLeftText").show();
    var content = $(this).html();
    console.log(content);
    //setActive(id:"tinymce-15", s:true):tinymce.ui.Control;
    tinyMCE.activeEditor.setContent(content);

});

$("#editPreview").on("click", ".imageOverlay", function() {
    console.log("image Overlay");

    $("#editPreview").find(".containerNon").find(".selected").removeClass("selected");
    $(this).siblings(".noChild").addClass("selected");

    $("#modalLeftText").hide();
    $("#modalLeftImage").show();

    if ($(".selected").find('a').length > 0) {
        var link = $(".selected").find('a').attr("href");
        console.log(link);
        $("#imageLink").val(link);
    } else {
        $("#imageLink").val('');
    }
});

$("#addLink").click(function() {

    var newLink = "http://" + $("#imageLink").val();
    var selectedId = $(".selected").attr("Id");
    var previewId = selectedId.replace("Edit", "Preview");

    if (newLink.length > 0) {
        $("#imageLinkWarning").hide();
        if ($(".selected").find('a').length > 0) {
            $(".selected").find('a').attr("href", newLink);
            $("#" + previewId).find('a').attr("href", newLink);
        } else {
            $(".selected").find('img').wrap('<a href="' + newLink + '"></a>');
            $("#" + previewId).find('img').wrap('<a href="' + newLink + '" target="_blank"></a>');
        }
    } else {
        $("#imageLinkWarning").show();
    }


});

$("#upLeft, #upRight").click(function() {
    editUp();
});

$("#downLeft, #downRight").click(function() {
    editDown();
});

$('#modalRight').on('mousewheel', function(event) {
    if (event.deltaY > 0) {
        editUp();
    } else if (event.deltaY < 0) {
        editDown();
    }
});

var mobileView = false;

$("#desktop").click(function() {
    mobileView = false;
    $("#buildPreview").removeClass("mobilePreview");
    $("#scrubberCont").removeClass("mobilePreview");
    $("#buildBG").removeClass("mobilePreviewBG");
});

$("#mobile").click(function() {
    mobileView = true;
    $("#buildPreview, #scrubberCont").addClass("mobilePreview");
    $("#buildBG").addClass("mobilePreviewBG");
    createScrubber("#buildBG", "#scrubberCont", ".containerNon", false);
});

$("#buildPreview").on('click', '.moduleDuplicateButton', function() {
    resetElem($(this).closest(".containerNon"));
});

$(".formatButton").click(function() {
    $(".formatDrop").toggle();
});

$(".underlineButton").click(function() {
    $(".newlink").toggle();
});

$(".galleryCont").on("click", ".replace", function() {

    var Id = $(".selected").attr("Id");
    var previewId = Id.replace("Edit", "Preview");
    var scrubberId = Id.replace("Edit", "Scrubber");

    if ($(this).closest(".galleryCont").find(".showCase").length > 0) {
        $("#imageWarning").hide();
        var url = $(".showCase").css("background-image");
        url = url.replace('url("', '');
        url = url.replace('")', '');
        console.log(url);
        $(".selected").css("width", "100%").find("img").attr("src", url);
        $("#" + previewId).css("width", "100%").find("img").attr("src", url);
        $("#" + scrubberId).css("width", "100%").find("img").attr("src", url);
    } else {
        $("#imageWarning").show();
    }
});

$(".colorDrag").draggable({
    appendTo: '#buildBG',
    helper: function(event) {
        var id = $(this).attr('id');
        var ret = $(this).clone();
        ret.attr('dragId', id);
        ret.css("z-index", "999");
        console.log('dragId: ', ret.attr('dragId'));
        return ret;
    }
});

$(".moduleNav").sortable({
    hoverClass: "hover",
    appendTo: '#buildBG',
    connectWith: "#buildPreview",
    placeholder: "sortable-placeholder",
    over: function(event, ui) {

        var mouseX, mouseY;
        var p = $('#buildPreview').offset();
        var s = $(window).width();

        $(document).mousemove(function(e) {

            mouseX = e.pageX - p.left + 4;
            mouseY = e.pageY;
            height_ui = $('.ui-sortable-placeholder').height();

            count = $('#frame table[data-module]').size();

            if ($('.ui-draggable.ui-draggable-dragging').length > 0) {

                if ($('.ui-sortable-placeholder').next().is('table')) {

                    if ($(count).length > 0) {

                        w = $(window).width();

                        if (w < 1600) {

                            a = 250 / 338;

                        } else {

                            a = 250 / 450;

                        }

                        b = mouseX * a;

                        if (b > 250) {

                            c = 500 - b;

                            $('.ui-sortable-placeholder').css('height', c + 'px');

                        } else {

                            $('.ui-sortable-placeholder').css('height', b + 'px');

                        }

                    } else {

                        $('.ui-sortable-placeholder').css('height', '250px');

                    }

                } else {

                    $('.ui-sortable-placeholder').css('height', '250px');

                }

            }

        });


    },
    helper: function(e, li) {
        copyHelper = li.clone().insertAfter(li);
        return li.clone();
    },
    stop: function(e, ui) {
        $("#moduleItemsCont").toggleClass("overflowHide");
        copyHelper && copyHelper.remove();
    }
});

//buildSortable();

var currentCard = 1;
var totalCards = 0;

$(".card").each(function() {
    totalCards++;
});

var chevEmail = "https://api.myjson.com/bins/3ur9a";
var gmcEmail = "https://api.myjson.com/bins/3nomm";
var cadEmail = "https://api.myjson.com/bins/1t8ni";
var buickCourierEmail = "https://api.myjson.com/bins/32y78";
var cadSquare = "https://api.myjson.com/bins/4bc70";
var chevAllImage = "https://api.myjson.com/bins/5a270";
var gmcPoster = "https://api.myjson.com/bins/4594w";

function cardLoad(htmlFile, jsonVar) {
    $("#buildPreview").load(htmlFile, function() {
        pullData(jsonVar);
        postImport();
    });
    postLoad();
}

$("#card3").click(function() {
    cardLoad('gmcEmail.html', gmcEmail);
});

$("#card5").click(function() {
    cardLoad("chevEmail.html", chevEmail);
});

$("#card6").click(function() {
    cardLoad('buickCourierEmail.html', buickCourierEmail)
});

$("#card4").click(function() {
    cardLoad('cadSquareEmail.html', cadSquare)
});

$("#card2").click(function() {
    cardLoad('chevAllImageEmail.html', chevAllImage)
});

$("#card7").click(function() {
    cardLoad('gmcPosterEmail.html', gmcPoster)
});

$("#scrollTop").click(function() {
    $('#buildCont').animate({
        scrollTop: 0
    }, 500);
});

function postLoad() {
    var delayTime = 200;
    $(this).addClass("bubble");
    setIntervalX(delayTime, totalCards);
    setTimeout(function() {
        $("#backgroundLeft").addClass("left");
        $("#backgroundRight").addClass("right");
    }, delayTime * (totalCards + 2));
    setTimeout(function() {
        $("#cardBG").hide();
    }, delayTime * (totalCards + 3))
};








// Functions
function setIntervalX(delay, repetitions) {
    var x = 0;
    var intervalID = window.setInterval(function() {
        $("#card" + (totalCards - x)).addClass("drop");

        if (++x === repetitions) {

            window.clearInterval(intervalID);
        }
    }, delay);
}

function removeButtons(select) {
    select.children(".preventSelection").remove();
};

$(".moduleNav").on("click", ".containerNon", function() {
    console.log("Testing");
    var clickClone = $(this).clone();
    $("#buildPreview .containerNon").siblings().removeClass("newItem");
    clickClone.addClass("newItem").appendTo("#buildPreview");
    var newItem = $(".newItem");
    receive(newItem);
    newElemsBuild();
    buildEdit();
    createScrubber("#buildBG", "#scrubberCont", ".containerNon", false);
    previewArray.push(clickClone.html());
    var elemNum = totalElem - 1;
    console.log($("#preview" + elemNum).offset().top);
    $('#buildCont').animate({
        scrollTop: $("#preview" + elemNum).offset().top + $("#buildCont").scrollTop()
    }, 1000);
});



function receive(target) {
    console.log("receive()");
    var newId = "preview" + (totalElem);
    target.removeClass("ui-sortable-handle").attr("Id", newId);
    target.find("td").each(function() {
        if ($(this).children('table').length === 0) {
            var fontSizeNew = ($(this).css("font-size").replace("px", "") * 100) / em;
            console.log("fontSizeNew: " + fontSizeNew);
            if ($(this).attr("data-edit") === "text") {
                $(this).attr("contentEditable", "true");
            }
            $(this).css("font-size", (fontSizeNew * moduleRatio) + "%");
        }
    });
    totalElem++;
}

function newElemsBuild() {
    $('.newItem td').each(function() {
        if ($(this).children('table').length === 0) {
            if ($(this).text().length > 0) {
                $(this).wrapInner("<span class='noChild' id='noChildPreview" + elems + "'></span>");
                elems++;
            }
        }
    });
}



function buildSortable() {
    // $("#buildPreview").sortable({
    //     hoverClass: "hover",
    //     accept: ".draggable",
    //     placeholder: "sortable-placeholder",
    //     handle: ".moduleDragButton",
    //     axis: 'y',
    //     start: function(e, ui) {
    //         ui.placeholder.height(ui.helper.outerHeight());
    //     },
    //     receive: function(e, ui) {

    //         ui.item.siblings().removeClass("newItem");
    //         ui.item.addClass("newItem")
    //         receive(ui.item);
    //         copyHelper = null;
    //         newElemsBuild();
    //         //highlighterInit();
    //         buildEdit();
    //         createScrubber("#buildBG", "#scrubberCont", ".containerNon", false);
    //         previewArray.push(ui.item.html());
    //         //newtinyMCEInline();
    //     },
    //     stop: function(e, ui) {
    //                     console.log("1234");
    //         ui.item.removeClass("ui-droppable").css("z-index", "100");
    //         removeButtons(ui.item);
    //         newElemsBuild();
    //         buildEdit();
    //         createScrubber("#buildBG", "#scrubberCont", ".containerNon", false);
    //         //newtinyMCEInline();
    //     }
    // });
}

function createSide() {
    initWidth = parseInt($("#preview0").innerWidth());
    moduleRatio = initWidth / 300;

    $("#buildPreview .containerNon").each(function() {
        var clone = $(this).clone();
        var id = clone.attr("id");
        id = id.replace("preview", "module");
        $(clone).appendTo("#moduleProject").attr("id", id);
    });

    $(".moduleNav .containerNon").each(function() {
        $(this).find("td").each(function() {
            if ($(this).children('table').length === 0) {
                $(this).attr("contentEditable", "false");
                var fontSize = $(this).css("font-size");
                if (fontSize) {
                    fontSize = parseInt(fontSize.replace("px", ""));
                    $(this).css("font-size", ((fontSize / em * 100) / moduleRatio) + "%");
                }
            }
        });
        $(this).find(".noChild").each(function() {
            console.log("test");
            var id = $(this).attr("id");
            id = id.replace("Preview", "Module");
            $(this).attr("id", id);
        });
    });
};

function postImport() {
    setTimeout(function() {

        console.log("timeout Initiated!")

        // Init Build
        idInit();
        createSide();
        findElemsBuild();
        highlighterInit();
        droppableInit();
        catchPreview();
        buildEdit();
        createScrubber("#buildBG", "#scrubberCont", ".containerNon", true);

        $(".moduleNav").sortable({
            hoverClass: "hover",
            appendTo: '#buildBG',
            connectWith: "#buildPreview",
            placeholder: "sortable-placeholder",
            over: function(event, ui) {

                var mouseX, mouseY;
                var p = $('#buildPreview').offset();
                var s = $(window).width();

                $(document).mousemove(function(e) {

                    mouseX = e.pageX - p.left + 4;
                    mouseY = e.pageY;
                    height_ui = $('.ui-sortable-placeholder').height();

                    count = $('#frame table[data-module]').size();

                    if ($('.ui-draggable.ui-draggable-dragging').length > 0) {

                        if ($('.ui-sortable-placeholder').next().is('table')) {

                            if ($(count).length > 0) {

                                w = $(window).width();

                                if (w < 1600) {

                                    a = 250 / 338;

                                } else {

                                    a = 250 / 450;

                                }

                                b = mouseX * a;

                                if (b > 250) {

                                    c = 500 - b;

                                    $('.ui-sortable-placeholder').css('height', c + 'px');

                                } else {

                                    $('.ui-sortable-placeholder').css('height', b + 'px');

                                }

                            } else {

                                $('.ui-sortable-placeholder').css('height', '250px');

                            }

                        } else {

                            $('.ui-sortable-placeholder').css('height', '250px');

                        }

                    }

                });


            },
            helper: function(e, li) {
                copyHelper = li.clone().insertAfter(li);
                return li.clone();
            },
            stop: function(e, ui) {
                $("#moduleItemsCont").toggleClass("overflowHide");
                copyHelper && copyHelper.remove();
            }
        });

        $("#buildPreview").sortable({
            hoverClass: "hover",
            accept: ".draggable",
            placeholder: "sortable-placeholder",
            handle: ".moduleDragButton",
            axis: 'y',
            start: function(e, ui) {
                console.log("349857");
                ui.placeholder.height(ui.item.outerHeight());
            },
            receive: function(e, ui) {
                ui.item.siblings().removeClass("newItem");
                ui.item.addClass("newItem")
                receive(ui.item);
                copyHelper = null;
                newElemsBuild();
                ui.item.find("*[data-edit='image']").prepend(imageOverlay);
                buildEdit();
                createScrubber("#buildBG", "#scrubberCont", ".containerNon", false);
                previewArray.push(ui.item.html());
                //newtinyMCEInline();
            },
            stop: function(e, ui) {
                ui.item.removeClass("ui-droppable").css("z-index", "100");
                removeButtons(ui.item);
                // newElemsBuild();
                // buildEdit();
                // createScrubber("#buildBG", "#scrubberCont", ".containerNon", false);
                //newtinyMCEInline();
            }
        });

    }, 2000);
}

function arrowInit() {
    $initItem = $(".navItem.navItemSelected");
    var p = $initItem;
    var position = p.position();
    var clickedPos = position.top;
    var finalPos = clickedPos + ($initItem.height() / 2) - ($(".navArrow").height() / 2);
    $(".navArrow").css("top", finalPos);
}

function pullData(brand) {
    setTimeout(function() {
        $.getJSON(brand, function(emailFill) {
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
            $('#buildPreview a').each(function() {
                if ($(this).attr("href").length > 0) {
                    if (/TEXT\d\d/.test($(this).attr("href"))) {
                        var link = $(this).attr("href").trim();
                        $(this).attr("href", emailFill[link]);
                    }
                }
            });
        });
    }, 500);
};

function buildEdit() {

    console.log("BuildEdit");

    modalCounter = 0;

    $("#editPreview").empty();

    $("#buildPreview .containerNon").each(function() {
        var clone = $(this).clone();
        var id = clone.attr("id");
        id = id.replace("preview", "edit");
        $(clone).appendTo("#editPreview").attr("id", id);
        modalCounter++;
    });
    $("#editPreview .containerNon").each(function() {
        $(this).find("td").each(function() {
            if ($(this).attr("data-edit") == "text") {
                $(this).removeAttr("contenteditable");
            }
        });
        // $(this).find(".imageOverlay").each(function() {
        //     $(this).remove();
        // });
        $(this).find(".noChild").each(function() {
            var id = $(this).attr("Id");
            id = id.replace("Preview", "Edit");
            $(this).attr("Id", id);
        });
    });
}

function tinyMCEInline() {
    // var i, t = tinyMCE.editors;
    // for (i in t){
    //     if (t.hasOwnProperty(i)){
    //         t[i].remove();
    //     }
    // }

    $("#buildPreview .noChild").each(function() {
        if ($(this).parent().attr("data-edit") === "text") {
            var id = $(this).attr("id");
            tinymce.init({
                setup: function() {
                    console.log("setupTest");
                },
                selector: "#" + id,
                inline: true,
                toolbar: "undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist | link",
                menubar: false
            });
        }
    });
}

function newtinyMCEInline() {
    $(".newItem .noChild").each(function() {
        if ($(this).parent().attr("data-edit") === "text") {
            var id = $(this).attr("id");
            tinymce.init({
                setup: function() {
                    console.log("setupTest");
                },
                selector: "#" + id,
                inline: true,
                toolbar: "undo redo",
                menubar: false
            });
        }
    });
}

function idInit() {
    $("#buildPreview .containerNon").each(function() {
        $(this).attr("Id", "preview" + totalElem);
        totalElem++;
    });
}

function droppableInit() {
    $(".containerNon").each(function() {
        createDroppable($(this));
    });
}

function catchPreview() {
    origArray.push($("#buildPreview").html());
    // setTimeout(function() {
    //     origArray.push($("#editPreview").html());
    //     origArray.push($("#scrubberCont").html());
    // }, 50);
    $("#buildPreview .containerNon").each(function() {
        var elemHTML = $(this).html();
        previewArray.push(elemHTML);
    });
    // $("#scrubberCont .containerNon").each(function() {
    //     var elemHTML = $(this).html();
    //     scrubberArray.push(elemHTML);
    // });
    // $("#editPreview .containerNon").each(function() {
    //     var elemHTML = $(this).html();
    //     editArray.push(elemHTML);
    // });
}

function resetElem(elem) {
    var elemId = elem.closest(".containerNon").attr("Id").replace("preview", "");
    var background = elem.css("background");
    console.log(background);
    elem.empty().html(previewArray[elemId]).css("background", background);
    buildEdit();
    createScrubber("#buildBG", "#scrubberCont", ".containerNon", false);
}

function createDroppable(ele) {
    $(ele).droppable({
        accept: ".colorDrag",
        drop: function(event, ui) {
            var previewId = $(this).attr("Id");
            var editId = previewId.replace("preview", "#edit");
            var scrubberId = previewId.replace("preview", "#scrubber");
            var color = $(ui.draggable).css("background-color");
            $(this).css("background-color", color)
            $(scrubberId).css("background-color", color)
            $(editId).css("background-color", color)
        }
    });
}

function currentDivHeight() {
    var divHeight = $("#currentDiv>#buildElemItem").children(":first").outerHeight();
    var contHeight = $("#currentDiv").outerHeight();
}

function highlighterInit() {
    $('#buildPreview *[data-edit="image"]').each(function() {
        if ($(this).find(".imageOverlay").length <= 0) {
            $(this).prepend(imageOverlay);
        }
    });
    $("#buildPreview .containerNon").each(function() {
        $('#buildPreview *[data-edit="text"]').attr("contentEditable", "true").highlighter();
    });
}

function alignSelection(direction) {
    var parentEl = null,
        sel;

    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            parentEl = sel.getRangeAt(0).commonAncestorContainer;
            if (parentEl.nodeType != 1) {
                parentEl = parentEl.parentNode;
            }
        }
    } else if ((sel = document.selection) && sel.type != "Control") {
        parentEl = sel.createRange().parentElement();
    }
    parentEl.style.textAlign = direction;
}

function toggleBold() {
    var range, sel;
    if (window.getSelection) {
        // Non-IE case
        sel = window.getSelection();

        //console.log(sel);
        if (sel.getRangeAt) {
            range = sel.getRangeAt(0);
        }
        document.designMode = "on";
        if (range) {
            sel.removeAllRanges();
            sel.addRange(range);
        }
        document.execCommand("bold", false, null);
        document.designMode = "off";
    } else if (document.selection && document.selection.createRange &&
        document.selection.type != "None") {
        // IE case
        range = document.selection.createRange();
        range.execCommand("bold", false, null);
    }
}

function getSelectionParentElement() {
    var parentEl = null,
        sel;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            parentEl = sel.getRangeAt(0).commonAncestorContainer;
            if (parentEl.nodeType != 1) {
                parentEl = parentEl.parentNode;
            }
        }
    } else if ((sel = document.selection) && sel.type != "Control") {
        parentEl = sel.createRange().parentElement();
    }
    highlightSel = parentEl.closest(".noChild");
    console.log(highlightSel);
}

function toggleItalic() {
    var range, sel;
    if (window.getSelection) {
        // Non-IE case
        sel = window.getSelection();
        if (sel.getRangeAt) {
            range = sel.getRangeAt(0);
        }
        document.designMode = "on";
        if (range) {
            sel.removeAllRanges();
            sel.addRange(range);
        }
        document.execCommand("italic", false, null);
        document.designMode = "off";
    } else if (document.selection && document.selection.createRange &&
        document.selection.type != "None") {
        // IE case
        range = document.selection.createRange();
        range.execCommand("italic", false, null);
    }
}

function toggleSup() {
    var range, sel;
    if (window.getSelection) {
        // Non-IE case
        sel = window.getSelection();
        if (sel.getRangeAt) {
            range = sel.getRangeAt(0);
        }
        document.designMode = "on";
        if (range) {
            sel.removeAllRanges();
            sel.addRange(range);
        }
        document.execCommand("superscript", false, null);
        document.designMode = "off";
    } else if (document.selection && document.selection.createRange &&
        document.selection.type != "None") {
        // IE case
        range = document.selection.createRange();
        range.execCommand("superscript", false, null);
    }
}

function toggleSub() {
    var range, sel;
    if (window.getSelection) {
        // Non-IE case
        sel = window.getSelection();
        if (sel.getRangeAt) {
            range = sel.getRangeAt(0);
        }
        document.designMode = "on";
        if (range) {
            sel.removeAllRanges();
            sel.addRange(range);
        }
        document.execCommand("subscript", false, null);
        document.designMode = "off";
    } else if (document.selection && document.selection.createRange &&
        document.selection.type != "None") {
        // IE case
        range = document.selection.createRange();
        range.execCommand("subscript", false, null);
    }
}

function toggleColor() {
    //var color = $(".testSpec").find("sp-input").val();

    console.log(textColor);

    var range, sel;
    if (window.getSelection) {
        // Non-IE case
        sel = window.getSelection();
        if (sel.getRangeAt) {
            range = sel.getRangeAt(0);
        }
        document.designMode = "on";
        if (range) {
            sel.removeAllRanges();
            sel.addRange(range);
        }
        document.execCommand("foreColor", false, textColor);
        document.designMode = "off";
    } else if (document.selection && document.selection.createRange &&
        document.selection.type != "None") {
        // IE case
        range = document.selection.createRange();
        range.execCommand("foreColor", false, textColor);
    }
}

function toggleNewLink() {

    var range, sel;
    $(".newLink").removeClass("newLink");

    var url = 'http://www.newlink.com?';

    if (window.getSelection) {
        // Non-IE case
        sel = window.getSelection();
        if (sel.getRangeAt) {
            range = sel.getRangeAt(0);
        }
        document.designMode = "on";
        if (range) {
            sel.removeAllRanges();
            sel.addRange(range);
        }
        var sText = document.getSelection();
        document.execCommand('insertHTML', false, '<a class="newLink" href="' + url + '" target="_blank">' + sText + '</a>');
        document.designMode = "off";
    } else if (document.selection && document.selection.createRange &&
        document.selection.type != "None") {
        // IE case
        var sText = document.getSelection();
        range = document.selection.createRange();
        range.execCommand('insertHTML', false, '<a class="newLink" href="' + url + '" target="_blank">' + sText + '</a>');
    }
}

$("#newLinkButton").click(function() {
    var newUrl = $("#new").val();
    console.log("newUrl: " + newUrl)
    $(".newLink").attr("href", newUrl);
});

function toggleH1() {
    var range, sel;
    if (window.getSelection) {
        // Non-IE case
        sel = window.getSelection();
        if (sel.getRangeAt) {
            range = sel.getRangeAt(0);
        }
        document.designMode = "on";
        if (range) {
            sel.removeAllRanges();
            sel.addRange(range);
        }
        document.execCommand("formatBlock", false, '<h1>');
        document.designMode = "off";
    } else if (document.selection && document.selection.createRange &&
        document.selection.type != "None") {
        // IE case
        range = document.selection.createRange();
        range.execCommand("formatBlock", false, '<h1>');
    }
}

function toggleH2() {
    var range, sel;
    if (window.getSelection) {
        // Non-IE case
        sel = window.getSelection();
        if (sel.getRangeAt) {
            range = sel.getRangeAt(0);
        }
        document.designMode = "on";
        if (range) {
            sel.removeAllRanges();
            sel.addRange(range);
        }
        document.execCommand("formatBlock", false, '<h2>');
        document.designMode = "off";
    } else if (document.selection && document.selection.createRange &&
        document.selection.type != "None") {
        // IE case
        range = document.selection.createRange();
        range.execCommand("formatBlock", false, '<h2>');
    }
}

function toggleH3() {
    var range, sel;
    if (window.getSelection) {
        // Non-IE case
        sel = window.getSelection();
        if (sel.getRangeAt) {
            range = sel.getRangeAt(0);
        }
        document.designMode = "on";
        if (range) {
            sel.removeAllRanges();
            sel.addRange(range);
        }
        document.execCommand("formatBlock", false, '<h3>');
        document.designMode = "off";
    } else if (document.selection && document.selection.createRange &&
        document.selection.type != "None") {
        // IE case
        range = document.selection.createRange();
        range.execCommand("formatBlock", false, '<h3>');
    }
}

function createScrubber(host, client, tableClass, newBool) {

    console.log("createTest");

    var areaTotal = 0;
    var totalHeight = 0;
    var ratio = 0;

    $(host + " " + tableClass).each(function() {
        areaTotal++;
        totalHeight += $(this).innerHeight();
    });

    setTimeout(function() {
        var areaContHeight = totalHeight;
        var previewContHeight = $(client).height();
        ratio = previewContHeight / areaContHeight;

    }, 100);

    var initialWidth = $(host + " #0").innerWidth();

    if (newBool === false) {
        $(client).empty().append("<div id='scrubber'></div>");
    }

    $(host + " " + tableClass).each(function() {
        var clone = $(this).clone();
        $(client).append(clone);
    });

    $("#scrubberCont .containerNon").each(function() {
        var scrubberId = $(this).attr("Id");
        scrubberId = scrubberId.replace("preview", "scrubber");
        $(this).attr("Id", scrubberId);
        $(this).find("td").each(function() {
            var fontSize = $(this).css("font-size");
            if (fontSize) {
                fontSize = parseInt(fontSize.replace("px", ""));
                if (fontSize > 3) {
                    $(this).css("font-size", ((fontSize / em * 100)) + "%");
                }
            }
            if ($(this).attr("data-edit") == "text") {
                $(this).removeAttr("contenteditable");
            }
        });
        $(this).find(".imageOverlay").each(function() {
            $(this).remove();
        });
        $(this).find(".noChild").each(function() {
            var id = $(this).attr("Id");
            id = id.replace("Preview", "Scrubber");
            $(this).attr("Id", id);
        });
    });

    setTimeout(function() {
        $(client + " " + tableClass).each(function() {
            var height = $(this).innerHeight() * ratio;
            if (mobileView == false) {
                var width = "150px";
            }


            $(this).css({
                "height": height,
                "width": width
            });
        });

        var buildBgHeight = $("#buildBG").position().top;

        var scrubberHeight = $(client).innerHeight() * ratio;
        $("#scrubber").css("height", scrubberHeight);

        $('#scrubber').draggable({
            axis: "y",
            containment: "parent",
            drag: function(event, ui) {
                var top = ui.position.top;
                $(host).parent().scrollTop(top / ratio);
            }
        });

        $(host).parent().scroll(function() {
            var top = $(this).scrollTop();
            $("#scrubber").css("top", top * ratio);
        });
    }, 200);
}

function scroll(clicker, cont) {

    $(clicker).siblings().removeClass("editFocus");
    $(clicker).addClass("editFocus");


    var p = $(clicker);
    var position = p.position();

    var final = (-1 * position.top) + (($(cont).height() - $(clicker).height()) / 2);

    $(cont).css("top", final);
}

function findElemsBuild() {


    $('#buildPreview td').each(function() {
        if ($(this).children('table').length === 0) {
            if ($(this).text().length > 0) {
                $(this).wrapInner("<span class='noChild' id='noChildPreview" + elems + "'></span>");
                elems++;
            }
        }
    });
}

function selectFirst() {
    $("#tinymce-15").focus();
    $(".noChild").removeClass("selected");
    $(".editFocus").find(".noChild").first().addClass("selected");
    if ($(".selected").parent('td').attr("data-edit") === "text") {
        $("#modalLeftImage").hide();
        $("#modalLeftText").show();
        tinyMCE.activeEditor.setContent($(".selected").html());
    } else if ($(".selected").closest('td').attr("data-edit") === "image") {
        $("#modalLeftText").hide();
        $("#modalLeftImage").show();
        if ($(".selected").find('a').length > 0) {
            var link = $(".selected").find('a').attr("href");
            console.log(link);
            $("#imageLink").val(link);
        }
    }
}

function editUp() {
    if ($(".editFocus").prev().length > 0) {
        scroll($(".editFocus").prev(), "#editPreview");
    }

    selectFirst();
}

function editDown() {
    if ($(".editFocus").next().length > 0) {
        scroll($(".editFocus").next(), "#editPreview");
    }

    selectFirst();
}

function tinyTest() {
    console.log(tinyMCE.activeEditor)
    var tinyContent = tinyMCE.activeEditor.getContent();
    $(".selected").empty().html(tinyContent);

    var focusId = $(".selected").attr("Id");
    console.log("focusId: " + focusId);
    var previewId = focusId.replace("Edit", "Preview");
    var scrubberId = focusId.replace("Edit", "Scrubber");
    $("#" + previewId).empty().html(tinyContent);
    $("#" + scrubberId).empty().html(tinyContent);
    scroll(".editFocus", "#editPreview");
}

function tooltipUniv() {
    if ($(highlightSel).hasClass("noChild")) {
        var origId = $(highlightSel).attr("Id").replace("noChildPreview", "");
    } else {
        var origId = $(highlightSel).closest(".noChild").attr("Id").replace("noChildPreview", "");
    }
    console.log("ID Edit: #noChildEdit" + origId + " ID Scrubber: #noChildScrubber" + origId);
    $("#noChildEdit" + origId).empty().html($(highlightSel).html());
    $("#noChildScrubber" + origId).empty().html($(highlightSel).html());
    console.log($(highlightSel).attr("Id"));
}


// Export

$("#export").click(function() {
    exportEmail();
    setTimeout(function() {
        $("#previewSidebar").addClass("previewShow");
    }, 400);
});

$("#previewSidebarClose").click(function() {
    $("#previewSidebar").removeClass("previewShow");
    setTimeout(function() {
        $("#previewSidebarTab").addClass("previewShowTab");
    }, 200);
});

$("#previewSidebarTab").click(function() {
    $("#previewSidebarTab").removeClass("previewShowTab");
    setTimeout(function() {
        $("#previewSidebar").addClass("previewShow");
    }, 200);
});

$("#previewClose").click(function() {
    $("#previewModal").removeClass("previewModalSlide");
});

$("#rotate").click(function() {
    $("#right .Cont").toggleClass("landscape");
    if ($("#orientation").html() == "portrait") {
        $("#orientation").html("landscape");
    } else {
        $("#orientation").html("portrait");
    }
});



var emailWidth = 600;

function exportEmail() {

    $("#previewModal").addClass("previewModalSlide");

    //$("#previewFrame, #previewFrameMobile").contents().append('<!DOCTYPE HTML>');

    //$("#previewFrame").contents().find('head').load('head.html');
    //$("#previewFrameMobile").contents().find('head').load('head.html');

    var exportClone = $("#buildPreview").clone();
    //exportClone = exportClone.find("#buildPreview").unwrap();

    console.log("width: " + emailWidth);

    exportClone.find(".containerNon").each(function() {
        $(this).addClass("container");
        $(this).attr('width', emailWidth);
        $(this).css({
            "padding-top": "0px",
            "padding-bottom": "0px"
        });
    });

    exportClone.find("td").each(function() {

        var data = $(this).attr('data-edit');
        var content = $(this).attr('contentEditable');


        // For some browsers, `attr` is undefined; for others,
        // `attr` is false.  Check for both.
        if (typeof data !== typeof undefined && data !== false) {
            $(this).removeAttr('data-edit');
        }
        if (typeof content !== typeof undefined && content !== false) {
            $(this).removeAttr('contentEditable');
        }
    });

    exportClone.find(".noChild").each(function() {
        $(this).contents().unwrap();
    });

    exportClone.find(".imageOverlay").each(function() {
        $(this).remove();
    });

    exportClone.find(".ui-droppable").each(function() {
        $(this).removeClass('ui-droppable');
    });

    //console.log(exportClone.length);

    $("#previewFrame, #previewFrameMobile").contents().find('body').empty().html(exportClone);
    //$("#previewFrameMobile").contents().find('body').html(exportClone);
};






















// Temp Graveyard

// function previewSortable() {
//     $("#buildPreview").sortable({
//         hoverClass: "hover",
//         accept: ".draggable",
//         placeholder: "sortable-placeholder",
//         handle: ".moduleDragButton",
//         axis: 'y',
//         start: function(e, ui) {
//             ui.placeholder.height(ui.helper.outerHeight());
//         },
//         receive: function(e, ui) {
//             console.log("receive non()");
//             ui.item.attr("Id", totalElem);
//             ui.item.find("td").each(function() {
//                 var fontSize = $(this).css("font-size");
//                 fontSize = fontSize.replace("px", "");
//                 $(this).attr("fontSize " + fontSize);
//                 $(this).css("font-size", fontSize * 2 + "px");
//             });
//             copyHelper = null;
//             totalElem++;
//         }
//     });
// }

// $("#buildPreview").on('click', '.topButton', function() {
//     var copy = $(this).parent().parent().clone();
//     $(this).parent().parent().before(copy);
//     var className = copy.attr("class");
//     className = className.split(" ")[0];
//     createDroppable("." + className);
//     highlighterInit();
// });

// $("#buildPreview").on('click', '.bottomButton', function() {
//     var copy = $(this).parent().parent().clone();
//     $(this).parent().parent().after(copy);
//     var className = copy.attr("class");
//     className = className.split(" ")[0];
//     createDroppable("." + className);
//     highlighterInit();
// });

// $("#modulesSearch").focus(function() {
//     $(".placeholderText").hide();
// });

// $("#modulesSearch").blur(function() {
//     if (!$(this).val()) {
//         $(".placeholderText").show();
//     }
// });

// $(".tooltipButton").click(function() {
//     $("td[contenteditable='true']").trigger("keyup");
// });
