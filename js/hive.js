// Converts from degrees to radians.
Math.radians = function(degrees) {
  return degrees * Math.PI / 180;
};
 
// Converts from radians to degrees.
Math.degrees = function(radians) {
  return radians * 180 / Math.PI;
};

var hive = {
	
	init: function (scene) {
        
		var self = this;

		self.initPosX = 0;
		self.initPosY = 0;

		self.scene = scene;

		var cubeGeometry = new THREE.CubeGeometry( 85, 85, 85 );

		var crateTexture = new THREE.ImageUtils.loadTexture( 'images/hive.gif' );
		var crateMaterial = new THREE.MeshBasicMaterial( { map: crateTexture } );
		self.crate = new THREE.Mesh( cubeGeometry.clone(), crateMaterial );
		self.crate.position.set(self.initPosX, 43, self.initPosY);

		scene.add(self.crate);

		self.initLabel();

	},

	initLabel: function(){

		var self = this;

		self.noPolens = 0;		

		var textShapes = THREE.FontUtils.generateShapes("Hive : Polen Count ["+self.noPolens+"]",  { size: 12});

		var text = new THREE.ShapeGeometry( textShapes );
		self.label = new THREE.Mesh( text, new THREE.MeshBasicMaterial( { color: 0xffffff } ) ) ;

		self.label.position.set(self.initPosX-85, 100, self.initPosY);

		self.scene.add(self.label);

	},

	dropPolen: function(){

		var self = this;

		self.noPolens++;

		self.scene.remove(self.label);

		var textShapes = THREE.FontUtils.generateShapes("Hive : Polen Count ["+self.noPolens+"]",  { size: 12});

		var text = new THREE.ShapeGeometry( textShapes );
		self.label = new THREE.Mesh( text, new THREE.MeshBasicMaterial( { color: 0xffffff } ) ) ;

		self.label.position.set(self.initPosX-85, 100, self.initPosY);

		self.scene.add(self.label);

	},

	animate: function(){

		var self = this;

	},

	getCoordinates: function(){

		var self = this;

		return [self.initPosX, self.initPosY];

	},

	getCompassCoords: function(x,y){

		var self = this;

		var x = Math.atan2(x, y);

		var angle = (x > 0 ? x : (2*Math.PI + x)) * 360 / (2*Math.PI)

		var directions = 8;
		
		var degree = 360 / directions;
		angle = angle + degree/2;
		
		if (angle >= 0 * degree && angle < 1 * degree)
		    return "north";
		if (angle >= 1 * degree && angle < 2 * degree)
		    return "northeast";
		if (angle >= 2 * degree && angle < 3 * degree)
		    return "east";
		if (angle >= 3 * degree && angle < 4 * degree)
		    return "southeast";
		if (angle >= 4 * degree && angle < 5 * degree)
		    return "south";
		if (angle >= 5 * degree && angle < 6 * degree)
		    return "southwest";
		if (angle >= 6 * degree && angle < 7 * degree)
		    return "west";
		if (angle >= 7 * degree && angle < 8 * degree)
		    return "northwest";

		/*var margin = Math.pi/90; // 2 degree tolerance for cardinal directions
		var o = self.initPosX - x;
		var a = self.initPosY - y;
		var angle = Math.atan2(o,a);

		if (angle > -margin && angle < margin)
			return "east";
		else if (angle > Math.pi/2 - margin && angle < Math.pi/2 + margin)
			return "north";
		else if (angle > Math.pi - margin && angle < -Math.pi + margin)
			return "west";
		else if (angle > -Math.pi/2 - margin && angle < -Math.pi/2 + margin)
			return "south";
		
		if (angle > 0 && angle < Math.pi/2) {
			return "northest";
		} else if (angle > Math.pi/2 && angle < Math.pi) {
			return "northwest";
		} else if (angle > -Math.pi/2 && angle < 0) {
			return "southeast";
		} else {
			return "southwest";
		}*/


		
		
	},

	isHittingObject: function(x,y){

		var self = this;

		//Get & save positions

		var isHitting = false;

		var newX = x;
		var newY = y;

		//Calculate object area

		var minX = self.initPosX-(20);
		var maxX = self.initPosX+(20);

		var minY = self.initPosY-(20);
		var maxY = self.initPosY+(20);

		//Check if object is within this one

		if((newX>= minX && newX <= maxX) && (newY>= minY && newY <= maxY))
			isHitting = true;

		return isHitting;
					    
	}


}
