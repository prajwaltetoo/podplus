import React, { useState } from 'react';
import './style.css'
import { TiDelete } from "react-icons/ti";

const MultiSelect = ({ options, setOptions, selectedOptions, setSelectedOptions, text }) => {
    const [searchInput, setSearchInput] = useState('');
    const [focused, setFocused] = useState(false);

    const handleSearchChange = (event) => {
        setSearchInput(event.target.value);
    };

    const handleOptionClick = (option) => {
        setSelectedOptions([...selectedOptions, option]);
    };

    const handleRemoveOption = (option) => {
        setSelectedOptions(selectedOptions.filter(item => item !== option));
    };

    const filteredOptions = options.filter(option => !selectedOptions.includes(option))

    return (
        <div className={`multi-select ${focused && 'focused'}`}>
            <div className='selected-box'>
                {selectedOptions.map(option => (
                    <div key={option} className='selected-option'>
                        {option}
                        <TiDelete onClick={() => handleRemoveOption(option)} />
                    </div>
                ))}
                <input
                    onFocus={() => setFocused(true)}
                    onBlur={() => setTimeout(() => {
                        setFocused(false)
                    }, 200)}
                    type="search"
                    placeholder={text}
                    value={searchInput}
                    onChange={handleSearchChange}
                />
            </div>
            {focused && <div className='dropdown'>
                {filteredOptions
                .filter(option => option.toLowerCase().includes(searchInput.toLowerCase()))
                .map(option => (
                    <div className='option' key={option} onClick={() => handleOptionClick(option)}>
                        {option}
                    </div>
                ))}
            </div>}
        </div>
    );
};

export default MultiSelect;
