import React from "react";
import "./App.css";

type Color = "white" | "red" | "yellow" | "green" | "blue";
const colors: ReadonlyArray<Color> = ["red", "yellow", "green", "blue"];

function getColor(color: string): string {
  switch (color) {
    case "red":
      return "rgb(206,56,41)";

    case "yellow":
      return "rgb(226,159,54)";

    case "green":
      return "rgb(2,107,77)";

    case "blue":
      return "rgb(30,81,153)";
  }

  return color;
}
const ColorMap: ReadonlyMap<Color, string> = new Map([
  ["red", "red"],
  ["yellow", "yellow"],
  ["green", "green"],
  ["blue", "blue"],
]);

interface Square {
  readonly color: Color;
  /** 0 is used for LOCKS */
  readonly number: number;
}

type RowDefinition = ReadonlyArray<Square>;
type BoardDefinition = ReadonlyArray<RowDefinition>;

const DefaultBoard: BoardDefinition = [
  [
    { number: 2, color: "red" },
    { number: 3, color: "red" },
    { number: 4, color: "red" },
    { number: 5, color: "red" },
    { number: 6, color: "red" },
    { number: 7, color: "red" },
    { number: 8, color: "red" },
    { number: 9, color: "red" },
    { number: 10, color: "red" },
    { number: 11, color: "red" },
    { number: 12, color: "red" },
    { number: 0, color: "red" },
  ],
  [
    { number: 2, color: "yellow" },
    { number: 3, color: "yellow" },
    { number: 4, color: "yellow" },
    { number: 5, color: "yellow" },
    { number: 6, color: "yellow" },
    { number: 7, color: "yellow" },
    { number: 8, color: "yellow" },
    { number: 9, color: "yellow" },
    { number: 10, color: "yellow" },
    { number: 11, color: "yellow" },
    { number: 12, color: "yellow" },
    { number: 0, color: "yellow" },
  ],
  [
    { number: 12, color: "green" },
    { number: 11, color: "green" },
    { number: 10, color: "green" },
    { number: 9, color: "green" },
    { number: 8, color: "green" },
    { number: 7, color: "green" },
    { number: 6, color: "green" },
    { number: 5, color: "green" },
    { number: 4, color: "green" },
    { number: 3, color: "green" },
    { number: 2, color: "green" },
    { number: 0, color: "green" },
  ],
  [
    { number: 12, color: "blue" },
    { number: 11, color: "blue" },
    { number: 10, color: "blue" },
    { number: 9, color: "blue" },
    { number: 8, color: "blue" },
    { number: 7, color: "blue" },
    { number: 6, color: "blue" },
    { number: 5, color: "blue" },
    { number: 4, color: "blue" },
    { number: 3, color: "blue" },
    { number: 2, color: "blue" },
    { number: 0, color: "blue" },
  ],
];

const MixxBoard: BoardDefinition = [
  [
    { number: 2, color: "yellow" },
    { number: 3, color: "yellow" },
    { number: 4, color: "yellow" },
    { number: 5, color: "blue" },
    { number: 6, color: "blue" },
    { number: 7, color: "blue" },
    { number: 8, color: "green" },
    { number: 9, color: "green" },
    { number: 10, color: "green" },
    { number: 11, color: "red" },
    { number: 12, color: "red" },
    { number: 0, color: "red" },
  ],
  [
    { number: 2, color: "red" },
    { number: 3, color: "red" },
    { number: 4, color: "green" },
    { number: 5, color: "green" },
    { number: 6, color: "green" },
    { number: 7, color: "green" },
    { number: 8, color: "blue" },
    { number: 9, color: "blue" },
    { number: 10, color: "yellow" },
    { number: 11, color: "yellow" },
    { number: 12, color: "yellow" },
    { number: 0, color: "yellow" },
  ],
  [
    { number: 12, color: "blue" },
    { number: 11, color: "blue" },
    { number: 10, color: "blue" },
    { number: 9, color: "yellow" },
    { number: 8, color: "yellow" },
    { number: 7, color: "yellow" },
    { number: 6, color: "red" },
    { number: 5, color: "red" },
    { number: 4, color: "red" },
    { number: 3, color: "green" },
    { number: 2, color: "green" },
    { number: 0, color: "green" },
  ],
  [
    { number: 12, color: "green" },
    { number: 11, color: "green" },
    { number: 10, color: "red" },
    { number: 9, color: "red" },
    { number: 8, color: "red" },
    { number: 7, color: "red" },
    { number: 6, color: "yellow" },
    { number: 5, color: "yellow" },
    { number: 4, color: "blue" },
    { number: 3, color: "blue" },
    { number: 2, color: "blue" },
    { number: 0, color: "blue" },
  ],
];

// Row key should be 2-12 and "LOCKED" is 0
type RowState = { [key: number]: boolean };
type BoardState = RowState[];

function textColor(backgroundColor: string) {
  // TODO this is not very good.
  return backgroundColor === "yellow" || backgroundColor === "white"
    ? "black"
    : "white";
}

// We are treating 0 as locked!
interface ClickData {
  rowIndex: number;
  number: number;
  color: string;
  checked: boolean;
}

function QwixxRowButton({
  rowIndex,
  color,
  number,
  checked,
  locked,
  highlighted,
  onClick,
}: {
  rowIndex: number;
  color: string;
  number: number;
  checked: boolean;
  locked: boolean;
  highlighted: boolean;
  onClick: (clickData: ClickData) => void;
}) {
  let background = "rgba(255,255,255,.6)";
  if (highlighted) background = "rgba(255,255,255,.95)";
  if (locked) background = "rgba(255,255,255,.2)";
  if (checked) background = "rgba(0,0,0,.3)";
  return (
    <div style={{ background: getColor(color), padding: 5 }}>
      <button
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background,
          color: checked ? "white" : getColor(color),
          width: 35,
          height: 35,
          margin: 2,
          fontFamily: "sans-serif",
          fontSize: number ? 24 : 20,
          fontWeight: 700,
          border: "none",
          borderRadius: 4,
          textAlign: "center",
        }}
        onClick={() => {
          onClick({ rowIndex, color, number, checked: !checked });
        }}>
        {number || "🔒"}
      </button>
    </div>
  );
}

function isLaterSelected(
  rowDef: RowDefinition,
  rowState: RowState,
  number: number
) {
  // we want to check if any LATER number is selected.
  let isLater = false;
  for (let square of rowDef) {
    if (isLater && rowState[square.number]) {
      return true;
    }
    if (square.number === number) {
      isLater = true;
    }
  }

  return false;
}

function QwixxRow({
  rowIndex,
  rowDef,
  rowState,
  rowHighlights,
  onClick,
}: {
  rowIndex: number;
  rowDef: RowDefinition;
  rowState: RowState;
  rowHighlights?: Square[];
  onClick: (clickData: ClickData) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        marginBottom: 5,
      }}>
      {rowDef.map((square, squareIndex) => {
        let highlighted = false;
        rowHighlights?.forEach((highlight) => {
          if (
            (highlight.color == "white" || highlight.color === square.color) &&
            highlight.number === square.number
          ) {
            highlighted = true;
          }
        });
        return (
          <QwixxRowButton
            key={squareIndex}
            rowIndex={rowIndex}
            color={square.color}
            number={square.number}
            checked={rowState[square.number]}
            locked={isLaterSelected(rowDef, rowState, square.number)}
            highlighted={highlighted}
            onClick={onClick}
          />
        );
      })}
    </div>
  );
}

function createEmptyBoard(): BoardState {
  return [{}, {}, {}, {}];
}

function QwixxBoard({
  dice,
  turn,
  boardDef,
  boardState,
  onClick,
  lockedColors,
}: {
  dice?: number[];
  turn?: boolean;
  boardDef: BoardDefinition;
  boardState: BoardState;
  onClick: (clickData: ClickData) => void;
  lockedColors: Set<Color>;
}) {
  return (
    <div>
      {boardDef.map((rowDef, rowIndex) => (
        <QwixxRow
          key={rowIndex}
          rowIndex={rowIndex}
          rowDef={rowDef}
          rowState={boardState[rowIndex]}
          rowHighlights={dice && getDiceRoll(dice, lockedColors)}
          onClick={onClick}
        />
      ))}
    </div>
  );
}

function QwixxDie({ color, number }: { color: string; number: number }) {
  return (
    <div
      style={{
        background: color,
        color: textColor(color),
        border: "2px solid black",
        borderRadius: 4,
        width: 40,
        height: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        margin: 3,
      }}>
      {number}
    </div>
  );
}

function rollDice() {
  const dice: number[] = [];
  for (let i = 0; i < 6; i++) {
    dice.push(Math.floor(Math.random() * 6) + 1);
  }
  return dice;
}

const diceColors: ReadonlyArray<Color> = ["white", "white", ...colors];

function getDiceRoll(dice: number[], lockedColors: Set<Color>): Square[] {
  if (dice.length == 2) {
    return [{ color: "white", number: dice[0] + dice[1] }];
  }

  const rolls: Square[] = [
    { color: "white", number: dice[0] + dice[1] },

    { color: "red", number: dice[0] + dice[2] },
    { color: "red", number: dice[1] + dice[2] },

    { color: "yellow", number: dice[0] + dice[3] },
    { color: "yellow", number: dice[1] + dice[3] },

    { color: "green", number: dice[0] + dice[4] },
    { color: "green", number: dice[1] + dice[4] },

    { color: "blue", number: dice[0] + dice[5] },
    { color: "blue", number: dice[1] + dice[5] },
  ];

  return rolls.filter((r) => !lockedColors.has(r.color));
}

function QwixxDice({
  dice,
  lockedColors,
}: {
  dice: number[];
  lockedColors: Set<Color>;
}) {
  return (
    <div style={{ display: "flex", margin: 5 }}>
      {dice.map((die, index) =>
        false && lockedColors.has(diceColors[index]) ? null : (
          <QwixxDie key={index} color={diceColors[index]} number={die} />
        )
      )}
    </div>
  );
}

function QwixxDiceAreaDummy() {
  const [dice, setDice] = React.useState<number[] | undefined>();
  return (
    <QwixxDiceArea
      dice={dice}
      setDice={setDice}
      row={true}
      lockedColors={new Set()}
    />
  );
}

function ActionButton({
  text,
  onClick,
  compact,
}: {
  text: string;
  onClick: () => void;
  compact?: boolean;
}) {
  return (
    <button
      style={{
        border: "2px solid black",
        borderRadius: 0,
        height: compact ? 20 : 40,
        minWidth: compact ? 40 : 60,
        margin: compact ? "2px 5px" : 10,
        cursor: "pointer",
      }}
      onClick={onClick}>
      {text}
    </button>
  );
}

function QwixxDiceArea({
  dice,
  setDice,
  row,
  lockedColors,
}: {
  dice?: number[];
  setDice: (dice: number[]) => void;
  row?: boolean;
  lockedColors: Set<Color>;
}) {
  return (
    <div
      style={{
        display: row ? "flex" : undefined,
        alignItems: "center",
        flexWrap: "wrap",
      }}>
      <ActionButton
        text='Roll'
        onClick={() => {
          setDice(rollDice());
        }}
      />
      {dice ? <QwixxDice dice={dice} lockedColors={lockedColors} /> : null}
      {/* {dice ? <QwixxDiceValues dice={dice} /> : null} */}
    </div>
  );
}

function copyBoardState(boardState: BoardState): BoardState {
  const copy = createEmptyBoard();
  for (const color in boardState) {
    copy[color] = { ...boardState[color] };
  }
  return copy;
}

function updateBoardState(
  boardState: BoardState,
  { rowIndex, color, number, checked }: ClickData
): BoardState {
  boardState = copyBoardState(boardState);
  boardState[rowIndex][number] = checked;
  return boardState;
}

function trimDice(isActive: boolean, dice?: number[]) {
  if (isActive) return dice;
  if (!dice || dice.length <= 2) return dice;

  return [dice[0], dice[1]];
}

function scoreRow(rowState: RowState, rowDef: RowDefinition): number {
  let score = 0;
  let count = 0;
  for (let square of rowDef) {
    // if n is 0, this is the LOCK, so it only counts if at least 6! others are already pressed
    if (square.number === 0 && count < 6) continue;
    if (rowState[square.number]) score += ++count;
  }

  return score;
}

function scoreQwixxBoard(
  boardState: BoardState,
  boardDef: BoardDefinition
): number {
  let score = 0;

  boardState.forEach((rowState, rowIndex) => {
    score += scoreRow(rowState, boardDef[rowIndex]);
  });

  return score;
}

function QwixxScoreSquare({
  color,
  rowState,
  rowDef,
  score,
}: {
  color: string;
  rowState?: RowState;
  rowDef?: RowDefinition;
  score?: number;
}) {
  const background = color == "white" ? "black" : getColor(color);
  return (
    <div
      style={{
        border: `3px solid ${background}`,
        background,
        color: background,
        borderRadius: 8,
        margin: "0 5px",
      }}>
      <div
        style={{
          borderRadius: 4,
          background: color == "white" ? "white" : "rgba(255,255,255,.6)",
          height: 20,
          width: 40,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: 18,
          fontWeight: 700,
        }}>
        {rowState && rowDef ? scoreRow(rowState, rowDef) : score ?? 0}
      </div>
    </div>
  );
}

function QwixxScore({
  boardState,
  boardDef,
  penalty = 0,
}: {
  boardState: BoardState;
  boardDef: BoardDefinition;
  penalty: number;
}) {
  return (
    <div style={{ display: "flex" }}>
      {boardState.map((rowState, rowIndex) => (
        <React.Fragment key={rowIndex}>
          <QwixxScoreSquare
            color={colors[rowIndex]}
            rowState={rowState}
            rowDef={boardDef[rowIndex]}
          />
          <span key={rowIndex + "+"} style={{ fontSize: 18, fontWeight: 800 }}>
            {rowIndex < boardState.length - 1 ? "+" : "-"}
          </span>
        </React.Fragment>
      ))}

      {/* todo: add penalties */}
      <QwixxScoreSquare color='white' score={penalty} />
      <span style={{ fontSize: 18, fontWeight: 800 }}>=</span>
      <QwixxScoreSquare
        color='white'
        score={scoreQwixxBoard(boardState, boardDef) - penalty}
      />
    </div>
  );
}

function getLockedRows(players: BoardState[]) {
  const lockedRows = new Set<number>();
  players.forEach((player) => {
    player.forEach((rowState, rowIndex) => {
      if (rowState[0]) lockedRows.add(rowIndex);
    });
  });
  return lockedRows;
}

function getLockedColors(lockedRows: Set<number>, boardDef: BoardDefinition) {
  const lockedColors = new Set<Color>();
  lockedRows.forEach((rowIndex) => {
    const row = boardDef[rowIndex];
    lockedColors.add(row[row.length - 1].color);
  });
  return lockedColors;
}

function QwixxGame() {
  const [boardDef, setBoardDef] = React.useState(DefaultBoard);
  const [dice, setDice] = React.useState<number[] | undefined>();
  const [turn, setTurn] = React.useState(-1);
  const [players, setPlayers] = React.useState<BoardState[]>([
    createEmptyBoard(),
  ]);

  const lockedRows = getLockedRows(players);
  const lockedColors = getLockedColors(lockedRows, boardDef);

  // need to track who has penalities and has played this turn!

  const [penalties, setPenalties] = React.useState<number[]>([]);

  // const [plays, setPlays] = React.useState<

  const currentPlayer = players.length > 1 && turn % players.length;

  return (
    <div>
      {players.map((boardState, playerIndex) => {
        const isActive = playerIndex === currentPlayer;
        return (
          <div
            key={playerIndex}
            style={{
              border: isActive ? "3px solid red" : "3px solid grey",
              padding: 5,
              margin: 2,
              display: "inline-flex",
              alignItems: "center",
              // flexDirection: "column",
              background: isActive ? "rgb(200,200,200)" : undefined,
            }}>
            {/* <div style={{ fontSize: 24, marginBottom: 10 }}>
              Player {playerIndex + 1}
              {isActive ? " (Your turn!)" : null}
            </div> */}
            <div>
              <QwixxBoard
                lockedColors={lockedColors}
                turn={isActive}
                dice={trimDice(isActive, dice)}
                boardDef={boardDef}
                boardState={boardState}
                onClick={(clickData) => {
                  const newBoardState = updateBoardState(boardState, clickData);
                  const newPlayers = players.map((p) => copyBoardState(p));
                  newPlayers[playerIndex] = newBoardState;

                  // when locking or unlocking apply to all rows!
                  if (clickData.number === 0) {
                    newPlayers.forEach((player) => {
                      player[clickData.rowIndex][0] = clickData.checked;
                    });
                  }

                  setPlayers(newPlayers);
                }}
              />
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}>
                <QwixxScore
                  boardState={boardState}
                  boardDef={boardDef}
                  penalty={penalties[playerIndex]}
                />
                <ActionButton
                  compact
                  text='Pass'
                  onClick={() => {
                    if (isActive) {
                      const newPenalties = [...penalties];
                      newPenalties[playerIndex] =
                        (newPenalties[playerIndex] ?? 0) + 5;
                      setPenalties(newPenalties);
                    }
                  }}
                />
              </div>
            </div>
            {isActive ? (
              <div style={{ margin: 10, fontSize: 18 }}>Your turn!</div>
            ) : null}
          </div>
        );
      })}

      <div style={{ display: "flex" }}>
        {turn < 0 ? (
          <ActionButton
            text='Mixx board'
            onClick={() => {
              setBoardDef(MixxBoard);
            }}
          />
        ) : null}
        {turn < 0 ? (
          <ActionButton
            text='Default board'
            onClick={() => {
              setBoardDef(DefaultBoard);
            }}
          />
        ) : null}
        {turn < 0 ? (
          <ActionButton
            text='Add player'
            onClick={() => {
              setPlayers([...players, createEmptyBoard()]);
              setTurn(-1);
            }}
          />
        ) : null}
        {turn < 0 ? (
          <ActionButton
            text='Start'
            onClick={() => {
              setDice(undefined);
              setTurn(0);
            }}
          />
        ) : null}
        {turn >= 0 ? (
          <ActionButton
            text='Next player'
            onClick={() => {
              setDice(undefined);
              setTurn(turn + 1);
            }}
          />
        ) : null}
        {turn >= 0 ? (
          <QwixxDiceArea
            row
            dice={dice}
            setDice={setDice}
            lockedColors={lockedColors}
          />
        ) : null}
      </div>
    </div>
  );
}

enum Game {
  Qwixx,
}

function App() {
  const [game, chooseGame] = React.useState(Game.Qwixx);

  let content = (
    <div>
      <button
        onClick={() => {
          chooseGame(Game.Qwixx);
        }}>
        Qwixx
      </button>
    </div>
  );

  switch (game) {
    case Game.Qwixx:
      content = <QwixxGame />;
      break;
  }

  return content;
}

export default App;
