var scaling = "fit";
var width = 1024;
var height = 768;
var countPieces = 0;
var totalPieces = 0;
var selected = (localStorage.getItem('__puzzle_brg')!=null&&localStorage.getItem('__puzzle_brg')!=undefined?localStorage.getItem('__puzzle_brg'):0);
var level = (localStorage.getItem('__puzzle_level')!=null&&localStorage.getItem('__puzzle_level')!=undefined?localStorage.getItem('__puzzle_level'):0);
var __images = ["assets/brave.jpg","assets/jungle.jpg","assets/masha.jpg","assets/rango.jpg", "assets/beauty.jpg", "assets/pitt.jpg", "assets/titanic.jpg", "assets/cowboy.jpg", "assets/trees.jpg", "assets/tulip.jpg"];
var __imgopt = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];
var __level = ['seasy', 'easy', 'medium', 'umedium', 'hard', 'vhard', 'shard'];


var frame = new Frame(scaling, width, height);
frame.on("ready", function()
{
	var stage = frame.stage;
	var stageW = frame.width;
	var stageH = frame.height;

	var puzzleX;
	var puzzleY;
	frame.outerColor = "#444";
	frame.color = "#ddd";

	var con = new Container

	var imageObj = [];
	var piecesArrayObj = [];
	frame.loadAssets(__images[selected]);

	var label = new Label({
	   text:"CLICK",
	   size:40,
	   font:"courier",
	   color:"orange",
	   rollColor:"red",
	   fontOptions:"bold"
	});
	stage.addChild(label);
	label.x = -100;
	label.y = -100;
	label.on("click", function(){zog("clicking");});


	frame.on("complete", function() {


		imageObj = frame.asset(__images[selected]).clone();
		imageObj.addTo(con);
		imageObj.alpha = 0.2;

		var piecesArray = new Array();
		var horizontalPieces = 2;
		var verticalPieces = 3;
		if(level==0){
			horizontalPieces = 3;
			verticalPieces = 3;
		}else if(level==1){
			horizontalPieces = 4;
			verticalPieces = 4;
		}else if(level==2){
			horizontalPieces = 5;
			verticalPieces = 5;
		}else if(level==3){
			horizontalPieces = 6;
			verticalPieces = 6;
		}else if(level==4){
			horizontalPieces = 8;
			verticalPieces = 8;
		}else{
			horizontalPieces = 10;
			verticalPieces = 10;
		}
		var obj = getQueryString();
		zog(obj)
		if(obj)
		{
		   horizontalPieces = obj.row;
		   verticalPieces = obj.column;
		}
		var imageWidth = imageObj.width;
		var imageHeight = imageObj.height;
		var pieceWidth = Math.round(imageWidth / horizontalPieces);
		var pieceHeight = Math.round(imageHeight / verticalPieces);
		var gap = 40;
		totalPieces = horizontalPieces*verticalPieces;

		puzzleX = frame.width/2-imageWidth/2;
		puzzleY = frame.height/2-imageHeight/2;
		imageObj.pos(puzzleX,puzzleY);
		zog(puzzleX,puzzleY);

		document.getElementById('score').innerHTML = "Done: "+countPieces+"/"+totalPieces;


		for (j = 0; j < verticalPieces; j++) {
			piecesArrayObj[j] = [];
			for (i = 0; i < horizontalPieces; i++) {
				var n = j + i * verticalPieces;

				var offsetX = pieceWidth * i;
				var offsetY = pieceHeight * j;


				var x8 = Math.round(pieceWidth / 8);
				var y8 = Math.round(pieceHeight / 8);

				piecesArrayObj[j][i] = new Object();
				piecesArrayObj[j][i].right = Math.floor(Math.random() * 2);
				piecesArrayObj[j][i].down = Math.floor(Math.random() * 2);

				if (j > 0) {
					piecesArrayObj[j][i].up = 1 - piecesArrayObj[j - 1][i].down;
				}
				if (i > 0) {
					piecesArrayObj[j][i].left = 1 - piecesArrayObj[j][i - 1].right;
				}

				piecesArray[n] = new Rectangle({
					width: pieceWidth,
					height: pieceHeight,

				});



				var tileObj = piecesArrayObj[j][i];
				var s = new Shape

				var context = s.graphics;
				s.drag();
				s.mouseChildren = false;
				s.addEventListener("pressup", function(e) {
					var mc = e.currentTarget;

					var xx = Math.round(mc.x);
					var yy = Math.round(mc.y);

					if (xx < puzzleX+gap / 2 && xx > puzzleX-gap / 2 && yy < puzzleX+gap / 2 && yy > puzzleY-gap / 2) {
						 mc.x = puzzleX;
						mc.y = puzzleY;
						mc.noDrag();
						mc.addTo(mc.parent,0);
						mc.mouseChildren = false;
						mc.mouseEnabled = false;
						mc.hint.visible = false;
						countPieces++;
						document.getElementById('score').innerHTML = "Done: "+countPieces+"/"+totalPieces;
						zog("countPieces",countPieces);
						if(countPieces == totalPieces)
						{
							var pane = new Pane({width:600,label:"Well Done!", height:200, modal:true, displayClose:true});

							var confirm = new Button(120, 50, "OK", "green").center(pane).mov(0,70);

							confirm.on("click", function() {
								pane.hide();
							});
							pane.show();
						}
						stage.update();

					}

				});
				context.setStrokeStyle(3,"round");
				var commandi1 = context.beginStroke(createjs.Graphics.getRGB(0, 0, 0)).command;
				var commandi = context.beginBitmapFill(imageObj.image).command;


				context.moveTo(offsetX, offsetY);




				if (j != 0) {
					context.lineTo(offsetX + 3 * x8, offsetY);
					if (tileObj.up == 1) {
						context.curveTo(offsetX + 2 * x8, offsetY - 2 * y8, offsetX + 4 * x8, offsetY - 2 * y8);
						context.curveTo(offsetX + 6 * x8, offsetY - 2 * y8, offsetX + 5 * x8, offsetY);
					} else {
						context.curveTo(offsetX + 2 * x8, offsetY + 2 * y8, offsetX + 4 * x8, offsetY + 2 * y8);
						context.curveTo(offsetX + 6 * x8, offsetY + 2 * y8, offsetX + 5 * x8, offsetY);
					}
				}
				context.lineTo(offsetX + 8 * x8, offsetY);
				if (i != horizontalPieces - 1) {
					context.lineTo(offsetX + 8 * x8, offsetY + 3 * y8);
					if (tileObj.right == 1) {
						context.curveTo(offsetX + 10 * x8, offsetY + 2 * y8, offsetX + 10 * x8, offsetY + 4 * y8);
						context.curveTo(offsetX + 10 * x8, offsetY + 6 * y8, offsetX + 8 * x8, offsetY + 5 * y8);
					} else {
						context.curveTo(offsetX + 6 * x8, offsetY + 2 * y8, offsetX + 6 * x8, offsetY + 4 * y8);
						context.curveTo(offsetX + 6 * x8, offsetY + 6 * y8, offsetX + 8 * x8, offsetY + 5 * y8);
					}
				}
				context.lineTo(offsetX + 8 * x8, offsetY + 8 * y8);
				if (j != verticalPieces - 1) {
					context.lineTo(offsetX + 5 * x8, offsetY + 8 * y8);
					if (tileObj.down == 1) {
						context.curveTo(offsetX + 6 * x8, offsetY + 10 * y8, offsetX + 4 * x8, offsetY + 10 * y8);
						context.curveTo(offsetX + 2 * x8, offsetY + 10 * y8, offsetX + 3 * x8, offsetY + 8 * y8);
					} else {
						context.curveTo(offsetX + 6 * x8, offsetY + 6 * y8, offsetX + 4 * x8, offsetY + 6 * y8);
						context.curveTo(offsetX + 2 * x8, offsetY + 6 * y8, offsetX + 3 * x8, offsetY + 8 * y8);
					}
				}
				context.lineTo(offsetX, offsetY + 8 * y8);
				if (i != 0) {
					context.lineTo(offsetX, offsetY + 5 * y8);
					if (tileObj.left == 1) {
						context.curveTo(offsetX - 2 * x8, offsetY + 6 * y8, offsetX - 2 * x8, offsetY + 4 * y8);
						context.curveTo(offsetX - 2 * x8, offsetY + 2 * y8, offsetX, offsetY + 3 * y8);
					} else {
						context.curveTo(offsetX + 2 * x8, offsetY + 6 * y8, offsetX + 2 * x8, offsetY + 4 * y8);
						context.curveTo(offsetX + 2 * x8, offsetY + 2 * y8, offsetX, offsetY + 3 * y8);
					}
				}
				context.lineTo(offsetX, offsetY);
				s.addTo(con);

				var fill = new createjs.Graphics.Fill("red");

				var hint = new Shape();
				hint.mouseChildren = false;
				hint.mouseEnabled = false;
				s.hint = hint;
				hint.graphics = context.clone(true);
				hint.pos(puzzleX,puzzleY);
				hint.graphics._fill = fill;
				hint.graphics._fill.style = null;

				hint.addTo(con,0);
				s.animate({obj:{x:rand(-offsetX,frame.width-offsetX-pieceWidth),y:rand(-offsetY,frame.height-offsetY-pieceHeight)}, time:700});

			}
		}
		con.addTo(stage);
		stage.update();
	});
	stage.update();
});

document.onreadystatechange=function(){
	document.getElementById('settings').style.visibility = "hidden";
	document.getElementById(__level[level]).checked = true;
	document.getElementById(__imgopt[selected]).style.borderColor = "red";
	
	document.getElementById('closebutton').addEventListener("click", function(){
		document.getElementById('settings').style.visibility = "hidden";
	});
	document.getElementById('option').addEventListener("click", function(){
		document.getElementById('settings').style.visibility = "visible";
	});
	document.getElementById('btok').addEventListener("click", function(){
		var opt = document.querySelectorAll('input[type=radio]');
		for(i=0; i<opt.length; i++)
			if(opt[i].checked){
				level = i;
				localStorage.setItem("__puzzle_level", level);
				break;
			}
		window.location.replace(window.location.pathname + window.location.search + window.location.hash);
	});
	var imgs = document.querySelectorAll("img.thumb");
	for(j=0; j<imgs.length; j++){
		imgs[j].addEventListener('click', function(){
			for(k=0; k<imgs.length; k++)
				imgs[k].style.borderColor = "black";
			this.style.borderColor = "red";
			this.scrollIntoView(false);
			localStorage.setItem("__puzzle_brg", this.id);
		});
	}
	dragElement(document.getElementById(("settings")));
	document.getElementById('view').addEventListener('wheel', function(e){
		this.scrollLeft+=e.deltaY;
	});
}

function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById("header")) {
    document.getElementById("header").onmousedown = dragMouseDown;
  } else {
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    document.onmouseup = null;
    document.onmousemove = null;
  }
}