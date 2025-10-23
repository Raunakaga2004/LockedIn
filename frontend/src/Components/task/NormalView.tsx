import Single_Task from "./Single_Task";
import tasks from "./temptask";

export default function NormalView(){
  return <>
    <div className="flex flex-row justify-between">
      {/* normal view */}

    <div className="bg-slate-200 w-full h-full">
      {/* task component */}
      <div>
        {/* task 1 */}
        {tasks.tasks.map((task, id) => 
          <Single_Task key={id} task={task} id={id}/>
        )}
      </div>
    </div>

    <div>
      {/* report component */}
      reports
    </div>

  </div> 
  </>
}