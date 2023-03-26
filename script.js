
//Dark theme 
var icon=document.getElementById('icon');
icon.onclick=function(){
    document.body.classList.toggle("dark-theme");
    if(document.body.classList.contains("dark-theme")){
      icon.src="src/sunn.png";
    }
    else{
        icon.src="src/moon.png";   
    }
} 

//On app load ,gets all the tasks from local storage
window.onload=loadtasks();
//On form submit,adds task
document.querySelector("form").addEventListener("submit", e => {
  e.preventDefault();
  addtask();
});

//function -loading the task
function loadtasks(){
  if (localStorage.getItem("tasks") == null) return;
  let tasks=Array.from(JSON.parse(localStorage.getItem("tasks")));
  tasks.forEach(task => {
    const list=document.querySelector("ul");
    const li=document.createElement("li");
    li.innerHTML= `<div  id="mytodo" class=" col-sm gap-auto p-7">
    <input type="checkbox" onclick=taskcomplete(this)" class="check"  ${task.completed ? "checked" : ""}>
    <input type="text" size="90" value="${task.task}" class="task ${task.completed ? "completed" : "" } " onfocus=getcurrenttask(this) " onblur="edittask(this)">
    <i class=fa fa-trash" onclick=removetask(this)"></li></div> `;
    list.insertBefore(li,list.children[0]);  
    
  });
}
let list=document.querySelector("ul");
//function-adding new task
function addtask() {
  let task=document.querySelector("form input");
  let list=document.querySelector("ul");
  let content=document.querySelector("delcontent")
  if(task.value === "") {
    alert("Please add some task!");
    return false;
  }
  // task already exist
  if (document.querySelector(`input[value="${task.value}"]`)) {
    alert("Task already exist!");
    return false;
  }
  localStorage.setItem("tasks" , JSON.stringify([...JSON.parse(localStorage.getItem("tasks") || "[]") , {task:task.value ,completed:false}]));

  let li=document.createElement("li");
  li.innerHTML = `<div id="mytodo" class=" col-sm gap-auto p-7"><input type="checkbox" onclick="taskcomplete(this)" class="check">
      <input type="text" size="90" value="${task.value}" class="task" onfocus="getcurrenttask(this)" onblur="edittask(this)">
      <i class="fa fa-trash" onclick="removetask(this)"></i> </div>`;
  list.insertBefore(li,list.children[0]);
  task.value="" 
  
}

//function-completed task
function taskcomplete(event) {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  tasks.forEach(task => {
    if (task.task === event.nextElementSibling.value) {
      task.completed = !task.completed;
    }
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  event.nextElementSibling.classList.toggle("completed");
}

//function-removing the task
function removetask(event) {
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  tasks.forEach(task => {
    if (task.task === event.parentNode.children[1].value) {
      // delete task
      tasks.splice(tasks.indexOf(task), 1);
    }
  });
  localStorage.setItem("tasks", JSON.stringify(tasks));
  event.parentElement.remove();  //removes value
}

var currenttask=null;
//function-retrieving the task
function getcurrenttask(event) {
  currenttask=event.value
}

//function-editing a task
function edittask(event){
  let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
  if (event.value === "") {
    alert("Task is empty!");
    event.value = currenttask;
    return;
  }
  // task already exist
  tasks.forEach(task => {
    if (task.task === event.value) {
      alert("Task already exist!");
      event.value = currenttask;
      return;
    }
  });
  // update task
  tasks.forEach(task => {
    if (task.task === currenttask) {
      task.task = event.value;
    }
  });
  // update local storage
  localStorage.setItem("tasks", JSON.stringify(tasks));

}

// download your planner
window.jsPDF = window.jspdf.jsPDF;
jQuery(document).ready(function() {
  $('#download-btn').click(function(){
    html2canvas(document.querySelector('#mytodo')).then((canvas) => {
      let img=canvas.toDataURL('image/png');
      // console.log(img);

      let pdf=new jsPDF('p', 'px' , [1600,1131]);
      pdf.addImage(img,'PNG',20,20,690,550);
      pdf.save("planner.pdf");
    });
  });
});


//function to delete all the todos
function deleteall(elementID) {
  localStorage.clear();
  var div = document.getElementById(elementID);
    
  while(div.firstChild) {
      div.removeChild(div.firstChild);
  }
  
}