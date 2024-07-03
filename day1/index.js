// step 0
const solution = (args) => {
  const keyboard = [
    ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"],
    ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
    ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
    ["Z", "X", "C", "V", "B", "N", "M"],
  ];

  const dx = [0, 0, 1, -1]; // up / donw
  const dy = [1, -1, 0, 0]; // right / left

  const direction = [">", "<", "_", "^"];

  const moveKeyboard = (char, nowX, nowY, visited) => {
    const queue = [{ startX: nowX, startY: nowY, path: "" }];

    while (queue.length) {
      const { startX, startY, path } = queue.shift();

      if (keyboard[startX][startY] === char)
        return { path: "", next: [startX, startY] }; // 예외처리

      for (let i = 0; i < dx.length; i++) {
        const nx = startX + dx[i];
        const ny = startY + dy[i];

        if (
          nx < 0 ||
          ny < 0 ||
          nx >= keyboard.length ||
          ny >= keyboard[nx].length
        )
          continue;

        if (visited[nx][ny]) continue;

        visited[nx][ny] = true;

        if (keyboard[nx][ny] === char) {
          // 현재까지 움직인 경로 return
          return { path: path + direction[i], next: [nx, ny] };
        }

        queue.push({ startX: nx, startY: ny, path: path + direction[i] });
      }
    }
  };

  const init = (word) => {
    // 매 입력마다 시작 위치가 초기화된다고 가정한다.
    // Q. @ 값의 역할은?

    const res = word
      .split("")
      .map((char) => ({
        char,
        startX: 0,
        startY: 0,
      }))
      .reduce(
        (acc, { char, startX, startY }) => {
          const visited = Array.from({ length: 4 }, () =>
            Array.from({ length: 10 }, () => false)
          );
          let position;
          if (!acc.startX) {
            position = { startX, startY };
          } else {
            position = { startX: acc.startX, startY: acc.startY };
          }
          const { next, path } = moveKeyboard(
            char,
            position.startX,
            position.startY,
            visited
          );
          acc.startX = next[0];
          acc.startY = next[1];
          acc.ans += `${path}`;

          return acc;
        },
        { ans: "" }
      );

    return res.ans;
  };

  init(args[0]);

  return args.map((word) => {
    return init(word);
  });
};

solution(["BOOST", "HELLO", "CAMPER5", "FROM1984"]);
