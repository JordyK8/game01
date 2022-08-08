import Phaser from 'phaser';

export default {
  type: Phaser.AUTO,
  physics: {
    default: 'arcade',
    
    arcade: {
      gravity: {y: 0},
      debug: true,
    }
  },
  parent: 'game',
  backgroundColor: '#33A5E7',
  scale: {
    width: 480,
    height: 832,
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  }
};
