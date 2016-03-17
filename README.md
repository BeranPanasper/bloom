# Bloom

Bloom is an experimental HTML5 2D/3D game engine that follows the ECS pattern (Entity component system). The 3D part relies for now on THREE.js.

### Hello World example

In this example, we create a component object and a game object. The component object will log the current time in the HTML page.  

```js
// First we need to require the core package
// that contains the main bloom classes.
var core = bloom.require('core');

// We create our component with a specific name
function MyLogComponent() {
    // Call Component super constructor
    core.Component.call(this);
};

// Make MyLogComponent inherits from core Component class
bloom.inherits(MyLogComponent, core.Component);

// And create an update function. This function will 
// be called at each game tick. 
MyLogComponent.prototype.update = function(time, delta) {
    // Here we just set the HTML context with an hello world message
    this.getLayer().getElement().innerText = 'Hello world! Time is ' + time;
};

// Now let's create our game
function Game() {
    // Call super constructor
    core.Game.call(this);    
};

// Make our game inherits from bloom Game class
bloom.inherits(Game, core.Game);

// When the game start we create our game context:
// a scene, a layer, an actor and our component.
Game.prototype.start = function() {
    // We create a scene
    var scene = new core.Scene();
    // An HTML layer 
    var layer = new core.LayerHTML();
    // An actor
    var actor = new core.Actor();
    // And we instanciate our component
    var component = new MyLogComponent();
    
    // now we just need to register the layer into the scene
    scene.add(layer);
    // the actor into the layer
    layer.add(actor);
    // and the component in the actor
    actor.add(component);
};

// And we finally instanciate our Game class
new Game();

// And voila!

```


### Main classes

#### Game

The Game class contains a list of scenes. One scene only can be rendered at a time. We can navigate between scene using the game `goto` function.

#### Scene

The Scene contains a list of layers. All the layers are rendered in the same time.

#### Layer

A Layer is an object that contains an HTML element that will be attached to the page. There are 3 types of layers: 2D, 3D, HTML. The Layer is responsible to update the actors and the components.

#### Actor

An actor is a container with an identifier and a state. It contains the components. The actor should only be responsible of refreshing its state, the components being responsible to apply this state.

### Component

A component is responsible to apply the state of the actor. Components can be sounds, 2D or 3D objects on the screen, HTML templates, and many other things. For example, a MeshComponent will be used by a 3D layer and will be automatically added to the 3D scene. If the state provides a 3D vector position, it will be applied on the MeshComponent. Another example, a SpriteComponent will be used by a 2D layer and will be automatically drawn on the 2D canvas. At last, an HTMLComponent will be used by an HTML layer and will be automatically added to the dom.








