  const TaskCard = ({task}) => {
    return <div className="border border-secondary rounded-4 px-2 my-2 bg-light text-black">
    <div className="h3 fw-semibold mb-2">
      {task.title}
    </div>
    <div className="h4 d-flex gap-4 justify-content-between py-2 text-secondary fw-normal text-secondary-emphasis">
      <div>{task.id}</div>
      <div>{task.points}</div>
    </div>
    </div>
  }
  
export const tasks = [
  { 
    title: 'Do Market Research',
    id: 'BUS-1',
    status:'todo',
    points: 5 
  },
  { 
    title: 'Do Market Something',
    id: 'BUS-2',
    status:'todo',
    points: 2 
  },
  { 
    title: 'Do Market Research',
    id: 'BUS-3',
    status:'done',
    points: 8 
  },
  { 
    title: 'Do Market Research',
    id: 'BUS-4',
    status:'inProgress',
    points: 3 
  },
  ]

export const statuses = ['todo', 'inProgress', 'done']

export default TaskCard