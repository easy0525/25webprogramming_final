$(document).ready(function () {
  console.log("ready");
});

// circle1
$(document).ready(function () {
  const $ball = $(".circle1");

  // 2. 상태 변수 초기화
  let isRolling = false; // 현재 구르는 중인지 확인하는 플래그
  let currentX = 0; // 현재 X축 위치 (초기값 0)
  let currentRotation = 0; // 현재 회전 각도 (초기값 0)

  // 3. 설정값 (속도 조절)
  const moveSpeed = 3; // 이동 속도 (값이 클수록 빠름)
  const rotateSpeed = 3; // 회전 속도 (이동 속도에 맞춰 조정 필요)

  // 4. 애니메이션 루프 함수
  function rollBall() {
    if (!isRolling) return; // 굴러가는 상태가 아니면 함수 종료 (멈춤)

    // 위치 업데이트 (우 -> 좌 이동이므로 값을 뺍니다)
    currentX += moveSpeed;

    // 각도 업데이트 (왼쪽으로 구르려면 반시계 방향인 마이너스 각도로 회전)
    currentRotation += rotateSpeed;

    // CSS Transform 적용 (이동 + 회전 동시 적용)
    // 중요: translate가 먼저, rotate가 나중에 와야 자연스럽게 굴러갑니다.
    $ball.css(
      "transform",
      `translateX(${currentX}px) rotate(${currentRotation}deg)`
    );

    // 다음 프레임 요청 (부드러운 60fps 애니메이션을 위해 사용)
    requestAnimationFrame(rollBall);
  }

  // 5. 이벤트 리스너 연결

  // 마우스를 올렸을 때: 굴러가기 시작
  $ball.on("mouseenter", function () {
    isRolling = true;
    requestAnimationFrame(rollBall);
  });

  // 마우스를 뗐을 때: 멈춤 (상태값 유지)
  $ball.on("mouseleave", function () {
    isRolling = false;
    // 여기서 아무것도 초기화하지 않으므로, 공은 현재 위치와 각도에서 딱 멈춥니다.
  });
});

$(document).ready(function () {
  const $ball = $(".circle2");

  let isRolling = false;
  let currentX = 0;
  let currentRotation = 0;

  const moveSpeed = 3;
  const rotateSpeed = 3;

  function rollBall() {
    if (!isRolling) return;

    currentX -= moveSpeed;

    currentRotation -= rotateSpeed;

    $ball.css(
      "transform",
      `translateX(${currentX}px) rotate(${currentRotation}deg)`
    );

    requestAnimationFrame(rollBall);
  }

  $ball.on("mouseenter", function () {
    isRolling = true;
    requestAnimationFrame(rollBall);
  });

  $ball.on("mouseleave", function () {
    isRolling = false;
  });
});
