import * as THREE from '../../libs/three/three.module';
import { GLTFLoader } from '../../libs/three/jsm/GLTFLoader';
import { RGBELoader } from '../../libs/three/jsm/RGBELoader';
import { ARButton } from '../../libs/ARButton.js';
import { LoadingBar } from '../../libs/LoadingBar.js';
import { ControllerGestures } from '../../libs/ControllerGestures.js';


class ARApp{
	constructor(){
		const container = document.createElement( 'div' );
		document.body.appendChild( container );
        
        this.loadingBar = new LoadingBar();
        this.loadingBar.visible = false;

		// this.assetsPath = '../../assets/ar-shop/';
        
		this.camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 20 );
		this.camera.position.set( 0, 1.6, 0 );
        
		this.scene = new THREE.Scene();

		const ambient = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
        ambient.position.set( 0.5, 1, 0.25 );
		this.scene.add(ambient);
			
		this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true } );
		this.renderer.setPixelRatio( window.devicePixelRatio );
		this.renderer.setSize( window.innerWidth, window.innerHeight );
        this.renderer.outputEncoding = THREE.sRGBEncoding;
		container.appendChild( this.renderer.domElement );
        this.setEnvironment();
        
        this.reticle = new THREE.Mesh(
            new THREE.RingBufferGeometry( 0.15, 0.2, 32 ).rotateX( - Math.PI / 2 ),
            new THREE.MeshBasicMaterial()
        );
        
        this.reticle.matrixAutoUpdate = false;
        this.reticle.visible = false;
        this.scene.add( this.reticle );
        
        this.setupXR();
		
		window.addEventListener('resize', this.resize.bind(this) );
        
	}
    
    setupXR(){
        this.renderer.xr.enabled = true;
        
        if ( 'xr' in navigator ) {

			navigator.xr.isSessionSupported( 'immersive-ar' ).then( ( supported ) => {

                if (supported){
                    const collection = document.getElementsByClassName("ar-button");
                    [...collection].forEach( el => {
                        el.style.display = 'block';
                    });
                }
			} );
            
		} 
        
        const self = this;

        this.hitTestSourceRequested = false;
        this.hitTestSource = null;
        
        // function onSelect() {
        //     if (self.chair===undefined) return;
            
        //     if (self.reticle.visible){
        //         self.chair.position.setFromMatrixPosition( self.reticle.matrix );
        //         self.chair.visible = true;
        //     }
        // }

        // function onRotate() {
        //     if(self.chair.visible) {

        //     }
        // }

        // this.controller = this.renderer.xr.getController( 0 );
        // console.log(this.controller);
        // console.log(this.renderer.xr.getController(1))
        // this.controller.addEventListener( 'select', onSelect );
    
        // this.controller.addEventListener('rotate', onRotate())

        // this.scene.add( this.controller );
        
        this.gestures = new ControllerGestures( this.renderer );
        console.log(this.gestures)
        this.gestures.addEventListener( 'tap', (ev)=>{
            console.log( 'tap' ); 
            console.log(ev)
            // self.ui.updateElement('info', 'tap' );
            if (!self.chair.visible){
                self.chair.visible = true;
                // self.chair.position.set( 0, -0.3, -0.5 ).add( ev.position );
                self.chair.position.setFromMatrixPosition( self.reticle.matrix );
                console.log(self.chair.position)
                self.scene.add( self.chair); 
            }
            if(self.chair.visible) {
                self.chair.position.setFromMatrixPosition( self.reticle.matrix );
                self.chair.visible = true;
            }
        });

        this.gestures.addEventListener( 'rotate', (ev)=>{
            console.log("rotate");
                 console.log( ev ); 
            if (ev.initialise !== undefined){
                self.startQuaternion = self.chair.quaternion.clone();
            }else{
                self.chair.quaternion.copy( self.startQuaternion );
                self.chair.rotateY( ev.theta );
            }
        });

        this.gestures.addEventListener( 'pan', (ev)=>{
            console.log("zoom in")
            console.log( ev );
            if (ev.initialise !== undefined){
                self.startPosition = self.chair.position.clone();
            }else{
                const pos = self.startPosition.clone().add( ev.delta.multiplyScalar(3) );
                self.chair.position.copy( pos );
                // self.ui.updateElement('info', `pan x:${ev.delta.x.toFixed(3)}, y:${ev.delta.y.toFixed(3)}, x:${ev.delta.z.toFixed(3)}` );
            } 
        });
        this.gestures.addEventListener( 'swipe', (ev)=>{
            console.log("swipe")
            console.log( ev );   
            // self.ui.updateElement('info', `swipe ${ev.direction}` );
            if (self.chair.visible){
                self.chair.visible = false;
                self.scene.remove( self.chair ); 
            }
        });
        this.gestures.addEventListener( 'pinch', (ev)=>{
            console.log("zoom out")
            console.log( ev );  
            if (ev.initialise !== undefined){
                self.startScale = self.chair.scale.clone();
            }else{
                const scale = self.startScale.clone().multiplyScalar(ev.scale);
                self.chair.scale.copy( scale );
                // self.ui.updateElement('info', `pinch delta:${ev.delta.toFixed(3)} scale:${ev.scale.toFixed(2)}` );
            }
        });

        this.renderer.setAnimationLoop( this.render.bind(this) )
    }
	
    resize(){
        this.camera.aspect = window.innerWidth / window.innerHeight;
    	this.camera.updateProjectionMatrix();
    	this.renderer.setSize( window.innerWidth, window.innerHeight ); 
    }
    
    setEnvironment(){
        const loader = new RGBELoader().setDataType( THREE.FloatType );
        const pmremGenerator = new THREE.PMREMGenerator( this.renderer );
        pmremGenerator.compileEquirectangularShader();
        
        const self = this;
        
        loader.load( './venice_sunset_1k.hdr', ( texture ) => {
          const envMap = pmremGenerator.fromEquirectangular( texture ).texture;
          pmremGenerator.dispose();

          self.scene.environment = envMap;

        }, undefined, (err)=>{
            console.log(err)
            console.error( 'An error occurred setting the environment');
        } );
    }
    
	showChair(link){
        console.log(link)
        this.initAR();
        
		const loader = new GLTFLoader()
        const self = this;
        
        this.loadingBar.visible = true;
		
		// Load a glTF resource
		loader.load(
			// resource URL
			link,
			// called when the resource is loaded
			function ( gltf ) {
                console.log(gltf)

				self.scene.add( gltf.scene );
                self.chair = gltf.scene;
        
                self.chair.visible = false; 
                
                self.loadingBar.visible = false;

                // const scale = 0.5;
				// self.chair.scale.set(scale, scale, scale); 
                
                // self.renderer.setAnimationLoop( self.render.bind(self) );
			},
			// called while loading is progressing
			function ( xhr ) {

				self.loadingBar.progress = (xhr.loaded / xhr.total);
				
			},
			// called when loading has errors
			function ( error ) {
                console.log(error)
				console.log( 'An error happened' );

			}
		);
	}			
    
    initAR(){
        let currentSession = null;
        const self = this;
        
        const sessionInit = { requiredFeatures: [ 'hit-test' ] };
        
        
        function onSessionStarted( session ) {

            session.addEventListener( 'end', onSessionEnded );

            self.renderer.xr.setReferenceSpaceType( 'local' );
            self.renderer.xr.setSession( session );
       
            currentSession = session;
            
        }

        function onSessionEnded( ) {
            console.log(onSessionEnded)

            currentSession.removeEventListener( 'end', onSessionEnded );

            currentSession = null;
            
            if (self.chair !== null){
                self.scene.remove( self.chair );
                self.chair = null;
            }
            
            self.renderer.setAnimationLoop( null );

        }

        if ( currentSession === null ) {

            navigator.xr.requestSession( 'immersive-ar', sessionInit ).then( onSessionStarted );

        } else {

            currentSession.end();

        }
    }
    
    requestHitTestSource(){
        const self = this;
        
        const session = this.renderer.xr.getSession();

        session.requestReferenceSpace( 'viewer' ).then( function ( referenceSpace ) {
            
            session.requestHitTestSource( { space: referenceSpace } ).then( function ( source ) {

                self.hitTestSource = source;

            } );

        } );

        session.addEventListener( 'end', function () {

            self.hitTestSourceRequested = false;
            self.hitTestSource = null;
            self.referenceSpace = null;

        } );

        this.hitTestSourceRequested = true;

    }
    
    getHitTestResults( frame ){
        const hitTestResults = frame.getHitTestResults( this.hitTestSource );

        if ( hitTestResults.length ) {
            
            const referenceSpace = this.renderer.xr.getReferenceSpace();
            const hit = hitTestResults[ 0 ];
            const pose = hit.getPose( referenceSpace );

            this.reticle.visible = true;
            this.reticle.matrix.fromArray( pose.transform.matrix );

        } else {

            this.reticle.visible = false;

        }

    }
    
	render( timestamp, frame ) {

        if ( frame ) {
            if ( this.hitTestSourceRequested === false ) this.requestHitTestSource( )

            if ( this.hitTestSource ) this.getHitTestResults( frame );
        }
        if ( this.renderer.xr.isPresenting ){
            // console.log("gestures updating")
            this.gestures.update();
        }
        this.renderer.render( this.scene, this.camera );

    }
}

export { ARApp };