import React, { useState } from 'react';
import { faPlus,faTrash} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";

const ToDoList =() =>{
  const [selectedDate ,setSelectedDate] = useState(new Date());
  const [tasks ,setTasks] = useState([]);
  const [input ,setInput] = useState('');
  
  const handleSubmit = (e) =>{
    e.preventDefault();
     console.log('date:'+selectedDate);
    if(selectedDate){
      // eslint-disable-next-line no-undef
      const formattedDate = format(selectedDate, 'MM/dd/yyyy');
      console.log('date:'+formattedDate);

    }
  }
  const addTask = () => {
    if(input.trim() && selectedDate) {
      setTasks([...tasks, {
        text:input,date:selectedDate, completed:false}]);
      setInput('');
      console.log('task:'+input)
    }
  }

  const toggleTask = (index) =>{
    const newTasks = tasks.map((task, i) =>
      i === index ? { ...task, completed: !task.completed}:task
    );
    setTasks(newTasks);
  }
  
  const deleteTask = (index) => {
    const newTasks = tasks.filter ((_, i) => i !== index);
    setTasks(newTasks);
  }
  const formatDate = (date) => {
    if (date)  {
    return date.toLocaleDateString('zh-TW', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };
  }

  return (
    <>
    <h1 className="title">Todolist</h1>
    <div className="todolist">
      <div className="date">
        <h1>{formatDate(selectedDate)}</h1>
      </div>
      <form onSubmit={handleSubmit}>
      <DatePicker
        selected={selectedDate}
        onChange={(date) =>setSelectedDate(date)} dateFormat="MM/dd/yyyy"/>
      
      <input type='text' value ={input} onChange={(e) => setInput (e.target.value)}></input>
      <FontAwesomeIcon icon={faPlus} onClick={addTask}>
      </FontAwesomeIcon>
      </form>
    </div>
      <ul className='task-list'>
        {tasks.map((task, index) =>(
          <li key={index} className={task.completed ?'task completed' : 'task'}>
          <span onClick={() => toggleTask(index)}>{task.text}</span>
          <FontAwesomeIcon icon={faTrash} onClick={() => deleteTask(index)}>
          </FontAwesomeIcon>
          </li>
        ))}
      </ul>
    </>
  );
};

export default ToDoList;