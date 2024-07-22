import React, { useState } from 'react';
import newBookStyles from './NewBook.module.css';

export default function NewBook() {
  const [formData, setFormData] = useState({
    gender: 'female',
    checkbox3: true,
  });

  const handleChange = (event) => {
    const { name, value, type } = event.target;
    if (type === 'checkbox') {
      setFormData((values) => ({ ...values, [name]: event.target.checked }));
    } else {
      setFormData((values) => ({ ...values, [name]: value }));
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    console.log('handleSubmit', formData);
  };

  return (
    <form onSubmit={handleSubmit} className={newBookStyles.root}>
      <label>
        Book Name:
        <input
          type="text"
          name="name"
          value={formData.name || ''}
          onChange={handleChange}
        />
      </label>
      <label>
        Book Description:
        <textarea
          name="description"
          value={formData.description}
          onChange={handleChange}
        />
      </label>
      <label>
        Book Publisher:
        <select
          name="publisher"
          value={formData.publisher}
          onChange={handleChange}
        >
          <option value="publisher1">Publisher1</option>
          <option value="publisher2">Publisher2</option>
          <option value="publisher3">Publisher3</option>
        </select>
      </label>
      <div>
        <label>
          <input
            type="radio"
            name="gender"
            value="male"
            checked={formData.gender === 'male'}
            onChange={handleChange}
          />
          Male
        </label>
        <label>
          <input
            type="radio"
            name="gender"
            value="female"
            checked={formData.gender === 'female'}
            onChange={handleChange}
          />
          Female
        </label>
      </div>

      <div>
        <label>
          <input
            type="checkbox"
            name="checkbox1"
            checked={formData.checkbox1}
            onClick={handleChange}
          />
          checkbox1
        </label>
        <label>
          <input
            type="checkbox"
            name="checkbox2"
            checked={formData.checkbox2}
            onClick={handleChange}
          />
          checkbox2
        </label>
        <label>
          <input
            type="checkbox"
            name="checkbox3"
            checked={formData.checkbox3}
            onClick={handleChange}
          />
          checkbox3
        </label>
      </div>

      <input type="submit" />
    </form>
  );
}
