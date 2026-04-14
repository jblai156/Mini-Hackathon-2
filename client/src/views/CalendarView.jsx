import { useState, useRef, useMemo, useEffect } from 'react';

import useSWR from 'swr';

// FullCalendar Imports
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from "@fullcalendar/interaction";
import bootstrap5Plugin from '@fullcalendar/bootstrap5';
import timeGridPlugin from '@fullcalendar/timegrid';
import multiMonthPlugin from '@fullcalendar/multimonth';
import { formatDate } from '@fullcalendar/core';

// Bootstrap Imports
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

// Tippy Imports
import tippy, {followCursor} from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';
import 'tippy.js/animations/scale-extreme.css';
import 'tippy.js/themes/light.css';

// Firebase Imports
import { collection, onSnapshot, doc } from 'firebase/firestore';
import { db } from '../firebase';

import '../App.css';

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

function CalendarView({ projectId, projectOn }) {

  const calendarRef = useRef(null);
  

  // STATES
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  const [events, setEvents] = useState([]); // Holds all events
  const [activeProject, setActiveProject] = useState(null);
  // const [projectOn, setProjectOn] = useState(false);


  // CLICK ON DATE
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  const handleDateClick = (info) => {
    info.view.calendar.changeView('timeGridDay', info.dateStr);
  };


  // FETCH TASKS FROM FIREBASE AND MAP TO CALENDAR EVENTS
  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  useEffect(() => {
    // 1. Guard check for projectId
    if (!projectId) return;

    // 2. FIX: Point to 'projects' collection, not 'users'
    const colRef = collection(db, 'projects', projectId, 'tasks');

    const unsubscribe = onSnapshot(colRef, (snapshot) => {
      const taskEvents = snapshot.docs.map((doc) => {
        const data = doc.data();

        return {
          id: doc.id,
          title: data.display === 'background' 
            ? data.title 
            : `${data.taskCode ? data.taskCode + ' ' : ''}${data.title}`,
          start: data.deadline || data.start, 
          end: data.end || null,
          allDay: data.allDay ?? true,
          display: data.display || 'auto',
          extendedProps: {
            notes: data.notes || '',
            groupId: data.groupId || ''
          },
          color: data.display === 'background' 
            ? (data.color || '#C5C7BC') 
            : data.color === 'primary' ? 'var(--bs-primary)'
            : data.priority === 'high' ? 'red' 
            : data.priority === 'medium' ? 'orange' 
            : data.priority === 'low' ? 'blue' 
            : 'gray',
        };
      });

      setEvents(taskEvents);
    });

    return () => unsubscribe();
    
    // 3. FIX: Change [userId] to [projectId]
  }, [projectId]); 


  useEffect(() => {
    if (!projectId) return;

    // FIX: Path must point to the shared project document
    const projectRef = doc(db, 'projects', projectId);
    
    const unsubscribe = onSnapshot(projectRef, (docSnap) => {
      if (docSnap.exists()) {
        setActiveProject(docSnap.data()); // This populates the data for the timer
      }
    });

    return () => unsubscribe();
  }, [projectId]);


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
    if (!currentTime || !activeProject?.start || !activeProject?.createdAt) {
      return { timeUntilStart: "00 days, 00:00", percentageLeftUntilStart: 0, formattedTimeLeft:"00 days, 00:00", percentageLeft: 0, projectStarted: false };
    }

    // --setting dates/times
    const now = new Date(currentTime);
    const start = new Date(`${activeProject.start}T${activeProject.startTime || '00:00'}`);
    const end = new Date(`${activeProject.end}T${activeProject.endTime || '23:59'}`);
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

    // --date/time formatting
    const options = {
      year: 'numeric', 
      month: '2-digit', 
      day: '2-digit', 
      hour: 'numeric', 
      minute: 'numeric', 
      hour12: true 
    };

    // --Get data directly from the event (set previously in useEffect)
    const title = event.title;
    const start = event.start ? event.start.toLocaleString('en-US', options) : 'N/A';
    const end = event.end ? event.end.toLocaleString('en-US', options) : 'N/A';
    
    // Look for notes in extendedProps
    const notes = event.extendedProps?.notes;

    const notesMarkup = (notes && notes.trim() !== "") ? `
        <hr class="my-1 border-secondary" />
        <div class="small opacity-75">${notes}</div>
    ` : '';

    // --tooltip content jsx
    const content = `
      <div class="tippy-content tippy-box bg-dark text-light p-2 rounded tippy-tooltip">
        <strong class="text-white">${title}</strong><br/>
        <hr class="my-1 border-secondary" />
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
      appendTo: () => document.body,
      maxWidth: 'none',
      theme: 'no-border',
      inertia: true,
      followCursor: 'initial',
      plugins: [followCursor],
      placement: 'auto',
    });
  };


  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

  return (
    <>
      <div>

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
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'dayGridMonth,timeGridWeek,timeGridDay,multiMonthYear'
            }}
            eventDidMount={renderTooltip}
            events={events}
            // events={events}
            selectable={false}
            dateClick= {handleDateClick}
          />
        </div>

      </div>
    </>
  )
}

// events={[...events, ...taskEvents]}

function renderEventContent(eventInfo) {
  var isStart = eventInfo.isStart;
  var isEnd = eventInfo.isEnd;
  const event = eventInfo.event;
  let showContent = true;

  if (event.display === 'background' && !isStart) showContent = false;
  if (showContent && event.display === 'background') isStart = null;
  if (!showContent) isEnd = null;

  const shouldShowTitle = showContent && event.display === 'background';

  const startTimeText = event.start 
    ? formatDate(event.start, { hour: 'numeric', minute: '2-digit', omitZeroMinute: true })
    : '';
  const endTimeText = event.end 
    ? formatDate(event.end, { hour: 'numeric', minute: '2-digit', omitZeroMinute: true })
    : '';

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      width: '100%',
      overflow: 'hidden',
      fontSize: '0.85em',
      minHeight: '1.5em' // FIX: Forces consistent thickness across all weeks
    }}>
      <div style={{ display: 'flex', alignItems: 'center', overflow: 'hidden' }}>
        {/* START TIME / GHOST SPACER */}
        {event.display !== 'background' ? (
          isStart ? (
            <b style={{ marginRight: '5px' }}>{startTimeText}</b>
          ) : (
            /* GHOST SPACER: Invisible text to keep height consistent on middle days */
            <b style={{ visibility: 'hidden', marginRight: '5px' }}>00:00</b>
          )
        ) : null}
        
        <span style={{ 
          whiteSpace: 'nowrap', 
          overflow: 'hidden', 
          textOverflow: 'ellipsis' 
        }}>
          {shouldShowTitle && event.title}
        </span>
      </div>

      {/* END TIME: Only for block events */}
      {isEnd && event.display !== 'background' && (
        <b style={{ marginLeft: '5px' }}>{endTimeText}</b>
      )}
    </div>
  );
}

export default CalendarView
