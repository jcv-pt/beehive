function Bee(name){

	this.name = name;

	this.posX=0;
	this.posY=50;
	this.posZ=0;

	this.currentDir = "";
	this.currentDirIterations = 0;
	this.nextIterChangeDir = 0;

	this.currentHei = "";
	this.currentHeiIterations = 0;
	this.nextIterChangeHei = 0;

	this.directions = ["north", "south", "west", "east", "northeast", "southeast", "southwest", "northwest"];
	this.heights = ["straight", "up", "down"];

	this.init =  function () {
        
		var self = this;

		var sphereMaterial = new THREE.MeshLambertMaterial(
		{
			//color: "#"+((Math.random()*0xFFFFFF<<0).toString(16))
			color: "#FFFF00"
		});

		var radius = 10, segments = 16, rings = 16;

		self.bee = new THREE.Mesh(new THREE.SphereGeometry(radius, segments, rings),sphereMaterial);

		self.hiveCoords = hive.getCoordinates();

		this.posX=self.hiveCoords[0];
		this.posZ=self.hiveCoords[1];

		var textShapes = THREE.FontUtils.generateShapes(this.name,  { size: 12});

		var text = new THREE.ShapeGeometry( textShapes );
		self.beeLabel = new THREE.Mesh( text, new THREE.MeshBasicMaterial( { color: 0xffffff } ) ) ;

		self.status = "";

		self.changeDirCounter = 0;

		self.wasHittingObj = false;

		//Init dir

		self.changeDirection();
		self.changeHeight();

		//Init polen

		self.havePolen = false;
		


	};

	this.getBeeMesh = function(){

		var self = this;

		return self.bee;
	};

	this.getBeeLabel = function(){

		var self = this;

		return self.beeLabel;
	};

	this.changeDirection  = function(){

		var self = this;

		//Check if current direction is going against object

		if(obstacles.isHittingObject(self.posX,self.posZ))
		{

			if(self.wasHittingObj==true && self.nextIterChangeDir<=self.currentDirIterations)
				return;

			//Change direction then...

			var directions = this.directions;

			if(self.currentDir == "north" || self.currentDir == "northwest" || self.currentDir == "northeast")
				var directions = ["west", "east"];

			if(self.currentDir == "south" || self.currentDir == "southwest" || self.currentDir == "southeast")
				var directions = ["west", "east"];

			if(self.currentDir == "east"  || self.currentDir == "southeast" || self.currentDir == "northeast")
				var directions = ["south", "north"];

			if(self.currentDir == "west" || self.currentDir == "northwest" || self.currentDir == "southwest")
				var directions = ["south", "north"];


			self.currentDir = directions[0,1];

			self.nextIterChangeDir = 1;

			self.wasHittingObj = true;


		}
		else
		{

			
			self.wasHittingObj = false;

			//Check if we have polen, if we do get coordinates from hive and move to direction...

			if(self.havePolen)
			{
				
				hiveDirection = hive.getCompassCoords(self.posX,self.posZ);

				self.currentDir = "";

				if(hiveDirection == "north")
					self.currentDir = "south";

				if(hiveDirection == "south")
					self.currentDir = "north";

				if(hiveDirection == "west")
					self.currentDir = "east";

				if(hiveDirection == "east")
					self.currentDir = "west";

				if(hiveDirection == "northeast")
					self.currentDir = "southwest";

				if(hiveDirection == "southeast")
					self.currentDir = "northwest";

				if(hiveDirection == "southwest")
					self.currentDir = "northeast";

				if(hiveDirection == "northwest")
					self.currentDir = "southwest";


				if(self.currentDir=="")
					self.currentDir = self.directions[self.getRandom(0,self.directions.length-1)];	

	
				self.nextIterChangeDir = self.getRandom(15,100);	

			}
			else
			{

				self.currentDir = self.directions[self.getRandom(0,self.directions.length-1)];
			
				self.nextIterChangeDir = self.getRandom(15,600);

			}

		}

		

		self.currentDirIterations = 0; 

		self.changeDirCounter++;

	};

	this.setBoundaries = function(x,y,z){

		var self = this;

		self.maxPosX=x/2;
		self.maxPosY=self.getRandom(50,90);
		self.maxPosZ=z/2;

		self.minPosX=self.maxPosX*-1;
		self.minPosY=5;
		self.minPosZ=self.maxPosZ*-1;

	}

	this.changeHeight  = function(){

		var self = this;

		if(self.posY >= self.maxPosY)
		{
			//Needs to go straight or down...

			var heights = ["straight", "down"];
			self.currentHei = heights[self.getRandom(0,1)];

			self.posY = self.maxPosY-2;

			this.nextIterChangeHei = self.getRandom(15,100);
			
		}
		else if(self.posY <= self.minPosY)
		{
			//Needs to go straight or up...
			
			var heights = ["up", "straight"];
			self.currentHei = heights[self.getRandom(0,1)];

			self.posY = self.minPosY+2;

			this.nextIterChangeHei = self.getRandom(15,100);
			
		}
		else
		{
			self.currentHei = self.heights[self.getRandom(0,self.heights.length-1)];
			this.nextIterChangeHei = self.getRandom(100,600);

		}

		this.currentHeiIterations = 0;
		

	};

	this.updateLabel = function(){

		var self = this;

		self.beeLabel.position.set(self.posX, self.posY+10, self.posZ);

		self.beeLabel.geometry.needsUpdate = true;


	};


	this.iHavePolen = function(){

		var self = this;


		self.havePolen = true;

		//Update bee color

		self.bee.material.color.setHex(0xcc0000);

		//Change direction acordingly...

		self.changeDirection();

	};

	this.dropPolen = function(){

		var self = this;


		self.havePolen = false;

		//Update hive

		hive.dropPolen();

		//Update bee color

		self.bee.material.color.setHex(0xFFFF00);

	};

	this.animate =  function(){

		var self = this;

		//Check if direction change is required

		if(	(self.nextIterChangeDir<=self.currentDirIterations) ||
			(self.posZ >= self.maxPosZ || self.posZ <= self.minPosZ) || 
			(self.posX >= self.maxPosX || self.posX <= self.minPosX)
		)
			self.changeDirection();

		if(obstacles.isHittingObject(self.posX,self.posZ))
			self.changeDirection();

		//Check if we found polen...

		if(self.havePolen ==  false && flowers.isHittingObject(self.posX,self.posZ))
			self.iHavePolen();

		//Check if we are at the hive

		if(self.havePolen && hive.isHittingObject(self.posX,self.posZ))
			self.dropPolen();

		//Check if height change is required

		if(	self.nextIterChangeHei<=self.currentHeiIterations || 
			(self.posY >= self.maxPosY ) || (self.posY <= 5 ) 
		)
			self.changeHeight();


		//Make the bee move acording to the direction...

		if(self.currentDir == "north" || self.currentDir == "northwest" || self.currentDir == "northeast")
			self.posZ++;

		if(self.currentDir == "south" || self.currentDir == "southwest" || self.currentDir == "southeast")
			self.posZ--;

		if(self.currentDir == "east"  || self.currentDir == "southeast" || self.currentDir == "northeast")
			self.posX++;

		if(self.currentDir == "west" || self.currentDir == "northwest" || self.currentDir == "southwest")
			self.posX--;


		//Make the bee move acording to the height...

		if(self.currentHei == "up")
			self.posY++;

		if(self.currentHei == "down")
			self.posY--;

		//Update position

		self.bee.position.set(self.posX, self.posY, self.posZ);

		//Update label

		self.updateLabel();

		//Update status

		self.status = self.name+" <br> Pos: ["+self.posX+"]["+self.posY+"]["+self.posZ+"] <br> MPos: ["+self.maxPosX+"]["+self.maxPosY+"]["+self.maxPosZ+"]<br> DC["+self.changeDirCounter+"] D["+self.currentDir+"] H["+self.currentHei+"]<br>Hive Dir ["+hive.getCompassCoords(self.posX,self.posZ)+"] Load ["+self.havePolen+"]<hr>"

		//Increment iterators

		self.currentDirIterations++;
		self.nextIterChangeHei++;

	};

	this.getStatus = function(){

		var self = this;

		return self.status;

	}

	this.getRandom = function(rmin, rmax){

		return Math.floor(Math.random() * (rmax - rmin + 1)) + rmin;

	}

}
