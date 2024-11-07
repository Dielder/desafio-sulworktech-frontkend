const apiUrl = 'https://desafio-sulworktech-production.up.railway.app/api/cafe-da-manha';

// Função para listar colaboradores
function listarColaboradores() {
    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            const tableBody = document.querySelector("#colaboradoresTable tbody");
            tableBody.innerHTML = '';

            const hoje = new Date();
            data.forEach(colaborador => {
                const dataCafe = new Date(colaborador.dataCafe);
                const dataFormatada = `${String(dataCafe.getDate()).padStart(2, '0')}/${String(dataCafe.getMonth() + 1).padStart(2, '0')}/${dataCafe.getFullYear()}`;

                // Se a data do café já passou, marcar automaticamente "não trouxe"
                const trouxeStatus = dataCafe < hoje ? true : colaborador.trouxeOpcao;

                // Criando a linha da tabela com as informações
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td>${colaborador.nome}</td>
                    <td>${colaborador.cpf}</td>
                    <td>${dataFormatada}</td>
                    <td>${colaborador.opcoesCafe.join(", ")}</td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => console.error('Erro ao listar colaboradores:', error));
}

// Função para atualizar o status de trouxeOpcao do colaborador
function atualizarStatus(id, trouxeOpcao) {
    fetch(`http://localhost:8080/api/CafeDaManha/trouxeOpcao/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ trouxeOpcao: trouxeOpcao }), // Enviar o objeto com o campo correto
    })
        .then(response => {
            if (response.ok) {
                alert('Status de trouxeOpcao atualizado com sucesso!');
                listarColaboradores(); // Recarregar a lista de colaboradores após a atualização
            } else {
                response.text().then(text => alert('Erro: ' + text));
            }
        })
        .catch(error => {
            alert('Erro ao atualizar o status: ' + error);
        });
}

// Função para cadastrar um novo colaborador - usaremos apenas em cadastro.html
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

