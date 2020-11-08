const C = {};

C.getOffSet = function(ele) {
  const mouse = { x: 0, y: 0 };
  ele.addEventListener('mousemove', function(e) {
    const { x, y } = C.eventWrapper(e);
    mouse.x = x;
    mouse.y = y;
  });
  return mouse
};

C.eventWrapper = function(ev) {
  const { pageX, pageY, target } = ev;
  const { left, top } = target.getBoundingClientRect();
  return { x: pageX - left, y: pageY - top }
};

// 角度转弧度
C.toRad = function(angle) {
  return angle * Math.PI / 180
}

// 弧度转角度
C.toAngle = function(rad) {
  return rad * 180 / Math.PI
}

// 随机数
C.randomNum = function(arr, int) {
  const max = Math.max(...arr);
  const min = Math.min(...arr);
  const num = Math.random() * (max - min) + min;
  return int ? Math.round(num) : num
}

// 随机颜色
C.randomColor = function() {
  return `rgb(${C.randomNum([55, 255], true)}, ${C.randomNum([55, 255], true)}, ${C.randomNum([55, 255], true)})`
}


// 矩形碰撞
C.rectConflict = function(rect1, rect2) {
  return (rect1.x + rect1.w >= rect2.x && rect1.x <= rect2.x + rect2.w && rect1.y + rect1.h >= rect2.y && rect1.y <= rect2.y + rect2.h)
};

// 两点距离
C.getDistance = function(x1, y1, x2, y2) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
};

C.checkBallBounce = function(ball, W, H, bounce) {
  if (ball.x - ball.r <= 0) {
    ball.x = ball.r;
    ball.vx *= bounce;

  } else if (ball.x + ball.r >= W) {
    ball.x = W - ball.r;
    ball.vx *= bounce;
  }
  if (ball.y - ball.r <= 0) {
    ball.y = ball.r;
    ball.vy *= bounce;

  } else if (ball.y + ball.r >= H) {
    ball.y = H - ball.r;
    ball.vy *= bounce;
  }
};

export default C
