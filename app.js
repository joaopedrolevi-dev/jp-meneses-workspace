/* Núcleo do aplicativo: navegação, armazenamento e utilidades. */
(() => {
  const DB_KEY = "jp_meneses_workspace_v1";
  const empty = { tasks: [], goals: [], reminders: [] };
  let data;
  try { data = JSON.parse(localStorage.getItem(DB_KEY)) || structuredClone(empty); }
  catch { data = structuredClone(empty); }
  window.Store = {
    all: () => data,
    save() { localStorage.setItem(DB_KEY, JSON.stringify(data)); window.dispatchEvent(new Event("workspace-updated")); },
    add(type, item) { data[type].push(item); this.save(); },
    update(type, id, changes) { data[type] = data[type].map(x => x.id === id ? {...x, ...changes} : x); this.save(); },
    remove(type, id) { data[type] = data[type].filter(x => x.id !== id); this.save(); }
  };
  window.uid = () => (crypto.randomUUID ? crypto.randomUUID() : Date.now() + "-" + Math.random().toString(16).slice(2));
  window.todayISO = () => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`; };
  window.formatDate = value => value ? new Date(value + "T12:00:00").toLocaleDateString("pt-BR") : "Sem data";
  window.escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
  window.toast = message => { const el=document.getElementById("toast"); el.textContent=message; el.classList.add("show"); clearTimeout(window.toastTimer); window.toastTimer=setTimeout(()=>el.classList.remove("show"),2300); };

  const pages = ["home","tasks","goals","calendar","reminders"];
  window.showPage = page => {
    pages.forEach(p => document.getElementById("page-"+p).classList.toggle("active", p===page));
    document.querySelectorAll(".nav-item").forEach(b => b.classList.toggle("active", b.dataset.page===page));
    if (page==="calendar") window.renderCalendar?.();
    window.scrollTo({top:0, behavior:"smooth"});
  };
  document.querySelectorAll(".nav-item").forEach(b => b.addEventListener("click",()=>showPage(b.dataset.page)));
  document.querySelectorAll("[data-go]").forEach(b => b.addEventListener("click",()=>showPage(b.dataset.go)));
  document.getElementById("todayLabel").textContent = new Date().toLocaleDateString("pt-BR",{weekday:"long",day:"numeric",month:"long"}).toUpperCase();

  let installPrompt;
  window.addEventListener("beforeinstallprompt", event => { event.preventDefault(); installPrompt=event; document.getElementById("installBtn").hidden=false; });
  document.getElementById("installBtn").addEventListener("click", async () => {
    if (!installPrompt) { toast("Use o menu do navegador e escolha 'Instalar app' ou 'Adicionar à tela inicial'."); return; }
    installPrompt.prompt(); await installPrompt.userChoice; installPrompt=null;
    document.getElementById("installBtn").hidden=true;
  });
  if ("serviceWorker" in navigator && (location.protocol==="https:" || location.hostname==="localhost")) {
    window.addEventListener("load",()=>navigator.serviceWorker.register("./service-worker.js").catch(err=>console.warn("Falha ao registrar Service Worker",err)));
  }
  window.addEventListener("workspace-updated", () => { window.renderTasks?.(); window.renderGoals?.(); window.renderReminders?.(); window.renderHome?.(); window.renderCalendar?.(); });
  window.renderHome = () => {
    const d=Store.all(), open=d.tasks.filter(x=>!x.done);
    document.getElementById("openCount").textContent=open.length;
    document.getElementById("goalCount").textContent=d.goals.length;
    document.getElementById("reminderCount").textContent=d.reminders.length;
    const today=d.tasks.filter(x=>x.date===todayISO()&&!x.done);
    document.getElementById("todayTasks").innerHTML=today.length ? today.map(x=>`<div class="item-card"><div class="item-main"><div class="item-title">${escapeHTML(x.title)}</div><div class="item-meta">Prioridade ${escapeHTML(x.priority)} · Hoje</div></div></div>`).join("") : "Nenhuma tarefa pendente para hoje.";
    const next=d.reminders.filter(x=>x.date>=todayISO()).sort((a,b)=>a.date.localeCompare(b.date)).slice(0,3);
    document.getElementById("upcoming").innerHTML=next.length ? next.map(x=>`<div class="item-card"><div class="item-main"><div class="item-title">${escapeHTML(x.title)}</div><div class="item-meta">${formatDate(x.date)} · ${escapeHTML(x.type)}</div></div></div>`).join("") : "Nenhum compromisso futuro cadastrado.";
  };
  window.renderHome();
})();