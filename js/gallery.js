var jsonObj = $.parseJSON('[{"Name":"Walking Guy","URL":"https://unsplash.it/800/200"},{"Name":"Coffee Bar","URL":"https://unsplash.it/700/200"},{"Name":"Skids","URL":"https://unsplash.it/700/300"},{"Name":"Desert","URL":"https://unsplash.it/700/350"},{"Name":"Beach","URL":"https://unsplash.it/700/550"},{"Name":"Log","URL":"https://unsplash.it/800/550"},{"Name":"Sailboat","URL":"https://unsplash.it/800/600"},{"Name":"Road","URL":"https://unsplash.it/800/620"},{"Name":"Street","URL":"https://unsplash.it/800/630"},{"Name":"Sky","URL":"https://unsplash.it/800/640"},{"Name":"Cars","URL":"https://unsplash.it/800/650"},{"Name":"Iceberg","URL":"https://unsplash.it/800/660"},{"Name":"KingVulture","URL":"https://unsplash.it/800/670"}]');

$(document).ready(function(){

	var currentCol = 0;
	

	for (var i = 0; i < jsonObj.length; i++) {

		var elem = '<div data-name="' + jsonObj[i].Name + '" data-url="' + jsonObj[i].URL + '" class="galleryImage"><img width="100%" src="' + jsonObj[i].URL + '"><div class="galleryImageExpand"><i class="fa fa-expand"></i></div><div class="galleryImageDesc">' + jsonObj[i].Name + '</div></div>';

		if (i < jsonObj.length - 1) {
			if (currentCol === 0) {
				$("#imageCol0").append(elem);
				currentCol++;
			} else if (currentCol === 1) {
				$("#imageCol1").append(elem);
				currentCol++;
			} else if (currentCol === 2) {
				$("#imageCol2").append(elem);
				currentCol = 0;
			}
		} else {
			var array = [];

			for (var j = 0; j < 3; j++) {
				array.push($("imageCol" + j).height);
			}

			var max = Math.max.apply(Math,array);

			$("#imageCol" + max).append(elem);
		}
			
		
	}
});

$("#modalLeft").on('click','.galleryImage', function() {
	$(this).closest('#galleryImageCont').find('.imageSelected').removeClass('imageSelected');
	$(this).addClass('imageSelected');
	var name = $(this).attr("data-name");
	var url = $(this).attr("data-url").split("/")[2];

	$("#imageName").html(name);
	$("#imageFileName").html(url);
	$("#imageDimensions").html($(this).find('img').naturalWidth + " x " + $(this).find('img').naturalHeight + " px");
});