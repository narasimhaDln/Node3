import axios from "axios";
import { useEffect, useState } from "react";
import { useGameContext } from "../context/GameContext";

export function Leaderboard() {
  const { gameFinished } = useGameContext();
  const [rankings, setRankings] = useState([]);

  useEffect(() => {
    async function fetchAndSetRankings() {
      try {
        const response = await axios.get("http://localhost:3000/score");
        const dataArray = response.data.data;

        const rankingArray = dataArray.map((item) => {
          return [item.userId, item.value]; // Store as a tuple (array of [string, number])
        });
        rankingArray.sort((a, b) => b[1] - a[1]);
        const topTenRankings = rankingArray.slice(0, 10);
        setRankings(topTenRankings);
      } catch (error) {
        if (error instanceof Error) {
          console.log(error.message);
        } else {
          console.error("An unexpected error occurred", error);
        }
      }
    }

    fetchAndSetRankings();
  }, [gameFinished]);

  return (
    <div className="leaderboard-container">
      <h2>Leaderboard</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {rankings.map((ranking, index) => (
            <tr key={index}>
              <td>{ranking[0]}</td>
              <td>{ranking[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Leaderboard;
