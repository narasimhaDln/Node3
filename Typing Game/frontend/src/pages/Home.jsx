import Logo from "../components/Logo.jsx";
import Info from "../components/Info.jsx";
import WordBox from "../components/WordBox.jsx";
import "../style.css";
import { GameContextProvider } from "../context/GameContext.jsx";
import { NewGameButton } from "../components/NewGameButton.jsx";
import Leaderboard from "../components/Leaderboard.jsx";

function Home() {
  return (
    <GameContextProvider>
      <div className="main-container">
        <div className="game-container">
          <div className="game">
            <Logo />
            <div className="flex-container">
              <Info />
              <NewGameButton />
            </div>
            <WordBox />
          </div>
          <Leaderboard />
        </div>
      </div>
    </GameContextProvider>
  );
}

export default Home;
