tempupdaterow = -1;

function loadFile(filefield){
	var reader = new FileReader();
	reader.onload = function(aFile){
		$('#'+$(filefield).attr('id')+'_base64').val(aFile.target.result);
		$(filefield).next().next().remove();
		$(filefield).parent().append($(createPreviewTag(aFile.target.result)));
	};
	for(var i in filefield.files){
		reader.readAsDataURL(filefield.files[i]);
	}
}

function detectFileType(filepath){
	var types = {
		audio:['wav', 'mp3', 'ogg'],
		video:['mp4'],
		image:['bmp', 'jpg', 'gif', 'png']	
	}
	var parts;
	if((parts = filepath.split(',')).length > 0){
		return parts[0].replace(/data\:|\;base64/g, '').split('/')[0];
	}
	parts = filepath.split('.');
	parts = parts[parts.length-1];
	for(var type in types){
		for(var ext in types[type]){
			if(types[type][ext] == parts){
				return type;
			}
		}
	}
}

function createPreviewTag(fileurl, forcetype){
	var out = "";
	
	type = detectFileType(fileurl);
	switch(type){
		case "audio":
			out = 	"<audio id='preview' controls style='width:45px; float:right; display:none;'>"+
			"<source src='"+fileurl+"'>"+
			"Your browser does not support the audio element."+
			"</audio>";
			break;
		case "video":
			out =	"<a id='preview' href='"+fileurl+"' style='float:right; width:15px; display:none; background:white; color:black; padding:2px; margin:-2px; border-radius:2px; box-shadow:0px 0px 2px black; z-index:900' target='_blank'>"+
			"<img src='icons/magnifier-medium.png' height='100%' width='100%' />"
			"</a>";
			break;
		case "image":
			out =	"<a id='preview' href='javascript:void();' style='float:right; width:15px; display:none; background:white; color:black; padding:2px; margin:-2px; border-radius:2px; box-shadow:0px 0px 2px black; z-index:900' onmouseover=\"showImagePreview(this, '"+fileurl+"')\" onmouseout=\"hideImagePreview(this)\">"+
			"<img src='icons/magnifier-medium.png' height='100%' width='100%' />"
			"</a>";
			break;
		default:
			break;
	}
	return out;
}

function showImagePreview(elem, fileurl){
	if($(elem).children('#thumb').length==0){
		var img = $('<img />');
		$(img).css({
			position:'absolute',
			marginLeft:'-40px', 
			marginTop:'-90px',
			borderRadius:'3px',
			height:'150px',
			boxShadow:'0px 0px 5px black',
			border:'solid thin black'
		});
		$(img).attr('src', fileurl);
		$(img).attr('id', 'thumb');
		$(elem).append(img);
	}else{
		$($(elem).children('#thumb')).show();
	}
}

function hideImagePreview(elem){
	$($(elem).children('#thumb')).hide();
}

function initiatepreview(td){
	//$(td).parent().css('line-height', '30px');
	$(td).children('#preview').stop().fadeIn(0);
	if(td.onmouseout==null){
		$(td).attr('onmouseout', "$(this).children('#preview').stop().fadeOut(0);");
	}else{
	}
}

function playSound(hiddenfield){
	var content = $(hiddenfield).val();
	if(content.length == 0){
		$.jGrowl("Select file first!", { theme: 'error' });
		return false;
	}
	$("#soundplaceholder").remove();
	$("<audio></audio>").attr({ 
		'id':'soundplaceholder',
		'src':content, 
		'volume':0.4,
	}).appendTo("body");
	var snd = document.getElementById('soundplaceholder');
	snd.play();
}

function previewSound(src){
	$("#soundplaceholder").remove();
	$("<audio></audio>").attr({ 
		'id':'soundplaceholder',
		'src':src, 
		'volume':0.4,
	}).appendTo("body");
	var snd = document.getElementById('soundplaceholder');
	snd.play();
}

$.fn.inlineEdit = function(options){
	var defaults = {
		newbtn:'',
		listUrl:'',
		saveUrl:'',
		saveSuccessIndicator:'SUCCESS',
		buttonSave:'icons/disk-black.png',
		buttonEdit:'icons/pencil-ruler.png',
		buttonCross:'icons/cross-button.png',
		tds:{},
	};
	
	var tgtTable = document.getElementById($(this).attr('id'));
	$("#"+options.newbtn).click(function(){
		$(tgtTable).find('tbody').append(createRow(null, true));
	});
	$('#'+options.refreshbtn).click(function(){
		$(tgtTable).trigger('refreshtable');
	});
	
	function detectFileType(filepath){
		var types = {
			audio:['wav', 'mp3', 'ogg'],
			video:['mp4'],
			image:['bmp', 'jpg', 'gif', 'png']	
		}

		var parts = filepath.split('.');
		parts = parts[parts.length-1];
		for(var type in types){
			for(var ext in types[type]){
				if(types[type][ext] == parts){
					return type;
				}
			}
		}
	}
	
	function createPreviewTag(fileurl, forcetype){
		var out = "";
		
		type = detectFileType(fileurl);
		switch(type){
			case "audio":
				out = 	"<audio id='preview' controls style='width:45px; float:right; display:none;'>"+
				"<source src='"+fileurl+"'>"+
				"Your browser does not support the audio element."+
				"</audio>";
				break;
			case "video":
				out =	"<a id='preview' href='"+fileurl+"' style='float:right; width:15px; display:none; background:white; color:black; padding:2px; margin:-2px; border-radius:2px; box-shadow:0px 0px 2px black; z-index:900' target='_blank'>"+
				"<img src='icons/magnifier-medium.png' height='100%' width='100%' />"
				"</a>";
				break;
			case "image":
				out =	"<a id='preview' href='javascript:void();' style='float:right; width:15px; display:none; background:white; color:black; padding:2px; margin:-2px; border-radius:2px; box-shadow:0px 0px 2px black; z-index:900' onmouseover=\"showImagePreview(this, '"+fileurl+"')\" onmouseout=\"hideImagePreview(this)\">"+
				"<img src='icons/magnifier-medium.png' height='100%' width='100%' />"
				"</a>";
				break;
			default:
				break;
		}
		return out;
	}
		
	function createField(attributes, val){
		if(attributes['tag']=='input') return createInput(attributes, val);
		else if(attributes['tag']=='select') return createSelect(attributes, val);
		else if(attributes['tag']=='textarea'){
			return createTextarea(attributes,val);
		}
	}
	
	function createTextarea(attributes, val){
		var textarea = "<textarea ";
		for(var attr in attributes){
			if(attr == 'tag') continue;
			textarea += attr+'="'+attributes[attr]+'" ';
		}
		textarea += ">"+val.toString().replace(/<br>/g, '\n')+"</textarea>";
		return textarea;
	}

	
	function createSelect(attributes, value){
		var select = "<select ";		
		
		var playbtn =""; var style="";
		
		for(var attr in attributes){
			if(attr == 'tag' || attr == 'options') continue;
			select += attr+'="'+attributes[attr]+'" ';
		}
		
		var opts = $(attributes['options']).find('option');
		var sOpts = "";
		for(var i=0; i<opts.length; i++){
			if($(opts[i]).html()==value){
				$(opts[i]).attr('selected', true);
			}
			sOpts+= opts[i].outerHTML;
		}
	
		
		select += " style='"+style+"'>"+sOpts;
		select += "</select>"+playbtn;
		return select;
	}
	
	function createInput(attributes, val){
		if(attributes['type']=='file'){
			if(attributes['preview']){
				var styles = attributes['style'].split(';');
				styles.push("width:70%; float:left; margin-right:10px; padding:0px; margin-top:0px;");
				attributes['style'] = styles.join(";");
			}
		}
		
		var input = "<"+attributes['tag']+" ";		
		for(var attr in attributes){
			if(attr == 'tag') continue;
			input += attr+'="'+attributes[attr]+'" ';
		}
		if(attributes['type']=='file'){
		
			input+= " onchange='loadFile(this);'/>";
			input+= '<input type="hidden" id="'+attributes['id']+'_base64"/>';
			
		}else if(attributes['type']=='datetimepicker' || attributes['type']=='datepicker'){
		
			input+= " value='"+val+"' onfocus=\"if(!$(this).hasClass('hasDatepicker')){ $(this)."+
					attributes['type']+"({ dateFormat: 'yy-mm-dd' }); $(this).blur(); $(this).focus(); }\"/>";
			
		}else if(attributes['type']=='media'){
		
			input = input.replace('type="media"', 'type="hidden"');
			input+= " value='"+val+"' />";
			var hash = Math.ceil(Math.random()).toString(16);
			$.ajax({
				dataType:'json',
				url:options.mediaBrowserUrl,
			}).success(function(data){
				var iconset = "";
				for(var i =0; i<data.length; i++)
					iconset += "<img src='"+data[i].filename+"' />";
				$('#mediaselect'+hash).html(iconset);
			});
			input+= "<div id='mediaselect"+hash+"'></div>"
			
		}else{
			input+= " value='"+val+"'/>";
		}
		
		return input;
	}
	
	function createRow(row, encapsulate){
		var newrow = $('<tr></tr>');
		var col = "";
		if(row != null){
			var data = $(row).find('td');
			for(var i in options.tds){
				var colopt = options.tds[i];
				if(colopt['type']=='file' && colopt['preview']){
					col +="<td onmouseover='initiatepreview(this)'>";
					col += createField(colopt,data[i].innerHTML.split(/</)[0])+createPreviewTag(data[i].innerHTML.split(/</)[0]);
					col += "</td>";
				}else{
					col +="<td>";
					col += createField(colopt,data[i].innerHTML);
					col += "</td>";
				}
			}
			col += "<td>"+
				"<img src='"+options.buttonSave+"' onclick='$(this.parentNode.parentNode.parentNode.parentNode).trigger(\"updaterow\", this.parentNode.parentNode)' />"+
				"<img src='"+options.buttonCross+"' onclick='$(this.parentNode.parentNode.parentNode.parentNode).trigger(\"cancelediting\", this.parentNode.parentNode)' />"+
			"</td>";
		}else{
			for(var k in options.tds){
				var colopt = options.tds[k];
				if(colopt['type']=='file' && colopt['preview']){
					col +="<td onmouseover='initiatepreview(this)'>";
					col += createField(colopt,"")+createPreviewTag("");
					col += "</td>";
				}else{
					col +="<td>";
					col += createField(colopt,"");
					col += "</td>";
				}
				
			}
			col += "<td>"+
				"<img src='"+options.buttonSave+"' onclick='$(this.parentNode.parentNode.parentNode.parentNode).trigger(\"savetable\", this.parentNode.parentNode)' />"+
				"<img src='"+options.buttonCross+"' onclick='$(this.parentNode.parentNode).remove()' />"+
			"</td>";
		}
		if(!encapsulate){
			return $(col);
		}else{
			$(newrow).html(col);
			return newrow;
		}
	}
	
	$(tgtTable).bind('savetable', function(event, row){
		var data = {};
		for(i in options.tds){
			if(options.tds[i].type == 'file'){
				var ctn = $('#'+options.tds[i].id+'_base64').val();
				if($('#'+options.tds[i].id).val()!=""){
					data[options.tds[i].name] = $('#'+options.tds[i].id).val().match(/[^\/\\]+$/)[0];
				}else{
					alert('Please select file first!');
					$('#'+options.tds[i].id).click();
					return;
				}
				data[options.tds[i].name+'_base64'] = ctn.substring(ctn.indexOf(',')+1);
			}else if(options.tds[i].type == 'textarea'){
				data[options.tds[i].name] = $(row).find('#'+options.tds[i].id).html().replace(/<br>/g, '\n');
			}else{
				data[options.tds[i].name] = $(row).find('#'+options.tds[i].id).val();
			}
		}
		$.ajax({
			url:options.saveUrl,
			data:data,
			type:'POST',
			success:function(resp){
				if(resp == options.saveSuccessIndicator){
					$(tgtTable).trigger('refreshtable');
				}else{
					alert(resp);
				}
				tempupdaterow = -1;
			}
		});
	});
	
	$(tgtTable).bind('refreshtable', function(event, row){
		$.ajax({
			url:options.listUrl,
			dataType:'json',
			success:function(data){
				$(tgtTable).find('tbody').html('');
				for(var i in data){
					var datarow = $("<tr></tr>");
					var datacol = "";
					for(var j in options.tds){
						if(options.tds[j].id=="id"){
							$(datarow).attr('recordid', data[i][options.tds[j].id]);
						}
						if(options.tds[j].name.indexOf('_id')>-1){
							var rfield = options.tds[j].descfield.split('.');
							data[i][options.tds[j].name] = data[i][rfield[0]][rfield[1]];
						}
						
						if(options.tds[j].type == 'file' || options.tds[j].tag == 'select'){
							if(options.tds[j].preview){
								datacol += "<td onmouseover='initiatepreview(this)'>"+data[i][options.tds[j].name]+createPreviewTag(data[i][options.tds[j].name])+"</td>";
							}else{
								datacol += "<td>"+data[i][options.tds[j].name]+"</td>";
							}
						}else{
							datacol += "<td>"+data[i][options.tds[j].name].toString().replace(/\n/g, '<br>')+"</td>";
						}
					}
					datacol += "<td>"+
						"<img src='"+options.buttonEdit+"' onclick='$(this.parentNode.parentNode.parentNode.parentNode).trigger(\"enableediting\", this.parentNode.parentNode)' />"+
						"<img src='"+options.buttonCross+"' onclick='$(this.parentNode.parentNode.parentNode.parentNode).trigger(\"deleterow\", this.parentNode.parentNode)' />"+
					"</td>";
					$(datarow).html(datacol);
					$(tgtTable).find('tbody').append(datarow);
				}
			}
		});
		tempupdaterow = -1;
	});
	
	$(tgtTable).bind('updaterow', function(event, row){
		$(this).trigger('savetable', row);
	});
	
	$(tgtTable).bind('deleterow', function(event, row){
		if(!confirm("[WARNING] Any record(s) that requires this record will also be deleted.\n\nAre you sure to delete this record?")) return;
		var idtodelete = $(row).attr('recordid');
		$.ajax({
			url:options.deleteUrl,
			data:{
				id:idtodelete
			},
			type:'GET',
			headers: {
				'X-CSRF-Token': xcsrftoken
			},
			success:function(resp){
				if(resp == options.saveSuccessIndicator){
					$(tgtTable).trigger('refreshtable');
				}else{
					alert(resp);
				}
			}
		});
		tempupdaterow = -1;
	});
	
	$(tgtTable).bind('enableediting', function(event, row){
		var idtoupdate = $(row).attr('recordid');
		if(tempupdaterow == -1){
			var rowtoupdate = $(tgtTable).find('tbody > tr[recordid='+idtoupdate+']');
			tempupdaterow = $(rowtoupdate).clone();
			$(rowtoupdate).html(createRow(rowtoupdate, false));
		}else{
			alert('Finish current editing first!');
			return;
		}
	});
	
	$(tgtTable).bind('cancelediting', function(event, row){
		$(row).html($(tempupdaterow).html());
		tempupdaterow = -1;
	});
	
	$(tgtTable).trigger('refreshtable');
}