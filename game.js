// paper airplane game by Clint Heinrich.
// coding assistance from examples at http://phaser.io/examples

//var game = new Phaser.Game(1300, 650, Phaser.CANVAS, 'gameContainer', { preload: preload, create: create, update: update, render: render });
//old version with static boundaries

var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, 'gameContainer', { preload: preload, create: create, update: update, render: render });

function preload() {

    game.load.image('analog', 'images/fusia.png');
    game.load.image('arrow', 'images/longarrow2.png');
    game.load.image('airplane', 'images/airplane.png');
    game.load.image('trash', 'images/trash.png');
    game.load.image('background','images/debug-grid-1920x1920.png');

}

var arrow;
var airplane;
var catchFlag = false;
var launchVelocity = 0;
var thrown = false;
var hits = 0;

function create() {

    game.physics.startSystem(Phaser.Physics.ARCADE);
    
    this.background = this.game.add.tileSprite(0, 0, 4000, 4000, 'background');
    
    game.world.setBounds(0, 0, 4000, 4000);

    // set global gravity
    game.physics.arcade.gravity.y = 200;
    game.stage.backgroundColor = '#0072bc';
    
    var graphics = game.add.graphics(0,0);
    graphics.beginFill(0x049e0c);
    graphics.drawRect(445, 3750, 10, 250);

    analog = game.add.sprite(450, 3750, 'analog');

    game.physics.enable(analog, Phaser.Physics.ARCADE);

    analog.body.allowGravity = false;
    analog.width = 8;
    analog.rotation = 220;
    analog.alpha = 0;
    analog.anchor.setTo(0.5, 0.0);
    
    arrow = game.add.sprite(400, 3750, 'arrow');

    game.physics.enable(arrow, Phaser.Physics.ARCADE);

    arrow.anchor.setTo(0.1, 0.5);
    arrow.body.moves = false;
    arrow.body.allowGravity = false;
    arrow.alpha = 0;
    
    trash = game.add.sprite(3500, 3632, 'trash');
    game.physics.enable(trash, Phaser.Physics.ARCADE);
    trash.body.moves = false;
    trash.body.allowGravity = false;
    
    airplane = game.add.sprite(100, 3900, 'airplane');
    game.physics.enable(airplane, Phaser.Physics.ARCADE);
    airplane.anchor.setTo(0.5, 0.5);
    airplane.body.collideWorldBounds = true;
    airplane.body.bounce.setTo(0.2, 0.2);
    game.camera.follow(airplane);
    

    
    // Enable input.
    airplane.inputEnabled = true;
    airplane.input.start(0, true);
    airplane.events.onInputDown.add(set);
    airplane.events.onInputUp.add(launch);

}

function set(airplane, pointer) {

    if (thrown == true && airplane.body.blocked.down == true)
    {
        airplane.x = 100;
        airplane.y = 3900;
        airplane.body.velocity.setTo(0, 0);
    } else {
        airplane.body.moves = false;
        airplane.body.velocity.setTo(0, 0);
        airplane.body.allowGravity = false;
        catchFlag = true;
    }

}

function launch() {

    if (thrown == true)
    {
        
        thrown = false;
    }
    
    else
    {
        catchFlag = false;
        thrown = true;

        airplane.body.moves = true;
        arrow.alpha = 0;
        analog.alpha = 0;
        Xvector = (arrow.x - airplane.x) * 3;
        Yvector = (arrow.y - airplane.y) * 3;
        airplane.body.allowGravity = true;  
        airplane.body.velocity.setTo(Xvector, Yvector);
    }
}

function trashCollision () {
    hits++;
    airplane.x = 100;
    airplane.y = 3900;
    airplane.body.velocity.setTo(0, 0);
}

function update() {

    arrow.rotation = game.physics.arcade.angleBetween(arrow, airplane);
    
    this.physics.arcade.overlap(airplane, trash, trashCollision, null, this);
    
    if (catchFlag == true)
    {
        //  Track the airplane sprite to the mouse  
        airplane.x = game.input.activePointer.worldX;   
        airplane.y = game.input.activePointer.worldY;
        
        arrow.alpha = 1;    
        analog.alpha = 0.5;
        analog.rotation = arrow.rotation - 3.14 / 2;
        analog.height = game.physics.arcade.distanceToPointer(arrow);  
        launchVelocity = analog.height;
    };   
    
}

function render() {

    game.debug.text("Drag the airplane and release to launch, click on the plane to reset   Number of hits: " + hits, 32, 32);

    //game.debug.bodyInfo(airplane, 32, 64);

    // game.debug.spriteInfo(airplane, 32, 64);
    // game.debug.text("Launch Velocity: " + parseInt(launchVelocity), 32, 250);

}