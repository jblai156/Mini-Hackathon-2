  const TaskCard = ({title, id, points}) => {
    return <div className="border border-secondary rounded-5 px-2 m-2 bg-light text-black">
    <div className="display-1 fw-semibold mb-5">
      {title}
    </div>
    <div className="display-3 d-flex gap-4 justify-content-between py-2 text-secondary fw-normal text-secondary-emphasis">
      <div>{id}</div>
      <div>{points}</div>
    </div>
    </div>
  }

  export default TaskCard