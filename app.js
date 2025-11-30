// ===================================================
// MOTIVATION MESSAGES
// ===================================================

const motivasiList = [
    "Semangat! Satu tugas lagi membuatmu lebih maju!",
    "Ingat, masa depanmu dibangun hari ini.",
    "Kecilkan kemalasan, besarkan aksi!",
    "Sedikit demi sedikit menjadi bukit.",
    "Kamu mampu melewati hari ini, tetap jalan!"
  ];
  
  document.getElementById("motivasi").textContent =
    motivasiList[Math.floor(Math.random() * motivasiList.length)];
  
  
  // ===================================================
  // CRUD LOCALSTORAGE
  // ===================================================
  
  let editIndex = null;
  
  function getTasks() {
    return JSON.parse(localStorage.getItem("tasks") || "[]");
  }
  
  function saveTasks(tasks) {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }
  
  function addTask() {
    const title = document.getElementById("title").value;
    const time = document.getElementById("time").value;
  
    if (!title || !time) return alert("Isi semua kolom!");
  
    const tasks = getTasks();
    tasks.push({ title, time, notified: false });
    saveTasks(tasks);
  
    document.getElementById("title").value = "";
    document.getElementById("time").value = "";
  
    renderTasks();
  }
  
  function renderTasks() {
    const tasks = getTasks();
    const list = document.getElementById("taskList");
  
    list.innerHTML = "";
  
    tasks.forEach((task, i) => {
      const item = document.createElement("li");
  
      item.innerHTML = `
        <span>${task.title} — ${task.time}</span>
        <div class="actions">
          <button onclick="openEdit(${i})">Edit</button>
          <button onclick="deleteTask(${i})">Hapus</button>
        </div>
      `;
  
      list.appendChild(item);
    });
  }
  
  function deleteTask(i) {
    const tasks = getTasks();
    tasks.splice(i, 1);
    saveTasks(tasks);
    renderTasks();
  }
  
  function openEdit(i) {
    editIndex = i;
  
    const tasks = getTasks();
    document.getElementById("editTitle").value = tasks[i].title;
    document.getElementById("editTime").value = tasks[i].time;
  
    document.getElementById("editModal").style.display = "block";
  }
  
  function saveEdit() {
    const tasks = getTasks();
  
    tasks[editIndex].title = document.getElementById("editTitle").value;
    tasks[editIndex].time = document.getElementById("editTime").value;
  
    saveTasks(tasks);
    closeModal();
    renderTasks();
  }
  
  function closeModal() {
    document.getElementById("editModal").style.display = "none";
  }
  
  renderTasks();
  
  
  // ===================================================
  // NOTIFICATION CHECKER
  // ===================================================
  
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }
  
  setInterval(() => {
    const tasks = getTasks();
    const now = Date.now();
  
    tasks.forEach(task => {
      const t = new Date(task.time).getTime();
  
      if (!task.notified && now >= t) {
        if (Notification.permission === "granted") {
          new Notification("Daily Remind", {
            body: task.title,
          });
        }
        task.notified = true;
      }
    });
  
    saveTasks(tasks);
  }, 15000);
  