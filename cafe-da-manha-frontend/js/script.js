const apiUrl = 'https://desafio-sulworktech-production.up.railway.app/api/cafe-da-manha';

// Função para listar colaboradores
function listarColaboradores() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {

            const tableBody = document.querySelector("#colaboradoresTable tbody");
            tableBody.innerHTML = ''; // Limpar a tabela antes de adicionar novas linhas

            data.forEach(colaborador => {
                const dataCafe = new Date(colaborador.dataCafe);
                const dataFormatada = `${String(dataCafe.getDate()).padStart(2, '0')}/${String(dataCafe.getMonth() + 1).padStart(2, '0')}/${dataCafe.getFullYear()}`;

                const trouxeStatus = dataCafe < new Date() ? true : colaborador.trouxeOpcao;

                // Criando a linha da tabela com as informações
                const row = document.createElement('tr');
                row.innerHTML = `
    <td>${colaborador.nome}</td>
    <td>${colaborador.cpf}</td>
    <td>${dataFormatada}</td>
    <td>${colaborador.opcoesCafe.join(", ")}</td>
    <td>
        <button onclick="window.location.href='atualizar.html?id=${colaborador.id}'" style="background-color: yellow; color: black; border: none; padding: 8px 16px; cursor: pointer; font-size: 14px; border-radius: 5px;">Atualizar</button>
        <button onclick="excluirColaborador('${colaborador.id}')" style="background-color: red; color: white; border: none; padding: 8px 16px; cursor: pointer; font-size: 14px; border-radius: 5px;">Excluir</button>
    </td>
`;
                tableBody.appendChild(row);

            });
        })
        .catch(error => console.error('Erro ao listar colaboradores:', error));
}

// Função para cadastrar um novo colaborador
function cadastrarColaborador(event) {
    event.preventDefault(); // Evitar o comportamento padrão do formulário

    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const dataCafe = document.getElementById('dataCafe').value;
    const opcoesCafe = document.getElementById('opcoesCafe').value.split(",").map(item => item.trim());

    const novoColaborador = {
        nome: nome,
        cpf: cpf,
        dataCafe: dataCafe,
        opcoesCafe: opcoesCafe
    };

    // Enviar a requisição POST para o backend
    fetch(apiUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(novoColaborador)
    })
        .then(response => {
            if (response.ok) {
                alert('Colaborador cadastrado com sucesso!');
                window.location.href = 'lista.html'; // Redireciona para a página de listagem após o cadastro
            } else {
                response.text().then(text => alert('Erro: ' + text)); // Exibir erro, caso ocorra
            }
        })
        .catch(error => {
            alert('Erro ao cadastrar colaborador: ' + error);
            console.error('Erro ao cadastrar colaborador:', error);
        });
}

// Função para excluir um colaborador
function excluirColaborador(id) {
    console.log("Função excluirColaborador chamada. ID:", id); // Verifique se chega aqui

    if (confirm("Tem certeza de que deseja excluir este colaborador?")) {
        fetch(`${apiUrl}/${id}`, {
            method: 'DELETE'
        })
            .then(response => {
                if (response.ok) {
                    alert("Colaborador excluído com sucesso!");
                    listarColaboradores(); // Atualizar a lista de colaboradores após a exclusão
                } else {
                    response.text().then(text => alert("Erro: " + text));
                }
            })
            .catch(error => console.error("Erro ao excluir colaborador:", error));
    }
}


// Verificar qual página está carregada para executar o código correto
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('cadastroForm')) {
        // Página de cadastro
        document.getElementById('cadastroForm').addEventListener('submit', cadastrarColaborador);
    } else if (document.getElementById('colaboradoresTable')) {
        // Página de lista
        listarColaboradores();
    }
});

// Função para atualizar colaborador
function atualizarColaborador(event) {
    event.preventDefault(); // Evita o recarregamento da página

    const urlParams = new URLSearchParams(window.location.search);
    const colaboradorId = urlParams.get('id');

    // Verificação de depuração
    console.log("Colaborador ID:", colaboradorId);  // Exibe o ID no console para checar

    if (!colaboradorId) {
        alert('Erro: ID do colaborador não encontrado.');
        return;
    }

    // Restante do código para capturar dados e enviar a requisição PUT
    const nome = document.getElementById('nome').value;
    const cpf = document.getElementById('cpf').value;
    const dataCafe = document.getElementById('dataCafe').value;
    const opcoesCafe = document.getElementById('opcoesCafe').value.split(",").map(item => item.trim());

    const colaboradorAtualizado = {
        nome: nome,
        cpf: cpf,
        dataCafe: dataCafe,
        opcoesCafe: opcoesCafe
    };

    // Enviar a requisição PUT para atualizar o colaborador no backend
    fetch(`${apiUrl}/${colaboradorId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(colaboradorAtualizado)
    })
        .then(response => {
            if (response.ok) {
                alert('Colaborador atualizado com sucesso!');
                window.location.href = 'lista.html'; // Redireciona para a página de listagem após a atualização
            } else {
                response.text().then(text => alert('Erro ao atualizar colaborador: ' + text));
            }
        })
        .catch(error => {
            alert('Erro ao atualizar colaborador: ' + error);
            console.error('Erro ao atualizar colaborador:', error);
        });
}


// Associa a função ao evento de envio do formulário na página de atualização
document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('formAtualizarColaborador').addEventListener('submit', atualizarColaborador);
});
