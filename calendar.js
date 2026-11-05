/* Calendário mensal simples com marcação de tarefas e lembretes. */
(() => {
  let shown=new Date(), selected=todayISO();
  const title=document.getElementById("monthTitle"),days=document.getElementById("calendarDays"),agenda=document.getElementById("dayAgenda");
  const pad=n=>String(n).padStart(2,"0");
  document.getElementById("prevMonth").addEventListener("click",()=>{shown.setMonth(shown.getMonth()-1);renderCalendar();});
  document.getElementById("nextMonth").addEventListener("click",()=>{shown.setMonth(shown.getMonth()+1);renderCalendar();});
  window.renderCalendar=()=>{
    title.textContent=shown.toLocaleDateString("pt-BR",{month:"long",year:"numeric"});
    const first=new Date(shown.getFullYear(),shown.getMonth(),1), offset=first.getDay(), count=new Date(shown.getFullYear(),shown.getMonth()+1,0).getDate();
    const marked=new Set([...Store.all().tasks.map(x=>x.date),...Store.all().reminders.map(x=>x.date)]);
    let html="";for(let i=0;i<offset;i++)html+="<span></span>";
    for(let day=1;day<=count;day++){const iso=`${shown.getFullYear()}-${pad(shown.getMonth()+1)}-${pad(day)}`;html+=`<button class="day ${iso===todayISO()?"today":""} ${iso===selected?"selected":""} ${marked.has(iso)?"has-event":""}" data-day="${iso}">${day}</button>`;}
    days.innerHTML=html;days.querySelectorAll("[data-day]").forEach(b=>b.addEventListener("click",()=>{selected=b.dataset.day;renderCalendar();}));
    document.getElementById("selectedDateTitle").textContent=formatDate(selected);
    const t=Store.all().tasks.filter(x=>x.date===selected),r=Store.all().reminders.filter(x=>x.date===selected);
    const rows=[...t.map(x=>`<div class="item-card"><div class="item-main"><div class="item-title">${escapeHTML(x.title)}</div><div class="item-meta">Tarefa ${x.done?"· Concluída":"· Pendente"}</div></div></div>`),...r.map(x=>`<div class="item-card"><div class="item-main"><div class="item-title">${escapeHTML(x.title)}</div><div class="item-meta">Lembrete · ${escapeHTML(x.type)}</div></div></div>`)];
    agenda.innerHTML=rows.length?rows.join(""):"<div class='empty-state'>Nenhuma tarefa ou lembrete nesta data.</div>";
  };
  renderCalendar();
})();