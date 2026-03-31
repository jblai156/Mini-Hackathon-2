const lowPriorityIcon = (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="blue" strokeWidth="3">
    <path d="M5 9l7 7 7-7" />
  </svg>
)
const mediumPriorityIcon = (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="orange" strokeWidth="2">
    <path d="M5 10h14" />
    <path d="M5 14h14" />
  </svg>
)
const highPriorityIcon = (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="red" strokeWidth="2">
    <path d="M5 15l7-7 7 7" />
  </svg>
)

const TaskCard = ({task}) => {
    return <div className="border border-secondary rounded-4 px-2 my-2 bg-light text-black">
    <div className="h3 fw-semibold mb-2">
      {task.title}
    </div>
    <div className="h4 d-flex gap-4 justify-content-between py-2 text-secondary fw-normal text-secondary-emphasis">
      <div className="d-flex gap-2">
        <div>{task.id}</div>
        {task.priority === 'high' && highPriorityIcon}
        {task.priority === 'medium' && mediumPriorityIcon}
        {task.priority === 'low' && lowPriorityIcon}
      </div>
      <div>{task.points}</div>
    </div>
    </div>
  }
  
export const tasks = [
  { 
    title: 'Do Market Research',
    id: 'BUS-1',
    status:'todo',
    priority: 'high',
    points: 5 
  },
  { 
    title: 'Do Market Something',
    id: 'BUS-2',
    status:'todo',
    priority: 'low',
    points: 2 
  },
  { 
    title: 'Do Market Research',
    id: 'BUS-3',
    status:'done',
    priority: 'high',
    points: 8 
  },
  { 
    title: 'Do Market Research',
    id: 'BUS-4',
    status:'inProgress',
    priority: 'medium',
    points: 3 
  },
  ]

export const statuses = ['todo', 'inProgress', 'done']
export const priorities = ['low', 'medium', 'high']

export default TaskCard