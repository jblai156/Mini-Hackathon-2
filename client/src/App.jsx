import { useState, useEffect } from 'react'
import { auth, db } from './firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, query, where, getDocs, deleteDoc, doc, onSnapshot } from 'firebase/firestore';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import AddMemberModal from './components/AddMemberModal';
import ProjectCreationModal from './components/ProjectCreationModal.jsx';
import LandingPage from './views/LandingPage';
import BoardView from './views/BoardView';
import CalendarView from './views/CalendarView.jsx';
import ChatView from './views/ChatView';

function App() {

  const [projectOn, setProjectOn] = useState(false);
  const [activeProjectId, setActiveProjectId] = useState(null); 
  const [showWarning, setShowWarning] = useState(false);
  const [activeView, setActiveView] = useState('board');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showProjectModal, setShowProjectModal] = useState(false);
  const [showMemberModal, setShowMemberModal] = useState(false);


  const handleReset = async () => {
    if (!activeProjectId) return;

    if (window.confirm("Delete this shared project for everyone?")) {
      try {
        // 1. Delete all tasks in the subcollection first
        const tasksRef = collection(db, 'projects', activeProjectId, 'tasks');
        const snapshot = await getDocs(tasksRef);
        const deletePromises = snapshot.docs.map(docSnap => deleteDoc(docSnap.ref));
        await Promise.all(deletePromises);
        
        // 2. Delete the main project document
        await deleteDoc(doc(db, 'projects', activeProjectId));
        
        // The onSnapshot in App.jsx will see the project is gone and reset the UI automatically
        setShowWarning(false);
      } catch (error) {
        console.error("Delete failed:", error);
        alert("Permission denied: Only the project owner can delete the project.");
      }
    }
  };

 // 1. AUTH LISTENER (The one you accidentally erased)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // 2. PROJECT LISTENER (The collaborative one)
  useEffect(() => {
    if (!user) {
      setActiveProjectId(null);
      setProjectOn(false);
      return;
    }

    const projectsRef = collection(db, 'projects');
    const q = query(projectsRef, where("members", "array-contains", user.uid));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (!snapshot.empty) {
        // Get the first project where you are a member
        const projectDoc = snapshot.docs[0]; 
        setActiveProjectId(projectDoc.id);
        setProjectOn(true);
      } else {
        setActiveProjectId(null);
        setProjectOn(false);
      }
    }, (err) => {
      // FIX: This error handler prevents the "Uncaught Error" crash
      console.error("Firebase Rule Error:", err.message);
    });

    return () => unsubscribe();
  }, [user]);  

  const handleLogout = () => {
    signOut(auth);
    setProjectOn(false); // Reset UI state on logout
  };

  // 4. THE GUARDS: If loading or not logged in, stop here and show LandingPage
  if (loading) return <div className="bg-dark min-vh-100"></div>;
  if (!user) return <LandingPage />; 

  return (
    /* vh-100 prevents the whole page from scrolling; instead, we scroll individual sections */
    <div className="d-flex vh-100 bg-dark text-light" data-bs-theme="dark">
      
      {/* SIDEBAR */}
      <div 
        className="bg-dark border-end border-secondary p-3 d-flex flex-column h-100 sticky-top" 
        style={{ width: '280px', minWidth: '280px' }}
      >
        <div className="mb-4 px-2">
          <h4 className="fw-bold text-primary">Super Awesome Group</h4>
          <hr className="border-secondary" />
        </div>

        {/* Navigation section - flex-grow-1 pushes the bottom actions down */}
        <div className="d-flex flex-column gap-2">
          {!projectOn ? (
            <button 
              className="btn btn-primary w-100 py-3 fw-bold" 
              onClick={() => setShowProjectModal(true)} // This uses setShowProjectModal
            >
              <i className="bi bi-plus-circle me-2"></i>Add Project
            </button>
          ) : (
            <>
              <button className="btn btn-info w-100 mb-4 fw-bold" onClick={() => setShowMemberModal(true)}>
                <i className="bi bi-person-plus me-2"></i>Add Members
              </button>
              
              <p className="text-uppercase small fw-bold text-secondary px-2 mb-1">Views</p>
              <button 
                className={`btn w-100 text-start ${activeView === 'board' ? 'btn-primary' : 'btn-dark'}`} 
                onClick={() => setActiveView('board')}
              >
                <i className="bi bi-kanban me-2"></i>Board
              </button>
              
              <button 
                className={`btn w-100 text-start py-2 ${activeView === 'calendar' ? 'btn-primary' : 'btn-dark'}`} 
                onClick={() => setActiveView('calendar')}
              >
                <i className="bi bi-calendar3 me-2"></i>Calendar
              </button>
              
              <button 
                className={`btn w-100 text-start py-2 ${activeView === 'chat' ? 'btn-primary' : 'btn-dark'}`} 
                onClick={() => setActiveView('chat')}
              >
                <i className="bi bi-chat-dots me-2"></i>Chat
              </button>
            </>
          )}
        </div>

        {/* BOTTOM ACTIONS - Pushed to the very bottom via mt-auto */}
        <div className="mt-auto pt-3 border-top border-secondary">
          <div className="px-2 mb-3">
            <small className="text-secondary d-block text-truncate">{user?.email}</small>
          </div>
          
          <button 
            className="btn btn-outline-danger w-100 d-flex align-items-center justify-content-center gap-2" 
            onClick={handleLogout}
          >
            <i className="bi bi-box-arrow-right"></i>
            Logout
          </button>
          {projectOn && (
            <button 
              className="btn btn-outline-danger w-100 mb-3 btn-sm" 
              onClick={() => setShowWarning(true)}
            >
              <i className="bi bi-trash me-2"></i>Delete Project
            </button>
          )}
          <div className="px-2 d-flex align-items-center justify-content-between">
            <div className="text-truncate" style={{maxWidth: '150px'}}>
              <small className="text-secondary d-block">Account</small>
              <span className="small fw-bold">{user?.email}</span>
            </div>
            <button className="btn btn-link text-danger p-0" onClick={handleLogout}>
              <i className="bi bi-box-arrow-right fs-5"></i>
            </button>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT AREA - overflow-auto allows this part to scroll while sidebar stays put */}
      <main className="flex-grow-1 overflow-auto bg-dark p-0">
        <div className="p-4">
          {activeView === 'board' && <BoardView projectId={activeProjectId} userId={user.uid} />}
          {activeView === 'calendar' && <CalendarView projectId={activeProjectId} userId={user.uid} projectOn={projectOn} setProjectOn={setProjectOn} />}
          {activeView === 'chat' && <ChatView projectId={activeProjectId} userId={user.uid} />}
        </div>
      </main>

      {/* DELETE WARNING MODAL */}
      {showWarning && (
        <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }} data-bs-theme="dark">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content bg-dark text-light border-secondary">
              <div className="modal-header border-secondary">
                <h5 className="modal-title text-danger">WARNING</h5>
                <button type="button" className="btn-close btn-close-white" onClick={() => setShowWarning(false)}></button>
              </div>
              <div className="modal-body text-start">
                This will permanently delete the project and all associated tasks.
                <br/><br/>
                Are you sure you wish to continue?
              </div>
              <div className="modal-footer border-secondary">
                <button type="button" className="btn btn-outline-light" onClick={() => setShowWarning(false)}>Cancel</button>
                <button type="button" className="btn btn-danger" onClick={handleReset}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showProjectModal && ( // This uses showProjectModal
        <ProjectCreationModal 
          userId={user.uid}
          onClose={() => setShowProjectModal(false)} 
          onSuccess={() => {
            setProjectOn(true);
            setActiveView('board');
          }}
        />
      )}

      {/* Add Member Modal */}
      {showMemberModal && (
        <AddMemberModal 
          userId={user.uid} 
          activeProjectId={activeProjectId} // <--- Pass the shared ID here
          onClose={() => setShowMemberModal(false)} 
        />
      )}
    </div>
  );
}

export default App