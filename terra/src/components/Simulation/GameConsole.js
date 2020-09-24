import React, { useState } from 'react';

export function GameConsole( {generalMessages, battleMessages, actionMessages}){

    const [consoleType, setConsoleType] = useState('General');

    function changeConsoleType(type){
        setConsoleType(type);
    }

    //returns a copy of the array of console messages for that type
    function getSelectedConsoleMessages(consoleType){
        let consoleMessages = [];

        switch(consoleType){
            case 'General':
                consoleMessages = [...generalMessages];
                break;
            case 'Battle':
                consoleMessages = [...battleMessages];
                break;
            case 'Action':
                consoleMessages = [...actionMessages];
                break;
            default:
                consoleMessages = [...generalMessages];
        }

        return consoleMessages;

    }

    function renderConsoleMessages(){        
        
        let consoleMessages = [];

        switch(consoleType){
            case 'General':
                consoleMessages = getSelectedConsoleMessages('General');
                break;
            case 'Battle':
                consoleMessages = getSelectedConsoleMessages('Battle');
                break;
            case 'Action':
                consoleMessages = getSelectedConsoleMessages('Action');
                break;
            default:
                consoleMessages = getSelectedConsoleMessages('General');
                break;

        }
                
        return(
            consoleMessages.map((item, index) =>
                <li key={index}>
                    {item.timeStamp + " " + item.message}
                </li>
            )
        )
        
        
    }

    return(
        <div className="gameConsole">
                <div className="consoleButtons">
                    <button onClick={() => changeConsoleType('General')}>General</button>
                    <button onClick={() => changeConsoleType('Battle')}>Battle</button>
                    <button onClick={() => changeConsoleType('Action')}>Action</button>
                </div>
            <div className="consoleMessages">
                <ul>
                    {renderConsoleMessages()}
                </ul>
            </div>
        </div>
    );
}