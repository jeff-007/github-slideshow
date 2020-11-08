class Ball {
  constructor(props) {
    this.x = 0;
    this.y = 0;
    this.x3d = 0; // 三维坐标
    this.y3d = 0;
    this.z3d = 0;
    this.r = 20;
    this.vx = 0;
    this.vy = 0;
    this.vz = 0; // z轴速度
    this.scaleX = 1; // 横向缩放
    this.scaleY = 1; // 纵向缩放
    this.strokeStyle = 'rgba(0, 0, 0, 0)';
    this.fillStyle = 'rgb(57, 119, 224)';
    this.alpha = 1;
    Object.assign(this, props);
  }
  render(ctx) {
    const { x, y, r, scaleX, scaleY, strokeStyle, fillStyle, alpha } = this;
    ctx.save();
    ctx.translate(x, y);
    ctx.scale(scaleX, scaleY);
    ctx.strokeStyle = strokeStyle;
    ctx.fillStyle = fillStyle;
    ctx.globalAlpha = alpha;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, 2 * Math.PI);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }

  // 判断当前坐标是否在该实例小球内
  isPoint(pos) {
    const { x, y } = pos;
    return this.r >= Math.sqrt((x - this.x) ** 2 + (y - this.y) ** 2)
  }
}

export { Ball }
