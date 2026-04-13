import React, { useState, useRef, useMemo, useEffect } from 'react';
import useSWR from 'swr'

import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import bootstrap5Plugin from '@fullcalendar/bootstrap5'
import timeGridPlugin from '@fullcalendar/timegrid';
import multiMonthPlugin from '@fullcalendar/multimonth'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

import { collection, onSnapshot } from 'firebase/firestore'
import { db } from '../firebase'

import '../App.css'

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function CalendarView() {

  const calendarRef = useRef(null);
  
  // STATE TO HOLD ALL EVENTS
  const [events, setEvents] = useState([]);

  // STATE TO HOLD TASK EVENTS FROM BOARD
  const [taskEvents, setTaskEvents] = useState([]);

  const [activeProject, setActiveProject] = useState(null);
  const [projectOn, setProjectOn] = useState(false);

  // ADD PROJECT BUTTON
  const addProjectClick = () => {
    if (projectOn) {
      alert("Project is already setup!");
      return;
    }
    setShowForm(true);
  };

  // CREATE PROJECT BUTTON (IN MODAL)
  const createProjectClick = () => {
    setShowForm(true);
  };
  
  // State for form visibility and inputs
  const [showForm, setShowForm] = useState(false);
  
  const [newBackgroundEvent, setNewBackgroundEvent] = useState({ 
    title: '', 
    startDate: null,
    endDate: null,
  });
  
  const [newActualEvent, setNewActualEvent] = useState({
    title: '',
    startDate: '', 
    startTime: '', 
    endDate: '', 
    endTime: '' 
  });

  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // FETCH TASKS FROM FIREBASE AND MAP TO CALENDAR EVENTS
  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'boards', 'board1', 'tasks'),
      (snapshot) => {
        const tasks = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }))

        const mapped = tasks
          .filter((task) => task.deadline)
          .map((task) => ({
            id: `task-${task.id}`,
            title: `${task.taskCode ? task.taskCode + ' ' : ''}${task.title}`,
            start: task.deadline,
            allDay: true,
            color:
              task.priority === 'high'
                ? 'red'
                : task.priority === 'medium'
                ? 'orange'
                : task.priority === 'low'
                ? 'blue'
                : 'gray',
          }))

        setTaskEvents(mapped)
      }
    )

    return () => unsubscribe()
  }, [])

  // DEADLINE COUNTDOWN
  // SWR fetches current time, triggering re-renders
  const { data: currentTime } = useSWR('currentTime', () => new Date().toISOString(), {
    refreshInterval: 1000, 
    revalidateOnFocus: false, 
    dedupingInterval: 0,
  });

  const { timeUntilStart, percentageLeftUntilStart, formattedTimeLeft, percentageLeft, projectStarted } = useMemo(() => {
    if (!currentTime || !activeProject?.startDate || !activeProject?.createdAt) {
      return { timeUntilStart: "00 days, 00:00", percentageLeftUntilStart: 0, formattedTimeLeft:"00 days, 00:00", percentageLeft: 0, projectStarted: false };
    }

    const now = new Date(currentTime);
    const start = new Date(`${activeProject.startDate}T${activeProject.startTime || '00:00'}`);
    const end = new Date(`${activeProject.endDate}T${activeProject.endTime || '23:59'}`);
    const created = new Date(activeProject.createdAt);

    const hasStarted = now >= start;
    const pad = (num) => String(num).padStart(2, '0');
    const msInMinute = 1000 * 60, msInHour = msInMinute * 60, msInDay = msInHour * 24;

    // Calculations Until Start Time
    let diffStart = Math.max(0, start - now);
    const dStart = Math.floor(diffStart / msInDay);
    const hStart = Math.floor((diffStart % msInDay) / msInHour);
    const mStart = Math.floor((diffStart % msInHour) / msInMinute);

    const totalWait = start - created;
    const percStart = totalWait > 0 ? Math.round(((start - now) / totalWait) * 100) : 0;

    // Calculations Until Deadline
    let diffEnd = Math.max(0, end - now);
    const dEnd = Math.floor(diffEnd / msInDay);
    const hEnd = Math.floor((diffEnd % msInDay) / msInHour);
    const mEnd = Math.floor((diffEnd % msInHour) / msInMinute);

    const totalDuration = end - start;
    const percEnd = totalDuration > 0 ? Math.round(((end - now) / totalDuration) * 100) : 0;

    return {
      timeUntilStart: `${pad(dStart)} days, ${pad(hStart)}:${pad(mStart)}`,
      percentageLeftUntilStart: Math.min(100, Math.max(0, percStart)),
      formattedTimeLeft: `${pad(dEnd)} days, ${pad(hEnd)}:${pad(mEnd)}`,
      percentageLeft: Math.min(100, Math.max(0, percEnd)),
      projectStarted: hasStarted
    };
  }, [currentTime, activeProject]);
  
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // SUBMIT NEW PROJECT FORM
  const newProjectSubmit = (e) => {
    e.preventDefault();
    if (projectOn) return;
    if (newBackgroundEvent.title && newBackgroundEvent.startDate && newBackgroundEvent.endDate) {

      // FORMAT FOR ACTUAL EVENT
      const startDateTime = `${newBackgroundEvent.startDate}T${newActualEvent.startTime || '00:00'}`;
      const endDateTime = `${newBackgroundEvent.endDate}T${newActualEvent.endTime || '23:59'}`;

      // INCLUDE ENDDATE IN BACKGROUND EVENT
      const endDate = new Date(newBackgroundEvent.endDate);
      const inclusiveEnd = new Date(endDate);
      inclusiveEnd.setDate(endDate.getDate() + 1); // Add one day to make it inclusive
      const formattedEnd = inclusiveEnd.toISOString().split('T')[0]; // Format to YYYY-MM-DD

      // BACKGROUND EVENT (FADED BACKGROUND COLOUR FOR PROJECT LENGTH)
      const backgroundEventToAdd = {
        title: newBackgroundEvent.title,
        start: newBackgroundEvent.startDate,
        end: formattedEnd,
        allDay: true,
        display: 'background',
        color: '#C5C7BC',
        className: 'solid-background'
      };

      // ACTUAL EVENT
      const actualEventToAdd = {
        title: newActualEvent.title,
        start: startDateTime,
        end: endDateTime,
        allDay: false,
        color: 'primary'
      };
      
      setEvents([...events, backgroundEventToAdd, actualEventToAdd]); // Updates the events object
      
      const calendarApi = calendarRef.current.getApi();
      calendarApi.addEvent(backgroundEventToAdd);
      calendarApi.addEvent(actualEventToAdd);

      setActiveProject({
        startDate: newBackgroundEvent.startDate,
        endDate: newBackgroundEvent.endDate,
        startTime: newActualEvent.startTime,
        endTime: newActualEvent.endTime,
        createdAt: new Date().toISOString()
      });

      setProjectOn(true);

      setNewBackgroundEvent({ title: '', startDate: '', endDate: '' });
      setNewActualEvent({ title: '', startDate: '', startTime: '', endDate: '', endTime: '' });
      setShowForm(false);
    }

    createProjectClick;
  };

  return (
    <>
      <div>
        {/* ADD PROJECT MODAL */}
        {showForm && (
          <div className="modal d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                
                {/* Modal Header */}
                <div className="modal-header">
                  <h5 className="modal-title">Add New Project</h5>
                  <button type="button" className="btn-close" onClick={() => setShowForm(false)}></button>
                </div>

                {/* Modal Body with Form */}
                <form onSubmit={newProjectSubmit}> {/* newProjectSubmit is called when 'Create Project' button is pressed */}
                  <div className="modal-body">

                    {/* Project Name */}
                    <div className="mb-3">
                      <label className="form-label">Project Name</label>
                        <input 
                          type="text" 
                          className="form-control"
                          placeholder="Project Name" 
                          value={newBackgroundEvent.title} 
                          onChange={e => setNewBackgroundEvent({...newBackgroundEvent, title: e.target.value})} 
                          required 
                        />
                    </div>

                    {/* START */}
                    <div className="row">

                      {/* Date */}
                      <div className="mb-3 col">
                        <label className="form-label">Start Date</label>
                          <input 
                            type="date"
                            className="form-control" 
                            value={newBackgroundEvent.startDate} 
                            onChange={e => setNewBackgroundEvent({...newBackgroundEvent, startDate: e.target.value})}
                            required 
                          />
                      </div>

                      {/* Time */}
                      <div className="mb-3 col">
                        <label className='form-label'>Start Time</label>
                          <input 
                            type="time" 
                            className='form-control'
                            value={newActualEvent.startTime} 
                            onChange={e => setNewActualEvent({...newActualEvent, startTime: e.target.value})} 
                          />
                      </div>
                    </div>


                    {/* END */}
                    <div className='row'>

                      {/* Date */}
                      <div className="mb-3 col">
                        <label className="form-label">End Date</label>
                          <input 
                            type="date" 
                            className="form-control"
                            value={newBackgroundEvent.endDate} 
                            onChange={e => setNewBackgroundEvent({...newBackgroundEvent, endDate: e.target.value})} 
                            required 
                          />
                      </div>

                      {/* Time */}
                      <div className="mb-3 col">
                        <label className='form-label'>End Time</label>
                          <input 
                            type="time" 
                            className='form-control'
                            value={newActualEvent.endTime} 
                            onChange={e => setNewActualEvent({...newActualEvent, endTime: e.target.value})} 
                          />
                      </div>
                    </div>

                  </div>
                  
                  {/* Modal Footer */}
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                    <button type="submit" className="btn btn-primary">Create Project</button> {/* This calls newProjectSubmit */}
                  </div>

                </form>

              </div>
            </div>
          </div>
        )}

        {/* DEADLINE COUNTDOWN */}
        {projectOn && (
          <div className='deadline-container p-5'>
            {!projectStarted ? (
              /* Time Until Start */
              <>
              <div className="progress d-flex justify-content-end mx-auto" 
                role='progressbar'
                aria-label="Animated striped example" 
                aria-valuenow={percentageLeftUntilStart} 
                aria-valuemin="0" 
                aria-valuemax="100"
                style={{ height: '40px', width: '80%'}}>
                <div 
                  className="progress-bar progress-bar-striped progress-bar-animated bg-warning fs-5" 
                  style={{ width: `${percentageLeftUntilStart}%`, transition: 'width 1s linear' }}
                >
                  {percentageLeftUntilStart > 40 ? `Project starts in: ${timeUntilStart}` : ''}
                </div>
              </div>
              {percentageLeftUntilStart <= 40 && (
                <p className="mt-2 fw-bold fs-5">Project starts in: {timeUntilStart}</p>
              )}
              </>
            ) : (
              /* Project Deadline */
              <>
              <div className="progress d-flex justify-content-end mx-auto" 
                role='progressbar'
                aria-label="Animated striped example" 
                aria-valuenow={percentageLeft} 
                aria-valuemin="0" 
                aria-valuemax="100"
                style={{ height: '40px', width: '80%'}}>
                <div 
                  className="progress-bar progress-bar-striped progress-bar-animated fs-5" 
                  style={{ width: `${percentageLeft}%`, transition: 'width 1s linear' }}
                >
                  {percentageLeft > 30 ? `Deadline: ${formattedTimeLeft}` : ''}
                </div>
              </div>
              {percentageLeft <= 30 && (
                <p className="mt-2 fw-bold fs-5">Deadline: {formattedTimeLeft}</p>
              )}
            </>
            )}
          </div>
        )}

        <div className="ticks"></div>

        {/* CALENDAR */}
        <div className='p-5'>
          <FullCalendar
            ref={calendarRef}
            plugins={[ dayGridPlugin, bootstrap5Plugin, interactionPlugin, timeGridPlugin, multiMonthPlugin ]}
            themeSystem='bootstrap5'
            initialView="dayGridMonth"
            nowIndicator={true}
            eventContent={renderEventContent}
            customButtons={{
              addProjectButton: {
                text: 'Add Project',
                click: addProjectClick,
              },
            }}
            // Reference the custom button name in the toolbar
            headerToolbar={{
              left: 'prev,next today addProjectButton',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,multiMonthYear'
            }}
            events={[...events, ...taskEvents]}        
            dayCellDidMount={(info) => {
              if (info.isToday) {
                info.el.style.backgroundColor = 'rgba(0, 236, 240, 0.38)';
              }
            }}
          />
        </div>

      </div>
    </>
  )
}

function renderEventContent(eventInfo) {
  return(
    <>
      <b>{eventInfo.timeText}</b>
      <i>{eventInfo.event.title}</i>
    </>
  )
}

export default CalendarView