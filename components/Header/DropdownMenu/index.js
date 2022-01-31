import React from 'react';

const DropdownMenu = ({ items, classnames }) => {
    return (
        <div className={classnames}>
            <ul>
                {items.map((item, i) => (
                    <li key={i}>
                       <a>{item.label}</a>
                    </li>
                ))}
            </ul>
        </div>
    );
}
 
export default DropdownMenu;