var totalElem = 0;
var innerElem = ""

var imageOverlay = '<div class="imageOverlay"></div>';

$("#buildPreview .containerNon").each(function() {
    $(this).attr("Id", totalElem);
    totalElem++;
});

highlighterInit();

//Draggable and Droppable Events
$(".colorDrag").draggable({
    helper: function(event) {
        var id = $(this).attr('id');
        var ret = $(this).clone();
        ret.attr('dragId', id);
        ret.css("z-index", "999");
        console.log('dragId: ', ret.attr('dragId'));
        return ret;
    }
});


function createDroppable(ele) {
    $(ele).droppable({
        accept: ".colorDrag",
        drop: function(event, ui) {
            var color = $(ui.draggable).css("background-color");
            console.log(color);
            $(this).css("background-color", color);
        }
    });
}

var originalPreview;

function catchPreview() {
    console.log("catch");
    originalPreview = $("#buildPreview").clone();
}

catchPreview();

$("#clearTemplate").click(function() {
    console.log(originalPreview);
    $("#buildPreview").remove();
    $(this).after(originalPreview);
});

$(".containerNon").each(function() {
    createDroppable($(this));
});

$(".moduleTemp").sortable({
    hoverClass: "hover",
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
                
                    if($('.ui-sortable-placeholder').next().is('table')) {
                    
                        if ($(count).length > 0) {
                        
                            w = $(window).width();
        
                            if(w < 1600){
                            
                                a = 250 / 338;
                            
                            }
                            
                            else {
                                
                                a = 250 / 450;
                                
                            }
                    
                            b = mouseX * a;
                            
                            if(b > 250){
                            
                                c = 500 - b;
                            
                                $('.ui-sortable-placeholder').css('height',c+'px');
                                
                            }
                            
                            else {
                                
                                $('.ui-sortable-placeholder').css('height',b+'px');
                                
                            }
                        
                        }
                        
                        else {
                        
                            $('.ui-sortable-placeholder').css('height','250px');
                            
                        }
                    
                    }
                    
                    else {
                        
                        $('.ui-sortable-placeholder').css('height','250px');
                        
                    }
                    
                }
            
            }); 

           
        },
    helper: function(e, li) {
        copyHelper = li.clone().insertAfter(li);
        return li.clone();
    },
    stop: function() {
        $("#moduleItemsCont").toggleClass("overflowHide");
        copyHelper && copyHelper.remove();
    }
});

function createElem(elemClass, ui) {
    var prev = ui.item.prev();
    prev.after(buildElem(totalElem, elemClass));
    ui.item.remove();
}

$("#buildPreview").sortable({
    hoverClass: "hover",
    accept: ".draggable",
    placeholder: "sortable-placeholder",
    handle: ".moduleDragButton",
    axis: 'y',
    start: function(e, ui) {
        ui.placeholder.height(ui.helper.outerHeight());
    },
    receive: function(e, ui) {
        //$(this).append()
        console.log(ui.item);
        console.log(ui.item.attr("class"));
        ui.item.attr("Id", totalElem);
        copyHelper = null;
        totalElem++;
    }
});

$("#buildCont").on('click', '.close', function() {
    console.log($(this));
    $(this).parent().remove();
});

$(".modulesButton").click(function() {
    $(this).siblings().removeClass("highlightButton");
    $(this).addClass("highlightButton");
    var id = $(this).attr("Id");
    id = id.replace("modulesButton", "temp");
    $("#" + id).siblings().removeClass("tempShow");
    $("#" + id).addClass("tempShow");
});

$("#buildPreview").on('click', '.topButton', function() {
    var copy = $(this).parent().parent().clone();
    $(this).parent().parent().before(copy);
    var className = copy.attr("class");
    className = className.split(" ")[0];
    console.log(className);
    createDroppable("." + className);
    highlighterInit();
});

$("#buildPreview").on('click', '.bottomButton', function() {
    var copy = $(this).parent().parent().clone();
    $(this).parent().parent().after(copy);
    var className = copy.attr("class");
    className = className.split(" ")[0];
    console.log(className);
    createDroppable("." + className);
    highlighterInit();
});

$("#buildPreview").on('click', '.refreshButton', function() {
    var item = $(this).parent().siblings(".buildElemItem");
    var className = item.children(":first").attr("Id");
    console.log(className);
    item.empty();
    item.append(eval(className));
    $(this).parent().parent().css("background-color", "");
});

$("#buildPreview").on('click', '.closeButton', function() {
    $(this).parent().remove();
});

$(".sidebarHeader span").click(function() {
    if ($(this).parent().parent().hasClass("modulesHeaderCont")) {
        $(this).parent().parent().siblings(".sideBody").toggleClass("sideBodyHide");
        $(this).find("i").toggleClass("sideHeaderFlip");
        $("#modulesSearch, .placeholderText").toggle();
    } else {
        $(this).parent().siblings(".sideBody").toggleClass("sideBodyHide");
        $(this).find("i").toggleClass("sideHeaderFlip");
    }
});

$("#modulesSearch").focus(function() {
    $(".placeholderText").hide();
});

$("#modulesSearch").blur(function() {
    if (!$(this).val()) {
        $(".placeholderText").show();
    }
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
var colorCount = 0;

$(".recentColor").each(function() {
    totalColor.push([]);
});

for (i = 0; i < totalColor.length; i++) {
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
        var pickedColor = color.toHexString();
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
    //$("#modular, #editor").toggleClass("navShow");
    //$(this).filter('div[data-edit="true"]').css("border", "2px solid #5963dd");
});

function currentDivHeight() {
    var divHeight = $("#currentDiv>#buildElemItem").children(":first").outerHeight();
    var contHeight = $("#currentDiv").outerHeight();
    console.log($("#currentDiv>#buildElemItem").children(":first"));
    console.log("divHeight: " + divHeight + " contHeight: " + contHeight);
}

$(".projectCard").click(function() {
    $("#projects").fadeOut('fast');
});

function borderMid(elem) {
    var elemHeight = $(elem).outerHeight();
    var finalHeight = (elemHeight / 2);
    var elemId = $(elem).attr("Id");
    var leftCont = $("#" + elemId).find(".buttonContLeft");
    var rightCont = $("#" + elemId).find(".buttonContRight");
    $(".border").show();
    var leftHeight = leftCont.outerHeight() / 2;
    var rightHeight = rightCont.outerHeight() / 2;
    $(".border").hide();
    leftCont.css("top", finalHeight - leftHeight);
    rightCont.css("top", finalHeight - rightHeight);

    //console.log("elemId: " + elemId + "\nelemHeight: " + elemHeight + "\nrightHeight: " + rightHeight + "\nleftHeight: " + leftHeight + "\n\n");
}

function highlighterInit() {
    $('#buildPreview *[data-edit="image"]').each(function() {
        $(this).append(imageOverlay);
    });
    $("#buildPreview .containerNon").each(function() {
        borderMid($(this));
        $('#buildPreview *[data-edit="text"]').attr("contentEditable", "true").highlighter();
    });
}


function styleSelection(style) {
    console.log("sel");
    var span = document.createElement(style);
    
    if (window.getSelection) {
        var sel = window.getSelection();
        if (sel.rangeCount) {
            var range = sel.getRangeAt(0).cloneRange();
            range.surroundContents(span);
            sel.removeAllRanges();
            sel.addRange(range);
        }
    }
}

function styleWhole(style) {
    console.log("whole");
        if ($(parentEl).css("font-wight") == "bold" || $(parentEl).css("font-style") == "italic" || $(parentEl).css("text-decoration") == "underline") {
            if (style == "b") {
                $(parentEl).css("font-wight", "regular");
            } else if (style == "em") {
                $(parentEl).css("font-style", "normal");
            } else if (style == "u") {
                $(parentEl).css("text-decoration", "none");
            }
        } else {
            if (style == "b") {
                $(parentEl).css("font-wight", "bold");
            } else if (style == "em") {
                $(parentEl).css("font-style", "italic");
            } else if (style == "u") {
                $(parentEl).css("text-decoration", "underline");
            }
        }
            
}

function checkParent(style) {
    var parentEl = null, sel;
    
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            parentEl = sel.getRangeAt(0).commonAncestorContainer;
            if (parentEl.nodeType != 1) {
                parentEl = parentEl.parentNode;
            }
        }
    } else if ( (sel = document.selection) && sel.type != "Control") {
        parentEl = sel.createRange().parentElement();
    }

    console.log("preParent: " + parentEl);

    $parent = jQuery(parentEl);

    console.log("postParent: " + $parent);
    console.log("hasClass: " + $parent.hasClass('threeClick'));

    if ($parent.hasClass('threeClick')) {
        styleWhole(style);
    } else {
        styleSelection(style)
    }
}

function alignSelection(direction) {
    var parentEl = null, sel;
    
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            parentEl = sel.getRangeAt(0).commonAncestorContainer;
            if (parentEl.nodeType != 1) {
                parentEl = parentEl.parentNode;
            }
        }
    } else if ( (sel = document.selection) && sel.type != "Control") {
        parentEl = sel.createRange().parentElement();
    }
    parentEl.style.textAlign = direction;
}

function toggleBold() {
    var range, sel;
    if (window.getSelection) {
        // Non-IE case
        sel = window.getSelection();
        console.log(sel);
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

function toggleNewLink() {
    //console.log("toggleNewLink");

    var range, sel;

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
        document.execCommand("CreateLink", false, url);
        document.designMode = "off";
    } else if (document.selection && document.selection.createRange &&
            document.selection.type != "None") {
        // IE case
        range = document.selection.createRange();
        range.execCommand("CreateLink", false, url);
    }
}

$(".boldButton").click(function(e) {
    toggleBold();
});

$(".italicButton").click(function() {
    toggleItalic();
});

$(".underlineButton").click(function() {
    toggleNewLink();
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

$(document).on('mouseenter', '#buildPreview .containerNon', function(e) {
    e.stopPropagation();

    table = $(this);
        
    mod_h = parseInt($(this).height()) / 2;
                
    var editButtons = '<div class="moduleCodeButton preventSelection refreshButton" style="top: '+mod_h+'px">';
    editButtons +=      '<div class="codeButton">';
    editButtons +=      '</div>';
    editButtons +=    '</div>';
    editButtons +=    '<div class="moduleDuplicateButton preventSelection editButton" style="top: '+mod_h+'px">';
    editButtons +=      '<div class="duplicateButton">';
    editButtons +=      '</div>';
    editButtons +=    '</div>';
    editButtons +=    '<div class="moduleDragButton preventSelection closeButton" style="top: '+mod_h+'px">';
    editButtons +=      '<div class="dragButton">';
    editButtons +=      '</div>';
    editButtons +=    '</div>';
    editButtons +=    '<div class="moduleDeleteButton preventSelection closeButton" style="top: '+mod_h+'px">';
    editButtons +=      '<div class="deleteButton">';
    editButtons +=      '</div>';
    editButtons +=    '</div>';
    
    $(table).first('td').prepend(editButtons);

    $('.codeButton, .dragButton, .deleteButton, .duplicateButton').delay(0).animate({
            
        width: '100%'
            
    }, { duration: 400, easing: 'easeOutBack' });

    console.log("mouseEnter");


}).on('mouseleave', '#buildPreview .containerNon', function(e) {
        e.stopPropagation();
        console.log("mouseLeave");
        $('.moduleCodeButton, .moduleDragButton, .moduleDeleteButton, .moduleDuplicateButton').remove();
    
    });

$('#buildPreview').contentEditable().change(function(e) {
    var Id = $(e.changedField).attr("Id");
    var right = $(e.changedField).html();
    $("#moduleTemp #" + Id).html(right);
    console.log(right);
});

$(document).on('click', '.imageOverlay', function() {
    alert("Image");
});

function createScrubber(host, client, tableClass) {
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
      console.log("areaContHeight: " + areaContHeight);
      console.log("previewContHeight: " + previewContHeight);
      ratio = previewContHeight/areaContHeight;
      console.log("ratio: " + ratio);
  }, 100);

  var initialWidth = $(host + " #area1").css("width");
  
  $(host + " " + tableClass).each(function() {
    var clone = $(this).clone();
    $(client).append(clone);
  });
  
  setTimeout(function() {
      $(client + " " + tableClass).each(function() {
        var height = $(this).innerHeight() * ratio;
        var width = initialWidth * ratio;
        $(this).css({"height": height, "width": width})
      });
      
      var scrubberHeight = $(client).innerHeight() * ratio;
      $("#scrubber").css("height", scrubberHeight);

      $('#scrubber').draggable({
        axis: "y", 
        containment: "parent",
        drag: function( event, ui ) {
          var top = ui.position.top;
          console.log("top: " + top);
          console.log("ratio: " + ratio);
          $(host).parent().scrollTop((top / ratio));
          console.log(top/ratio);
        }
      });

      $(host).parent().scroll(function() {
        var top = $(this).scrollTop();
        console.log(top);
        $("#scrubber").css("top", top * ratio);
      });
  }, 200)
  
}

createScrubber("#buildPreview", "#scrubberCont", ".containerNon");



// $('[contenteditable]').on('paste',function(e) {

//             var sel = document.getSelection();
//             var selRange = sel.getRangeAt(0);
//             console.log(selRange);

//             $selRange = jQuery(selRange);

//             var firstText = selRange.innerHTML;

//             console.log(firstText);

//             e.preventDefault();

//             var text = (e.originalEvent || e).clipboardData.getData('text/html') || prompt('Paste something..');
//             var $result = $('<div></div>').append($(text));

//             $(this).html('Test1      ' + $result.html() + '          Test2');

//             // replace all styles except bold and italic
//             $.each($(this).find("*"), function(idx, val) {

//                 var $item = $(val);
//                 if ($item.length > 0){
//                    var saveStyle = {
//                         'font-weight': $item.css('font-weight'),
//                         'font-style': $item.css('font-style')
//                     };
//                     $item.removeAttr('style')
//                          .removeClass()
//                          .css(saveStyle); 
//                 }
//             });

//             // remove unnecesary tags (if paste from word)
//             $(this).children('style').remove();
//             $(this).children('meta').remove()
//             $(this).children('link').remove();

//         });

// $('*[data-edit="text"]').each(function() {
//     new Medium({
//         element: $(this)
//     });
// });























// var checkScrollBars = function(){
//     var b = $('nav');
//     var normalw = 0;
//     var scrollw = 0;
//     console.log("prop: " + b.prop('scrollHeight'));
//     console.log("height: " + b.height());
//     if(b.prop('scrollHeight')>b.height()){
//         normalw = $('nav').innerWidth;
//         scrollw = normalw - b.width();
//         $('nav').css({marginRight:'-'+scrollw+'px'});
//     }
// }

// checkScrollBars();
