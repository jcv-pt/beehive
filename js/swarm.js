var swarm = {
	
	init: function (maxX,maxY,maxZ, scene) {
        
		var self = this;

		self.swarm = new Array();

		self.swarmMesh = new Array();
		self.swarmLabelsMesh = new Array();

		self.swarmSize = self.getRandom(5,15);

		for (var i = 0; i < self.swarmSize; i++) {
			
			self.swarm.push(new Bee('Bee'+i));

			//Add to array

			self.swarm[i].init();

			self.swarmMesh.push(self.swarm[i].getBeeMesh());
			
			scene.add(self.swarmMesh[i]);

			self.swarmLabelsMesh.push(self.swarm[i].getBeeLabel());

			scene.add(self.swarmLabelsMesh[i]);

			//Set boundaries

			self.swarm[i].setBoundaries(maxX,maxY,maxZ);

		}
		
				

	},

	animate: function(){

		var self = this;

		var outHtml = "";

		for (var i = 0; i < self.swarmSize; i++) {


		    self.swarm[i].animate();

			outHtml +=  self.swarm[i].getStatus();

		}

		document.getElementById("simstat").innerHTML = outHtml;


	},

	getRandom: function(rmin, rmax){

		return Math.floor(Math.random() * (rmax - rmin + 1)) + rmin;

	}

}
