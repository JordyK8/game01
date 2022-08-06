import Phaser, { GameObjects } from 'phaser';

export default class Demo extends Phaser.Scene {
  private player: GameObjects.Rectangle;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private bombs: number;
  private bomb: GameObjects.Sprite;
  private maxBombs: number;
  constructor() {
    super('GameScene');
    this.player;
    this.cursors;
    this.bombs = 0;
    this.maxBombs = 1;
    this.bomb;
  }

  preload() {
    this.load.spritesheet('bomb', 'assets/bomb.png', {
      frameWidth: 20,
      frameHeight: 26,
      startFrame: 0,
      endFrame: 5});
    this.load.spritesheet('bomb', 'assets/bomb.png', {
      frameWidth: 20,
      frameHeight: 26,
      startFrame: 0,
      endFrame: 5});
  }
  create ()
  {
      this.player = this.add.rectangle(400, 300, 20, 20, 0xffffff);
      this.bomb = this.add.sprite(0,0, 'bomb')
      this.cursors = this.input.keyboard.createCursorKeys();
      this.physics.add.existing(this.player, false);
    this.anims.create({
      key: 'bomb',
      frames: this.anims.generateFrameNumbers('bomb', {
        frames: [0, 1, 2, 3, 4, 5]
      }),
      frameRate: 1.6,
      repeat: 0
      })
      
      this.player.body.setCollideWorldBounds(true);
  }
  
  update ()
  {
      this.player.body.setVelocity(0);
  
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
      
    this.cursors.space.once('down', () => {
      if (this.bombs < this.maxBombs) {
        this.bombs++;
        const bomb = this.add.sprite(this.player.x, this.player.y , 'bomb')
        bomb.play('bomb')
        setTimeout(() => {
          bomb.destroy();
          this.bombs--;
        }, 4000);
      }
    })
  }
  
}
