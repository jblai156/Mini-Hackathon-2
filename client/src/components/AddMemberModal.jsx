import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { db } from '../firebase';
import { collection, query, where, getDocs, doc, updateDoc, arrayUnion } from 'firebase/firestore';

function AddMemberModal({ onClose, activeProjectId }) {
  const [searchEmail, setSearchEmail] = useState('');
  const [status, setStatus] = useState({ type: '', msg: '' });

  const handleAddMember = async (e) => {
    e.preventDefault();
    setStatus({ type: '', msg: '' });

    try {
      // 1. Search for the user by email
      const usersRef = collection(db, 'users');
      const q = query(usersRef, where("email", "==", searchEmail.toLowerCase().trim()));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.empty) {
        setStatus({ type: 'danger', msg: 'User not found. They must sign up first!' });
        return;
      }

      const newMemberUid = querySnapshot.docs[0].id;

      // 2. Add them to the shared project's members array
      const projectRef = doc(db, 'projects', activeProjectId); 
      await updateDoc(projectRef, {
      members: arrayUnion(newMemberUid)
      });


      setStatus({ type: 'success', msg: 'Member added successfully!' });
      setTimeout(onClose, 1500);
    } catch (err) {
      setStatus({ type: 'danger', msg: 'Error: ' + err.message });
    }
  };

  return (
    <Modal show onHide={onClose} centered data-bs-theme="dark">
      <Modal.Header closeButton className="bg-dark text-light border-secondary">
        <Modal.Title>Add Project Member</Modal.Title>
      </Modal.Header>
      <Modal.Body className="bg-dark text-light">
        {status.msg && <Alert variant={status.type}>{status.msg}</Alert>}
        <Form onSubmit={handleAddMember}>
          <Form.Group className="mb-3">
            <Form.Label>User Email</Form.Label>
            <Form.Control 
              type="email" 
              placeholder="friend@example.com"
              value={searchEmail}
              onChange={(e) => setSearchEmail(e.target.value)}
              required
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">Search & Add</Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
}

export default AddMemberModal;