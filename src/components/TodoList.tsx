import { useEffect, useState } from "react";
import { Trash2, Pencil, CheckCheck } from "lucide-react";

type Task = {
  text: string;
  checked: boolean;
};

export const TodoList = () => {
  const [task, setTask] = useState<string>("");
  const [taskList, setTaskList] = useState<Task[]>([]);
  const [isEditing, setIsEditing] = useState<number | null>(null);
  const [editTask, setEditTask] = useState<string>("");

 useEffect(() => {
  if(typeof window !== "undefined"){
  
    const savedTasks = localStorage.getItem("taskList");
    if(savedTasks) {
      try {
        setTaskList(JSON.parse(savedTasks));
      } catch (error) {
        console.log("Failed to parse tasks from localStorage:", error);
      
      }
    }
    
  }
 }, []);

 useEffect(() => {
  if(typeof window !== "undefined" && taskList.length > 0){
    localStorage.setItem("taskList", JSON.stringify(taskList))
  }
  
  
 }, [taskList]);


  const addTask = () => {
    if (task.trim() === "") {
      alert("input a task");
    } else {
      setTaskList([...taskList, { text: task, checked: false }]);
      setTask("");
    }
  };

  const deleteTask = (index: number) => {
    setTaskList(taskList.filter((_, i) => i !== index));
  };
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      addTask();
    }
  };

  const handleEdit = (index: number) => {
    setIsEditing(index);
    setEditTask(taskList[index].text);
  };

  const handleSaveEdit = (index: number) => {
    const updateTaskList = [...taskList];
    updateTaskList[index].text = editTask;
    setTaskList(updateTaskList);
    setIsEditing(null);
    setEditTask("");
  };
  const handleToggleComplete = (index: number) => {
    const updateTaskList = [...taskList];
    updateTaskList[index].checked = !updateTaskList[index].checked;
    setTaskList(updateTaskList);
  };

  return (
    <div className="bg-purple-600/80 w-[380px] md:w-2/4 pb-5 rounded-lg shadow-md mt-10">
      <h1 className="md:text-5xl text-3xl text-center mt-8">My ToDo List</h1>
      <div className="flex justify-center mt-4">
        <input
          type="text"
          placeholder="Add some task"
          className="bg-gray-200 rounded-l-md outline-none w-[80%] p-2"
          value={task}
          onKeyDown={handleKeyDown}
          onChange={(e) => setTask(e.target.value)}
        />
        <button
          className="px-3 bg-lime-300 rounded-r-md font-bold"
          onClick={addTask}
        >
          add
        </button>
      </div>

      <div className="mx-4 md:mx-10">
        <ul className="mt-4">
          {taskList.map((task, index) => (
            <li
              key={index}
              className="capitalize border rounded-md flex justify-between p-2 mb-2 break-all"
            >
              <div className="w-full">
                {isEditing === index ? (
                  <input
                    type="text"
                    value={editTask}
                    className="bg-gray-200 rounded-md outline-none p-2 w-[99%]"
                    onChange={(e) => setEditTask(e.target.value)}
                  />
                ) : (
                  <div className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      className=" bg-lime-200 min-w-4 h-4 
                appearance-none rounded-sm checked:bg-lime-300 checked:before:content-['✔']
                flex items-center justify-center"
                      checked={task.checked}
                      onChange={() => handleToggleComplete(index)}
                    />
                    <span> {task.text} </span>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                {isEditing === index ? (
                  <button onClick={() => handleSaveEdit(index)}>
                    <CheckCheck />
                  </button>
                ) : (
                  <button onClick={() => handleEdit(index)}>
                    <Pencil size={18} />
                  </button>
                )}

                <button onClick={() => deleteTask(index)}>
                  <Trash2 size={18} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
