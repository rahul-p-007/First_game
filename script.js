// Load event waits for all assets such as spritesheets and images to be fully loaded before it executes code in it's callback function

//anonymous function = function without name
window.addEventListener("load", function () {
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  // ctx = context(means instance of built in canvas 2D api that holds all drawing methods and porperties we will need to animate our game)
  canvas.width = 800;
  canvas.height = 720;
  let enemies = [];
  let score = 0;
  let gameOver = false;
  // ES6 arrow functions don't bind their own 'this' but they inherit the one from thier parent scope, this is called lexical scoping;
  class InputHnadler {
    constructor() {
      this.keys = [];
      window.addEventListener("keydown", e => {
        if ((e.key === "ArrowDown" ||
            e.key === "ArrowUp" ||
            e.key === "ArrowLeft" ||
            e.key === "ArrowRight") 
            && this.keys.indexOf(e.key) === -1
        ) {
          // this line means if ArrowDown  is presrt  and push down to the array by decreasing the indexNo.(it means how many time we press the arrow down keys it only show ones time)
          this.keys.push(e.key);
        }
        // console.log(e.key, this.keys);
      });

      window.addEventListener("keyup", e => {
        if (
          e.key === "ArrowDown" ||
          e.key === "ArrowUp" ||
          e.key === "ArrowLeft" ||
          e.key === "ArrowRight"){
          this.keys.splice(this.keys.indexOf(e.key), 1);
          // This line means that if the user press the key it store in the array but when  he press the another key it will delete the old key and store the new keys
        }
        // console.log(e.key, this.keys);
      });
    }
  }

  class Player {
    constructor(gameWidth,gameHeight){
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.width = 200;
        this.height = 200;
        this.x = 10;
        this.y = this.gameHeight - this.height;
        this.image = document.getElementById('playerImage');
        this.frameX = 0; // This will use to select the single image from the player image and same as frameY.
        this.frameY = 0;
        this.speed = 0; // This will give the direction of the player for example when the it poistive value it will move in the right direction and so on it have negative value it will move in the left direction.
        this.vy = 0 ; // This is use for upper movement in update function main code is thier.
        this.weight = 1; // This will use to force the player in the screen. 
        this.maxFrame = 8;
        this.fps = 20;
        this.frameTimer = 0;
        this.frmaeInterval = 1000/this.fps;
       
    }   
    draw(context){
        // context.fillStyle = 'white';
        // context.fillRect(this.x,this.y,this.width,this.height);
        // context.strokeStyle = 'white';
        // context.strokeRect(this.x, this.y,this.width,this.height);
        // context.beginPath();
        // context.arc(this.x+this.width/2,this.y + this.height/2,this.width/2,0,Math.PI * 2 );
        // context.stroke();
        // context.strokeStyle = 'blue';
        // context.beginPath();
        // context.arc(this.x,this.y,this.width/2,0,Math.PI * 2 );
        // context.stroke(); 
        context.drawImage(this.image,this.frameX * this.width,this.frameY * this.height,this.width,this.height,this.x,this.y,this.width,this.height);
    }
    update(input,deltaTime,enemies){
        // Collision
        enemies.forEach(Enemy =>{
            const dx = (Enemy.x + Enemy.width/2) -(this.x + this.width/2);
            const dy = (Enemy.y + Enemy.height/2) - (this.y + this.height/2);
            const distance = Math.sqrt(dx * dx + dy * dy);
            if(distance <Enemy.width/2 + this.width/2){
                gameOver = true;
            }
        })

        // Player animation

        if(this.frameTimer > this.frmaeInterval){
            if(this.frameX >= this.maxFrame) this.frameX = 0;
            else this.frameX++;
            this.frameTimer = 0;
        }else{
            this.frameTimer += deltaTime; 
        }
       // This will provide the movement of the player b/c it select the whole frame and display frame by frame so that its look like it running
        
        // Player Controls  

        if(input.keys.indexOf('ArrowRight') > -1){
            this.speed = 5; // From If conditon (this code means that when user press the right key then our player start moving at speed of 5 and for stop we give the else statment (it means that if the user hold the key the player will move and if the user not hold the key the player will stop moving ))
        }else if(input.keys.indexOf('ArrowLeft') > -1){
            this.speed = -5; // This give the  user to move in left direction.
        }
        else if(input.keys.indexOf('ArrowUp') > -1 && this.onGround()){
            this.vy -= 30;
        }
        else{
            this.speed = 0;
        }


        // Horiontal movement
        this.x += this.speed;  // This will update the coordinate of x-axis whenever will call;
        // This code provide the bounder 
        if(this.x < 0 ) this.x = 0; // this will provide left bounder.
        else if(this.x > this.gameWidth - this.width) this.x = this.gameWidth - this.width; // This will provide right bounder.
        
        
        // Veritcal movement 
        this.y += this.vy;
        if(!this.onGround()){
            this.vy += this.weight; // From if (when the user press UpArrow key it will move to upward and when the user release the Up key the player move to down (for this we have else code))
            this.frameY =  1 ;
            this.maxFrame = 5;
        } else{
            this.vy =0;
            this.maxFrame = 8;
            this.frameY = 0;
        }
        // This give the bounder to vertical 
        if(this.y > this.gameHeight -this.height) this.y = this.gameHeight - this.height; 
    } 
    
    /*
    --------------------
    So The Upward movement work like when we press the UpArrow the vy is defined to 0 it imdately get the value of -30 and then the condition given on vertical movement(IF condtion ) it become true the the wieght as we  difine it to 1 it will added over and over make the vy to 0. And when hit the ground the Jump is comepleted and again vy become 0 .    
    From this the player move to down. 

    --------------------
    */

    onGround(){
        return this.y >= this.gameHeight - this.height;
    }

  }

  class Background {
    constructor(gameWidth,gameHeight){
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.image = document.getElementById('backgroundImage');
        this.x = 0;
        this.y = 0;
        this.width = 2400;
        this.height = 720;
        this.speed = 7;
    }
    draw(context){
        context.drawImage(this.image,this.x,this.y,this.width,this.height); // This will provide the background 
        context.drawImage(this.image,this.x + this.width,this.y,this.width - this.speed,this.height); // From this we make the image large and it look like a single and move endlessly.

        /*
        --------------------
        The Endless image work like : when the first image get completed then the second image the take the last poistion of the first image and it work very fast so we can't make the differnce (from this it look like endless image).

        --------------------
        */
    }
    update(){
        this.x -= this.speed; // This will move the background in the left direction.
        if(this.x < 0 - this.width) this.x =0; // From this line we understand that if background  will over it will come back to 0.
    }

  }

  class Enemy {
    constructor(gameHeight,gameWidth){
        this.gameWidth = gameWidth;
        this.gameHeight = gameHeight;
        this.width = 160;
        this.height = 119;
        this.image = document.getElementById("enemyImage");
        this.x = this.gameWidth; //  This will provide the enemey poistion in x direction(Vertically)
        this.y = this.gameWidth - this.height;  //  This will provide the enemey poistion in y direction(Horizontially)
        this.frameX = 0;
        this.speed = 8;
        this.maxFrame = 5;
        this.fps = 20;
        this.frameTimer = 0;
        this.frmaeInterval = 1000/this.fps;
        this.marksForDeletion = false;
    }
    draw(context){
        // context.strokeStyle = 'white';
        // context.strokeRect(this.x, this.y,this.width,this.height);
        // context.beginPath();
        // context.arc(this.x+this.width/2,this.y + this.height/2,this.width/2,0,Math.PI * 2 );
        // context.stroke();
        // context.strokeStyle = 'blue';
        // context.beginPath();
        // context.arc(this.x,this.y,this.width/2,0,Math.PI * 2 );
        // context.stroke(); 
        context.drawImage(this.image,this.frameX * this.width,0,this.width,this.height,this.x,this.y,this.width,this.height);
    }

    update(deltaTime){
        if(this.frameTimer > this.frmaeInterval){
            if(this.frameX >= this.maxFrame) this.frameX = 0;
            else this.frameX++;
            this.frameTimer = 0;
        } else{
            this.frameTimer += deltaTime;
        }
        this.x -= this.speed;
        if(this.x < 0 - this.width){ 
        this.marksForDeletion = true;
        score++;
        }
    }
  }

  function handleEnemies(deltaTime){
    if(enemyTimer > enemyInterval + randomEnemyInterval){
        enemies.push(new Enemy(canvas.width,canvas.height));
        let randomEnemyInterval = Math.random() * 1000 + 500;
        enemyTimer = 0;
    }else{
        enemyTimer += deltaTime;
    }
    enemies.forEach(Enemy =>{
        Enemy.draw(ctx);
        Enemy.update(deltaTime);
    });
    enemies = enemies.filter(Enemy =>!Enemy.marksForDeletion);
    //Filter() array method creates a new array with all elements that pass the test implemented by the provided function
  }
  function displayStatusText(context){
    context.font = '40px Helvetica';
    context.fillStyle = 'black';// Form this to fillText() function it use to display the context to the screen.
    context.fillText('Score : ' + score,20,50); // fillText() method text we wnat to draw + x and y coordinates context.fillText(text,x,y)
    context.fillStyle = 'white';
    context.fillText('Score : ' + score,22,52);
    if(gameOver){
        context.textAlign = 'center';
        context.fillStyle = 'black';
        context.fillText('GAME OVER, try agnain',canvas.width/2,200);
        context.fillStyle = 'white';
        context.fillText('GAME OVER, try agnain',canvas.width/2 + 2,202);
    } 
  }

  const input = new InputHnadler();
  const player = new Player(canvas.width,canvas.height);
  const background = new Background(canvas.width, canvas.height);
//   const enemy1 = new Enemy(canvas.width,canvas.height);  


  let lastTime = 0; // This will provide the computer the time .
  let enemyTimer = 0; // It count the millisecond form 0 to certain limit  and every it reaches it limit it get back to zer0. (this varibale use to use the delta time)
  let enemyInterval = 1000; // This variable give to add the enemy every 1000 second.
  let randomEnemyInterval = Math.random() * 1000 + 500; // This will provide the enemy to come randomly this less interval.

  function animate(timeStamp){
    const deltaTime = timeStamp - lastTime; 
     // The deltaTime is the milisecond differnce from  this loop to previous loop.
    // timeStamp is arugement which auto genrated by the requestAnimationFrame whenever the function call first it call at animate(), then it go to function animate(timeStamp);

    lastTime = timeStamp;
    // console.log(deltaTime); 
    ctx.clearRect(0,0,canvas.width,canvas.height); // This will delete the back tail of the rectangle and only show the rectangel;
    background.draw(ctx);
    background.update();
    player.draw(ctx);
    player.update(input,deltaTime,enemies);
    handleEnemies(deltaTime);
    // enemy1.draw(ctx);
    // enemy1.update(); 
    displayStatusText(ctx);
    if(!gameOver) requestAnimationFrame(animate);
  }
  animate(0);
});
