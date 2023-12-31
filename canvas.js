
function resizeCanvas() {
    canvas.width = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
    canvas.height = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
}
let center = {
    x : 0,
    y : 0,
}
let materials = {
    coins : 0,
    wood : 0, 
}
let mouse = {
    x : 0,
    y : 0,
}

class Player {
    constructor(px, py) {
        this.position = {
            x:px,
            y:py,
        }
        this.dimensions ={
            width : 50,
            height : 50,
        }
        this.direction = "left";
        this.mode = "none";
        this.speed = 3;
        this.tempWall = {
            orientation : 0, 
            wall : new Wall(0,0,0,0,true,true),
        };
    }
    draw () {
        c.fillStyle = 'red';
        c.fillRect( canvas.width/2 - this.dimensions.width/2, canvas.height/2 - this.dimensions.height/2, this.dimensions.width, this.dimensions.height);
    }
    actions(walls) {
        this.move (walls);
        this.makeWalls(walls);
    }
    makeWalls (walls)
    {
        if (keys.get("1")==true){
            if (this.mode!="wall")
                this.mode = "wall";
            else
                this.mode = "none";
            keys.set("1",false);
            keys.set('mouse',false);
        }
        
        if (this.mode == "wall")
        {
            if (keys.get("r")==true)
            {
                keys.set("r",false);
                this.tempWall.orientation = (this.tempWall.orientation+1)%2;
            }

            if (this.tempWall.orientation == 0){
                this.tempWall.wall.position.x1 = Math.round((mouse.x+center.x-canvas.width/2-100/2)/100)*100;
                this.tempWall.wall.position.x2 = Math.round((mouse.x+center.x-canvas.width/2-100/2)/100)*100+100;
                this.tempWall.wall.position.y1 = Math.round((mouse.y+center.y-canvas.height/2)/100)*100;
                this.tempWall.wall.position.y2 = Math.round((mouse.y+center.y-canvas.height/2)/100)*100;
            }
            if (this.tempWall.orientation == 1){
                this.tempWall.wall.position.x1 = Math.round((mouse.x+center.x-canvas.width/2)/100)*100;
                this.tempWall.wall.position.x2 = Math.round((mouse.x+center.x-canvas.width/2)/100)*100;
                this.tempWall.wall.position.y1 = Math.round((mouse.y+center.y-canvas.height/2-100/2)/100)*100;
                this.tempWall.wall.position.y2 = Math.round((mouse.y+center.y-canvas.height/2-100/2)/100)*100+100;
            }


            if (keys.get("mouse")==true){
                this.tempWall.wall.makeID();
                if (this.tempWall.wall.touchingPlayer(this)==false&&addWall(walls,this.tempWall.wall))
                {
                    this.tempWall.wall = new Wall();
                }
            }

            c.globalAlpha = .25;
            this.tempWall.wall.draw();
            c.globalAlpha = 1;
            
        }    
        
    }
    move(walls)
    {
        //face directions
        if (Math.abs(mouse.x-canvas.width/2)/canvas.width > Math.abs(mouse.y-canvas.height/2)/ canvas.height)
            if (mouse.x-canvas.width/2 > 0)
                this.direction = "right";
            else 
                this.direction = "left";
        else
            if (mouse.y-canvas.height/2 > 0)
                this.direction = "down";
            else
                this.direction = "up";
        //move
        if (keys.get("d")==true && keys.get("a")==false)//move right
            this.position.x+=this.speed;
        if (keys.get("a")==true && keys.get("d")==false)//move left
            this.position.x-=this.speed;
        wallsX.forEach( a => a.collisionX(this));

        if (keys.get("w")==true && keys.get("s")==false)//move up
            this.position.y-=this.speed;
        if (keys.get("s")==true && keys.get("w")==false)//move down
            this.position.y+=this.speed;
        wallsY.forEach( a => a.collisionY(this)); 

        center.x = this.position.x + this.dimensions.width/2;
        center.y = this.position.y + this.dimensions.height/2;
    }
}

class Wall{
    constructor(px,py, px2, py2, see, touch) {
        let x = px;
        let y = py;
        this.see= see;
        this.touch=touch;
        this.position = {
            x1:x,
            y1:y,
            x2:px2,
            y2:py2,
        }
        this.thickness = 10;
        this.health=50;
        
    }
    makeID()
    {       
         this.id = parseInt(""+0+this.position.x1+this.position.y1+this.position.x2+this.position.y2);
    }
    draw () {
        if (!(this.see==false))
        {
            c.fillStyle = 'red';
            c.fillRect(this.position.x1 - this.thickness/2 - center.x + canvas.width/2, this.position.y1 - this.thickness/2 - center.y + canvas.height/2, this.position.x2 - this.position.x1 + this.thickness, this.position.y2 - this.position.y1 + this.thickness);
        }
    }
    collisionX(player){
        if (!(this.touch==false))
        if (player.position.y+player.dimensions.height>this.position.y1 - this.thickness/2  && player.position.y<this.position.y2 + this.thickness/2)
        {
            if (player.position.x + player.dimensions.width > this.position.x1 - this.thickness/2 && player.position.x + player.dimensions.width < this.position.x1 + this.thickness/2) //left
            {
                player.position.x = this.position.x1 - this.thickness/2 - player.dimensions.height;
            }
            if (player.position.x > this.position.x1 - this.thickness/2 && player.position.x < this.position.x2 + this.thickness/2) //right
            {
                player.position.x = this.position.x2 + this.thickness/2;
            }
        }
    }
    collisionY(player){
        if (!(this.touch==false))
        if (player.position.x+player.dimensions.width>this.position.x1 - this.thickness/2  && player.position.x<this.position.x2 + this.thickness/2)
        {
            if (player.position.y + player.dimensions.height > this.position.y1 - this.thickness/2 && player.position.y + player.dimensions.height < this.position.y1 + this.thickness/2) //top
            {
                player.position.y = this.position.y1 - this.thickness/2 - player.dimensions.height;
            }
            if (player.position.y > this.position.y1 - this.thickness/2 && player.position.y < this.position.y2 + this.thickness/2) //bottom
            {
                player.position.y = this.position.y2 + this.thickness/2;
            }
        }
    }
    touchingPlayer(player)
    {
        if (player.position.x+player.dimensions.width>this.position.x1 - this.thickness/2  && player.position.x<this.position.x2 + this.thickness/2)
        {
            if (player.position.y + player.dimensions.height > this.position.y1 - this.thickness/2 && player.position.y + player.dimensions.height < this.position.y1 + this.thickness/2) //top
            {
                return true;
            }
            if (player.position.y > this.position.y1 - this.thickness/2 && player.position.y < this.position.y2 + this.thickness/2) //bottom
            {
                return true;
            }
        }
        if (player.position.y+player.dimensions.height>this.position.y1 - this.thickness/2  && player.position.y<this.position.y2 + this.thickness/2)
        {
            if (player.position.x + player.dimensions.width > this.position.x1 - this.thickness/2 && player.position.x + player.dimensions.width < this.position.x1 + this.thickness/2) //left
            {
                return true;
            }
            if (player.position.x + player.dimensions.width> this.position.x1 - this.thickness/2 && player.position.x < this.position.x2 + this.thickness/2) //right
            {
                return true;
            }
        }
        return false;
    }
    
}
class Obsticle{
    constructor(px,py,w,h,health)
    {
        this.position = {
            x:px,
            y:py,
        }
        this.dimensions = {
            width:w,
            height:h
        }
        this.health = health;
    }
    draw (){
        c.fillStyle = 'green';
        c.strokeRect(this.position.x - center.x + canvas.width/2, this.position.y - center.y + canvas.height/2, this.dimensions.width, this.dimensions.height);
    }
    makeWalls(walls)
    {
        let temp = new Wall(this.position.x, this.position.y, this.position.x + this.dimensions.width, this.position.y,false, true);
        temp.makeID();
        addWall(walls,temp);
        temp = new Wall(this.position.x, this.position.y, this.position.x , this.position.y+ this.dimensions.height,false, true);
        temp.makeID();
        addWall(walls,temp);
        temp = new Wall(this.position.x, this.position.y+ this.dimensions.height, this.position.x + this.dimensions.width, this.position.y+ this.dimensions.height,false, true);
        temp.makeID();
        addWall(walls,temp);
        temp = new Wall(this.position.x + this.dimensions.width, this.position.y, this.position.x + this.dimensions.width , this.position.y+ this.dimensions.height,false, true);
        temp.makeID();
        addWall(walls,temp);
        for( let x= Math.floor(this.position.x/100)*100; x < this.position.x+this.dimensions.width; x+=100)
        {
            for ( let y = Math.floor(this.position.y/100)*100; y < this.position.y+this.dimensions.height; y+=100)
            {
                if (y >  this.position.y && y < this.position.y+this.dimensions.height)
                {
                    temp =  new Wall(x,y,x+100,y,false,false);
                    temp.makeID();
                    addWall(walls,temp);
                }
                if (x > this.position.x && this.position.x+this.dimensions.width)
                {
                    temp =  new Wall(x,y,x,y+100,false,false);
                    temp.makeID();
                    addWall(walls,temp);
                }
            }
        }
    }
}
class Tree extends Obsticle{
    constructor(px,py,w,h)
    {
        super(px,py,w,h,1000);
    }
    draw ()
    {
        c.fillStyle = 'green';
        c.fillRect(this.position.x - center.x + canvas.width/2, this.position.y - center.y + canvas.height/2, this.dimensions.width, this.dimensions.height);
    }
    
}
function addWall(walls, wall){
    let start = 0, end = walls.length-1;
    while (start <= end){
        let mid =Math.floor((start+end)/2);
        if (walls[mid].id == wall.id) return false;
        else if (walls[mid].id < wall.id)
            start = mid+1;
        else
            end = mid-1;

    }
    

    walls.push(wall);
    wallsX.push(wall);
    wallsY.push(wall);
    wallsX.sort(compareX);
    wallsY.sort(compareY);
    walls.sort(compareID);
    return true;
}

function compareID (a,b)
{
    return a.id - b.id;
}
function compareX (a,b)
{
    return a.position.x - b.position.x;
}
function compareY (a,b)
{
    return a.position.y - b.position.y;
}

function up (event)
{
    keys.set(event.key.toLowerCase(),false);
}
function down (event)
{
    keys.set(event.key.toLowerCase(),true);
}
function mouseup(event)
{
    keys.set("mouse",false);
}
function mousedown(event)
{
    keys.set("mouse",true);
}
function follow (event)
{
    mouse.x = event.offsetX;
    mouse.y = event.offsetY;
}

function animate()
{
    
    const start = performance.now();
    window.requestAnimationFrame(animate)
    c.clearRect(0,0,canvas.width,canvas.height)
    
    p.draw();
    walls.forEach( a => a.draw());
    lifeTree.draw();

    p.actions(walls);

    const end = performance.now();
    //console.log(`Execution time: ${end - start} ms`);

}
function gameSetUp()
{
    addEventListener("mouseup",mouseup);
    addEventListener("mousedown",mousedown);
    addEventListener("mousemove",follow);
    addEventListener("keyup",up);
    addEventListener("keydown",down);
    window.onload = window.onresize = resizeCanvas;
    animate();
}



const keys = new Map();
keys.set('a',false);
keys.set('d',false);
keys.set('s',false);
keys.set('w',false);
keys.set('t',false);
keys.set('r',false);
keys.set('mouse',false);
var canvas = document.querySelector('canvas');
var c =canvas.getContext("2d");

resizeCanvas();

const p = new Player(10000,10000);
const walls = [];
const wallsX = [];
const wallsY = [];
const lifeTree = new Tree (10050,10050,200,200);
lifeTree.makeWalls(walls);

gameSetUp();


