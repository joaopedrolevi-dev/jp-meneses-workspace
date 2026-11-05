/* Lembretes registrados localmente. */
(() => {
  const form=document.getElementById("reminderForm"),list=document.getElementById("reminderList");
  document.getElementById("reminderDate").value=todayISO();
  form.addEventListener("submit",e=>{e.preventDefault();const title=document.getElementById("reminderTitle").value.trim();if(!title)return;Store.add("reminders",{id:uid(),title,date:document.getElementById("reminderDate").value,type:document.getElementById("reminderType").value,repeat:document.getElementById("reminderRepeat").checked});form.reset();document.getElementById("reminderDate").value=todayISO();toast("Lembrete salvo!");});
  window.renderReminders=()=>{
    const items=Store.all().reminders.slice().sort((a,b)=>a.date.localeCompare(b.date));
    list.innerHTML=items.length?items.map(x=>`<article class="item-card"><div class="item-main"><div class="item-title">${escapeHTML(x.title)}</div><div class="item-meta">${formatDate(x.date)} · ${escapeHTML(x.type)}${x.repeat?" · Mensal":""}</div></div><button class="icon-btn" data-rem-delete="${x.id}" aria-label="Excluir lembrete">×</button></article>`).join(""):"<div class='empty-state'>Nenhum lembrete cadastrado.</div>";
    list.querySelectorAll("[data-rem-delete]").forEach(b=>b.addEventListener("click",()=>{if(confirm("Excluir este lembrete?"))Store.remove("reminders",b.dataset.remDelete);}));
  };
  window.renderReminders();
})();