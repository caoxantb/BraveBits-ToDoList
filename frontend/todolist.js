class ToDoList {
  //attributes and constructors
  el;
  data;

  constructor(el, data = []) {
    this.el = el;
    this.data = data;
  }

  //render data and pass to object's innerHTML
  render = (data) => {
    console.log(data);
    const tasks = data.map((task) => {
      const styleSpanWhenChecked = task.checked
        ? "text-decoration:line-through;text-decoration-thickness:2px;"
        : "";

      return `
            <li id=${task.id} class="list">
                <input  type="checkbox" 
                        class="checkbox"
                        id="checkbox-${task.id}" 
                        ${task.checked ? "checked" : ""}>       
                <span class="taskName" 
                      id="taskName-${task.id}" 
                      style=${styleSpanWhenChecked}>${task.name}
                </span>
                <span class="delete" id="delete-${task.id}">\u00D7</span>
            </li>
        `;
    });
    document.querySelector(".sleepyDiv").style.display =
      tasks.length > 0 ? "none" : "flex";
    this.el.innerHTML = tasks.join("");
  };

  getData = async () => {
    const list = await getListById("todolist");
    this.data = list.tasks;
  };

  //create a new task and add to object's data
  addTask = async () => {
    if (inputTask.value === "") return;
    const taskName = inputTask.value;
    const newTask = await postTaskToOneList("todolist", {
      name: taskName,
      checked: false,
    });
    this.data = [...this.data, newTask];
    this.render(this.data);
    inputTask.value = "";
  };

  //add click event listener to checkbox
  onClickCheckbox = () => {
    this.el.addEventListener("click", async (event) => {
      if (event.target.matches(".checkbox")) {
        const checkbox = document.getElementById(event.target.id);
        const li = checkbox.closest(".list");
        await updateCheckedStatus("todolist", {
          id: li.id,
          checked: checkbox.checked,
        });
        const newTasksArray = [...this.data];
        newTasksArray.map((task) => {
          if (task.id === li.id) task.checked = !task.checked;
        });
        this.data = [...newTasksArray];
        this.render(this.data);
      }
    });
  };

  //add click event listener to delete span
  //filter to remove the task from the list
  onClickDelete = () => {
    this.el.addEventListener("click", async (event) => {
      if (event.target.matches(".delete")) {
        const del = document.getElementById(event.target.id);
        const li = del.closest(".list");
        await deleteTaskFromOneList("todolist", li.id);
        const tasksLoaded = this.data;
        this.data = tasksLoaded.filter((task) => task.id !== li.id);
        this.render(this.data);
      }
    });
  };

  //reorder from one index to another
  reorder = async (from, to) => {
    const newTasksArray = [...this.data];
    newTasksArray.splice(to, 0, newTasksArray.splice(from, 1)[0]);
    await updateListById({ id: this.el.id, tasks: newTasksArray });
    this.data = [...newTasksArray];
    this.render(this.data);
  };

  onMouseDown = () => {
    this.el.addEventListener("mousedown", (event) => {
      if (event.target.matches(".taskName")) {
        const spanLi = document.getElementById(event.target.id);
        const li = spanLi.closest(".list");

        const liIndexMoveFrom = this.data.findIndex((l) => l.id === li.id);

        const liClone = li.cloneNode();
        liClone.innerHTML = li.innerHTML;
        this.el.appendChild(liClone);

        //get coordinates of <li>
        const rect = li.getBoundingClientRect();

        //create a clone <li> based on the coordinates retrieved
        liClone.style.left = rect.left;
        liClone.style.top = rect.top;
        let liCloneBottom = rect.top + rect.height;
        const liCloneBottomBeforeMove = liCloneBottom;

        //styling the clone as absolute so the relativity of <ul> does not affect its movement
        //hide the original <li> when onmousedown is detected, leaving only the clone visible
        liClone.style.position = "absolute";
        // liClone.style.width = "800px";
        liClone.style.zIndex = 1000;
        liClone.style.backgroundColor = "whitesmoke";
        li.style.visibility = "hidden";

        //get the correlative distance between the mouseclick point and the xy-axis
        //when the mouse moves, the <li> moves accordingly
        let distLeft = event.clientX - rect.left;
        let distTop = event.clientY - rect.top;

        //initial move
        move(event.pageX, event.pageY);

        //move
        function move(pageX, pageY) {
          liClone.style.left = pageX - distLeft + "px";
          liClone.style.top = pageY - distTop + "px";
          liCloneBottom = pageY - distTop + rect.height;
        }

        //mousemove
        const onMouseMove = (event) => {
          move(event.pageX, event.pageY);
        };

        const onMouseUp = async (event) => {
          console.log(event.target.closest(".list"));
          let liIndexMoveTo;
          if (liCloneBottom > liCloneBottomBeforeMove) {
            liIndexMoveTo =
              this.data.findIndex(
                (l) =>
                  document.getElementById(l.id).getBoundingClientRect().bottom >
                  liCloneBottom
              ) - 1;
            if (liIndexMoveTo < 0) liIndexMoveTo = this.data.length - 1;
          } else {
            liIndexMoveTo = this.data.findIndex(
              (l) =>
                document.getElementById(l.id).getBoundingClientRect().top >
                liCloneBottom - rect.height
            );
          }

          await this.reorder(liIndexMoveFrom, liIndexMoveTo);

          document.removeEventListener("mousemove", onMouseMove);
          document.removeEventListener("mouseup", onMouseUp);
        };

        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
      }
    });
  };
}

//initiate object
const ul = new ToDoList(document.getElementById("todolist"));

ul.getData().then(() => {
  ul.render(ul.data);
});

//add task when input button/enter key is fired
const button = document.querySelector("button");
const inputTask = document.getElementById("inputTask");

button.addEventListener("click", async () => {
  await ul.addTask();
});

inputTask.addEventListener("keypress", async (e) => {
  if (e.key === "Enter") {
    e.preventDefault();
    ul.addTask();
  }
});

ul.onClickDelete();
ul.onClickCheckbox();
ul.onMouseDown();
