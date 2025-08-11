import { useState, useEffect } from 'react';
import { faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Axios from 'axios';
import { format, parseISO } from 'date-fns';

const ToDoList = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [input, setInput] = useState('');
  const [taskList, setTaskList] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const getTask = () => {
    setIsLoading(true);
    Axios.get('http://localhost:3001/tasks')
      .then((response) => {
        const formattedTasks = response.data.map(task => ({
          id: task.id,
          task: task.task || '', 
          date: task.date ? parseISO(task.date) : new Date(), 
          completed: task.completed === "true"
        }));
        setTaskList(formattedTasks);
        setIsLoading(false);
      })
      .catch((error) => {
        setError('無法獲取任務列表');
        console.error('Failed to fetch tasks:', error.response?.data || error.message);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getTask();
    const interval = setInterval(getTask, 3000);
    return () => clearInterval(interval); 
  }, []);
  const formatDate = (date) => {
    try {
      return format(date, 'MM/dd/yyyy');
    } catch (e) {
      console.error('Invalid date:', date);
      return '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedDate) {
      addTask();
    }
  };

  const addTask = () => {
    if (!input.trim() || !selectedDate) {
      setError('please input date or task');
      return;
    }
    
    const postData = {
      task: input,
      date: format(selectedDate,'yyyy-MM-dd'), // Send as ISO string
      completed: false,
    };
    
    Axios.post('http://localhost:3001/create', postData)
      .then((response) => {
        const newTask = {
          id: response.data.id,
          task: response.data.task,
          date: parseISO(response.data.date),
          completed: response.data.completed === "true"
        };
        setTaskList([...taskList, newTask]);
        setInput('');
        setSelectedDate(new Date());
        setError('');
      })
      .catch((error) => {
        setError('add task fail');
        console.error('Error adding task:', error.response?.data || error.message);
      });
  };
  
  const deleteTask = async (id) => {
    try{
      console.log('id:'+id);
      const response = await Axios.delete(`http://localhost:3001/delete/${id}`);
        if (response.status === 200) {
          setTaskList(taskList.filter(task => task.id !== id));
        }else{
          console.log('fail to delete task' + response.text());
        }
      }catch(error) {
        setError('delete data fail');
        console.error('Error deleting task:', error.response?.data || error.message);
      };
  }

  const toggleTask = (id, index) => {
    const updatedTasks = [...taskList];
    updatedTasks[index].completed = !updatedTasks[index].completed;
    setTaskList(updatedTasks);
    Axios.put(`http://localhost:3001/update/${id}`, {
      completed: updatedTasks[index].completed
    }).catch(error => {
      console.error('Error updating task:', error);
    });
  };


  
  return (
    <>
      <h1 className="title">Todolist</h1>
      <div className="todolist">
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="MM/dd/yyyy"
          />
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
            <FontAwesomeIcon icon={faPlus} className="cursor-pointer" onClick={addTask}/>
          
        </form>
      </div>
      <ul className="task-list">
        {isLoading ? (
          <p>Loading...</p>
        ) : taskList.length === 0 ? (
          <p>No tasks</p>
        ) : (
          taskList.map((task, index) => (
            <li
              key={task.id}
              className={task.completed ? 'task completed' : 'task'}
            >
              <span onClick={() => toggleTask(task.id, index)}>
                {task.task} ({formatDate(task.date)})
              </span>
              <FontAwesomeIcon
                icon={faTrash}
                onClick={() => deleteTask(task.id)}
                className="cursor-pointer"
              />
            </li>
          ))
        )}
      </ul>
    </>
  );
};


export default ToDoList;
