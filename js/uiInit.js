// $(".colorDrag").draggable({
//     appendTo: '#buildBG',
//     helper: function(event) {
//         var id = $(this).attr('id');
//         var ret = $(this).clone();
//         ret.attr('dragId', id);
//         ret.css("z-index", "999");
//         console.log('dragId: ', ret.attr('dragId'));
//         return ret;
//     }
// });

// $(".moduleTemp").sortable({
//     hoverClass: "hover",
//     appendTo: '#buildBG',
//     connectWith: "#buildPreview",
//     placeholder: "sortable-placeholder",
//     over: function(event, ui) {   
           
//             var mouseX, mouseY;
//             var p = $('#buildPreview').offset();
//             var s = $(window).width();
            
//             $(document).mousemove(function(e) {
                
//                 mouseX = e.pageX - p.left + 4;
//                 mouseY = e.pageY;
//                 height_ui = $('.ui-sortable-placeholder').height();
                
//                 count = $('#frame table[data-module]').size();
                
//                 if ($('.ui-draggable.ui-draggable-dragging').length > 0) { 
                
//                     if($('.ui-sortable-placeholder').next().is('table')) {
                    
//                         if ($(count).length > 0) {
                        
//                             w = $(window).width();
        
//                             if(w < 1600){
                            
//                                 a = 250 / 338;
                            
//                             }
                            
//                             else {
                                
//                                 a = 250 / 450;
                                
//                             }
                    
//                             b = mouseX * a;
                            
//                             if(b > 250){
                            
//                                 c = 500 - b;
                            
//                                 $('.ui-sortable-placeholder').css('height',c+'px');
                                
//                             }
                            
//                             else {
                                
//                                 $('.ui-sortable-placeholder').css('height',b+'px');
                                
//                             }
                        
//                         }
                        
//                         else {
                        
//                             $('.ui-sortable-placeholder').css('height','250px');
                            
//                         }
                    
//                     }
                    
//                     else {
                        
//                         $('.ui-sortable-placeholder').css('height','250px');
                        
//                     }
                    
//                 }
            
//             }); 

           
//         },
//     helper: function(e, li) {
//         copyHelper = li.clone().insertAfter(li);
//         return li.clone();
//     },
//     stop: function(e, ui) {
//         var item = ui.item;
//         item.siblings().removeClass("newItem");
//         item.addClass("newItem").removeClass("ui-sortable-handle");
//         $("#moduleItemsCont").toggleClass("overflowHide");
//         newElemsBuild();
//         copyHelper && copyHelper.remove();
//     }
// });

// var elems = 0;

// function newElemsBuild() {
//     $('.newItem td').each(function() {
//         if ($(this).children('table').length === 0) {
//             if ($(this).text().length > 0) {
//                 $(this).wrapInner("<span class='noChild' id='noChildPreview" + elems + "'></span>");
//                 elems++;
//             }
//         }
//     });
// }

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
//         ui.item.attr("Id", totalElem);
//         ui.item.find("td").each(function() {
//             var fontSize = $(this).css("font-size");
//             console.log(fontSize);
//             fontSize = fontSize.replace("px", "");
//             $(this).attr("fontSize " + fontSize);
//             $(this).css("font-size", fontSize * 2 + "px");
//         });
//         copyHelper = null;
//         totalElem++;
//     }
// });

// // $(".imageCol").sortable({
// //     connectWith: ".selected",
// //     placeholder: "sortable-placeholder"
// // });

// // $(".selected").sortable({
// //     accept: ".draggable"
// // });