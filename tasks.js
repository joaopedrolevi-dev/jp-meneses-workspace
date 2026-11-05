/* Cadastro e acompanhamento de tarefas. */
(() => {
  const form=document.getElementById("taskForm"), list=document.getElementById("taskList");
  let filter="all";
  document.getElementById("taskDate").value=todayISO();
  form.addEventListener("submit",e=>{
    e.preventDefault(); const title=document.getElementById("taskTitle").value.trim(); if(!title)return;
    Store.add("tasks",{id:uid(),title,date:document.getElementById("taskDate").value,priority:document.getElementById("taskPriority").value,done:false});
    form.reset(); document.getElementById("taskDate").value=todayISO(); toast("Tarefa adicionada!");
  });
  document.querySelectorAll("[data-filter]").forEach(b=>b.addEventListener("click",()=>{filter=b.dataset.filter;document.querySelectorAll("[data-filter]").forEach(x=>x.classList.toggle("active",x===b));renderTasks();}));
  window.renderTasks=()=>{
    const items=Store.all().tasks.filter(x=>filter==="all"||(filter==="open"&&!x.done)||(filter==="done"&&x.done)).sort((a,b)=>(a.date||"").localeCompare(b.date||""));
    list.innerHTML=items.length?items.map(x=>`<article class="item-card ${x.done?"done":""}"><button class="check-btn ${x.done?"checked":""}" data-toggle="${x.id}" aria-label="Concluir tarefa">${x.done?"✓":""}</button><div class="item-main"><div class="item-title">${escapeHTML(x.title)}</div><div class="item-meta">${formatDate(x.date)} · Prioridade ${escapeHTML(x.priority)}</div></div><div class="item-actions"><button class="icon-btn" data-edit="${x.id}" aria-label="Editar">✎</button><button class="icon-btn" data-delete="${x.id}" aria-label="Excluir">×</button></div></article>`).join(""):"<div class='empty-state'>Nenhuma tarefa nesta lista. Adicione sua primeira tarefa acima.</div>";
    list.querySelectorAll("[data-toggle]").forEach(b=>b.addEventListener("click",()=>{const x=Store.all().tasks.find(t=>t.id===b.dataset.toggle);Store.update("tasks",x.id,{done:!x.done});}));
    list.querySelectorAll("[data-delete]").forEach(b=>b.addEventListener("click",()=>{if(confirm("Excluir esta tarefa?"))Store.remove("tasks",b.dataset.delete);}));
    list.querySelectorAll("[data-edit]").forEach(b=>b.addEventListener("click",()=>{const x=Store.all().tasks.find(t=>t.id===b.dataset.edit);const title=prompt("Editar tarefa:",x.title);if(title&&title.trim())Store.update("tasks",x.id,{title:title.trim()});}));
  };
  window.renderTasks();
})();