import { useState } from 'react';
import TaskCard    from './TaskCard';
import AddTaskForm from './AddTaskForm';

const ColumnList = ({ column, tasks, boardId, onAddTask, onDeleteTask, onDeleteColumn }) => {
  const [showForm, setShowForm] = useState(false);

  const handleAdd = async (taskData) => {
    await onAddTask(taskData);
    setShowForm(false);
  };

  return (
    <div style={styles.column}>
      {/* Column header */}
      <div style={styles.header}>
        <h3 style={styles.title}>{column.title}</h3>
        <button onClick={() => onDeleteColumn(column._id)} style={styles.colDeleteBtn}
          title='Delete column'>x</button>
      </div>

      {/* Task cards */}
      <div style={styles.taskList}>
        {tasks.map((task) => (
          <TaskCard key={task._id} task={task} onDelete={onDeleteTask} />
        ))}
      </div>

      {/* Add task */}
      {showForm ? (
        <AddTaskForm
          columnId={column._id}
          boardId={boardId}
          onAdd={handleAdd}
          onCancel={() => setShowForm(false)}
        />
      ) : (
        <button onClick={() => setShowForm(true)} style={styles.addTaskBtn}>
          + Add a task
        </button>
      )}
    </div>
  );
};

const styles = {
  column:       { background:'#ebecf0', borderRadius:'8px', padding:'12px',
                  width:'272px', minWidth:'272px', maxHeight:'calc(100vh - 120px)',
                  overflowY:'auto', flexShrink:0 },
  header:       { display:'flex', justifyContent:'space-between',
                  alignItems:'center', marginBottom:'10px' },
  title:        { fontSize:'14px', fontWeight:'700', color:'#172b4d' },
  colDeleteBtn: { background:'none', border:'none', color:'#97a0af',
                  cursor:'pointer', fontSize:'18px', lineHeight:1 },
  taskList:     { marginBottom:'8px' },
  addTaskBtn:   { width:'100%', padding:'8px', background:'none',
                  border:'none', textAlign:'left', color:'#5e6c84',
                  cursor:'pointer', fontSize:'14px', borderRadius:'4px' }
};
export default ColumnList;
