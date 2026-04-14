import React, { useState } from 'react';
import { Navbar, Container, Nav, Button, Modal, Form } from 'react-bootstrap';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

function LandingPage() {
  const [showAuth, setShowAuth] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  
  // Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');


  const handleShow = (loginMode) => {
    setIsLogin(loginMode);
    setShowAuth(true);
  };

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (isLogin) {
        // Just sign in
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // 1. Create the new user account
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        // 2. NEW: Save the user's email to a searchable Firestore document
        // We use setDoc with user.uid so the document ID matches their Auth ID
        await setDoc(doc(db, 'users', user.uid), {
          email: email.toLowerCase().trim(),
          uid: user.uid,
          createdAt: new Date().toISOString()
        });
      }
      setShowAuth(false); 
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-vh-100 bg-dark text-light" data-bs-theme="dark">
      {/* Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="border-bottom border-secondary">
        <Container>
          <Navbar.Brand href="#" className="fw-bold fs-4">Super Awesome Group</Navbar.Brand>
          <Nav className="ms-auto gap-2">
            <Button variant="outline-light" onClick={() => handleShow(true)}>Log In</Button>
            <Button variant="primary" onClick={() => handleShow(false)}>Create Account</Button>
          </Nav>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <Container className="text-center py-5 mt-5">
        <h1 className="display-2 fw-bold mb-4">Group Project Dashboard</h1>
        
      </Container>

      {/* Auth Modal */}
      <Modal show={showAuth} onHide={() => setShowAuth(false)} centered data-bs-theme="dark">
        <Modal.Header closeButton className="border-secondary bg-dark">
          <Modal.Title>{isLogin ? 'Welcome Back' : 'Create Your Account'}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="p-4 bg-dark text-light">
          {error && <div className="alert alert-danger small p-2">{error}</div>}
          <Form onSubmit={handleAuthSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email Address</Form.Label>
              <Form.Control 
                type="email" 
                className="bg-dark text-light border-secondary"
                placeholder="name@example.com" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control 
                type="password" 
                className="bg-dark text-light border-secondary"
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="w-100 py-2 mt-2 fw-bold">
              {isLogin ? 'Log In' : 'Sign Up'}
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer className="justify-content-center border-0 pb-4">
          <p className="small mb-0 text-secondary">
            {isLogin ? "Don't have an account?" : "Already have an account?"}
            <Button variant="link" className="p-0 ms-1 text-primary text-decoration-none fw-bold" onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Create one here' : 'Log in here'}
            </Button>
          </p>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default LandingPage;