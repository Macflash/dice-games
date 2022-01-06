import React from "react";

function YahtzeeRow({
  name,
  score,
  possibleScore,
  onClick,
}: {
  name: string;
  score?: number;
  possibleScore?: number;
  onClick?: () => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        // height: 40,
        border: "2px solid black",
      }}>
      <div
        style={{
          outline: "2px solid black",
          minWidth: 50,
          padding: "0 3px",
          height: 40,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
        {name}
      </div>
      <div
        style={{
          outline: "2px solid black",
          height: 40,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}>
        {score !== undefined ? (
          score
        ) : (
          <button
            style={{
              cursor: "pointer",
              borderRadius: 0,
              background: possibleScore ? "rgb(150,250,250)" : undefined,
              color: possibleScore ? undefined : "grey",
            }}
            onClick={onClick}>
            {possibleScore ?? 0}
          </button>
        )}
      </div>
    </div>
  );
}

function NumberRow({
  number,
  name,
  score,
  onScore,
  dice,
}: {
  dice: number[];
  number: number;
  name: string;
  score?: number;
  onScore: (score: number) => void;
}) {
  const possibleScore = scoreNumber(dice, number);
  return (
    <YahtzeeRow
      name={name}
      score={score}
      onClick={() => {
        onScore(possibleScore);
      }}
      possibleScore={possibleScore}
    />
  );
}

interface YahzteeScore {
  readonly upper: ReadonlyArray<number>;

  readonly threekind?: number;
  readonly fourkind?: number;

  readonly fullhouse?: boolean;
  readonly smstraight?: boolean;
  readonly lgstraight?: boolean;
  readonly yahtzee: number;
  readonly chance?: number;
}

function scoreNumber(dice: number[], number: number): number {
  let score = 0;
  dice.forEach((d) => {
    if (d === number) {
      score += number;
    }
  });
  return score;
}

function UpperSection({
  score,
  setScore,
  dice,
}: {
  dice: number[];
  score: YahzteeScore;
  setScore: (newScore: YahzteeScore) => void;
}) {
  let subTotal = 0;
  score.upper.forEach((s) => {
    if (s) subTotal += s;
  });

  let bonus = 0;
  if (subTotal >= 63) bonus = 35;

  const total = subTotal + bonus;

  return (
    <div>
      <div style={{ margin: 5 }}>Upper Section</div>
      <div style={{ display: "flex", margin: 2 }}>
        {[1, 2, 3, 4, 5, 6].map((number) => (
          <NumberRow
            name={number + ""}
            number={number}
            score={score.upper[number]}
            dice={dice}
            onScore={(newScore) => {
              const upper = [...score.upper];
              upper[number] = newScore;
              setScore({ ...score, upper });
            }}
          />
        ))}

        <YahtzeeRow name='Subtotal' score={subTotal} />
        <YahtzeeRow name='Bonus' score={bonus ?? 0} />
        <YahtzeeRow name='Total' score={total ?? 0} />
      </div>
    </div>
  );
}

function sumDice(dice: number[]): number {
  let sum = 0;
  dice.forEach((d) => {
    if (d) sum += d;
  });
  return sum;
}

function countDice(dice: number[]): Map<number, number> {
  const counts = new Map<number, number>([
    [0, 0],
    [1, 0],
    [2, 0],
    [3, 0],
    [4, 0],
    [5, 0],
    [6, 0],
  ]);

  dice.forEach((d) => {
    counts.set(d, (counts.get(d) || 0) + 1);
  });

  return counts;
}

function scoreKind(dice: number[], kind: number): number {
  let hasKind = false;
  const counts = countDice(dice);
  counts.forEach((count, number) => {
    if (number && count >= kind) hasKind = true;
  });

  return hasKind ? sumDice(dice) : 0;
}

//lg is 40, sm is 30
function scoreStraight(dice: number[], length: number, score: number): number {
  const counts = countDice(dice);
  for (let start = 1; start < 6; start++) {
    let straightCount = 0;
    for (let current = start; current <= 6; current++) {
      if (counts.get(start) || 0 < 1) {
        // not a straight anymore!
        continue;
      }
      straightCount++;
      if (straightCount >= length) {
        return score;
      }
    }
  }

  return 0;
}

function LowerSection({
  score,
  setScore,
  dice,
}: {
  dice: number[];
  score: YahzteeScore;
  setScore: (newScore: YahzteeScore) => void;
}) {
  return (
    <div>
      <div style={{ margin: 5 }}>Lower Section</div>
      <div style={{ display: "flex", margin: 2 }}>
        <YahtzeeRow
          name='3 kind'
          score={score.threekind}
          possibleScore={scoreKind(dice, 3)}
          onClick={() => {
            setScore({ ...score, threekind: scoreKind(dice, 3) });
          }}
        />
        <YahtzeeRow
          name='4 kind'
          score={score.fourkind}
          possibleScore={scoreKind(dice, 4)}
          onClick={() => {
            setScore({ ...score, threekind: scoreKind(dice, 4) });
          }}
        />

        <YahtzeeRow name='Full House' />

        <YahtzeeRow name='Sm Straight' score={score.smstraight && } />
        <YahtzeeRow name='Lg straight' />

        <YahtzeeRow name='Yahtzee' />
        <YahtzeeRow name='Chance' />

        <YahtzeeRow name='Subtotal' score={0} />
        <YahtzeeRow name='Grand Total' score={0} />
      </div>
    </div>
  );
}

function YahzteeDie({
  number,
  onClick,
}: {
  number: number;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      style={{
        background: number || "grey",
        cursor: onClick ? "pointer" : "not-allowed",
        margin: 2,
        fontSize: 20,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: 45,
        width: 45,
        border: "2px solid black",
        borderRadius: 6,
      }}>
      {number || ""}
    </div>
  );
}

function roll() {
  return Math.floor(Math.random() * 6) + 1;
}

function YahtzeeDice({
  dice,
  setDice,
  done,
  addRoll,
}: {
  done: boolean;
  dice: number[];
  setDice: (newDice: number[]) => void;
  addRoll: () => void;
}) {
  return (
    <div style={{ display: "flex" }}>
      {dice.map((number, index) => (
        <YahzteeDie
          number={number}
          onClick={
            done
              ? undefined
              : () => {
                  // set it to 0
                  console.log("clear", index);
                  const newDice = [...dice];
                  newDice[index] = 0;
                  setDice(newDice);
                }
          }
        />
      ))}
      <button
        disabled={done}
        style={{
          width: 50,
          margin: 10,
          fontSize: 16,
          cursor: done ? "not-allowed" : "pointer",
        }}
        onClick={
          done
            ? undefined
            : () => {
                // if no 0's dont do anything
                if (dice.filter((d) => !d).length == 0) return;

                //re roll all 0 dice
                const newDice = dice.map((d) => d || roll());
                setDice(newDice);
                addRoll();
              }
        }>
        Roll
      </button>
    </div>
  );
}

export function YahtzeeGame() {
  const [score, setScore] = React.useState<YahzteeScore>({
    upper: [],
    yahtzee: 0,
  });

  const [dice, setDice] = React.useState([0, 0, 0, 0, 0]);
  const [rolls, setRolls] = React.useState(0);

  const setScoreAndClearDice = React.useCallback(
    (newScore: YahzteeScore) => {
      setScore(newScore);
      setDice([0, 0, 0, 0, 0]);
      setRolls(0);
    },
    [setScore, setDice, setRolls]
  );

  return (
    <div>
      <UpperSection score={score} setScore={setScoreAndClearDice} dice={dice} />
      <LowerSection score={score} setScore={setScoreAndClearDice} dice={dice} />
      <YahtzeeDice
        dice={dice}
        setDice={setDice}
        addRoll={() => setRolls(rolls + 1)}
        done={rolls > 2}
      />
    </div>
  );
}
