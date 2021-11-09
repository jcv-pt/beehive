var obstacles = {
	
	init: function (width, height, scene) {
        
		var self = this;

		self.obstaclesX = new Array();
		self.obstaclesY = new Array();

		self.maxX = width;
		self.maxY = height;

		self.scene = scene;

		self.noObjects = self.getRandom(5,15);
		//self.noObjects = 1

		for (var i = 0; i < self.noObjects; i++) {

			//Add to array

			self.addObstacle();

		}
		
				

	},

	addObstacle: function(){

		var self = this;

		var cubeGeometry = new THREE.CubeGeometry( 85, 85, 85 );
		var crateTexture = new THREE.ImageUtils.loadTexture( 'images/crate.gif' );
		var crateMaterial = new THREE.MeshBasicMaterial( { map: crateTexture } );
		var obj = new THREE.Mesh( cubeGeometry.clone(), crateMaterial );

		var hiveLocation = hive.getCoordinates();

		//Get & save positions

		var validCoords = false;
		
		do {
	
			validCoords = true;

			//Generate x

			var newX = self.getRandom((self.maxX/2)*-1,(self.maxX/2));
			var newY = self.getRandom((self.maxY/2)*-1,(self.maxY/2));

			var i =0;

			self.obstaclesX.forEach(function(){

				//Calculate object area

				var minX = self.obstaclesX[i]-(45);
				var maxX = self.obstaclesX[i]+(45);

				var minY = self.obstaclesY[i]-(45);
				var maxY = self.obstaclesY[i]+(45);

				//console.log(minX+" - "+maxX+" - "+minY+" - "+maxY);

				//Check if object is within this one

				if((newX>= minX && newX <= maxX) && (newY>= minY && newY <= maxY))
					validCoords = false;

				//Check if out of the map

				if(newX>= self.maxX/2 && newX <= (self.maxX/2)*-1)
					validCoords = false;

				if(newY>= self.maxY/2 && newY <= (self.maxY/2)*-1)
					validCoords = false;

				if(hive.isHittingObject(newX,newY))
					validCoords = false;

				i++;
	

			});


/*
			self.obstaclesX.forEach(function(index, value) {
			    if(value == newX || (value <= newX && newX <= value+85) || value+85 >= self.maxX/2 || value-85 <= (self.maxX/2)*-1)
				validCoords = false;
			    if(newX == hiveLocation[0] || (newX >= hiveLocation[0] && newX <= hiveLocation[0]+85))
				validCoords = false;

			});


			//Generate y

			var newY = self.getRandom((self.maxY/2)*-1,(self.maxY/2));

			self.obstaclesY.forEach(function(index, value) {
			    if(value == newY || (value <= newY && newY <= value+85) || value+85 >= self.maxY/2 || value-85 <= (self.maxY/2)*-1)
				validCoords = false;
			    if(newY == hiveLocation[1] || (newY >= hiveLocation[1] && newY <= hiveLocation[1]+85))
				validCoords = false;
			});*/

					    

		}
		while (validCoords == false);

		self.obstaclesX.push(newX);
		self.obstaclesY.push(newY);

		obj.position.set(newX, 43, newY);

		//Add to scene

		self.scene.add(obj);
/*
		var textShapes = THREE.FontUtils.generateShapes("["+newX+":"+newY+"]",  { size: 12});

		var text = new THREE.ShapeGeometry( textShapes );
		var label = new THREE.Mesh( text, new THREE.MeshBasicMaterial( { color: 0xffffff } ) ) ;

		label.position.set(newX,100, newY);

		self.scene.add(label);


		var textShapes = THREE.FontUtils.generateShapes("["+(newX-45)+":"+(newY-45)+"]",  { size: 12});

		var text = new THREE.ShapeGeometry( textShapes );
		var label = new THREE.Mesh( text, new THREE.MeshBasicMaterial( { color: 0xffffff } ) ) ;

		label.position.set(newX-45,100, newY-45);

		self.scene.add(label);

		var textShapes = THREE.FontUtils.generateShapes("["+(newX+45)+":"+(newY+45)+"]",  { size: 12});

		var text = new THREE.ShapeGeometry( textShapes );
		var label = new THREE.Mesh( text, new THREE.MeshBasicMaterial( { color: 0xffffff } ) ) ;

		label.position.set(newX+45,100, newY+45);

		self.scene.add(label);*/

	},

	isHittingObject: function(x,y){

		var self = this;

		//Get & save positions

		var isHitting = false;

		var newX = x;
		var newY = y;

		//Generate x

		var i =0;

		self.obstaclesX.forEach(function(){

			//Calculate object area

			var minX = self.obstaclesX[i]-(55);
			var maxX = self.obstaclesX[i]+(55);

			var minY = self.obstaclesY[i]-(55);
			var maxY = self.obstaclesY[i]+(55);

			//Check if object is within this one

			if((newX>= minX && newX <= maxX) && (newY>= minY && newY <= maxY))
				isHitting = true;

			i++;


		});

		return isHitting;
					    
	},

	getRandom: function(rmin, rmax){

		return Math.floor(Math.random() * (rmax - rmin + 1)) + rmin;

	}

}
