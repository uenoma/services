import './Characters.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ProgressContent from './ProgressContent';

function Characters() {

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const searchCharacter = () => {
    fetchCharacters();
  }

  const selectedCharacter = (character) => {
    window.location.href = "https://dndhideout.com/dndcs2014/?id=" + character.id;
  }

  const fetchCharacters = async () => {
    setIsLoading(true);
    const api = "https://dndhideout.com/services/dnd_characters2014/public/api/characters"
    const response = await axios.get(api);

    const filter = document.getElementById("searchWord").value;

    let filteredData = response.data;
    if (filter.length > 0) {
      filteredData = response.data.filter(function (character) {
        if (character.name.indexOf(filter) >= 0 ||
          character.species.indexOf(filter) >= 0 ||
          character.level.indexOf(filter) >= 0 ||
          character.alignment.indexOf(filter) >= 0 ||
          character.player_name.indexOf(filter) >= 0) {
          return true;
        }
        return false
      });
    }

    const sortedData = filteredData.sort(function (a, b) {
      if (a.id < b.id) {
        return 1;
      } else if (a.id > b.id) {
        return -1;
      } else {
        return 0;
      }
    });

    setData(sortedData);
    setIsLoading(false);
  }

  const characterItems = () => {
    if (isLoading) {
      return <tr><td colspan="6"><ProgressContent /></td></tr>
    }

    if (data) {
      return data.map((character, index) => {
        return (
          <tr key={index} onClick={() => { selectedCharacter(character) }}>
            <td>{character.id}</td>
            <td>{character.name}</td>
            <td>{character.species}</td>
            <td>{character.level}</td>
            <td>{character.alignment}</td>
            <td>{character.player_name}</td>
          </tr>
        )
      })
    }
  }

  useEffect(() => {
    fetchCharacters();
  }, []);

  return (
    <div className="Characters">
      <h2>DnD Hideout Character Database</h2>
      <div className="CharactersHeader">
        <button onClick={() => { window.location.href = "https://dndhideout.com/dndcs2014/" }}>新規作成</button>
        <div>
          <input id="searchWord"></input><button onClick={() => { searchCharacter() }}>検索</button>
        </div>
      </div>
      <div className="CharactersBody">
        <table className="CharactersTable">
          <tbody>
            <tr>
              <th>ID</th>
              <th>キャラクター名</th>
              <th>種族</th>
              <th>クラス＆レベル</th>
              <th>属性</th>
              <th>プレイヤー名</th>
            </tr>
            {characterItems()}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Characters;
