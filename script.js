document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('task-form');
  const todayList = document.getElementById('today-tasks');
  const upcomingList = document.getElementById('upcoming-tasks');
  const doneList = document.getElementById('done-tasks');
  const calendarEl = document.getElementById('calendar');

  function toggleTheme() {
    document.body.classList.toggle('dark');
    localStorage.setItem('theme', document.body.classList.contains('dark') ? 'dark' : 'light');
  }

  window.toggleTheme = toggleTheme;

  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark');
  }

  function loadClock() {
    const clockEl = document.getElementById('clock');
    if (!clockEl) return;
    setInterval(() => {
      const now = new Date();
      clockEl.textContent = now.toLocaleTimeString();
    }, 1000);
  }

  function loadCalendar() {
    if (!calendarEl) return;
    const now = new Date();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
                        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const year = now.getFullYear();
    const month = now.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    let html = `<h3>${monthNames[month]} ${year}</h3><table><tr>`;
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    html += days.map(d => `<th>${d}</th>`).join('') + "</tr><tr>";

    for (let i = 0; i < firstDay; i++) html += "<td></td>";
    for (let d = 1; d <= daysInMonth; d++) {
      if ((firstDay + d - 1) % 7 === 0) html += "</tr><tr>";
      html += `<td>${d}</td>`;
    }
    html += "</tr></table>";
    calendarEl.innerHTML = html;
  }

  function saveTasks(tasks) {
    localStorage.setItem('zentraTasks', JSON.stringify(tasks));
  }

  function renderTask(task, index, targetList) {
    const li = document.createElement('li');
    li.className = task.done ? 'done' : '';

    const span = document.createElement('span');
    span.textContent = `${task.title} - ${new Date(task.date).toLocaleString()}`;

    const btns = document.createElement('div');
    btns.style.display = 'flex';
    btns.style.gap = '6px';

    const toggleBtn = document.createElement('button');
    toggleBtn.textContent = task.done ? 'Undo' : 'Done';
    toggleBtn.onclick = () => {
      const tasks = JSON.parse(localStorage.getItem('zentraTasks')) || [];
      tasks[index].done = !tasks[index].done;
      saveTasks(tasks);
      loadTasks();
    };

    const editBtn = document.createElement('button');
    editBtn.textContent = 'Edit';
    editBtn.onclick = () => {
      const title = prompt('Edit Task Title:', task.title);
      const date = prompt('Edit Task Date:', task.date);
      if (title && date) {
        const tasks = JSON.parse(localStorage.getItem('zentraTasks')) || [];
        tasks[index] = { ...tasks[index], title, date };
        saveTasks(tasks);
        loadTasks();
      }
    };

    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = 'X';
    deleteBtn.onclick = () => {
      const tasks = JSON.parse(localStorage.getItem('zentraTasks')) || [];
      tasks.splice(index, 1);
      saveTasks(tasks);
      loadTasks();
    };

    btns.appendChild(toggleBtn);
    btns.appendChild(editBtn);
    btns.appendChild(deleteBtn);

    li.appendChild(span);
    li.appendChild(btns);
    targetList.appendChild(li);
  }

  function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem('zentraTasks')) || [];
    const now = new Date();

    if (todayList) todayList.innerHTML = '';
    if (upcomingList) upcomingList.innerHTML = '';
    if (doneList) doneList.innerHTML = '';

    tasks.forEach((task, index) => {
      const taskDate = new Date(task.date);
      if (task.done && doneList) renderTask(task, index, doneList);
      else if (taskDate.toDateString() === now.toDateString() && todayList)
        renderTask(task, index, todayList);
      else if (taskDate > now && upcomingList)
        renderTask(task, index, upcomingList);
    });
  }

  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const title = document.getElementById('task-title').value;
      const date = document.getElementById('task-date').value;

      const newTask = { title, date, done: false };
      const tasks = JSON.parse(localStorage.getItem('zentraTasks')) || [];
      tasks.push(newTask);
      saveTasks(tasks);
      form.reset();
      loadTasks();
    });
  }

  loadClock();
  loadCalendar();
  loadTasks();
});