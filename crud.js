document.querySelector("#salvar").addEventListener("click", cadastrar);

let tarefas = [];

window.addEventListener("load", () => {
  tarefas = JSON.parse(localStorage.getItem("tarefas")) || [];
  atualizar();
});

function atualizar() {
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
  document.querySelector("#tarefas").innerHTML = "";
  tarefas.forEach((tarefa) =>
    document.querySelector("#tarefas").appendChild(criarCardElement(gerar_card(tarefa)))
  );
}

function cadastrar() {
  let titulo = document.querySelector("#titulo").value;
  let descricao = document.querySelector("#descricao").value;
  let prioridade = document.querySelector("#prioridade").value;

  const tarefa = {
    titulo,
    descricao,
    prioridade,
  };

  if (tarefa.titulo.length == 0) {
    document.querySelector("#titulo").classList.add("is-invalid");
    return;
  }

  tarefas.push(tarefa);

  document.querySelector("#tarefas").appendChild(criarCardElement(gerar_card(tarefa)));

  document.querySelector("#titulo").value = "";
  document.querySelector("#descricao").value = "";

  localStorage.setItem("tarefas", JSON.stringify(tarefas));

  atualizar();
  modal.hide();
}

function criarCardElement(cardHTML) {
  const cardElement = document.createElement("div");
  cardElement.classList.add("card", "kanban-card");
  cardElement.innerHTML = cardHTML;
  cardElement.setAttribute("draggable", "true");
  cardElement.addEventListener("dragstart", dragStart);
  cardElement.addEventListener("dragend", dragEnd);
  return cardElement;
}

function apagar(botao) {
  const card = botao.parentNode.parentNode;
  const cardId = card.id;
  card.remove();

  // Remover a tarefa do array 'tarefas'
  tarefas = tarefas.filter((tarefa) => tarefa.id !== cardId);

  // Atualizar os dados no localStorage
  localStorage.setItem("tarefas", JSON.stringify(tarefas));
}

function gerar_card(tarefa) {
  const cardId = `card-${Date.now()}`;
  return `<div id="${cardId}" class="card kanban-card" draggable="true" ondragstart="dragStart(event)" ondragend="dragEnd(event)">
    <div class="card-header bg-primary-subtle">
        ${tarefa.titulo}
    </div>
    <div class="card-body">
        <p class="card-text">
            ${tarefa.descricao}
        </p>
        <p>
            <span class="badge text-bg-warning">
                ${tarefa.prioridade}
            </span>
        </p>
        <a href="#" class="btn btn-success" id="editar">
            <i class="bi bi-pencil-square"></i>
        </a>
        <a href="#" onClick="apagar(this)" class="btn btn-danger" title="apagar tarefa">
            <i class="bi bi-trash3"></i>
        </a>
    </div>
  </div>`;
}

function dragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
    event.target.classList.add("dragging");
  }
  
  function dragEnd(event) {
    event.target.classList.remove("dragging");
  
    const cardId = event.target.id;
    const newColumnId = event.target.parentNode.id;
    const newColumnIndex = Array.from(event.target.parentNode.children).indexOf(event.target);
  
    // Atualizar a posição do card no array 'tarefas'
    const cardIndex = tarefas.findIndex((tarefa) => tarefa.id === cardId);
    const card = tarefas.splice(cardIndex, 1)[0];
    card.columnId = newColumnId;
    tarefas.splice(newColumnIndex, 0, card);
  
    // Atualizar os dados no localStorage
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
  }

function dragOver(event) {
  event.preventDefault();
}

function dragEnter(event) {
  event.target.classList.add("drag-over");
}

function dragLeave(event) {
  event.target.classList.remove("drag-over");
}

function drop(event) {
    event.preventDefault();
    const cardId = event.dataTransfer.getData("text/plain");
    const card = document.getElementById(cardId);
    event.target.appendChild(card);
    event.target.classList.remove("drag-over");
  
    // Salvar a posição do card na nova coluna
    const newColumnId = event.target.id;
    const newColumnIndex = Array.from(event.target.children).indexOf(card);
    const cardIndex = tarefas.findIndex((tarefa) => tarefa.id === cardId);
    tarefas[cardIndex].columnId = newColumnId;
    tarefas.splice(cardIndex, 1);
    tarefas.splice(newColumnIndex, 0, tarefas[cardIndex]);
  
    // Atualizar os dados no localStorage
    localStorage.setItem("tarefas", JSON.stringify(tarefas));
  }

const kanbanColumns = document.querySelectorAll(".kanban-column");

kanbanColumns.forEach((column) => {
  column.addEventListener("dragover", dragOver);
  column.addEventListener("dragenter", dragEnter);
  column.addEventListener("dragleave", dragLeave);
  column.addEventListener("drop", drop);
});
