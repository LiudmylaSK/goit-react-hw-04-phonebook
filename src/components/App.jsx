
import React, { useState, useEffect } from 'react';
import { nanoid } from 'nanoid';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Confirm } from 'notiflix/build/notiflix-confirm-aio';
import { MdContactPhone } from 'react-icons/md';
import css from './App.module.css';

import { ContactForm } from './ContactForm/ContactForm';
import { ContactsList } from './ContactsList/ContactsList';
import { SearchFilter } from './SearchFilter/SearchFilter';

Notify.init({
  borderRadius: '10px',
  position: 'center-top',
  width: '300px',
  timeout: 4000,
  clickToClose: true,
  cssAnimationStyle: 'zoom',
  info: {
    background: '#f2e230',
    textColor: '#00f',
  },
});

export const App = () => {
  const [contacts, setContacts] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const savedContacts = JSON.parse(localStorage.getItem('contacts')) || [];
    setContacts(savedContacts);
  }, []);

  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  const addContact = ({ name, number }) => {
    const normalizedName = name.toLowerCase();

    if (contacts.some((contact) => contact.name.toLowerCase() === normalizedName)) {
      return Notify.info(`${name} is already in your contacts`);
    }

    const contact = {
      name,
      number,
      id: nanoid(),
    };

    setContacts((prevContacts) => [...prevContacts, contact]);

    Notify.success(`${name} has been successfully added to your contacts`);
  };

  const onDeleteContact = (contactId) => {
    Confirm.show(
      'Confirm',
      'Are you sure you want to delete this contact?',
      'Yes',
      'No',
      () => {
        setContacts((prevContacts) => prevContacts.filter((contact) => contact.id !== contactId));
        Notify.success('The contact has been successfully deleted');
      },
      () => {
        Notify.info('The deletion has been cancelled');
      }
    );
  };

  const filterChange = (event) => {
    setFilter(event.currentTarget.value);
  };

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className={css.container}>
      <h1 className={css.mainTitle}>
        <MdContactPhone className={css.iconContact} />
        Phonebook
      </h1>
      <ContactForm onSubmit={addContact} />
      <h2 className={css.contactsTitle}>Contacts</h2>
      <SearchFilter value={filter} onChange={filterChange} />
      {filteredContacts.length > 0 ? (
        <ContactsList contacts={filteredContacts} onDeleteContact={onDeleteContact} />
      ) : (
        <p className={css.noContactsText}>There are no contacts in the Phonebook</p>
      )}
    </div>
  );
};


