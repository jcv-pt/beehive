var flowers = {
	
	init: function (maxX,maxY, scene) {
        
		var self = this;

		self.flowersX = new Array();
		self.flowersY = new Array();

		self.maxX = maxX;
		self.maxY = maxY;

		self.scene = scene;

		self.noFlowers = self.getRandom(5,10);

		for (var i = 0; i < self.noFlowers; i++) {

			//Add to array

			self.addFlower();

		}
		
				

	},


	createObject: function( objFile, objName ) {
	
	    var loader = new THREE.OBJLoader();
	    var container = new THREE.Object3D();
	    loader.load( objFile, function ( object ) {
		object.name = objName;
		object.scale.set(9, 9, 9);
		container.add( object );
	    })

	    return container;

	},


	addFlower: function(){

		var self = this;

		var cubeGeometry = new THREE.CubeGeometry( 70, 85, 170 );

		material = new THREE.MeshBasicMaterial({
		    color: 0x00cc00,
		    wireframe: true
		});

		var obj = new THREE.Mesh(cubeGeometry, material);

		//Get & save positions

		var validCoords = false;
		
		do {
	
			validCoords = true;

			//Generate x

			var newX = self.getRandom((self.maxX/2)*-1,(self.maxX/2));
			var newY = self.getRandom((self.maxY/2)*-1,(self.maxY/2));

			var i =0;

			self.flowersX.forEach(function(){

				//Calculate object area

				var minX = self.flowersX[i]-(45);
				var maxX = self.flowersX[i]+(45);

				var minY = self.flowersY[i]-(85);
				var maxY = self.flowersY[i]+(85);

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

					    

		}
		while (validCoords == false);

		self.flowersX.push(newX);
		self.flowersY.push(newY);

		obj.position.set(newX, 45, newY);

		//Add to scene

		self.scene.add(obj);

		//Add labels


		var textShapes = THREE.FontUtils.generateShapes("Flower Cluster #"+self.flowersX.length,  { size: 12});

		var text = new THREE.ShapeGeometry( textShapes );
		var label = new THREE.Mesh( text, new THREE.MeshBasicMaterial( { color: 0xffffff } ) ) ;

		label.position.set(newX,100, newY);

		self.scene.add(label);

	},

	isHittingObject: function(x,y){

		var self = this;

		//Get & save positions

		var isHitting = false;

		var newX = x;
		var newY = y;

		//Generate x

		var i =0;

		self.flowersX.forEach(function(){

			//Calculate object area

			var minX = self.flowersX[i]-(55);
			var maxX = self.flowersX[i]+(55);

			var minY = self.flowersY[i]-(95);
			var maxY = self.flowersY[i]+(95);

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
