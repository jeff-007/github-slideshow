class Arrow {
  // x y: 绘制起始点，w 箭头宽度 h 箭头高度
  constructor(props) {
    this.x = 0;
    this.y = 0;
    this.w = 60;
    this.h = 30;
    this.rotation = 0;
    this.fillStyle = 'rgb(57, 119, 224)';
    this.strokeStyle = 'rgba(0, 0, 0, 0)';
    Object.assign(this, props);
  }

  // 绘制路径
  createPath(ctx) {
    const { w, h } = this;
    ctx.beginPath();
    ctx.moveTo(-w / 2, -h / 2);
    ctx.lineTo(w / 10, -h / 2);
    ctx.lineTo(w / 10, -h);
    ctx.lineTo(w / 2, 0);
    ctx.lineTo(w / 10, h);
    ctx.lineTo(w / 10, h / 2);
    ctx.lineTo(-w / 2, h / 2);
    ctx.closePath();
  }
  // 箭头渲染
  render(ctx) {
    const { fillStyle, strokeStyle, rotation, x, y } = this;
    ctx.save();
    ctx.fillStyle = fillStyle;
    ctx.strokeStyle = strokeStyle;
    ctx.translate(x, y);
    ctx.rotate(rotation);
    this.createPath(ctx);
    ctx.fill();
    ctx.stroke();
    ctx.restore();
  }
}

export default Arrow
