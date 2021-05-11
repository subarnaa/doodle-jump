document.addEventListener('DOMContentLoaded', () => {
  const container = document.querySelector('.container');
  const doodle = document.createElement('div');
  let startPoint = 150;
  let doodleBottomSpace = startPoint;
  let doodleLeftSpace;
  let floorCount = 4.5;
  let isGameOver = false;
  let floors = [];
  let upTimerId;
  let downTimerId;
  let isJumping = false;
  let isGoingLeft = false;
  let isGoingRight = false;
  let leftTimerId;
  let rightTimerId;
  let score = 0;

  const positionDoodle = () => {
    container.appendChild(doodle);
    doodle.classList.add('doodle');
    doodleLeftSpace = floors[0].left;
    doodle.style.left = doodleLeftSpace + 'px';
    doodle.style.bottom = doodleBottomSpace + 'px';
  }

  class Floor {
    constructor (floorBottom) {
      this.bottom = floorBottom;
      this.left = (Math.random() * 320);
    }

    createFloor() {
      this.floor = document.createElement('div');
      const floor = this.floor;
      floor.classList.add('floor');
      floor.style.left = this.left + 'px';
      floor.style.bottom = this.bottom + 'px';
      container.appendChild(floor)
    }
  }

  const createFloors = () => {
    for (let i=0; i < floorCount; i++) {
      const floorGap = 600 / floorCount;
      const floorBottom = 100 + i* floorGap ;
      const newFloor = new Floor(floorBottom);
      newFloor.createFloor();
      floors.push(newFloor);
    }
  }

  const moveFloor = () => {
    if(doodleBottomSpace > 150){
      console.log('chalyo')
      floors.forEach( floor => {
        floor.bottom -= 4;
        const newPositionedFloor = floor.floor;
        newPositionedFloor.style.bottom = floor.bottom + 'px';

        if (floor.bottom < 10) {
          let firstFloor = floors[0].floor;
          firstFloor.classList.remove('floor');
          floors.shift();
          console.log(floors);
          score++;
          let newFloor = new Floor(600);
          newFloor.createFloor()
          floors.push(newFloor);
        }
      });
    }
  }

  const jump = () => {
    clearInterval(downTimerId)
    isJumping = true;
    upTimerId = setInterval(() => {
      doodleBottomSpace += 20;
      doodle.style.bottom = doodleBottomSpace + 'px';

      if (doodleBottomSpace > startPoint + 200) {
        fall();
      }
    }, 30)
  }

  const fall = () => {
    clearInterval(upTimerId);
    isJumping = false;
    downTimerId = setInterval(() => {
      doodleBottomSpace -= 5;
      doodle.style.bottom = doodleBottomSpace + 'px';

      if (doodleBottomSpace <= 0) {
        gameOver();
      }

      floors.forEach(floor => {
        if(
          (doodleBottomSpace >= floor.bottom) &&
          (doodleBottomSpace <= (floor.bottom + 15)) &&
          ((doodleLeftSpace + 60) >= floor.left ) &&
          (doodleLeftSpace <= (floor.left + 80)) &&
          !isJumping
          ) {
            console.log('landed');
            startPoint = doodleBottomSpace;
            jump();
          }
      })
    }, 30)
  }

  const controls = (e) => {
    if (e.key === 'ArrowLeft'){
      moveLeft();
    } else if (e.key === 'ArrowRight') {
      moveRight();
    } else if (e.key === 'ArrowUp') {
      movieStraight();
    }
  }

  const moveLeft = () => {
    console.log('left')
    isGoingLeft = true;
    if (isGoingRight) {
      clearInterval(rightTimerId);
      isGoingRight = false;
    }
    leftTimerId = setInterval(() => {
      if (doodleLeftSpace >= 0) {
        doodleLeftSpace -= 5;
        doodle.style.left = doodleLeftSpace + 'px';
      } else {
        moveRight();
      }
    }, 25)
  }

  moveRight = () => {
    console.log('right')
    isGoingRight = true;
    if (isGoingLeft) {
      clearInterval(leftTimerId);
      isGoingLeft = false;
    }
    rightTimerId = setInterval(() => {
      if (doodleLeftSpace <= 340) {
        doodleLeftSpace += 5;
        doodle.style.left = doodleLeftSpace + 'px';
      } else {
        moveLeft();
      }
    }, 25)
  }

  movieStraight = () => {
    isGoingLeft = false;
    isGoingRight = false;
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
  }

  const gameOver = () => {

    clearInterval(downTimerId);
    clearInterval(upTimerId);
    clearInterval(leftTimerId);
    clearInterval(rightTimerId);
    isGameOver = true;

    while (container.firstChild) {
      container.removeChild(container.firstChild)
    }

    const scoreBoard = document.createElement('scoreBoard');
    scoreBoard.setAttribute('id', 'scoreBoard');
    scoreBoard.innerHTML = 'Your score: ' + score;
    container.appendChild(scoreBoard);

    console.log('Game Over. Your score: ' + score);

  }

  const start = () => {
    if (!isGameOver) {
      createFloors();
      positionDoodle();
      setInterval(moveFloor, 30)
      jump()
      document.addEventListener('keyup', controls)
    }
  }
  start();
  console.log(floors)
});
