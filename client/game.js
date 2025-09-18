const config = {
  type: Phaser.AUTO,
  width: 640,
  height: 480,
  parent: 'game',
  physics: { default: 'arcade' },
  scene: { preload, create, update }
};
const TILE = 32, COLS = 20, ROWS = 15;
let score = 0;
window.__GAME_SCORE = 0;

const game = new Phaser.Game(config);

function preload(){
  this.load.image('player','assets/player.png');
  this.load.image('enemy','assets/enemy.png');
  this.load.image('box','assets/box.png');
  this.load.image('wall','assets/wall.png');
  this.load.image('bomb','assets/bomb.png');
  this.load.image('explosion','assets/explosion.png');
  this.load.image('powerup','assets/powerup.png');
}

function create(){
  this.cameras.main.setBackgroundColor('#222');
  // map groups
  this.walls = this.physics.add.staticGroup();
  this.boxes = this.physics.add.staticGroup();
  this.powerups = this.physics.add.group();
  // create grid
  this.map = [];
  for(let y=0;y<ROWS;y++){
    this.map[y]=[];
    for(let x=0;x<COLS;x++){
      if(y===0||y===ROWS-1||x===0||x===COLS-1){ this.walls.create(x*TILE+TILE/2,y*TILE+TILE/2,'wall'); this.map[y][x]='wall'; }
      else if(y%2===0 && x%2===0){ this.walls.create(x*TILE+TILE/2,y*TILE+TILE/2,'wall'); this.map[y][x]='wall'; }
      else if(Math.random()<0.18){ this.boxes.create(x*TILE+TILE/2,y*TILE+TILE/2,'box'); this.map[y][x]='box'; }
      else this.map[y][x]='empty';
    }
  }
  // clear spawn
  this.map[1][1]='empty'; this.map[1][2]='empty'; this.map[2][1]='empty';
  // player
  this.player = this.physics.add.sprite(1*TILE+TILE/2,1*TILE+TILE/2,'player').setDepth(2);
  this.player.setCollideWorldBounds(true);
  // enemies
  this.enemies = this.physics.add.group();
  for(let i=0;i<4;i++){ let e=this.enemies.create((COLS-2-i)*TILE+TILE/2,(ROWS-2)*TILE+TILE/2,'enemy'); e.alive=true; }
  // bombs & explosions
  this.bombs = [];
  this.explosions = this.physics.add.group();
  // input
  this.cursors = this.input.keyboard.createCursorKeys();
  this.keys = this.input.keyboard.addKeys('W,A,S,D,SPACE');
  // collisions
  this.physics.add.overlap(this.explosions, this.enemies, (exp, en)=>{ if(en.active){ en.destroy(); score += 50; window.__GAME_SCORE = score; } });
  this.physics.add.overlap(this.explosions, this.player, ()=>{ if(this.player.active){ this.player.destroy(); alert('You died — restart the page to play again.'); } });
  // simple enemy movement timer
  this.time.addEvent({ delay: 500, loop:true, callback:()=>{
    this.enemies.getChildren().forEach(en=>{
      if(!en.active) return;
      let dirs=[[1,0],[-1,0],[0,1],[0,-1]];
      let d=Phaser.Math.RND.pick(dirs);
      let nx = Math.floor(en.x/TILE)+d[0], ny = Math.floor(en.y/TILE)+d[1];
      if(nx>0 && nx<COLS-1 && ny>0 && ny<ROWS-1 && this.map[ny][nx] === 'empty'){
        en.x = nx*TILE+TILE/2; en.y = ny*TILE+TILE/2;
      }
    });
  }});
  // score text
  this.scoreText = this.add.text(8,8,'Score: 0',{fontSize:'16px', fill:'#fff'}).setScrollFactor(0).setDepth(5);
  // restart button via key R
  this.input.keyboard.on('keydown-R',()=> location.reload());
}

function update(){
  // movement - snap to grid
  let px = Math.floor(this.player.x / TILE), py = Math.floor(this.player.y / TILE);
  if(this.cursors.left.isDown || this.keys.A.isDown){ movePlayer(this, px-1, py); }
  if(this.cursors.right.isDown || this.keys.D.isDown){ movePlayer(this, px+1, py); }
  if(this.cursors.up.isDown || this.keys.W.isDown){ movePlayer(this, px, py-1); }
  if(this.cursors.down.isDown || this.keys.S.isDown){ movePlayer(this, px, py+1); }
  if(this.keys.SPACE && Phaser.Input.Keyboard.JustDown(this.keys.SPACE)){ placeBomb(this, px, py); }
  this.scoreText.setText('Score: '+score);
}

function movePlayer(scene, nx, ny){
  if(nx<0||nx>=COLS||ny<0||ny>=ROWS) return;
  if(scene.map[ny][nx] === 'empty'){ scene.player.x = nx*TILE+TILE/2; scene.player.y = ny*TILE+TILE/2; }
}

function placeBomb(scene, x, y){
  // don't place if bomb exists
  if(scene.bombs.find(b=>b.x===x&&b.y===y)) return;
  const b = {x,y,ts:Date.now()};
  const spr = scene.add.image(x*TILE+TILE/2,y*TILE+TILE/2,'bomb').setDepth(3);
  scene.bombs.push(b);
  scene.time.delayedCall(1200, ()=>{
    // explosion center
    explodeAt(scene, x, y);
    spr.destroy();
    scene.bombs = scene.bombs.filter(bb=>bb!==b);
  });
}

function explodeAt(scene, x, y){
  const positions = [{x,y},{x:x+1,y},{x:x-1,y},{x,y:y+1?y+1:y},{x,y:y-1?y-1:y}]; // center + 4
  // center
  makeExplosion(scene,x,y);
  [[1,0],[-1,0],[0,1],[0,-1]].forEach(dir=>{
    for(let r=1;r<=2;r++){
      let nx=x+dir[0]*r, ny=y+dir[1]*r;
      if(nx<=0||nx>=COLS-1||ny<=0||ny>=ROWS-1) break;
      if(scene.map[ny][nx] === 'wall') break;
      makeExplosion(scene,nx,ny);
      if(scene.map[ny][nx] === 'box'){
        scene.map[ny][nx] = 'empty';
        // destroy box sprite at position
        scene.boxes.getChildren().forEach(b=>{ if(Math.abs(b.x - (nx*TILE+TILE/2))<4 && Math.abs(b.y - (ny*TILE+TILE/2))<4) b.destroy(); });
        // chance for powerup
        if(Math.random()<0.2){ const pu = scene.powerups.create(nx*TILE+TILE/2, ny*TILE+TILE/2, 'powerup'); }
        score += 10; window.__GAME_SCORE = score;
        break;
      }
    }
  });
}

function makeExplosion(scene, x, y){
  const e = scene.add.image(x*TILE+TILE/2, y*TILE+TILE/2, 'explosion').setDepth(4);
  scene.explosions.add(e);
  scene.time.delayedCall(400, ()=>{ e.destroy(); });
}
