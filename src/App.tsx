import React from "react";
import "./App.css";

type RowColor = "red" | "yellow" | "green" | "blue";
const rowColors: ReadonlyArray<RowColor> = ["red", "yellow", "green", "blue"];

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
const ColorMap: ReadonlyMap<RowColor, string> = new Map([
  ["red", "red"],
  ["yellow", "yellow"],
  ["green", "green"],
  ["blue", "blue"],
]);

type RowDefinition = number[];
type BoardDefinition = { [color: string]: RowDefinition };

const DefaultBoard: BoardDefinition = {
  red: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 0],
  yellow: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 0],
  green: [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 0],
  blue: [12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 0],
};

// Row key should be 2-12 and "LOCKED" is 0
type RowState = { [key: number]: boolean };
type BoardState = { [color: string]: RowState };

function textColor(backgroundColor: string) {
  // TODO this is not very good.
  return backgroundColor === "yellow" || backgroundColor === "white"
    ? "black"
    : "white";
}

// We are treating 0 as locked!
interface ClickData {
  number: number;
  color: string;
  checked: boolean;
}

function QwixxRowButton({
  color,
  number,
  checked,
  locked,
  highlighted,
  onClick,
}: {
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
    <button
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background,
        color: getColor(color),
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
        onClick({ color, number, checked: !checked });
      }}>
      {number || "🔒"}
    </button>
  );
}

function isLaterSelected(
  rowDef: RowDefinition,
  rowState: RowState,
  number: number
) {
  // we want to check if any LATER number is selected.
  let isLater = false;
  for (let n of rowDef) {
    if (isLater && rowState[n]) {
      return true;
    }
    if (n === number) {
      isLater = true;
    }
  }

  return false;
}

type RowHightlightState = { [number: number]: boolean };
function QwixxRow({
  color,
  rowDef,
  rowState,
  rowHighlights,
  onClick,
}: {
  color: string;
  rowDef: RowDefinition;
  rowState: RowState;
  rowHighlights?: RowHightlightState;
  onClick: (clickData: ClickData) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        background: getColor(color),
        padding: 5,
        marginBottom: 5,
      }}>
      {rowDef.map((number) => (
        <QwixxRowButton
          color={color}
          number={number}
          checked={rowState[number]}
          locked={isLaterSelected(rowDef, rowState, number)}
          highlighted={rowHighlights ? rowHighlights[number] : false}
          onClick={onClick}
        />
      ))}
    </div>
  );
}

function createEmptyBoard(): BoardState {
  return {
    red: {},
    yellow: {},
    green: {},
    blue: {},
  };
}

function validPlaySpots(board: BoardState, dice: number[]) {
  // first two dice are the white ones.
  const whiteNumber = dice[0] + dice[1];

  // for each row see if there are are playable spots.
  const plays: BoardState = {};
  for (const color in board) {
    // can play either the white number or either white + the dice of that color
  }
}

function getHighlightState(dice: number[], color: string): RowHightlightState {
  const state: RowHightlightState = {};
  const roll = getDiceRoll(dice);

  state[roll.white] = true;
  for (const i of (roll as unknown as { [color: string]: number[] })[color]) {
    state[i] = true;
  }

  return state;
}

function QwixxBoard({
  dice,
  turn,
  boardDef,
  boardState,
  onClick,
}: {
  dice?: number[];
  turn?: boolean;
  boardDef: BoardDefinition;
  boardState: BoardState;
  onClick: (clickData: ClickData) => void;
}) {
  return (
    <div>
      {rowColors.map((color, index) => (
        <QwixxRow
          color={color}
          key={index}
          rowDef={boardDef[color]}
          rowState={boardState[color]}
          rowHighlights={dice ? getHighlightState(dice, color) : undefined}
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

const diceColors: ReadonlyArray<string> = ["white", "white", ...rowColors];

interface DiceRoll {
  white: number;
  red: number[];
  yellow: number[];
  green: number[];
  blue: number[];
}

function getDiceRoll(dice: number[]): DiceRoll {
  return {
    white: dice[0] + dice[1],
    red: [dice[0] + dice[2], dice[1] + dice[2]],
    yellow: [dice[0] + dice[3], dice[1] + dice[3]],
    green: [dice[0] + dice[4], dice[1] + dice[4]],
    blue: [dice[0] + dice[5], dice[1] + dice[5]],
  };
}

function QwixxDiceValue({
  color,
  numbers,
}: {
  color: string;
  numbers: number[];
}) {
  return (
    <span
      style={{
        background: getColor(color),
        color: color === "white" ? "black" : "white",
        fontWeight: 700,
        fontSize: 18,
        padding: 5,
        margin: 2,
      }}>
      {numbers[0]}
      {numbers[0] !== numbers[1] && numbers[1] ? `, ${numbers[1]}` : null}
    </span>
  );
}

function QwixxDiceValues({ dice }: { dice: number[] }) {
  const roll = getDiceRoll(dice);
  return (
    <div>
      <QwixxDiceValue color='white' numbers={[roll.white]} />
      {rowColors.map((color) => (
        <QwixxDiceValue color={color} numbers={(roll as any)[color]} />
      ))}
    </div>
  );
}

function QwixxDice({ dice }: { dice: number[] }) {
  return (
    <div style={{ display: "flex", margin: 5 }}>
      {dice.map((die, index) => (
        <QwixxDie color={diceColors[index]} number={die} />
      ))}
    </div>
  );
}

function QwixxDiceAreaDummy() {
  const [dice, setDice] = React.useState<number[] | undefined>();
  return <QwixxDiceArea dice={dice} setDice={setDice} row={true} />;
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
}: {
  dice?: number[];
  setDice: (dice: number[]) => void;
  row?: boolean;
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
      {dice ? <QwixxDice dice={dice} /> : null}
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
  { color, number, checked }: ClickData
): BoardState {
  boardState = copyBoardState(boardState);
  boardState[color][number] = checked;
  return boardState;
}

function QwixxPlayer({ turn }: { turn?: boolean }) {
  const [boardDef, setBoardDef] = React.useState(DefaultBoard);
  const [dice, setDice] = React.useState<number[] | undefined>();

  const [boardState, setBoardState] = React.useState<BoardState>(
    createEmptyBoard()
  );

  return (
    <div
      style={{
        margin: 10,
        border: "1px solid grey",
        padding: 10,
        display: "flex",
        alignItems: "center",
      }}>
      <QwixxBoard
        turn={turn}
        dice={dice}
        boardState={boardState}
        boardDef={boardDef}
        onClick={(clickData) => {
          setBoardState(updateBoardState(boardState, clickData));
        }}
      />

      <QwixxDiceArea dice={dice} setDice={setDice} />
    </div>
  );
}

function trimDice(isActive: boolean, dice?: number[]) {
  if (isActive) return dice;
  if (!dice || dice.length <= 2) return dice;

  return [dice[0], dice[1]];
}

function scoreRow(rowState: RowState, rowDef: RowDefinition): number {
  let score = 0;
  let count = 0;
  for (let n of rowDef) {
    // if n is 0, this is the LOCK, so it only counts if at least 6! others are already pressed
    if (n === 0 && count < 6) continue;
    if (rowState[n]) score += ++count;
  }

  return score;
}

function scoreQwixxBoard(
  boardState: BoardState,
  boardDef: BoardDefinition
): number {
  let score = 0;

  rowColors.forEach((color) => {
    score += scoreRow(boardState[color], boardDef[color]);
  });

  return score;
}

function QwixxScoreSquare({
  color,
  boardState,
  boardDef,
  score,
}: {
  color: string;
  boardState?: BoardState;
  boardDef: BoardDefinition;
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
        {boardState ? scoreRow(boardState[color], boardDef[color]) : score ?? 0}
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
      {rowColors.map((color) => (
        <>
          <QwixxScoreSquare
            color={color}
            boardState={boardState}
            boardDef={boardDef}
          />
          <span style={{ fontSize: 18, fontWeight: 800 }}>
            {color !== "blue" ? "+" : "-"}
          </span>
        </>
      ))}

      {/* todo: add penalties */}
      <QwixxScoreSquare color='white' score={penalty} boardDef={boardDef} />
      <span style={{ fontSize: 18, fontWeight: 800 }}>=</span>
      <QwixxScoreSquare
        color='white'
        boardDef={boardDef}
        score={scoreQwixxBoard(boardState, boardDef) - penalty}
      />
    </div>
  );
}

function QwixxGame() {
  const [boardDef, setBoardDef] = React.useState(DefaultBoard);
  const [dice, setDice] = React.useState<number[] | undefined>();
  const [turn, setTurn] = React.useState(-1);
  const [players, setPlayers] = React.useState<BoardState[]>([
    createEmptyBoard(),
  ]);

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
                turn={isActive}
                dice={trimDice(isActive, dice)}
                boardDef={DefaultBoard}
                boardState={boardState}
                onClick={(clickData) => {
                  const newBoardState = updateBoardState(boardState, clickData);
                  const newPlayers = players.map((p) => copyBoardState(p));
                  newPlayers[playerIndex] = newBoardState;
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
        <ActionButton
          text='Add player'
          onClick={() => {
            setPlayers([...players, createEmptyBoard()]);
            setTurn(-1);
          }}
        />
        {players.length > 1 ? (
          <ActionButton
            text='Next player'
            onClick={() => {
              setDice(undefined);
              setTurn(turn + 1);
            }}
          />
        ) : null}
        <QwixxDiceArea row dice={dice} setDice={setDice} />
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
