document.querySelector("#salvar").addEventListener("click", cadastrar);

function cadastrar(){
    let titulo = document.querySelector("#titulo").value;
    let descricao = document.querySelector("#descricao").value;
    let prioridade = document.querySelector("#prioridade").value;

    const tarefa = {
        titulo,
        descricao,
        prioridade
    };

    const cardHTML = gerar_card(tarefa);
    const tarefasContainer = document.querySelector('#backlog');
    const cardElement = criarCardElement(cardHTML);

    tarefasContainer.appendChild(cardElement);
}

function criarCardElement(cardHTML) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('col-12', 'col-md-6', 'col-lg-3');
    cardElement.innerHTML = cardHTML;
    cardElement.setAttribute('draggable', 'true');
    cardElement.addEventListener('dragstart', dragStart);
    cardElement.addEventListener('dragend', dragEnd);
    return cardElement;
}

function apagar(botao){
    botao.parentNode.parentNode.parentNode.remove();
}

function gerar_card(tarefa){
    return `<div class="card" draggable="true" ondragstart="dragStart(event)" ondragend="dragEnd(event)">
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
            <a href="#" class="btn btn-success">
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
    event.currentTarget.classList.add('dragging');
}

function dragEnd(event) {
    event.currentTarget.classList.remove('dragging');
}