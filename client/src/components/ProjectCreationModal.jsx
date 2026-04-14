import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

function ProjectCreationModal({ userId, onClose, onSuccess }) {
  // We keep your original dual-object state structure
  const [newBackgroundEvent, setNewBackgroundEvent] = useState({ 
    title: '', startDate: '', endDate: '' 
  });
  const [newActualEvent, setNewActualEvent] = useState({
    startTime: '', endTime: '', notes: ''
  });

  const newProjectSubmit = async (e) => {
    e.preventDefault();
    
    try {
        const sharedGroupId = `group-${Date.now()}`;
        
        // Formatting inclusive end date (+1 day)
        const endDate = new Date(newBackgroundEvent.endDate);
        const inclusiveEnd = new Date(endDate);
        inclusiveEnd.setDate(endDate.getDate() + 1);
        const formattedEnd = inclusiveEnd.toISOString().split('T')[0];

        // 1. CREATE THE SHARED PROJECT DOCUMENT
        // This is the "parent" that holds the member list
        const projectRef = await addDoc(collection(db, 'projects'), {
        title: newBackgroundEvent.title,
        start: newBackgroundEvent.startDate,
        end: newBackgroundEvent.endDate,
        startTime: newActualEvent.startTime || '09:00',
        endTime: newActualEvent.endTime || '17:00',
        createdAt: new Date().toISOString(),
        owner: userId,
        members: [userId] // Creator is the first member
        });

        const projectId = projectRef.id;

        // 2. SAVE BACKGROUND EVENT TO THE PROJECT
        await addDoc(collection(db, 'projects', projectId, 'tasks'), {
        title: newBackgroundEvent.title,
        start: newBackgroundEvent.startDate,
        end: formattedEnd,
        allDay: true,
        groupId: sharedGroupId,
        display: 'background',
        color: '#C5C7BC',
        });

        // 3. SAVE ACTUAL BLOCK EVENT TO THE PROJECT
        const startDateTime = `${newBackgroundEvent.startDate}T${newActualEvent.startTime || '00:00'}`;
        const endDateTime = `${formattedEnd}T00:00`;

        await addDoc(collection(db, 'projects', projectId, 'tasks'), {
        title: newBackgroundEvent.title,
        start: startDateTime,
        end: endDateTime,
        notes: newActualEvent.notes || '',
        display: 'block',
        color: 'primary',
        groupId: sharedGroupId
        });

        onSuccess(); 
        onClose();
    } catch (err) {
        console.error("Error creating project:", err);
    }
    };

  return (
    <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }} data-bs-theme="dark">
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content bg-dark text-light border-secondary">
          <div className="modal-header border-secondary">
            <h5 className="modal-title">Add New Project</h5>
            <button type="button" className="btn-close btn-close-white" onClick={onClose}></button>
          </div>

          <form onSubmit={newProjectSubmit}>
            <div className="modal-body">
              {/* Project Name */}
              <div className="mb-3">
                <label className="form-label">Project Name</label>
                <input 
                  type="text" className="form-control" placeholder="Project Name" 
                  value={newBackgroundEvent.title} 
                  onChange={e => setNewBackgroundEvent({...newBackgroundEvent, title: e.target.value})} 
                  required 
                />
              </div>

              {/* START */}
              <div className="row">
                <div className="mb-3 col">
                  <label className="form-label">Start Date</label>
                  <input 
                    type="date" className="form-control" 
                    value={newBackgroundEvent.startDate} 
                    onChange={e => setNewBackgroundEvent({...newBackgroundEvent, startDate: e.target.value})}
                    required 
                  />
                </div>
                <div className="mb-3 col">
                  <label className='form-label'>Start Time</label>
                  <input 
                    type="time" className='form-control'
                    value={newActualEvent.startTime} 
                    onChange={e => setNewActualEvent({...newActualEvent, startTime: e.target.value})} 
                  />
                </div>
              </div>

              {/* END */}
              <div className='row'>
                <div className="mb-3 col">
                  <label className="form-label">End Date</label>
                  <input 
                    type="date" className="form-control"
                    value={newBackgroundEvent.endDate} 
                    onChange={e => setNewBackgroundEvent({...newBackgroundEvent, endDate: e.target.value})} 
                    required 
                  />
                </div>
                <div className="mb-3 col">
                  <label className='form-label'>End Time</label>
                  <input 
                    type="time" className='form-control'
                    value={newActualEvent.endTime} 
                    onChange={e => setNewActualEvent({...newActualEvent, endTime: e.target.value})} 
                  />
                </div>
              </div>

              <div className="mb-3">
                <label className="form-label">Notes</label>
                <textarea 
                  className="form-control" placeholder="Optional..." rows="3"
                  value={newActualEvent.notes} 
                  onChange={e => setNewActualEvent({...newActualEvent, notes: e.target.value})}
                />
              </div>
            </div>
            
            <div className="modal-footer border-secondary">
              <button type="button" className="btn btn-outline-light" onClick={onClose}>Cancel</button>
              <button type="submit" className="btn btn-primary">Create Project</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default ProjectCreationModal;