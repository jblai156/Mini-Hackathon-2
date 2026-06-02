<h1>
  Mini Hackathon 2 - Building an MVP Through Iterative Software Engineering
</h1>

<strong>Course:</strong> Foundations of Software Engineering
<br>
<strong>Team Name:</strong> Super Awesome Group
<br>
<strong>Team Members:</strong> Joey, Sydney, Robel


<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->


<h2>Week 1/Sprint 0 - System Analysis & Planning</h2>

<h3>Problem Statement</h3>

<p>
  MRU computing students often struggle to effectively manage group projects due 
  to unstructured communications and scattered use of tools. Tasks are 
  frequently assigned through word of mouth or text messages which often leads 
  to confusion, missed responsibilities, and lack of accountability. On top of 
  that, students rarely track productivity or task progress because existing 
  tools are either too complex or not easy to integrate into their workflow. 
  This problem exists because students rely on informal methods of coordination 
  and are unaware of better solutions or find the existing tools out there to be 
  too overwhelming to start using.

  We address this issue by providing a centralized collaboration board where 
  students can assign tasks, track progress in real-time, communicate within the 
  project, and view simple analytics. This reduces confusion, helps improve 
  organization, and helps teams stay accountable without extra effort or complex 
  workflow setups.
</p>

<h3>Functional Requirements</h3>

<ul>
  <li>The system shall allow users to create tasks</li>
  <li>The system shall allow users to create sub-tasks</li>
  <li>The system shall allow users to edit and delete tasks</li>
  <li>The system shall allow users to assign tasks to project members</li>
  <li>
    The system shall allow users to mark tasks as backlog, doing, review, 
    and done
  </li>
  <li>The system shall allow users to set task priorities and deadlines</li>
  <li>The system shall allow users to create and invite people to a project</li>
  <li>
    The system shall allow users to communicate with people in their project
  </li>
  <li>The system shall allow users to view analytics of their team</li>
</ul>

<h3>Non-Functional Requirements</h3>

<ul>
  <li>The system should run in a web browser</li>
  <li>The interface should be easy for first-year students to understand</li>
  <li>The system should be able to update tasks in real-time</li>
  <li>
    The system should be able to load in under two seconds with 
    normal conditions
  </li>
  <li>Users should only be able to access authorized data</li>
  <li>User data must be securely stored</li>
</ul>

<h3>MoSCoW Prioritization</h3>

<ul>
  <li>
  <strong>Must-haves</strong>
    <ul>
      <li>Kanban-styled task tracking system</li>
    </ul>
  </li>
  <li>
  <strong>Should-haves</strong>
    <ul>
      <li>Communication chat</li>
      <li>Calendar / Deadline Visualization</li>
      <li>Real-time updates and notifications</li>
    </ul>
  </li>
  <li>
  <strong>Could-have</strong>
    <ul>
      <li>Analytics for each member and overall team</li>
    </ul>
  </li>
</ul>

<h3>T-Shirt Sizing (Effort Estimation)</h3>
	
<table>
  <tr>
    <th>Feature</th>
    <th>Size</th>
  </tr>
  <tr>
    <td>Create a project dashboard</td>  
    <td>Large</td>
  </tr>
  <tr>
    <td>Invite people to a project</td>
    <td>Medium</td>
  </tr>
  <tr>
    <td>Create a task</td> 
    <td>Medium</td>
  </tr>
  <tr>
    <td>Create a sub-tasks</td>
    <td>Medium</td>
  </tr>
  <tr>
    <td>Edit & Delete a task</td> 
    <td>Small</td>
  </tr>
  <tr>
    <td>Edit & Delete a sub-task</td>
    <td>Small</td>
  </tr>
  <tr>
    <td>Assign task to people</td>
    <td>Small</td>
  </tr>
  <tr>
    <td>Mark task progression level</td>
    <td>Small</td>
  </tr>
  <tr>
    <td>Set task priorities & deadlines</td>
    <td>Small</td>
  </tr>
  <tr>
    <td>Set sub-task priorities</td>
    <td>Small</td>
  </tr>
  <tr>
    <td>Project deadline countdown</td>
    <td>Small</td>
  </tr>
  <tr>
    <td>Project chat</td>
    <td>Large</td>
  </tr>
  <tr>
    <td>Project analytics</td>
    <td>Large</td>
  </tr>
</table>

<h3>Stakeholder Feedback</h3>

<strong>Student 1:</strong>

<ul>
  <li>Said the system seemed pretty useful</li>
  <li>
    Mentioned they would use a tool like this for organizing and 
    managing group work
  </li>
  <li>
    Liked the idea of combining task tracking and communication in one place
  </li>
</ul>

<strong>Student 2:</strong>

<ul>
  <li>Initially believed the system was mainly focused on communication</li>
  <li>Felt that there are already existing tools (e.g. Discord)</li>
  <li>
    Mentioned that communication aspect alone would not fill a strong niche
  </li>
  <li>
    Suggested that the system would need to offer more than just chat 
    to be useful
  </li>
</ul>

<strong>How the feedback influenced the design:</strong>

<ul>
  <li>The feedback did not lead to any major changes in the system design</li>
  <li>
    However, it did highlight the importance of clearly communicating that our 
    system is not just a chatting tool, but a task management and collaboration 
    platform
  </li>
  <li>
    Reinforced that our focus should be on task tracking as the core feature, 
    and communications as something to support it
  </li>
</ul>

<h3>Architecture Decision</h3>

<p>
  We chose a three-tier client-server architecture with presentation (JSX, 
  Bootstrap-React, React), logic (Javascript, Node.js, Express.js, Websocket), 
  and data (Firebase) layers. We chose this architecture because it is well 
  suited for a web based application of this nature. 
</p>

<h3>Tools and Training Plan</h3>

<strong>Programming Language:</strong> Javascript<br>
<strong>Version Control:</strong> Git and Github

<table>
  <tr>
    <th>Presentation</th>
    <th>Logic</th>
    <th>Data</th>
  </tr>
  <tr>
    <td>
      <ul>
        <li>React</li>
        <li>JSX</li>
        <li>Bootstrap-React</li>
      </ul>
    </td>
    <td>
      <ul>
        <li>Websocket</li>
        <li>Node.js</li>
        <li>Express.js</li>
        <li>Javascript</li>
      </ul>
    </td>
    <td>
      <ul>
        <li>Firebase</li>
      </ul>
    </td>
  </tr>
</table>

<strong>Familiar Tools:</strong>

<ul>
  <li>JSX (HTML)</li>
  <li>Bootstrap (CSS)</li>
  <li>Git</li>
  <li>Github</li>
</ul>

<strong>Somewhat Familiar:</strong>

<ul>
  <li>Javascript</li>
</ul>

<strong>Unfamiliar Tools:</strong>

<ul>
  <li>React</li>
  <li>Firebase</li>
  <li>Express.js</li>
  <li>Node.js</li>
</ul>


<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->


<h2>Week 2/Sprint 1 - Development Update</h2>

<h3>Development Progress Summary</h3>

<p>
  Managed to get the basic structure of the project set up with React, Node, 
  Express, Websocket, Bootstrap-React, and Firebase all in a GitHub repository. 
  Then got the Kanban board partially implemented.
</p>

<h3>Features Implemented So Far</h3>

<ul>
  <li>Kanban-styled task tracking system</li>
</ul> 

<h3>Requirement Progress Update</h3>

<table>
  <tr>
    <th>Functional Requirements Completed</th>
    <th>Non-Functional Requirements Completed</th>
  </tr>
  <tr>
    <td>
      <ul>
        <li>N/A</li>
      </ul>
    </td>
    <td>
      <ul>
        <li>The system should run in a web browser</li>
      </ul>
    </td>
  </tr>
<table>

<h3>New Requirements Added During This Sprint</h3>

<p>
  N/A
</p>

<h3>Development Challenges Encountered</h3>

<ul>
  <li>
    A little bit of trial & error trying to get the basic structure setup 
    (Google AI overview, Google AI Mode, documentation, and a bit of Youtube 
    helped)
  </li>
</ul>


<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->


<h2>Week 3/Sprint 2 - Development Update</h2>

<h3>Feature Development Progress</h3>
	
<p>
  The Calendar/Deadline visualization is partially completed, but the basic 
  functions are set up and working. 

  The Kanban board is mostly functional, with the core task management features 
  successfully implemented. Users are able to create new tasks directly within 
  columns, edit task titles, and adjust task points. Tasks can also be moved 
  between columns using drag-and-drop, and all updates are synchronized in real 
  time through Firebase. However, some features are still incomplete. Users are 
  not yet able to add detailed descriptions to tasks or modify task priority 
  after creation.
</p>

<h3>Requirement Progress Update</h3>

<table>
  <tr>
    <th>Functional Requirements Completed</th>
    <th>Non-Functional Requirements Completed</th>
  </tr>
  <tr>
    <td>
      <ul>
        <li>The system shall allow users to create tasks</li>
        <li>The system shall allow users to edit (some) tasks</li>
        <li>
          The system shall allow users to mark tasks as backlog, doing, review, 
          and done
        </li>
        <li>The system shall allow users to assign effort points to tasks</li>
        <li>The system shall display the total task points for each column</li>
      </ul>
    </td>
    <td>
      <ul>
        <li>The system should run in a web browser</li>
        <li>The system should be able to update tasks in real-time</li>
      </ul>
    </td>
  </tr>
</table>

<h3>New Requirements Added During This Sprint</h3>

<ul>
  <li>
    The system shall allow users to assign effort points to tasks
    <ul>
      <li>To provide a simple and realistic way to estimate task effort</li>
      <li>Estimated Size: Small</li>
    </ul>
  </li>
  <li>
    The system shall display the total task points for each column
    <ul>
      <li>
        To give users a quick overview of workload distribution across different 
        stages of the project
      </li>
      <li>Estimated Size: Small</li>
    </ul>
  </li>
  <li>
    The system shall integrate the Kanban board, chat board, and 
    calendar/deadline view into one unified application
    <ul>
      <li>
        Each component was developed separately during the sprint, so this 
        requirement was added to make the system function as a single 
        collaboration platform instead of isolated features
      </li>
      <li>Estimated Size: Large</li>
    </ul>
  </li>
</ul>

<h3>Technical Challenges Encountered</h3>

<ul>
  <li>
    Converting FullCalendar component into a react javascript component from the 
    docs (Trial & error + Google AI Overview helped)
  </li>
  <li>
    Creating a live re-rendering countdown bar that transitions into another 
    live re-rendering countdown bar (Trial & error + Google AI Mode helped with 
    this one)
  </li>
  <li>
    Figuring out which roles need to be given in a Firebase project to give 
    access to the database (Trial & error + Google AI Overview)
  </li>
</ul>


<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->


<h2>Week 4/Sprint 3 - Final MVP Demonstration</h2>

<h3>Requirement Completion Summary</h3>

<strong>The Functional requirements we completed are:</strong> 

<ul>
  <li>Users can create tasks, and to edit them</li>
  <li>Users can mark tasks as backlog, doing, review, and done</li>
  <li>Users can set task priorities and deadlines</li>
  <li>Allow so users can communicate with people in their project</li>
  <li>Real time updates with tasks and chat</li>
  <li>Allows users to create and invite people to a project</li>
</ul>

<strong>The Non-Functional requirements we completed are:</strong>

<ul>
  <li>The system should run in a web browser</li>
  <li>The interface should be easy for first-year students to understand</li>
  <li>The system should be able to update tasks in real-time</li>
  <li>
    The system should be able to load in under two seconds with normal 
    conditions
  </li>
  <li>The system shall allow users to create and invite people to a project</li>
  <li>Users should only be able to access authorized data</li>
  <li>User data must be securely stored</li>
</ul> 

<h3>Changes from Original Plan</h3>

<strong>
  The only changes from the original plan are the requirements we couldn’t get 
  to. We focused on completing a working MVP and were not able to implement the 
  following:
</strong>

<ul>
  <li>The system shall allow users to assign tasks to project members</li>
  <li>The system shall allow users to view analytics of their team</li>
</ul>

<h3>Additional Features Added During Development</h3>

<ul>
  <li>
    An additional feature added was synching the Kanban Board with the Calendar, 
    so the tasks created using the Kanban would show up on the Calendar. The 
    calendar would show the task date, the name, and the urgency given to the 
    task.
  </li>
  <li>
    We also added task points to give users a quick overview of workload 
    distribution across different stages of the project.
    <ul>
      <li>
        This was limited from 1 - 13, increasing in fibonacci sequencing. It was 
        put this way to capture uncertainty the larger the task was and make 
        relative size easier to determine instead of nitpicking specific 
        numbers.
        <ul>
          <li>Eg: 1, 2, 3, 5, 8, 13</li>
        </ul>
      </li>
    </ul>
  </li>
</ul>


<!-- ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ -->


<h2>Final Project Reflection</h2>

<h3>1. Project Outcome</h3>

<p>
  Our final system successfully met the main goal of creating a task management 
  and collaboration tool. The Kanban board allows users to organize tasks 
  efficiently, and the calendar integration provides a clear way to track 
  deadlines. The chat feature also allows for basic communication between users. 
  Most of the important features were implemented and working as expected during 
  testing.
</p>

<h3>2. Development Challenges</h3>

<p>
  The biggest challenge we had was integrating different parts of the system 
  into one application. Each feature was initially built separately, so 
  combining them required consistent data handling and carefully testing it all. 
  We also faced issues with debugging UI behavior and initially when we tried to 
  synchronize data. We dealt with these problems by simplifying our approach and 
  testing each feature carefully.
</p>

<h3>3. Engineering Decisions</h3>

<p>
  We chose to use React for the frontend and Firebase for real-time data 
  updates. This worked out well because it allowed us to synchronize data 
  between the board and calendar fairly easily. We also simplified our data 
  model by storing deadlines as strings instead of timestamps to reduce hassle. 
  Prioritizing core features helped us focus and avoid overcomplicating the 
  project.
</p>

<h3>4. Lessons Learned</h3>

<p>
  Overall, we learned how to integrate multiple features into a single working 
  system. We improved our understanding of React, Firebase, and how to implement 
  real-time updates. We also learned the importance of planning ahead and 
  managing time effectively. In future projects, we would start integration much 
  earlier.
</p>

<h2>Screenshots</h2>

<img width="1359" height="629" alt="Screenshot 2026-06-01 151943" src="https://github.com/user-attachments/assets/229dd461-267a-4fde-8fba-048072a5d4ed" />

<img width="1358" height="631" alt="Screenshot 2026-06-01 152113" src="https://github.com/user-attachments/assets/a0c395be-fe4c-4d16-94c2-587bd3e214dc" />

<img width="1356" height="631" alt="Screenshot 2026-06-01 152135" src="https://github.com/user-attachments/assets/cfe57893-52f3-4f9f-9541-6fb3681136a2" />

<img width="1344" height="633" alt="Screenshot 2026-06-01 152337" src="https://github.com/user-attachments/assets/f20cb0d2-850b-427c-a218-469188d1460b" />

<img width="1344" height="629" alt="Screenshot 2026-06-01 152649" src="https://github.com/user-attachments/assets/f44e9263-ff2e-45da-9364-8080aa466f02" />

<img width="1345" height="631" alt="Screenshot 2026-06-01 152831" src="https://github.com/user-attachments/assets/0f416f4c-863e-4610-872c-b4ca2ee07940" />

<img width="1343" height="631" alt="Screenshot 2026-06-01 153039" src="https://github.com/user-attachments/assets/56146ee7-f288-4cea-8856-594a727f5884" />

<img width="1344" height="630" alt="Screenshot 2026-06-01 153138" src="https://github.com/user-attachments/assets/fe1621bb-69bc-4896-9cbd-736edf301cbd" />

<img width="1344" height="631" alt="Screenshot 2026-06-01 153204" src="https://github.com/user-attachments/assets/05618f33-4e8f-4c18-bacb-61997eae593e" />

<img width="1345" height="630" alt="Screenshot 2026-06-01 153259" src="https://github.com/user-attachments/assets/3d7cac41-aadb-46cd-9492-9d4b2aef145f" />

<img width="1342" height="627" alt="Screenshot 2026-06-01 153329" src="https://github.com/user-attachments/assets/5de1f0c8-b823-42b4-b844-07b8da9b003a" />

<img width="1342" height="629" alt="Screenshot 2026-06-01 153503" src="https://github.com/user-attachments/assets/bcae3b49-ce8f-4e0d-8c38-0df29cc563b6" />

<img width="1358" height="631" alt="Screenshot 2026-06-01 153747" src="https://github.com/user-attachments/assets/40a26dd1-8bf5-4d4b-871d-eae958ff45aa" />

<img width="1342" height="631" alt="Screenshot 2026-06-01 153839" src="https://github.com/user-attachments/assets/e50032b3-c77a-4028-90ad-2f5a91253bf6" />

<img width="1343" height="629" alt="Screenshot 2026-06-01 153912" src="https://github.com/user-attachments/assets/723e9872-487a-4298-b614-177daff32222" />

<img width="1345" height="631" alt="Screenshot 2026-06-01 154022" src="https://github.com/user-attachments/assets/b4d00b84-55dc-4605-ba3e-8089303c5cc4" />

<img width="1345" height="630" alt="Screenshot 2026-06-01 154054" src="https://github.com/user-attachments/assets/5d43420b-0137-40e9-bb64-0d2a4bf02948" />

<img width="1344" height="631" alt="Screenshot 2026-06-01 154213" src="https://github.com/user-attachments/assets/6d480e05-6ec2-47d4-b12d-990b611b08cb" />

<img width="1341" height="632" alt="Screenshot 2026-06-01 154400" src="https://github.com/user-attachments/assets/6dd29ccc-ca92-4264-8926-570b2753d3bd" />

<img width="1342" height="633" alt="Screenshot 2026-06-01 154420" src="https://github.com/user-attachments/assets/bbc2e67a-016a-4f9d-98b6-04981c8ccc09" />

<img width="1344" height="632" alt="Screenshot 2026-06-01 154456" src="https://github.com/user-attachments/assets/9f68bcc7-141a-424c-96be-75b909752b55" />

<img width="1343" height="631" alt="Screenshot 2026-06-01 154539" src="https://github.com/user-attachments/assets/2728f871-3f3a-4cc9-afc5-8380dd8f8a6e" />

<img width="1344" height="629" alt="Screenshot 2026-06-01 154600" src="https://github.com/user-attachments/assets/ec9410db-154a-4761-93a5-d1b009afae25" />

<img width="1344" height="628" alt="Screenshot 2026-06-01 154618" src="https://github.com/user-attachments/assets/f89bdaaa-64c6-4a8b-925e-b5cfe2459eb1" />

<img width="1343" height="630" alt="Screenshot 2026-06-01 154654" src="https://github.com/user-attachments/assets/3d50fa08-2393-4628-8b0e-95791cdd270f" />

<img width="1342" height="631" alt="Screenshot 2026-06-01 154848" src="https://github.com/user-attachments/assets/3871ff9f-0747-4503-af13-aab85c3259f7" />

<img width="1343" height="633" alt="Screenshot 2026-06-01 155135" src="https://github.com/user-attachments/assets/c37e4927-78b2-4d51-acba-b77109acb987" />

<img width="1341" height="632" alt="Screenshot 2026-06-01 155230" src="https://github.com/user-attachments/assets/0a2f1253-400d-46e8-bc7f-13433d9d067a" />






