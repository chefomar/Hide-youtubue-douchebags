import React, { useState, useEffect } from 'react';
import AddDouchebagForm from './add-douchebag-form/add-douchebag-form';
import DouchebagList from './douchebag-list/douchebag-list';
import { getDouchebags, saveDouchebag, deleteDouchebag } from './storage';
import './App.css';

function App() {
  const [douchebags, setDouchebags] = useState([]);

  const addDouchebagHandler = (douchebag) => {
    console.log('add' + douchebag);
    saveDouchebag(douchebag, () => setDouchebags([...douchebags, douchebag]));
  }

  const removeDouchebagHandler = (douchebag) => {
    console.log('remove' + douchebag);
    deleteDouchebag(douchebag, () => setDouchebags(douchebags.filter(douche => douche !== douchebag)));
  }

  useEffect(() => {
    getDouchebags(function(list) {
      console.log(list);
      setDouchebags([...list]);
    });
  }, []);

  return (
    <>
      <AddDouchebagForm addDouchebag={addDouchebagHandler}></AddDouchebagForm>
      <DouchebagList douchebags={douchebags} removeDouchebag={removeDouchebagHandler}></DouchebagList>
    </>
  );
}

export default App;
