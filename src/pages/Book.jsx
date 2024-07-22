import React from 'react';
import { useParams, useOutletContext } from 'react-router-dom';

export default function Book() {
  const { id } = useParams();
  const context = useOutletContext();

  return (
    <div>
      <p>Book id: {id}</p>
      <p>context: {context?.hello}</p>
    </div>
  );
}
