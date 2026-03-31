  const TaskCard = ({ task }) => {
    return (
    <div className="border border-secondary rounded-5 px-2 m-2 bg-light text-black">

    <div className="display-1 fw-semibold mb-5">
      {task.title}
    </div>

    <div className="display-3 d-flex gap-4 justify-content-between py-2 text-secondary fw-normal text-secondary-emphasis">
      <div>{task.id}</div>
      <div>{task.points}</div>
    </div>
    
    </div>
    )
  }

const tasks = [
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

const statuses = ['todo', 'inProgress', 'done']

export default TaskCard