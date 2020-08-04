import React from 'react';

import './douchebag-list.css';

function DouchebagList(props) {
  const douchebags = props.douchebags;

  const douchebagList = douchebags.map(
    douchebag => {
      return (
        <li className="douchebag" key={douchebag}>
          <span>{douchebag}</span>
          <button type="button" className="remove-douchebag" onClick={() => props.removeDouchebag(douchebag)}></button>
        </li>
      );
    }
  );

  return (
    <ul className="douchebags">
      {douchebagList}
    </ul>
  );
}

export default DouchebagList;
