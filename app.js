const StorageCtrl = (function(){

  return {
    storeItem: function(task){

      let tasks;
      if(localStorage.getItem('tasks') === null){
        tasks = [];
        tasks.push(task);

        localStorage.setItem('tasks', JSON.stringify(tasks));
      } else {
        const tasks = JSON.parse(localStorage.getItem('tasks'));

        tasks.push(task);

        localStorage.setItem('tasks', JSON.stringify(tasks));

      }
    },  

    getItemsFromStore:  function() {
      let tasks;
      if(localStorage.getItem('tasks') === null){

        tasks = [];

      } else{
        tasks = JSON.parse(localStorage.getItem('tasks'));
      }

      return tasks;
    },

    updateStorageItem: function(itemToUpdate){
      const tasks = JSON.parse(localStorage.getItem('tasks'));

      tasks.forEach((task, index) => {
        if(task.id === itemToUpdate.id){
          tasks.splice(index, 1, itemToUpdate);
        }
      });

      localStorage.setItem('tasks', JSON.stringify(tasks));
    },

    
   
    deleteStorageItem: function(id){
      const tasks= JSON.parse(localStorage.getItem('tasks'));

      tasks.forEach((task, index) => {
        if(task.id === id){
          tasks.splice(index, 1);
        }
      })

      localStorage.setItem('tasks', JSON.stringify(tasks));
    },

    deleteFromRecent: function(id){
      const tasks= JSON.parse(localStorage.getItem('tasks'));

      tasks.forEach((task, index) => {
        if(task.id === id){
          tasks.splice(index, 1);
        }
      })

      localStorage.setItem('tasks', JSON.stringify(tasks));
    },

   
    setCompleted: function(completeTask){
      const tasks = JSON.parse(localStorage.getItem('tasks'));

      tasks.forEach((task) => {
        if(task.id === completeTask.id){
          let complete = completeTask.isCompleted;

          task.isCompleted = complete;
        }
      });

      localStorage.setItem('tasks', JSON.stringify(tasks));
    },

    storeCompleted: function(completed){
      let completedTasks;
      if(localStorage.getItem('completedTasks') === null){
        completedTasks = [];
        completedTasks.push(completed);

        localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
      } else {
        const completedTasks = JSON.parse(localStorage.getItem('completedTasks'));

        completedTasks.push(completed);

        localStorage.setItem('completedTasks', JSON.stringify(completedTasks));

      }
    },

    getCompletedFromStore:  function() {
      let completedTasks;
      if(localStorage.getItem('completedTasks') === null){

        completedTasks = [];

      } else{
        completedTasks = JSON.parse(localStorage.getItem('completedTasks'));
      }

      return completedTasks;
    },


    clearItemsFromStorage: function(){
      let completedTasks = JSON.parse(localStorage.getItem('completedTasks'));

      completedTasks = [];

      localStorage.setItem('completedTasks', JSON.stringify(completedTasks));
    },



  }
})();

const ItemCtrl = (function() {

  const Todo = function(id, task, isCompleted=false){
    this.id = id;
    this.task = task;
    this.isCompleted = isCompleted;
  }

  const data = {
    tasks: StorageCtrl.getItemsFromStore(),
    completedTasks: StorageCtrl.getCompletedFromStore(),
    
    // tasks: [
    //   {id: 0, task: "Learn React", isCompleted: false},
    //   {id: 1, task: "Learn Vue.js",  isCompleted: false},
    //   {id: 2, task: "Have some lunch",  isCompleted: false},
    // ],
    currentTask: null
  }

  return {
  getItems: function(){
    return data.tasks;
  },

  getRecentItems: function(){

    const items = ItemCtrl.getItems();

    let recent = [];

    items.forEach(item => {
      if(item.isCompleted === false){
        recent.push(item);
      }
    })

    return recent;
   
  },

  addItem: function(task){
    let ID;

    let count = data.tasks.length;
    
      if(count > 0 ){
        ID = data.tasks[count - 1].id + 1;
      }
      else{
        ID = 0;
      }

    const newTask = new Todo(ID, task);

    data.tasks.push(newTask);

    return newTask;
  },

  getItemById: function(id){
    let items = ItemCtrl.getItems();

    let found;

    items.forEach(item => {
      if(item.id === id){
        found = item;
      }
    })

    return found;
  },

  updateItem: function(task){
  let items = ItemCtrl.getItems();

  const currentItem = ItemCtrl.getCurrentItem();

  let found;
  
  items.forEach(item => {
    if(item.id === currentItem.id){
      item.task = task;
      found = item;
    }
  })

  return found;

  },

  deleteItem: function(){
    const itemToDelete = ItemCtrl.getCurrentItem();

    const ids = data.tasks.map(item => {
      return item.id;
    })

    const index = ids.indexOf(itemToDelete.id);
    
    data.tasks.splice(index, 1);
    
    StorageCtrl.deleteStorageItem(itemToDelete.id);

    document.querySelector('.modale').classList.remove('opened');

    UICtrl.deleteListItem(itemToDelete.id);

    UICtrl.showRecentCount();

  },

  removeItemFromRecent: function(item){
    const ids = data.tasks.map(item => {
      return item.id;
    })

    const index = ids.indexOf(item.id);
    
    data.tasks.splice(index, 1);
    
    StorageCtrl.deleteFromRecent(item.id);
  },

  clearAllItems: function(){
      data.completedTasks = [];
  },

  setCurrentItem: function(item){
    data.currentTask = item;
  },

  getCurrentItem: function(){
    const item = data.currentTask;
    return item;
  },

  isCompleted: function(){
    const item = ItemCtrl.getCurrentItem();
    item.isCompleted = true;

    return item;
  },

  getCompletedTasks: function(){
    return data.completedTasks;

    // console.log(completedTasks);
  },

  logData: function(){ 
    return data;
  }
}

})();

const UICtrl = (function() {
  const UISelectors = {
    
    taskInput: '.add__task--input',
    itemsList: '.task__list',
    listItems: '.task__list li',
    addBtn: '.add__task--btn',
    updateBtn: '.update__task--btn',
    editBtn: '#edit-item',
    deleteBtn: '.remove-item',
    taskDetails: '.dateToday',
    completedTask: '#complete__task',
    recentTask: '#incomplete__task',
    recentCount: '.badge__incomplete',
    completedCount: '.badge__complete'
  }



  return {
    getSelectors: function(){
      return UISelectors;
    },

    getInput: function(){
      const task = document.querySelector(UISelectors.taskInput).value;
      return task;
    },

    addListItem: function(item){
      const li = document.createElement('li');

      li.className = 'task__list--item';

      li.id = `task-${item.id}`;

      li.innerHTML = `
      <p>${item.task}</p>
      <div class="control__icons">
          <a href="#"><i id="check-btn" class="check-item fas fa-check fa-xs"></i></a>
          <a href="#"><i id="edit-btn" class="edit-item fas fa-pen fa-xs"></i></a>
          <a href="#"><i id="remove-btn" class="remove-item openmodale fas fa-trash-alt fa-xs"></i></i></a>
      </div>
      `
      document.querySelector(UISelectors.itemsList).insertAdjacentElement('afterbegin', li);
    },

    populateitemsList: function(){
      const items = ItemCtrl.getItems();

      let output = '';
      items.forEach(item => {
        let count = items.length;
        if(item.isCompleted === false && count > 0){
          output += `
          <li class="task__list--item" id="task-${item.id}">
          <p>${item.task}</p>
          <div class="control__icons">
              <a href="#"><i id="check-btn" class="check-item fas fa-check fa-xs"></i></a>
              <a href="#"><i id="edit-btn" class="edit-item fas fa-pen fa-xs"></i></a>
              <a href="#"><i id="remove-btn" class="remove-item openmodale fas fa-trash-alt fa-xs"></i></i></a>
          </div>
        </li>
          `
          document.querySelector(UISelectors.itemsList).innerHTML = output;
        }
     

      })
    },

    populateCompleted: function(items){   
      let output = ``;

      items.forEach(item => {
        output += `
        
        <li class="task__list--item" id="task-01">
        <p>${item.task}</p>       
        </li>
        `
        document.querySelector(UISelectors.itemsList).innerHTML = output;
      });

      
    },

    showRecentCount: function(){
      const recent = ItemCtrl.getRecentItems();

      let count = recent.length;

      if(count > 0){
        UICtrl.showRecentBadge(count);
      }

    },

    // removeListItem: function(id){
    //   const item = document.querySelector(`#task-${id}`);

    //   item.remove();
    // },

    updateListItem: function(item){
      let listItems = document.querySelectorAll(UISelectors.listItems);

      listItems = Array.from(listItems);

      

      listItems.forEach(listItem => {
        const itemID = listItem.id;

        // console.log(itemID);
        

        if(itemID === `task-${item.id}`){
          document.querySelector(`#${itemID}`).innerHTML = `
          <p>${item.task}</p>
          <div class="control__icons">
              <a href="#"><i id="check-btn" class="check-item fas fa-check fa-xs"></i></a>
              <a href="#"><i id="edit-btn" class="edit-item fas fa-pen fa-xs"></i></a>
              <a href="#"><i id="remove-btn" class="remove-item openmodale fas fa-trash-alt fa-xs"></i></i></a>
          </div>
          `
        }
      })
   

  },

  deleteListItem: function(id){
    const item = document.querySelector(`#task-${id}`);

    item.remove();

  },

  removeListItems: function(){
    let listItems = document.querySelectorAll(UISelectors.listItems)

    listItems = Array.from(listItems);

    listItems.forEach(listItem => {
      listItem.remove();
    })
  },

  addItemToForm: function(){
      const item = ItemCtrl.getCurrentItem();

      document.querySelector(UISelectors.taskInput).value = item.task;

  },

  showEditState: function(){
     document.querySelector(UISelectors.addBtn).style.display = 'none';
     document.querySelector(UISelectors.updateBtn).style.display = 'inline';

    },

  hideEditState: function(){
     document.querySelector(UISelectors.updateBtn).style.display = 'none';
     document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },

  hideClearState: function(){
    document.querySelector('.clear__all').style.display = 'none';
  },

  showClearState: function(){
    document.querySelector('.clear__all').style.display = 'grid';
  },

  showModal: function(){
      document.querySelector('.modale').classList.add('opened');
    
      document.querySelector('.closemodale').addEventListener('click', (e) => {
        e.preventDefault();
        document.querySelector('.modale').classList.remove('opened');
    })

    document.querySelector('.no__btn').addEventListener('click', (e) => {
      e.preventDefault();
      document.querySelector('.modale').classList.remove('opened');
    });
    },

    showCompletedBadge: function(count){
      if(count > 0){
        document.querySelector(UISelectors.completedCount).textContent = count;
        document.querySelector(UISelectors.completedCount).style.display = 'flex';    
      }
      else {
        document.querySelector(UISelectors.completedCount).textContent = count;
        document.querySelector(UISelectors.completedCount).style.display = 'none'; 
      }
      
    },

    showRecentBadge: function(count){
      if(count > 0){
        document.querySelector('.recent__count').textContent = `${count} Active Tasks`;
        document.querySelector(UISelectors.recentCount).textContent = count;
        document.querySelector(UISelectors.recentCount).style.display = 'flex';
      }
      else {
        document.querySelector('.recent__count').textContent = `No Active Tasks`;
        document.querySelector(UISelectors.recentCount).textContent = count;
        document.querySelector(UISelectors.recentCount).style.display = 'none';
      }
    
    },

   showTodaysDate: function(date){
      
      let monthNames = [
        "January", "February", "March",
        "April", "May", "June", "July",
        "August", "September", "October",
        "November", "December"
      ];
    
      let day = date.getDate();
      let monthIndex = date.getMonth();
      let year = date.getFullYear();
  
      const dateToday = `${day}th ${monthNames[monthIndex]} ${year}`;

      document.querySelector(UISelectors.taskDetails).textContent = dateToday;
  
  },

  refreshPage: function(){
    window.location.reload();
  },

    clearInput: function(){
      document.querySelector(UISelectors.taskInput).value = '';
    }
  }
  
})();

const App = (function(ItemCtrl, StorageCtrl, UICtrl) {

  const loadEventListeners = function(){

    const UISelectors = UICtrl.getSelectors();

    document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

    document.querySelector(UISelectors.itemsList).addEventListener('click', itemCheckClick);

    document.querySelector(UISelectors.itemsList).addEventListener('click', itemEditClick);

    document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

    document.addEventListener('keypress', (e)=> {
      if(e.keyCode === 13 || e.which === 13){
        e.preventDefault();
        return false;
      }
    })


    document.querySelector(UISelectors.itemsList).addEventListener('click', itemDeleteClick);

    document.querySelector('.yes__btn').addEventListener('click', ItemCtrl.deleteItem);

    document.querySelector(UISelectors.completedTask).addEventListener('click', showCompletedTasks);

    document.querySelector(UISelectors.recentTask).addEventListener('click', showRecentTasks);

    document.querySelector('.clear__all').addEventListener('click', clearCompleted);



    
  }

  const itemAddSubmit = function(e){
    const input = UICtrl.getInput();

    if(input !== ''){

    const newTask =  ItemCtrl.addItem(input);

    StorageCtrl.storeItem(newTask);

    UICtrl.addListItem(newTask);

    UICtrl.showRecentCount();

    UICtrl.clearInput();

    }
    e.preventDefault();
  }

  const itemCheckClick = function(e){

    let classList = e.target.classList;

    if(classList.contains('check-item')){
     let listID = e.target.parentNode.parentNode.parentNode.id;

     const listIdArr = listID.split('-');

     const id = parseInt(listIdArr[1]);

     const itemToEdit = ItemCtrl.getItemById(id);

    ItemCtrl.setCurrentItem(itemToEdit);

    const completedTask = ItemCtrl.isCompleted();

    // console.log(completedTask);

    StorageCtrl.setCompleted(completedTask);

    StorageCtrl.storeCompleted(completedTask);

    ItemCtrl.removeItemFromRecent(ItemCtrl.getCurrentItem());

    UICtrl.refreshPage();

    UICtrl.showCompletedBadge();

    UICtrl.showRecentBadge();

    UICtrl.deleteListItem(itemToEdit.id);

    }

    e.preventDefault();

  }

  const itemEditClick = function(e){

    let classList = e.target.classList;

    if(classList.contains('edit-item')){
     let listID = e.target.parentNode.parentNode.parentNode.id;

     const listIdArr = listID.split('-');

     const id = parseInt(listIdArr[1]);

     const itemToEdit = ItemCtrl.getItemById(id);

    ItemCtrl.setCurrentItem(itemToEdit);

    UICtrl.addItemToForm();

    UICtrl.showEditState();

    }

    e.preventDefault();

  }

  const itemUpdateSubmit = function(e){
    const input = UICtrl.getInput();

    const updatedItem = ItemCtrl.updateItem(input);

    StorageCtrl.updateStorageItem(updatedItem);

    UICtrl.updateListItem(updatedItem);

    UICtrl.showRecentCount();

    UICtrl.clearInput();

    UICtrl.hideEditState();


    e.preventDefault();
  }

  const itemDeleteClick = function(e){

    let classList = e.target.classList;

    if(classList.contains('remove-item')){
     let listID = e.target.parentNode.parentNode.parentNode.id;

     const listIdArr = listID.split('-');

     const id = parseInt(listIdArr[1]);

     const itemToEdit = ItemCtrl.getItemById(id);

     ItemCtrl.setCurrentItem(itemToEdit);

     UICtrl.showModal();

    }

  

    e.preventDefault();

  }



// }

    const showCompletedTasks = function(){
      const completed = ItemCtrl.getCompletedTasks();

      let count = completed.length;

      if(count !== 0){
      
       UICtrl.populateCompleted(completed);
       UICtrl.showClearState();
      }
      else {
        console.log('No recent tasks');
      }

    }

    const clearCompleted = function(){
      ItemCtrl.clearAllItems();

      UICtrl.removeListItems();

      StorageCtrl.clearItemsFromStorage();

      UICtrl.hideClearState();

      UICtrl.showCompletedBadge();
    }

    const showRecentTasks = function(){
      const items = ItemCtrl.getRecentItems();

      if(items.length > 0){
        UICtrl.populateitemsList();
      }else {
        UICtrl.refreshPage();
      }
      
    }
  

  return {
    init: function() {

      UICtrl.hideEditState();

      UICtrl.hideClearState();

      UICtrl.populateitemsList();
      
      loadEventListeners();

      UICtrl.showTodaysDate(new Date());

      const items = ItemCtrl.getCompletedTasks()

      UICtrl.showCompletedBadge(items.length);

      UICtrl.showRecentCount();

    }
  }
})(ItemCtrl, StorageCtrl, UICtrl);

App.init();