/* Metas com progresso manual. */
(() => {
  const form=document.getElementById("goalForm"),list=document.getElementById("goalList");
  form.addEventListener("submit",e=>{e.preventDefault();const title=document.getElementById("goalTitle").value.trim();if(!title)return;Store.add("goals",{id:uid(),title,date:document.getElementById("goalDate").value,category:document.getElementById("goalCategory").value,progress:0});form.reset();toast("Meta criada!");});
  window.renderGoals=()=>{
    const items=Store.all().goals;
    list.innerHTML=items.length?items.map(x=>`<article class="item-card"><div class="item-main"><div class="goal-top"><div class="item-title">${escapeHTML(x.title)}</div><span class="goal-percent">${x.progress}%</span></div><div class="item-meta">${escapeHTML(x.category)} · Prazo: ${formatDate(x.date)}</div><div class="progress"><span style="width:${x.progress}%"></span></div><div class="goal-controls"><button data-progress="${x.id}" data-step="-10">− 10%</button><button data-progress="${x.id}" data-step="10">＋ 10%</button><button data-goal-delete="${x.id}">Excluir</button></div></div></article>`).join(""):"<div class='empty-state'>Suas metas aparecerão aqui. Que tal cadastrar a primeira?</div>";
    list.querySelectorAll("[data-progress]").forEach(b=>b.addEventListener("click",()=>{const x=Store.all().goals.find(g=>g.id===b.dataset.progress);Store.update("goals",x.id,{progress:Math.max(0,Math.min(100,x.progress+Number(b.dataset.step)))});}));
    list.querySelectorAll("[data-goal-delete]").forEach(b=>b.addEventListener("click",()=>{if(confirm("Excluir esta meta?"))Store.remove("goals",b.dataset.goalDelete);}));
  };
  window.renderGoals();
})();