$(document).ready(function () {
  const $ball = $(".circle1");

  // --- 1. 상태 변수 및 설정값 ---
  let isRolling = false;
  let isReturning = false;
  let isPaused = false;
  let isFinalRoll = false; // ★ 추가: 마지막 굴림 단계 (멈춤이 목표)인지 추적

  let currentX = 0;
  let currentRotation = 0;

  const moveSpeed = 3;
  const rotateSpeed = 5;

  // L->R 이동 최대 지점
  const turnPoint = 450;
  // R->L 복귀 시 Z-index가 바뀌고 방향이 전환될 지점 (left: 450px)
  const reEmergencePoint = -150;
  // ★ 추가: Road1 뒤에서 나와 1초(약 180px) 굴러간 후 멈출 지점
  const finalStopPoint = 30;

  const pauseDuration = 50; // 0.05초 정지

  $ball.css("z-index", 20); // 초기 z-index (길 위)

  // --- 2. 애니메이션 루프 함수 ---
  function rollBall() {
    if (isPaused || (!isRolling && !isReturning)) return;

    // [상태 A] 갈 때 (L -> R, Z: 20)
    if (!isReturning) {
      currentX += moveSpeed;
      currentRotation += rotateSpeed;

      // 1. ★ 최종 멈춤 지점 체크 (마지막 굴림 단계일 때만 X=30에서 멈춥니다)
      if (isFinalRoll && currentX >= finalStopPoint) {
        isRolling = false;
        isFinalRoll = false; // 사이클 종료
        // 멈춤 위치를 finalStopPoint로 정확히 고정
        $ball.css(
          "transform",
          `translateX(${finalStopPoint}px) rotate(${currentRotation}deg)`
        );
        return;
      }

      // 2. Outbound 끝 지점 체크 (X=450 도달)
      if (currentX >= turnPoint) {
        isRolling = false;
        startTurnSequence();
        return;
      }
    }
    // [상태 B] 올 때 (R -> L, Z: 5)
    else {
      currentX -= moveSpeed;
      currentRotation -= rotateSpeed;

      // X=-150 (reEmergencePoint) 도달 시 Z-index, 방향 변경
      if (currentX <= reEmergencePoint) {
        // Z-index, 방향 변경 후 L->R 재시작
        finishReturnSequence();
        return;
      }
    }

    // CSS 적용 (이동 + 회전)
    $ball.css(
      "transform",
      `translateX(${currentX}px) rotate(${currentRotation}deg)`
    );

    requestAnimationFrame(rollBall);
  }

  // --- 3. 헬퍼 함수들 (상태 전환 및 복귀 시퀀스) ---

  // 1. X=450 도달 시 실행 (0.05초 정지 후 R->L 굴림 시작)
  function startTurnSequence() {
    isPaused = true;

    setTimeout(() => {
      isPaused = false;

      isReturning = true;
      isRolling = false;

      // Z-index 변경 (길 뒤로 숨김)
      $ball.css("z-index", 5);

      // 루프 재시작 (R->L 굴림 시작)
      rollBall();
    }, pauseDuration);
  }

  // 2. X=-150 도달 시 실행 (Z-index, 방향 변경 후 L->R 굴림 시작)
  function finishReturnSequence() {
    // 1. Z-index를 높여서 길 앞으로 나타나게 함
    $ball.css("z-index", 20);

    // 2. 상태 전환: R->L (isReturning) -> L->R (isRolling)
    isReturning = false;
    isRolling = true;
    // ★ 다음 굴림은 최종 멈춤을 목표로 합니다.
    isFinalRoll = true;

    // 3. 현재 위치(X=-150)에서 L->R 굴림 재시작

    // 루프 재시작 (L->R 굴림 시작)
    rollBall();
  }

  // --- 4. 이벤트 리스너 ---

  $ball.on("mouseenter", function () {
    // 굴러가는 중이 아니고 멈춤 상태도 아닐 때만 시작 (X=30에 멈춰있을 때)
    if (!isReturning && !isPaused && !isRolling) {
      isRolling = true;
      requestAnimationFrame(rollBall);
    }
  });

  $ball.on("mouseleave", function () {
    // 복귀 중일 때는 마우스를 떼도 멈추지 않아야 합니다.
    if (!isReturning) {
      isRolling = false;
    }
  });
});

$(document).ready(function () {
  const $ball = $(".circle2");

  // --- 1. 상태 변수 및 설정값 ---
  let isRolling = false;
  let isReturning = false;
  let isPaused = false;
  let isFinalRoll = false;

  let currentX = 0;
  let currentRotation = 0;

  const moveSpeed = 3;
  const rotateSpeed = 5;

  // L->R 이동 최대 지점 (R->L 출발 시 음수 방향 최대 이동 지점)
  const turnPoint = -676;
  // R->L 복귀 후 Z-index가 바뀌고 방향이 전환될 지점
  const reEmergencePoint = 200; // ★ 이 지점도 논리적으로 음수여야 할 가능성이 높으나, 일단 기존 150 유지
  // ★ 수정: Road1 뒤에서 나와 1초(약 180px) 굴러간 후 멈출 지점 (음수 방향이므로 -30)
  const finalStopPoint = -30;

  const pauseDuration = 50; // 0.05초 정지

  $ball.css("z-index", 20); // 초기 z-index (길 위)

  // --- 2. 애니메이션 루프 함수 ---
  function rollBall() {
    if (isPaused || (!isRolling && !isReturning)) return;

    // [상태 A] 갈 때 (R -> L, Z: 20)
    if (!isReturning) {
      currentX -= moveSpeed; // ★ R->L 이동 (X 감소)
      currentRotation -= rotateSpeed;

      // 1. ★ 최종 멈춤 지점 체크 (R->L 이동이므로 <= 조건 사용)
      if (isFinalRoll && currentX <= finalStopPoint) {
        isRolling = false;
        isFinalRoll = false;
        // 멈춤 위치를 finalStopPoint로 정확히 고정
        $ball.css(
          "transform",
          `translateX(${finalStopPoint}px) rotate(${currentRotation}deg)`
        );
        return;
      }

      // 2. ★ Outbound 끝 지점 체크 (R->L 이동이므로 <= 조건 사용)
      if (currentX <= turnPoint) {
        isRolling = false;
        startTurnSequence();
        return;
      }
    }
    // [상태 B] 올 때 (L -> R, Z: 5)
    else {
      currentX += moveSpeed; // ★ L->R 이동 (X 증가)
      currentRotation += rotateSpeed;

      // ★ R->L 복귀 후 Z-index, 방향 변경 (L->R 복귀이므로 >= 조건 사용)
      if (currentX >= reEmergencePoint) {
        // Z-index, 방향 변경 후 L->R 재시작
        finishReturnSequence();
        return;
      }
    }

    // CSS 적용 (이동 + 회전)
    $ball.css(
      "transform",
      `translateX(${currentX}px) rotate(${currentRotation}deg)`
    );

    requestAnimationFrame(rollBall);
  }

  // --- 3. 헬퍼 함수들 (상태 전환 및 복귀 시퀀스) ---

  // 1. X=450 (현재 -676) 도달 시 실행 (0.05초 정지 후 L->R 굴림 시작)
  function startTurnSequence() {
    isPaused = true;

    setTimeout(() => {
      isPaused = false;

      isReturning = true; // L->R 복귀 모드 시작
      isRolling = false;

      // Z-index 변경 (길 뒤로 숨김)
      $ball.css("z-index", 5);

      // 루프 재시작 (L->R 굴림 시작)
      rollBall();
    }, pauseDuration);
  }

  // 2. X=150 (reEmergencePoint) 도달 시 실행 (Z-index, 방향 변경 후 R->L 굴림 시작)
  function finishReturnSequence() {
    // 1. Z-index를 높여서 길 앞으로 나타나게 함
    $ball.css("z-index", 20);

    // 2. 상태 전환: L->R (isReturning) -> R->L (isRolling)
    isReturning = false;
    isRolling = true;
    // ★ 다음 굴림은 최종 멈춤을 목표로 합니다.
    isFinalRoll = true;

    // 3. 현재 위치(X=150)에서 R->L 굴림 재시작

    // 루프 재시작 (R->L 굴림 시작)
    rollBall();
  }

  // --- 4. 이벤트 리스너 ---

  $ball.on("mouseenter", function () {
    // 굴러가는 중이 아니고 멈춤 상태도 아닐 때만 시작 (X=-30에 멈춰있을 때)
    if (!isReturning && !isPaused && !isRolling) {
      isRolling = true;
      requestAnimationFrame(rollBall);
    }
  });

  $ball.on("mouseleave", function () {
    // 복귀 중일 때는 마우스를 떼도 멈추지 않아야 합니다.
    if (!isReturning) {
      isRolling = false;
    }
  });
});
