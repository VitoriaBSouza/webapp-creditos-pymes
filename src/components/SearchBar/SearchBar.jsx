import './SearchBar.css';

//icons
//Icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons'

export default function SearchBar({ 
  placeholder = "Buscar...", 
  value = "", 
  onChange,
  className = ""
}) {
  
  return (
    <div className={`search-bar-container ${className}`}>
      <div className="search-bar-wrapper">
        <input
          type="text"
          className="search-bar-input border rounded-pill p-2 ps-3"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        <button className="search-bar-icon" type="button">
          <FontAwesomeIcon icon={faMagnifyingGlass} />
        </button>
      </div>
    </div>
  );
}