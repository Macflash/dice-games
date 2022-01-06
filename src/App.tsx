import React from "react";
import "./App.css";
import { QwixxGame } from "./games/qwixx";
import { YahtzeeGame } from "./games/yahtzee";

enum Game {
  SelectGame,
  Qwixx,
  Yahtzee,
}

function App() {
  const [game, chooseGame] = React.useState(Game.SelectGame);

  let content = (
    <div>
      <button
        onClick={() => {
          chooseGame(Game.Qwixx);
        }}>
        Qwixx
      </button>
      <button
        onClick={() => {
          chooseGame(Game.Yahtzee);
        }}>
        Yahtzee
      </button>
    </div>
  );

  switch (game) {
    case Game.Qwixx:
      content = <QwixxGame />;
      break;

    case Game.Yahtzee:
      content = <YahtzeeGame />;
      break;
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          padding: 2,
          border: "1px solid black",
          cursor: "pointer",
          position: "absolute",
          top: 0,
          right: 0,
        }}
        onClick={() => chooseGame(Game.SelectGame)}>
        ⬅️ Back
      </div>
      {content}
    </div>
  );
}

export default App;
