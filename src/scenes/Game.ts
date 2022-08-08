import Phaser, { GameObjects } from 'phaser';

export default class Demo extends Phaser.Scene {
  private player: GameObjects.Rectangle;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private bombs: number;
  private bomb: GameObjects.Sprite;
  private maxBombs: number;
  private map: Phaser.Tilemaps.Tilemap;
  private tileset: Phaser.Tilemaps.Tileset;
  private layer: Phaser.Tilemaps.TilemapLayer;
  private expls: GameObjects.Rectangle[];
  private life: number;
  private lifeArr: GameObjects.Rectangle[];
  private playerIndestructable: boolean;
  constructor() {
    super('GameScene');
    this.player;
    this.cursors;
    this.bombs = 0;
    this.maxBombs = 3;
    this.bomb;
    this.map;
    this.tileset;
    this.layer;
    this.expls = [];
    this.life = 3;
    this.lifeArr = [];
    this.playerIndestructable = false;
  }

  preload() {
    this.load.image('tiles', 'assets/tiles.png')
    this.load.tilemapCSV('map', 'assets/bombermap-2.csv');
    this.load.spritesheet('bomb', 'assets/bomb.png', {
      frameWidth: 20,
      frameHeight: 28,
      startFrame: 0,
      endFrame: 5
    });
    this.load.spritesheet('player', 'assets/bomb.png', {
      frameWidth: 20,
      frameHeight: 20,
      startFrame: 0,
      endFrame: 5
    });
    
    this.load.spritesheet('bomb', 'assets/bomb.png', {
      frameWidth: 20,
      frameHeight: 26,
      startFrame: 0,
      endFrame: 5});
  }

  create() {       
    this.map = this.make.tilemap({ key: 'map', tileWidth: 32, tileHeight: 32 });
    this.tileset = this.map.addTilesetImage('tiles1', 'tiles');
    this.layer = this.map.createLayer('layer', this.tileset, 0, 0);
    // this.boxLayer = this.map.createLayer('boxes', this.tileset, 0, 0);
    this.player = this.add.rectangle(55, 55, 25, 25, 0xffff00);
    this.physics.add.existing(this.player);
    this.bomb = this.physics.add.sprite(0, 0, 'bomb', 0)
    this.cursors = this.input.keyboard.createCursorKeys();
    this.anims.create({
      key: 'bomb',
      frames: this.anims.generateFrameNumbers('bomb', {
        frames: [0, 1, 2, 3, 4, 5]
      }),
      frameRate: 1.6,
      repeat: 0
    });
    this.physics.add.collider(this.player, this.layer);
    this.physics.add.collider(this.player, this.bomb);
    this.layer.setCollisionBetween(52, 54)
    for (let i = 0; i < this.life; i++) {
      this.lifeArr.push(this.add.rectangle(32 + (i * 15), 15, 10, 10, 0xffffff));
    } 
  }
  
  update() {    
    this.playerMovements.bind(this)();
    this.cursors.space.once('down', this.setBomb.bind(this));
    for (const expl of this.expls) {    
      if (this.physics.overlap(this.player, expl) && !this.playerIndestructable) {
        this.takeLife.bind(this)();
      }
    }
  }

  takeLife() {    
    this.playerIndestructable = true;
    if (this.lifeArr.length) {
      this.lifeArr[this.lifeArr.length - 1].destroy();
      this.lifeArr.pop();
      console.log(this.lifeArr);
      
      setTimeout(() => {
        this.playerIndestructable = false;
      }, 3000);
      
    }else this.resetGame.bind(this)();
  }

  resetGame() {
    console.log('resetGame');
  }

  playerMovements() {
    // start ai test
    this.player.body.setVelocity(0);
    const steps = [];
    const position = { x: 50, y: 50 };
    if (this.player.x !== position.x && this.player.y !== position.y) {
      let velo;
      const x = Math.floor(this.player.x / 32);
      const y = Math.floor(this.player.y / 32);
      const nX = (x * 32 + 32 / 2);
      const nY = (y * 32 + 32 / 2);

      
      // if obstacle left
      // this.add.rectangle(this.player.x - 18, this.player.y, 4, 20, 0xfbbbfb)
      
      if (this.layer.getTileAtWorldXY(this.player.x - 18, this.player.y - 18) || this.layer.getTileAtWorldXY(this.player.x + 18, this.player.y + 18)) {
        console.log('yesy');
        
        // go up
        if (this.player.y < position.y) velo = 100;
        if (this.player.y > position.y) velo = -100;
        this.player.body.setVelocityY(velo)
      } else {
        // go left
        if (this.player.x < position.x) velo = 100;
        if (this.player.x > position.x) velo = -100;
        this.player.body.setVelocityX(velo)

      }

      // this.player.body.setVelocityX(velo)
      // console.log(this.layer.getTileAtWorldXY(this.player.x, this.player.y - 20))
      // if (this.layer.getTileAtWorldXY(nX , nY + 8)) {
      //   if (this.player.y < position.y) velo = 100;
      //   if (this.player.y > position.y) velo = -100;
      //   this.player.body.setVelocityY(velo)
      // } 
      // if (this.layer.getTileAtWorldXY(this.player.x, this.player.y + 8)) {
      //   if (this.player.x < position.x) velo = 100;
      //   if (this.player.x > position.x) velo = -100;
      // }
      // this.player.body.setVelocityX(velo)
    }
    // end ai test
  
      if (this.cursors.left.isDown)
      {
          this.player.body.setVelocityX(-100);
      }
      else if (this.cursors.right.isDown)
      {
          this.player.body.setVelocityX(100);
      }
  
      if (this.cursors.up.isDown)
      {
          this.player.body.setVelocityY(-100);
      }
      else if (this.cursors.down.isDown)
      {
          this.player.body.setVelocityY(100);
      }
  }

  setBomb() {    
    if (this.bombs < this.maxBombs) {
      this.bombs++;
      // get bomb placement position
      const x = Math.floor(this.player.x / 32);
      const y = Math.floor(this.player.y / 32);
      const nX = x * 32 + 32 / 2;
      const nY = y * 32 + 32 / 2;
      
      const bomb = this.physics.add.sprite(nX, nY, 'bomb').setScale(1.4,1.2)
      bomb.play('bomb')
      setTimeout(() => {
        this.bombs--;
        this.expls.push(this.add.rectangle(bomb.x , bomb.y, 32, 32, 0xf50000));
        for (let i = 1; i < 5; i++) {
          if (this.layer.getTileAtWorldXY(nX , nY + (32 * i))) break;
          const expl = this.add.rectangle(nX , nY + (32 * i), 32, 32, 0xffffff);
          this.physics.add.existing(expl);
          this.expls.push(expl);
        }
        for (let i = 1; i < 5; i++) {
          if (this.layer.getTileAtWorldXY(nX + (32 * i), nY)) break;
          const expl = this.add.rectangle(nX + (32 * i), nY, 32, 32, 0xffffff);
          this.physics.add.existing(expl);
          this.expls.push(expl);
        }
        for (let i = 1; i < 5; i++) {
          if (this.layer.getTileAtWorldXY(nX , nY - (32 * i))) break;
          const expl = this.add.rectangle(nX , nY - (32 * i), 32, 32, 0xffffff);
          this.physics.add.existing(expl);
          this.expls.push(expl);
        }
        for (let i = 1; i < 5; i++) {
          if (this.layer.getTileAtWorldXY(nX - (32 * i), nY)) break;
          const expl = this.add.rectangle(nX - (32 * i), nY, 32, 32, 0xffffff);
          this.physics.add.existing(expl);
          this.expls.push(expl);
        }
        setTimeout(() => {
          for (const expl of this.expls) {
            expl.destroy();
            this.expls = this.expls.filter((item) => item !== expl);
          }
          bomb.destroy();
          }, 2500)
      }, 4000);
    }
  }
}
