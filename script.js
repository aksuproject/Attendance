const firebaseConfig = {
  apiKey: "AIzaSyBxDdaeuRPuiDO2JYHFNfLzr7HcnzmrgAc",
  authDomain: "me-attendance-dbe63.firebaseapp.com",
  databaseURL: "https://me-attendance-dbe63-default-rtdb.firebaseio.com",
  projectId: "me-attendance-dbe63",
  storageBucket: "me-attendance-dbe63.firebasestorage.app",
  messagingSenderId: "227683930891",
  appId: "1:227683930891:web:fddd8b6d11bc9ef98c880e"
};
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

let highlightMode = 'name', isAdmin = false, editingKey = null, loadedPres = [];
let students = [
    {sn: 1, id: "B2555R10102001", name: "ABHISHEK KUMAR"}, {sn: 2, id: "B2555R10102002", name: "SANJEEV KUMAR"},
    {sn: 3, id: "B2555R10102005", name: "SATEESH KUMAR CHAUDHARI"}, {sn: 4, id: "B2555R10102006", name: "AJEET SINGH"},
    {sn: 5, id: "B2555R10102007", name: "KARAN KUMAR VERMA"}, {sn: 6, id: "B2555R10102008", name: "SHIVENDRA PRATAP VERMA"},
    {sn: 7, id: "B2555R10102010", name: "VIJESH RAGHUVANSHI"}, {sn: 8, id: "B2555R10102011", name: "AMAR VERMA"},
    {sn: 9, id: "B2555R10102012", name: "AMOL PANDEY"}, {sn: 10, id: "B2555R10102013", name: "KISHAN VERMA"},
    {sn: 11, id: "B2555R10102014", name: "ANSHIL VISHWAKARMA"}, {sn: 12, id: "B2555R10102017", name: "RAHUL SAKET"},
    {sn: 13, id: "B2555R10102018", name: "VINAY CHAUDHARY"}, {sn: 14, id: "B2555R10102019", name: "SANDHYA PRAJAPATI"},
    {sn: 15, id: "B2555R10102020", name: "SATYAM YADAV"}, {sn: 16, id: "B2555R10102021", name: "GAURAV KUSHWAHA"},
    {sn: 17, id: "B2555R10102022", name: "DURGESH PRAJAPATI"}, {sn: 18, id: "B2555R10102023", name: "SACHIN KUSHWAHA"},
    {sn: 19, id: "B2555R10102024", name: "SINGH SEJAL VIJAY"}, {sn: 20, id: "B2555R10102025", name: "ARYAN SINGH"},
    {sn: 21, id: "B2555R10102026", name: "AMAN KUSHWAHA"}, {sn: 22, id: "B2555R10102027", name: "AMAN VISHWAKARMA"},
    {sn: 23, id: "B2555R10102028", name: "SAHIL SAKET"}, {sn: 24, id: "B2555R10102029", name: "LUCKY VERMA"},
    {sn: 25, id: "B2555R10102030", name: "ANSH DAHIYA"}, {sn: 26, id: "B2555R10102031", name: "AJAY KUMAR CHAUDHARY"},
    {sn: 27, id: "B2555R10102033", name: "PRIYANSHU KUSHWAHA"}, {sn: 28, id: "B2555R10102034", name: "ABHISHEK PRAJAPATI"},
    {sn: 29, id: "B2555R10102035", name: "SUMIT KUSHWAHA"}, {sn: 30, id: "B2555R10102037", name: "ADITYA SINGH GAUTAM"},
    {sn: 31, id: "B2555R10102038", name: "SANJU AHIRWAR"}, {sn: 32, id: "B2555R10102039", name: "PARTH SONI"},
    {sn: 33, id: "B2555R10102041", name: "HARISHANKAR PATEL"}, {sn: 34, id: "B2555R10102042", name: "ANUJ BARMAN"},
    {sn: 35, id: "B2555R10102043", name: "MOHIT BANSAL"}, {sn: 36, id: "B2555R10102044", name: "RAHUL KUSHWAHA"},
    {sn: 37, id: "B2555R10102046", name: "SHREYESH SINGH"}, {sn: 38, id: "B2555R10102047", name: "LAKKI MOHAMMAD"},
    {sn: 39, id: "B2555R10102048", name: "ANAND SAHU"}, {sn: 40, id: "B2555R10102049", name: "SHIVAM KUSHWAHA"}
];

window.onload = () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('classDate').value = today;
    updateView('name');
    fetchHistory(false);
};

function toggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
        document.documentElement.removeAttribute('data-theme');
        document.getElementById('themeToggle').innerText = 'Dark Mode';
    } else {
        document.documentElement.setAttribute('data-theme', 'dark');
        document.getElementById('themeToggle').innerText = 'Light Mode';
    }
}

function login() {
    if(document.getElementById('adminPass').value === "ego360") {
        isAdmin = true;
        document.getElementById('adminPanel').style.display = "block";
        document.getElementById('loginBox').style.display = "none";
        fetchHistory(false);
        alert("Login Successful");
    } else alert("Invalid Password");
}

function logout() {
    isAdmin = false;
    document.getElementById('adminPanel').style.display = "none";
    document.getElementById('loginBox').style.display = "block";
    fetchHistory(false);
}

function updateView(mode) {
    highlightMode = mode;
    document.getElementById('sortName').className = (mode === 'name') ? 'btn-sort active' : 'btn-sort';
    document.getElementById('sortCode').className = (mode === 'id') ? 'btn-sort active' : 'btn-sort';
    if(mode === 'name') students.sort((a,b) => a.name.localeCompare(b.name));
    else students.sort((a,b) => a.id.localeCompare(b.id));
    renderList();
}

function renderList() {
    const listBody = document.getElementById('listBody');
    listBody.innerHTML = students.map((s, index) => {
        const isP = loadedPres.includes(s.id) || loadedPres.includes(s.name);
        return `<div class="list-row">
            <div class="col-sn">${index + 1}</div>
            <div class="col-info">
                <span class="${highlightMode==='name'?'focus-main':'focus-sub'}">${s.name}</span>
                <span class="${highlightMode==='id'?'focus-main':'focus-sub'}">${s.id}</span>
            </div>
            <div class="col-status">
                <label class="radio-btn radio-btn-p"><input type="radio" name="st_${s.id}" value="P" ${isP?'checked':''}> P</label>
                <label class="radio-btn radio-btn-a"><input type="radio" name="st_${s.id}" value="A" ${!isP?'checked':''}> A</label>
            </div>
        </div>`;
    }).join('');
}

function pushToCloud() {
    const date = document.getElementById('classDate').value;
    const sub = document.getElementById('subject').value || "No Subject";
    const isExtra = document.getElementById('isExtraLecture').checked;
    
    let pL = [], aL = [];
    let sortedToSave = [...students].sort((a,b) => a.id.localeCompare(b.id));

    sortedToSave.forEach(s => {
        const isP = document.querySelector(`input[name="st_${s.id}"]:checked`).value === 'P';
        let entry = { n: s.name, id: s.id, c: s.id.slice(-4) };
        isP ? pL.push(entry) : aL.push(entry);
    });

    const data = { date, sub, isExtra, pL, aL, ts: Date.now() };
    
    if(editingKey) {
        database.ref('attendance').child(editingKey).set(data)
        .then(() => { alert("Updated!"); resetForm(); })
        .catch(err => alert("Error saving data: " + err.message));
    } else {
        database.ref('attendance').push(data)
        .then(() => { alert("Saved!"); resetForm(); })
        .catch(err => alert("Error saving data: " + err.message));
    }
}

function resetForm() {
    editingKey = null; loadedPres = [];
    document.getElementById('mainSaveBtn').innerText = "Finalize & Save";
    document.getElementById('mainSaveBtn').style.background = "var(--text)";
    document.getElementById('mainSaveBtn').style.color = "var(--card-bg)";
    document.getElementById('subject').value = "";
    document.getElementById('isExtraLecture').checked = false;
    updateView(highlightMode);
}

function fetchHistory(filter) {
    let ref = database.ref('attendance');
    const fDate = document.getElementById('filterDate').value;
    if(filter && fDate) ref = ref.orderByChild('date').equalTo(fDate);

    ref.on('value', snap => {
        const logs = snap.val();
        const view = document.getElementById('logsView');
        if(!logs) { view.innerHTML = "<div style='padding:15px;'>No records found.</div>"; return; }
        
        view.innerHTML = Object.keys(logs).reverse().map(key => {
            const item = logs[key];
            
            let badgeHTML = "";
            if (item.isExtra === true || item.type === "Extra Class") {
                badgeHTML = `<span class="type-badge">Extra Lecture</span>`;
            }

            return `<div class="history-card">
                <div class="card-header">
                    ${isAdmin ? `<button class="btn-delete" onclick="deleteRec('${key}')">🗑️</button>` : ''}
                    
                    <div style="flex:1; display:flex; justify-content:space-between; align-items:center; margin:0 10px; gap:8px;" onclick="this.parentElement.nextElementSibling.style.display=(this.parentElement.nextElementSibling.style.display==='block'?'none':'block')">
                        
                        <div style="display:flex; align-items:center; gap:8px; flex-wrap:wrap; line-height:1.2;">
                            ${badgeHTML} 
                            <b style="word-break: break-word; color: var(--text);">${item.sub}</b>
                        </div>
                        
                        <span style="white-space:nowrap; font-size:11px; color:var(--text-muted);">${item.date} (${item.pL?item.pL.length:0}P) ▾</span>
                    </div>

                    ${isAdmin ? `<button class="btn-edit" onclick="editRec('${key}')">EDIT</button>` : ''}
                </div>
                <div class="card-body">
                    <button class="view-toggle" onclick="toggleTags(this)">Show Codes</button>
                    <div style="clear:both; margin-top:10px;"></div>
                    <b style="color:var(--present);">Present:</b><br><div class="p-list" style="margin-top:5px;">${renderTags(item.pL, 'p')}</div><br>
                    <b style="color:var(--absent);">Absent:</b><br><div class="a-list" style="margin-top:5px;">${renderTags(item.aL, 'a')}</div>
                </div>
            </div>`;
        }).join('');
    }, error => {
        console.error(error);
        document.getElementById('logsView').innerHTML = `<div style="color:#e57373; padding:15px; border:1px solid rgba(244,67,54,0.3); background:rgba(198,40,40,0.2); text-align:center;">
            <b>Database Access Denied!</b><br><br>
            Please check your Firebase Database rules.
        </div>`;
    });
}

function editRec(key) {
    database.ref('attendance').child(key).once('value', snap => {
        const d = snap.val();
        editingKey = key;
        loadedPres = (d.pL || []).map(p => p.id || p.n);
        
        document.getElementById('classDate').value = d.date;
        document.getElementById('subject').value = d.sub;
        
        const isExtra = d.isExtra === true || d.type === "Extra Class";
        document.getElementById('isExtraLecture').checked = isExtra;
        
        document.getElementById('mainSaveBtn').innerText = "Update Now";
        document.getElementById('mainSaveBtn').style.background = "#f39c12";
        document.getElementById('mainSaveBtn').style.color = "#ffffff";
        renderList();
        window.scrollTo({top:0, behavior:'smooth'});
    });
}

function deleteRec(k) { if(confirm("Delete Record?")) database.ref('attendance').child(k).remove(); }
function renderTags(list, type) { if(!list) return "None"; return list.map(item => `<span class="tag ${type}-tag" data-full="${item.n}" data-code="${item.c || '??'}">${item.n}</span>`).join(''); }

function toggleTags(btn) {
    const body = btn.parentElement;
    const tags = body.querySelectorAll('.tag');
    const isCodeMode = btn.innerText === "Show Names";
    tags.forEach(t => t.innerText = isCodeMode ? t.getAttribute('data-full') : t.getAttribute('data-code'));
    btn.innerText = isCodeMode ? "Show Codes" : "Show Names";
}
