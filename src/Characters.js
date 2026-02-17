import './Characters.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ProgressContent from './ProgressContent';

function Characters() {

  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [sortKey, setSortKey] = useState('id');
  const [sortDirection, setSortDirection] = useState('desc');

  const searchCharacter = () => {
    fetchCharacters();
  }

  const handleSort = (key) => {
    if (sortKey === key) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortDirection('asc');
    }
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

    setData(filteredData);
    setIsLoading(false);
  }

  const characterItems = () => {
    if (isLoading) {
      return <tr><td colspan="6"><ProgressContent /></td></tr>
    }

    if (data) {
      const sortedData = [...data].sort((a, b) => {
        let aVal = a[sortKey];
        let bVal = b[sortKey];
        if (sortDirection === 'asc') {
          return aVal > bVal ? 1 : aVal < bVal ? -1 : 0;
        } else {
          return aVal < bVal ? 1 : aVal > bVal ? -1 : 0;
        }
      });

      return sortedData.map((character, index) => {
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
              <th onClick={() => handleSort('id')}>ID {sortKey === 'id' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
              <th onClick={() => handleSort('name')}>キャラクター名 {sortKey === 'name' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
              <th onClick={() => handleSort('species')}>種族 {sortKey === 'species' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
              <th onClick={() => handleSort('level')}>クラス＆レベル {sortKey === 'level' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
              <th onClick={() => handleSort('alignment')}>属性 {sortKey === 'alignment' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
              <th onClick={() => handleSort('player_name')}>プレイヤー名 {sortKey === 'player_name' ? (sortDirection === 'asc' ? '▲' : '▼') : ''}</th>
            </tr>
            {characterItems()}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Characters;
