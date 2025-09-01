const API = 'https://demo2.z-bit.ee';
let token = null;
let userId = null;
let username = null;
let tasks = [];
let filter = 'all';
// Main DOM elements 
const authDiv = document.getElementById('auth');
const appDiv = document.getElementById('app');
const authMsg = document.getElementById('authMsg');
const who = document.getElementById('who');
const regUser = document.getElementById('regUser');
const regFirst = document.getElementById('regFirst');
const regLast = document.getElementById('regLast');
const regPass = document.getElementById('regPass');
const loginUser = document.getElementById('loginUser');
const loginPass = document.getElementById('loginPass');
const newTitle = document.getElementById('newTitle');
const newDesc = document.getElementById('newDesc');
const tasksDiv = document.getElementById('tasks');
const emptyDiv = document.getElementById('empty');

// Style toggle functionality
const styleToggle = document.getElementById('styleToggle');
const appStyles = document.getElementById('appStyles');
let currentStyle = 'basic';

const basicStyles = `
    body { font-family: Arial, sans-serif; max-width: 800px; margin: 20px auto; }
    h1 { margin-bottom: 10px; }
    .box { border: 1px solid #ccc; padding: 12px; border-radius: 8px; margin: 10px 0; }
    label { display: block; margin: 6px 0; }
    input, textarea, button { padding: 8px; }
    .row { display: flex; gap: 8px; align-items: center; flex-wrap: wrap; }
    .task { border: 1px solid #eee; padding: 8px; border-radius: 6px; margin: 6px 0; }
    .task.done .title { text-decoration: line-through; color: #666; }
    .small { color: #666; font-size: 12px; }
    #app { display: none; }
    .hidden { display: none; }
    
    .style-toggle {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
    }
    
    .toggle-btn {
      padding: 10px 20px;
      background: #333;
      color: white;
      border: none;
      border-radius: 5px;
      cursor: pointer;
    }`;
// LLm created beautiful style  
const modernStyles = `
    * { box-sizing: border-box; }
    body { 
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; 
      max-width: 900px; 
      margin: 0 auto; 
      padding: 20px;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      min-height: 100vh;
    }
    h1 { 
      color: white;
      font-size: 2.5rem;
      text-align: center;
      margin-bottom: 30px;
    }
    .box { 
      background: white; 
      padding: 30px; 
      border-radius: 20px; 
      margin: 20px 0; 
      box-shadow: 0 10px 40px rgba(0,0,0,0.1);
    }
    h2 {
      color: #333;
      margin-bottom: 20px;
    }
    label { 
      display: block; 
      margin: 15px 0; 
      font-weight: 500;
      color: #555;
    }
    input, textarea { 
      padding: 12px; 
      border: 2px solid #e0e0e0;
      border-radius: 10px;
      width: 100%;
      margin-top: 5px;
      font-size: 14px;
    }
    input:focus, textarea:focus {
      outline: none;
      border-color: #667eea;
    }
    button { 
      background: linear-gradient(45deg, #667eea, #764ba2);
      color: white;
      border: none;
      padding: 12px 25px; 
      border-radius: 10px;
      font-weight: 600;
      cursor: pointer;
      transition: transform 0.2s;
    }
    button:hover {
      transform: scale(1.05);
    }
    .row { 
      display: flex; 
      gap: 10px; 
      align-items: center; 
      flex-wrap: wrap; 
      margin: 20px 0;
    }
    .task { 
      background: #f8f9fa;
      border-left: 4px solid #667eea;
      padding: 15px; 
      border-radius: 10px; 
      margin: 15px 0; 
      transition: transform 0.2s;
    }
    .task:hover {
      transform: translateX(5px);
    }
    .task.done { 
      background: #e9ecef;
      border-left-color: #999;
      opacity: 0.7;
    }
    .task.done .title { 
      text-decoration: line-through; 
      color: #999; 
    }
    .small { 
      color: #888; 
      font-size: 13px; 
    }
    #app { display: none; }
    .hidden { display: none; }
    
    .style-toggle {
      position: fixed;
      top: 20px;
      right: 20px;
      z-index: 1000;
    }
    
    .toggle-btn {
      padding: 12px 24px;
      background: rgba(255,255,255,0.9);
      color: #333;
      border: none;
      border-radius: 10px;
      cursor: pointer;
      font-weight: 600;
      box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    }`;


    // Event listener for style toggle button
styleToggle.addEventListener('click', function() {
  if (currentStyle === 'basic') {
    appStyles.textContent = modernStyles;
    currentStyle = 'modern';
  } else {
    appStyles.textContent = basicStyles;
    currentStyle = 'basic';
  }
});


// App main functionality
function showAuth() {
  authDiv.style.display = 'block';
  appDiv.style.display = 'none';
  authMsg.textContent = '';
}

function showApp() {
  authDiv.style.display = 'none';
  appDiv.style.display = 'block';
  who.textContent = 'Signed in as ' + (username || '') + ' (User ID ' + userId + ')';
}

function saveSession() {
  localStorage.setItem('todo_token', token || '');
  localStorage.setItem('todo_user', String(userId || ''));
  localStorage.setItem('todo_name', username || '');
}

function loadSession() {
  const t = localStorage.getItem('todo_token');
  const u = localStorage.getItem('todo_user');
  const n = localStorage.getItem('todo_name');
  if (t && u) {
    token = t;
    userId = Number(u);
    username = n || '';
    return true;
  }
  return false;
}

function clearSession() {
  token = null;
  userId = null;
  username = null;
  localStorage.removeItem('todo_token');
  localStorage.removeItem('todo_user');
  localStorage.removeItem('todo_name');
}

function authHeaders() {
  return { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token };
}

function prettyDate(s) {
  if (!s) return '';
  const d = new Date(s.replace(' ', 'T') + 'Z');
  if (isNaN(d)) return s;
  return d.toLocaleString();
}

async function apiRegister() {
  const body = {
    username: regUser.value.trim(),
    firstname: regFirst.value.trim(),
    lastname: regLast.value.trim(),
    newPassword: regPass.value
  };
  if (!body.username || !body.newPassword) {
    authMsg.textContent = 'Username and password are required.';
    return;
  }
  try {
    const res = await fetch(API + '/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Register failed');
    token = data.access_token;
    userId = data.id;
    username = data.username;
    saveSession();
    showApp();
    await loadTasks();
  } catch (e) {
    authMsg.textContent = e.message || 'Register failed';
  }
}

async function apiLogin() {
  const body = {
    username: loginUser.value.trim(),
    password: loginPass.value
  };
  if (!body.username || !body.password) {
    authMsg.textContent = 'Username and password are required.';
    return;
  }
  try {
    const res = await fetch(API + '/users/get-token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    token = data.access_token;
    userId = data.id;
    username = data.username;
    saveSession();
    showApp();
    await loadTasks();
  } catch (e) {
    authMsg.textContent = e.message || 'Login failed';
  }
}

async function loadTasks() {
  if (!token) return;
  try {
    const res = await fetch(API + '/tasks', {
      headers: authHeaders()
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Load failed');
    if (Array.isArray(data)) tasks = data;
    renderTasks();
  } catch (e) {
    if (e.message && e.message.toLowerCase().includes('unauthorized')) {
      doLogout();
    }
  }
}

async function addTask() {
  const title = newTitle.value.trim();
  const desc = newDesc.value.trim();
  if (!title) {
    return;
  }
  try {
    const res = await fetch(API + '/tasks', {
      method: 'POST',
      headers: authHeaders(),
      body: JSON.stringify({ title: title, desc: desc })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Add failed');
    tasks.push(data);
    newTitle.value = '';
    newDesc.value = '';
    renderTasks();
  } catch (e) {
  }
}

async function toggleTask(id, done, checkbox) {
  try {
    checkbox.disabled = true;
    const res = await fetch(API + '/tasks/' + id, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify({ marked_as_done: done })
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Update failed');
    }
    const t = tasks.find(x => x.id === id);
    if (t) t.marked_as_done = done;
    renderTasks();
  } catch (e) {
    checkbox.checked = !done;
  } finally {
    checkbox.disabled = false;
  }
}

async function saveEdit(id, newTitleVal, newDescVal) {
  const body = {};
  body.title = newTitleVal;
  body.desc = newDescVal;
  try {
    const res = await fetch(API + '/tasks/' + id, {
      method: 'PUT',
      headers: authHeaders(),
      body: JSON.stringify(body)
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Save failed');
    }
    const t = tasks.find(x => x.id === id);
    if (t) { 
      t.title = newTitleVal; 
      t.desc = newDescVal; 
    }
    renderTasks();
  } catch (e) {
  }
}

async function deleteTask(id) {
  if (!confirm('Delete this task?')) return;
  try {
    const res = await fetch(API + '/tasks/' + id, {
      method: 'DELETE',
      headers: authHeaders()
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || 'Delete failed');
    }
    tasks = tasks.filter(x => x.id !== id);
    renderTasks();
  } catch (e) {
  }
}

function renderTasks() {
  let list = tasks.slice();
  if (filter === 'active') list = list.filter(t => !t.marked_as_done);
  if (filter === 'done') list = list.filter(t => t.marked_as_done);

  tasksDiv.innerHTML = '';
  if (list.length === 0) {
    emptyDiv.classList.remove('hidden');
  } else {
    emptyDiv.classList.add('hidden');
  }

  list.forEach(function(t) {
    const div = document.createElement('div');
    div.className = 'task' + (t.marked_as_done ? ' done' : '');
    div.dataset.id = t.id;

    const row = document.createElement('div');
    row.className = 'row';

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.checked = !!t.marked_as_done;
    cb.addEventListener('change', function() {
      toggleTask(t.id, cb.checked, cb);
    });

    const title = document.createElement('span');
    title.className = 'title';
    title.textContent = t.title;

    const btnEdit = document.createElement('button');
    btnEdit.textContent = 'Edit';
    btnEdit.addEventListener('click', function() {
      enterEdit(div, t);
    });

    const btnDel = document.createElement('button');
    btnDel.textContent = 'Delete';
    btnDel.addEventListener('click', function() {
      deleteTask(t.id);
    });

    row.appendChild(cb);
    row.appendChild(title);
    row.appendChild(btnEdit);
    row.appendChild(btnDel);

    const desc = document.createElement('div');
    desc.textContent = t.desc || '';
    desc.className = 'small';

    const meta = document.createElement('div');
    meta.className = 'small';
    meta.textContent = t.created_at ? ('Created: ' + prettyDate(t.created_at)) : '';

    div.appendChild(row);
    if (t.desc) div.appendChild(desc);
    if (t.created_at) div.appendChild(meta);
    tasksDiv.appendChild(div);
  });
}

function enterEdit(taskEl, t) {
  taskEl.innerHTML = '';
  const titleInput = document.createElement('input');
  titleInput.type = 'text';
  titleInput.value = t.title;
  titleInput.maxLength = 255;

  const descInput = document.createElement('textarea');
  descInput.rows = 3;
  descInput.value = t.desc || '';

  const row = document.createElement('div');
  row.className = 'row';
  const btnSave = document.createElement('button');
  btnSave.textContent = 'Save';
  const btnCancel = document.createElement('button');
  btnCancel.textContent = 'Cancel';

  row.appendChild(btnSave);
  row.appendChild(btnCancel);

  taskEl.appendChild(document.createTextNode('Title:'));
  taskEl.appendChild(titleInput);
  taskEl.appendChild(document.createTextNode('Description:'));
  taskEl.appendChild(descInput);
  taskEl.appendChild(row);

  btnSave.addEventListener('click', function() {
    const nt = titleInput.value.trim();
    if (!nt) { 
      return; 
    }
    saveEdit(t.id, nt, descInput.value.trim());
  });
  btnCancel.addEventListener('click', function() {
    renderTasks();
  });
}

document.getElementById('btnReg').addEventListener('click', apiRegister);
document.getElementById('btnLogin').addEventListener('click', apiLogin);
document.getElementById('btnLogout').addEventListener('click', doLogout);
document.getElementById('btnReload').addEventListener('click', loadTasks);
document.getElementById('btnAdd').addEventListener('click', addTask);

document.getElementById('fAll').addEventListener('click', function() {
  filter = 'all'; 
  renderTasks();
});
document.getElementById('fActive').addEventListener('click', function() {
  filter = 'active'; 
  renderTasks();
});
document.getElementById('fDone').addEventListener('click', function() {
  filter = 'done'; 
  renderTasks();
});

function doLogout() {
  clearSession();
  tasks = [];
  showAuth();
}

(function start() {
  if (loadSession()) {
    showApp();
    loadTasks();
  } else {
    showAuth();
  }
})();
