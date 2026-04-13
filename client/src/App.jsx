import { useState, useRef, useMemo } from 'react';

import useSWR from 'swr'

// FullCalendar Imports
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import interactionPlugin from "@fullcalendar/interaction"
import bootstrap5Plugin from '@fullcalendar/bootstrap5'
import timeGridPlugin from '@fullcalendar/timegrid';
import multiMonthPlugin from '@fullcalendar/multimonth'
import { formatDate } from '@fullcalendar/core';

// Bootstrap Imports
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-icons/font/bootstrap-icons.css'

// Tippy Imports
import tippy, {followCursor} from 'tippy.js'
import 'tippy.js/dist/tippy.css'
import 'tippy.js/animations/scale.css';
import 'tippy.js/animations/scale-extreme.css';
import 'tippy.js/themes/light.css';

import './App.css'

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function App() {

  const calendarRef = useRef(null);
  

  // STATES
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  const [events, setEvents] = useState([]); // Holds all events
  const [activeProject, setActiveProject] = useState(null);
  const [projectOn, setProjectOn] = useState(false);
  const [showWarning, setShowWarning] = useState(false);
  const [showForm, setShowForm] = useState(false); // State for 'Add Project' modal inputs
  const [newBackgroundEvent, setNewBackgroundEvent] = useState({ 
    title: '', 
    startDate: '',
    endDate: '',
  });
  const [newActualEvent, setNewActualEvent] = useState({
    title: '',
    startDate: '', 
    startTime: '', 
    endDate: '', 
    endTime: '',
    notes: ''
  });


  // CLICK ON DATE
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  const handleDateClick = (info) => {
    info.view.calendar.changeView('timeGridDay', info.dateStr);
  };


  // ADD PROJECT MODAL
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // 'Add Project' Button
  const addProjectClick = () => {
    if (projectOn) {
      alert("Project is already setup!");
      return;
    }
    setShowForm(true);
  };

  // 'Create Project' Button (in modal)
  const createProjectClick = () => {
    setShowForm(true);
  };

  // Submit New Project Form
  const newProjectSubmit = (e) => {
    e.preventDefault();
    if (projectOn) return;
    if (newBackgroundEvent.title && newBackgroundEvent.startDate && newBackgroundEvent.endDate) {

      // --formatting for actual event
      const startDateTime = `${newBackgroundEvent.startDate}T${newActualEvent.startTime || '00:00'}`;
      const endDateTime = `${newBackgroundEvent.endDate}T${newActualEvent.endTime || '23:59'}`;

      // --include end date in background event
      const endDate = new Date(newBackgroundEvent.endDate);
      const inclusiveEnd = new Date(endDate);
      inclusiveEnd.setDate(endDate.getDate() + 1); // Add one day to make it inclusive
      const formattedEnd = inclusiveEnd.toISOString().split('T')[0];

      const sharedGroupId = `group-${Date.now()}`; // Unique ID for pairing

      // --background event (faded background colour for project length)
      const backgroundEventToAdd = {
        title: newBackgroundEvent.title,
        start: newBackgroundEvent.startDate,
        end: formattedEnd,
        allDay: true,
        groupId: sharedGroupId,
        display: 'background',
        color: '#C5C7BC',
        className: 'solid-background'
      };

      // --actual event
      const actualEventToAdd = {
        title: newActualEvent.title,
        start: startDateTime,
        end: endDateTime,
        notes: newActualEvent.notes,
        allDay: false,
        color: 'primary',
        groupId: sharedGroupId,
        display: 'block'
      };
      
      // --set states
      setEvents(prevEvents => [...prevEvents, backgroundEventToAdd, actualEventToAdd]);

      setActiveProject({
        startDate: newBackgroundEvent.startDate,
        endDate: newBackgroundEvent.endDate,
        startTime: newActualEvent.startTime,
        endTime: newActualEvent.endTime,
        notes: newActualEvent.notes || '',
        createdAt: new Date().toISOString()
      });

      setProjectOn(true);

      // --reset states
      setNewBackgroundEvent({ title: '', startDate: '', endDate: '' });
      setNewActualEvent({ title: '', startDate: '', startTime: '', endDate: '', endTime: '', notes: '' });

      // --close modal
      setShowForm(false);
    }

    createProjectClick;
  };


  // DEADLINE COUNTDOWN
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  // SWR Fetches Current Time, Triggering Re-Renders
  const { data: currentTime } = useSWR('currentTime', () => new Date().toISOString(), {
    refreshInterval: 1000, 
    revalidateOnFocus: false, 
    dedupingInterval: 0,
  });

  // Retrieve, Create, and Format Necessary Data
  const { timeUntilStart, percentageLeftUntilStart, formattedTimeLeft, percentageLeft, projectStarted } = useMemo(() => {
    
    // --conditions
    if (!currentTime || !activeProject?.startDate || !activeProject?.createdAt) {
      return { timeUntilStart: "00 days, 00:00", percentageLeftUntilStart: 0, formattedTimeLeft:"00 days, 00:00", percentageLeft: 0, projectStarted: false };
    }

    // --setting dates/times
    const now = new Date(currentTime);
    const start = new Date(`${activeProject.startDate}T${activeProject.startTime || '00:00'}`);
    const end = new Date(`${activeProject.endDate}T${activeProject.endTime || '23:59'}`);
    const created = new Date(activeProject.createdAt);

    // --general
    const hasStarted = now >= start;
    const pad = (num) => String(num).padStart(2, '0');
    const msInMinute = 1000 * 60, msInHour = msInMinute * 60, msInDay = msInHour * 24;

    // --time until start
    let diffStart = Math.max(0, start - now);
    const dStart = Math.floor(diffStart / msInDay);
    const hStart = Math.floor((diffStart % msInDay) / msInHour);
    const mStart = Math.floor((diffStart % msInHour) / msInMinute);

    const totalWait = start - created;
    const percStart = totalWait > 0 ? Math.round(((start - now) / totalWait) * 100) : 0;

    // --time until deadline
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
  }, [currentTime, activeProject])


  // TOOLTIP
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  const renderTooltip = (info) => {
    const { event } = info;

    // --conditions
    if (info.view.type !== 'dayGridMonth') return;
    if (event.display === 'background') return;

    // --retrieve project information
    const allEvents = info.view.calendar.getEvents();
    const backgroundEvent = allEvents.find(
      (e) => e.display === 'background' && e.groupId === event.groupId
    );
    const actualEvent = allEvents.find(
      (e) => e.display === 'block' && e.groupId === event.groupId
    );
    
    // --setting title
    const title = backgroundEvent ? backgroundEvent.title : event.title;
    
    // --date/time formatting
    const options = {
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: 'numeric', 
      minute: 'numeric', 
      hour12: true 
    };

    // --setting dates/times and optional notes
    const start = event.start ? event.start.toLocaleString('en-US', options) : 'N/A';
    const end = event.end ? event.end.toLocaleString('en-US', options) : 'N/A';
    const notes = actualEvent?.extendedProps?.notes || event.extendedProps?.notes;

    // --apply notes jsx iff notes were submited
    const notesMarkup = notes ? `
        <hr class="my-1 border-secondary"/>
        ${notes}
    ` : '';

    // --tooltip content jsx
    const content = `
      <div class="tippy-content tippy-box bg-dark text-light p-2 rounded tippy-tooltip">

        <strong class="text-white">${title}</strong><br/>
        
        <hr class="my-1 border-secondary""")/>
        
        Start: ${start}<br/>
        End: ${end}

        ${notesMarkup}

      </div>
    `;

    // --create tippy tooltip
    tippy(info.el, {
      content: content,
      allowHTML: true,
      animation: 'scale-extreme',
      trigger: 'click',
      interactive: true,
      appendTo:  () => document.body,
      maxWidth: 'none',
      theme: 'no-border',
      inertia: true,
      followCursor: 'initial', // Places tooltip at click point
      plugins: [followCursor],
      placement: 'auto', // Finds best spot near click
    });
  };


  // DELETE PROJECT
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  const deleteProject = (e) => {
    
    // --conditions
    if (e) e.preventDefault();
    if (!activeProject) return;

    // --remove from FullCalendar
    let calendarApi = calendarRef.current.getApi();
    let event = calendarApi.getEventById(String(activeProject.id));
    if (event) {
      event.remove();
    }

    // --remove from react state
    setEvents(prevEvents => prevEvents.filter(el => el.id !== activeProject.id));

    // --reset active project
    setActiveProject(null);
    setProjectOn(false);

    // --close modal
    setShowWarning(false);
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

                    <div className="mb-3">
                      <label className="form-label">Notes</label>
                        <textarea 
                          type="text" 
                          className="form-control"
                          placeholder="Optional..." 
                          value={newActualEvent.notes} 
                          onChange={e => setNewActualEvent({...newActualEvent, notes: e.target.value})}
                        />
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

        {/* WARNING MODAL */}
        {showWarning && (
          <>
            <div className="modal fade show" style={{ display: 'block', backgroundColor: 'rgba(0,0,0,0.5)' }} id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="false">
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header">
                    <h1 className="modal-title fs-5 text-danger" id="staticBackdropLabel">WARNING</h1>
                  </div>
                  <div className="modal-body text-start">
                    This will permanently delete the project and all associated tasks.
                    <br/>
                    <br/>
                    Are you sure you wish to continue?
                  </div>
                  <div className="modal-footer">
                    <button type="button" className="btn btn-secondary" onClick={() => setShowWarning(false)}>Cancel</button>
                    <button type="button" className="btn btn-danger" onClick={deleteProject}>Delete</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-backdrop fade show"></div>
          </>
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

        {/* BUTTONS */}
        <div className='p-5 row'>

          {/* 'ADD PROJECT' BUTTON */}
          <div className="custom-toolbar-area mb-2 col">
            <button className="btn btn-primary" onClick={addProjectClick}>
              Add Project
            </button>
          </div>

          {/* 'DELETE PROJECT' BUTTON */}
          <div className="custom-toolbar-area mb-2 col">
            <button 
              className="btn btn-danger" 
              onClick={() => {
                if (activeProject) {
                  setShowWarning(true);
                } else {
                  alert("No project to delete");
                }
              }}
            >
              Delete Project
            </button>
          </div>
        </div>

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
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,multiMonthYear'
            }}
            eventDidMount={renderTooltip}
            events={events}
            selectable={false}
            dateClick= {handleDateClick}
          />
        </div>

      </div>
    </>
  )
}

function renderEventContent(eventInfo) {
  
  // Get Data
  var isStart = eventInfo.isStart;
  var isEnd = eventInfo.isEnd;
  const event = eventInfo.event;

  let showContent = true;


  // Conditions
  // --only show project name on the first day
  if (event.display === 'background' && !isStart) {
    showContent = false;
  }

  // --prevent start time from showing on first day background event
  if (showContent && event.display === 'background') {
    isStart = null; // Prevent 
  }

  // --if not first day of background event, only show background colour 
  if (!showContent) {
    isEnd = null; 
  }

  // Format Start & End Time
  const startTimeText = event.start 
    ? formatDate(event.start, { hour: 'numeric', minute: '2-digit', omitZeroMinute: true })
    : '';
  const endTimeText = event.end 
    ? formatDate(event.end, { hour: 'numeric', minute: '2-digit', omitZeroMinute: true })
    : '';

  return (

    <>
    {showContent && event.title}
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      height: '100%',
      overflow: 'hidden'
    }}>

      {/* Left - Start Time and Title */}
      <div style={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        {isStart && (
          <b style={{ 
            marginRight: '5px',
            fontSize: '0.85em',
            textAlign: 'left',
            whiteSpace: 'nowrap', 
          }}>{startTimeText}</b>
        )}
      </div>

      {/* In between */}
      {!isStart && !isEnd && (
        <b style={{
          color: 'rgba(62, 66, 71, 0)',
          marginLeft: '5px',
          fontSize: '0.85em',
          whiteSpace: 'nowrap',
        }}>
          -
        </b>
      )}

      {/* Right - End Time */}
      {isEnd && (
        <b style={{
          marginLeft: '5px',
          fontSize: '0.85em',
          textAlign: 'right',
          whiteSpace: 'nowrap'
        }}>
          {endTimeText}
        </b>
      )}
    </div>
    </>
  );
}

export default App
