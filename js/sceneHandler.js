var sceneHandler = {
	
	init: function () {
        
		var self = this;

		//Init world size

		self.worldSize_width = 1000; //Largura
		self.worldSize_depth = 1000; //Comprimento
		self.worldSize_height = 1000; //Altura
		
		//Init screen vars

		self.screen_width = window.innerWidth;
		self.screen_height = window.innerHeight;

		//Init keyboard vars

		self.keyboard = new KeyboardState();

		//Init camera vars

		self.camera = new THREE.PerspectiveCamera( 45, self.screen_width / self.screen_height, 1, 10000 );
		
		self.camera.position.x = 200;
		self.camera.position.y = 300;
		self.camera.position.z = 300;

		//Init controls vars

		self.controls = new THREE.OrbitControls( self.camera );
		self.controls.damping = 0.2;
		self.controls.addEventListener( 'change', self.render );

		//Init scene vars

		self.scene = new THREE.Scene();

		//Init scenario elements
		
		self.initScenario();

		//Start simulation

		self.animate();


	},

	onWindowResize: function () {

		sceneHandler.camera.left = window.innerWidth / - 2;
		sceneHandler.camera.right = window.innerWidth / 2;
		sceneHandler.camera.top = window.innerHeight / 2;
		sceneHandler.camera.bottom = window.innerHeight / - 2;

		sceneHandler.camera.updateProjectionMatrix();

		sceneHandler.renderer.setSize( window.innerWidth, window.innerHeight );

	},

	initScenario: function () {

		var self = this;

		// FLOOR
		var floorTexture = new THREE.ImageUtils.loadTexture( 'images/floor.jpg' );
		floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
		floorTexture.repeat.set( 5, 5 );
		var floorMaterial = new THREE.MeshBasicMaterial( { map: floorTexture, side: THREE.DoubleSide } );
		var floorGeometry = new THREE.PlaneGeometry(self.worldSize_width, self.worldSize_depth, 10, 10);
		var floor = new THREE.Mesh(floorGeometry, floorMaterial);
		floor.position.y = 0;
		floor.rotation.x = Math.PI / 2;
		self.scene.add(floor);

		// Init hive

		hive.init(self.scene); 

		//Init obstacles

		obstacles.init(self.worldSize_width, self.worldSize_depth, self.scene);

		//Init flowers

		flowers.init(self.worldSize_width, self.worldSize_depth, self.scene);

		//Init swarm
		
		swarm.init(self.worldSize_width, self.worldSize_depth, self.worldSize_height, self.scene);

		//Light

                var ambientLight = new THREE.AmbientLight(0xffffff, 1.0); 
                self.scene.add(ambientLight); 
  
                var directionalLight = new THREE.DirectionalLight(0xffffff, 1.0); 
                directionalLight.position.set(0.0, 0.0, 1.0); 
                self.scene.add(directionalLight); 

		var cameraAndLight = new THREE.Object3D();  // global variable
		var light3 = new THREE.DirectionalLight();
		light3.position.set( 5, 5, 5 );
		cameraAndLight.add( self.camera );  // camera is also global
		cameraAndLight.add( light3 );
		self.scene.add( cameraAndLight );

		// LIGHT
		var light4 = new THREE.PointLight(0xffffff);
		light4.position.set(0,150,100);
		self.scene.add(light4);

		//renderer = new THREE.CanvasRenderer();
		self.renderer = new THREE.WebGLRenderer();
		self.renderer.setSize( window.innerWidth, window.innerHeight );
		self.renderer.setClearColor( 0xccccff );
		self.renderer.setPixelRatio( window.devicePixelRatio );

		document.body.appendChild(self.renderer.domElement);


	},

	update: function(){

		var self = this;

		//self.camera.position.x -= 1.0;

		self.keyboard.update();

		if ( self.keyboard.pressed("D") )
			self.camera.position.x += 1.0;

		if ( self.keyboard.pressed("A") )
			self.camera.position.x -= 1.0;

		if ( self.keyboard.pressed("S") )
			self.camera.position.z -= 1.0;

		if ( self.keyboard.pressed("W") ) 
			self.camera.position.z += 1.0;

		self.camera.lookAt( self.scene.position );
	},

	animate: function() {

		var self = this;

		hive.animate();

		swarm.animate(self.scene);

		requestAnimationFrame(sceneHandler.animate);
		sceneHandler.controls.update();
		sceneHandler.render();


	},

	render: function() {

		var self = this;

		sceneHandler.update();

		sceneHandler.renderer.render( sceneHandler.scene, sceneHandler.camera );

	}

}



