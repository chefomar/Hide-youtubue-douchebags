import React, { useState } from 'react';

import './add-douchebag-from.css';

function AddDouchebagForm(props) {
  const [douchebag, setDouchebag] = useState('');

  const handleChange = (event) => {
    setDouchebag(event.target.value);
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    props.addDouchebag(douchebag);

    event.target.reset();
  }

  return (
    <form onSubmit={handleSubmit} className="douchebag-form">
      <input onChange={handleChange} type="text" placeholder="type the channel name.." className="form__input" name="douchebag" required></input>
      <button type="submit" className="form__submit">+</button>
    </form>
  );
}

export default AddDouchebagForm;
