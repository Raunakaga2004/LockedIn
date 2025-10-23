import Single_Task from "./Single_Task";
import tasks from "./temptask";

export default function EisenhowerMatrixView(){

  const allTasks = tasks.tasks; // assuming your structure is { tasks: [...] }

  // Filter tasks for each quadrant
  const importantAndUrgent = allTasks.filter(t => t.important && t.urgent);
  const importantNotUrgent = allTasks.filter(t => t.important && !t.urgent);
  const notImportantUrgent = allTasks.filter(t => !t.important && t.urgent);
  const notImportantNotUrgent = allTasks.filter(t => !t.important && !t.urgent);
  
  return <>
    <div className="grid grid-cols-2 grid-rows-2 gap-6 p-6 h-full w-full">
      
      {/* 🟥 Important & Urgent */}
      <div className="bg-slate-200 p-3 rounded-2xl shadow-sm">
        <h2 className="font-semibold mb-2 text-red-700">Important & Urgent</h2>
        {importantAndUrgent.length > 0 ? (
          importantAndUrgent.map((task, id) => (
            <Single_Task key={id} id={id} task={task} />
          ))
        ) : (
          <p className="text-sm text-gray-500">No tasks here</p>
        )}
      </div>

      {/* 🟦 Important & Not Urgent */}
      <div className="bg-slate-200 p-3 rounded-2xl shadow-sm">
        <h2 className="font-semibold mb-2 text-blue-700">Important & Not Urgent</h2>
        {importantNotUrgent.length > 0 ? (
          importantNotUrgent.map((task, id) => (
            <Single_Task key={id} id={id} task={task} />
          ))
        ) : (
          <p className="text-sm text-gray-500">No tasks here</p>
        )}
      </div>

      {/* 🟧 Not Important & Urgent */}
      <div className="bg-slate-200 p-3 rounded-2xl shadow-sm">
        <h2 className="font-semibold mb-2 text-orange-700">Not Important & Urgent</h2>
        {notImportantUrgent.length > 0 ? (
          notImportantUrgent.map((task, id) => (
            <Single_Task key={id} id={id} task={task} />
          ))
        ) : (
          <p className="text-sm text-gray-500">No tasks here</p>
        )}
      </div>

      {/* 🟩 Not Important & Not Urgent */}
      <div className="bg-slate-200 p-3 rounded-2xl shadow-sm">
        <h2 className="font-semibold mb-2 text-green-700">Not Important & Not Urgent</h2>
        {notImportantNotUrgent.length > 0 ? (
          notImportantNotUrgent.map((task, id) => (
            <Single_Task key={id} id={id} task={task} />
          ))
        ) : (
          <p className="text-sm text-gray-500">No tasks here</p>
        )}
      </div>
    </div>
  </>
}