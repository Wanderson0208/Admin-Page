document.addEventListener('DOMContentLoaded', function() {
    
    // Seleciona os elementos HTML pelo ID e armazena em variáveis
    const addUserBtn = document.getElementById('addUserBtn');
    const userModalCad = document.getElementById('userModalCad');
    const userModalEdit = document.getElementById('userModalEdit');
    const confirmModal = document.getElementById('confirmModal');
    const closeBtns = document.querySelectorAll('.closeBtn');
    const userFormCad = document.getElementById('userFormCad');
    const userFormEdit = document.getElementById('userFormEdit');
    const userTableBody = document.getElementById('userTableBody');
    const searchEmail = document.getElementById('searchEmail');
    const searchBtn = document.getElementById('searchBtn');

    // Obtem os usuários armazenados no LocalStorage ou cria um array vazio
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let editingUserIndex = -1; // Define o índice de edição como -1, indicando que nenhum usuário está sendo editado

    // Define um evento de clique para o botão de adicionar usuário
    addUserBtn.onclick = () => {

        editingUserIndex = -1; // Define o índice de edição como -1, indicando que um novo usuário será adicionado
        userFormCad.reset(); // Reseta o formulário, limpando todos os campos
        userModalCad.style.display = 'block'; // Exibe o modal de usuário, permitindo a inserção de novos dados
    
    };

    // Percorre todos os botões de fechar e adiciona um evento de clique a eles
    closeBtns.forEach(btn => {

        btn.onclick = () => {

            userModalCad.style.display = 'none'; // Fecha o modal de Cadastro de usuário
            userModalEdit.style.display = 'none'; // Fecha o modal de Edição de usuário
            confirmModal.style.display = 'none'; // Fecha o modal de confirmação

        }

    });

    // Define a função global 'deleteUser' que recebe um índice como argumento
    window.onclick = event => {

        if (event.target == userModalCad) userModalCad.style.display = 'none'; // Verifica se o elemento clicado é o modal de cadastro de usuário e, se for, fecha o modal
        if (event.target == userModalEdit) userModalEdit.style.display = 'none'; // Verifica se o elemento clicado é o modal de edição de usuário e, se for, fecha o modal
        if (event.target == confirmModal) confirmModal.style.display = 'none'; // Verifica se o elemento clicado é o modal de confirmação e, se for, fecha o modal
    
    };

    // Adiciona um evento de submissão ao formulário de cadastro de usuário
    userFormCad.onsubmit = event => {

        // Evita o envio padrão do formulário (recarregamento da página)
        event.preventDefault();

        // Validações de email e telefone
        const email = userFormCad.email.value;
        const phone = userFormCad.phone.value;
        
        // Verificação no campo do email
        if (!validateEmail(email)) {
            
            // Aqui exibimos uma mensagem de erro caso o email seja invático
            alert('Por favor, insira um email válido.');
            
            return;
        
        }
        
        // Verificação no campo do telefone
        if (!validatePhone(phone)) {
            
            // Aqui exibimos uma mensagem de erro caso o telefone seja inválido
            alert('Por favor, insira um telefone válido.');
            
            return;
        
        }
        
        // Verificação de duplicidade de email e telefone
        const isDuplicateEmail = users.some((user, index) => user.email === email && index !== editingUserIndex);
        const isDuplicatePhone = users.some((user, index) => user.phone === phone && index !== editingUserIndex);
        
        // Verifica se o email ou telefone ja foram cadastrados
        if (isDuplicateEmail) {
            
            // Aqui exibimos uma mensagem de erro caso o email já esteja cadastrado no sistema
            alert('Este email já está registrado.');
            return;
        
        }
        
        // Verifica se o email ou telefone ja foram cadastrados
        if (isDuplicatePhone) {
            
            // Aqui exibimos uma mensagem de erro caso o telefone já esteja cadastrado no sistema
            alert('Este telefone já está registrado.');
            return;
        
        }

        // Coleta os dados do formulário e os armazena em um objeto -> user ={}
        const user = {

            // Aqui vamos inserir os dados dos usuario vindos do formulário, em propriedades do objeto user
            name: userFormCad.name.value,
            email: userFormCad.email.value,
            phone: userFormCad.phone.value,
            city: userFormCad.city.value

        };

        // Verifica se estamos ADCIONAND um novo usuário ou se estamos EDITANDO um usuario já existente
        if (editingUserIndex === -1) {

            users.push(user);// Adiciona o novo usuário( user = {} ) ao array de usuários( users = [] )
       
        } else {

            users[editingUserIndex] = user;// Atualiza o usuário( user = {} ) existente no array de usuários( users = [] )
        
        }

        localStorage.setItem('users', JSON.stringify(users));// Salvamos o array( users = [] ) de usuários( user = {} ) atualizado no LocalStorage e convertemos o objeto( user = {} ) em string para armazenar no LocalStorage
        userModalCad.style.display = 'none'; // Fecha o modal de cadastro/edição
        renderTable(users);// Atualiza a tabela de usuários com as infos do usuario que foi EDITADO ou ADICIONADO
    
    };

    // Adiciona um evento de submissão ao formulário de edição de usuário
    userFormEdit.onsubmit = event => {

        // Evita o envio padrão do formulário
        event.preventDefault(); 

        // Validações de email e telefone
        const email = userFormEdit.email.value;
        const phone = userFormEdit.phone.value;

        // Verificação no campo do email
        if (!validateEmail(email)) {     

            // Aqui exibimos uma mensagem de erro caso o email seja invático
            alert('Por favor, insira um email válido.');
            return;

        }

        // Verificação no campo do telefone
        if (!validatePhone(phone)) {

            // Aqui exibimos uma mensagem de erro caso o telefone seja invático
            alert('Por favor, insira um telefone válido.');
            return;

        }

        // Verificação de duplicidade de email e telefone
        const isDuplicateEmail = users.some((user, index) => user.email === email && index !== editingUserIndex);
        const isDuplicatePhone = users.some((user, index) => user.phone === phone && index !== editingUserIndex);

        // Verifica se o email ou telefone ja foram cadastrados
        if (isDuplicateEmail) {

            // Aqui exibimos uma mensagem de erro caso o email já esteja cadastrado no sistema
            alert('Este email já está registrado.');
            return;

        }

        // Verifica se o email ou telefone ja foram cadastrados
        if (isDuplicatePhone) {

            // Aqui exibimos uma mensagem de erro caso o telefone Jays cadastrado no sistema
            alert('Este telefone já está registrado.');
            return;

        }

        // Coleta os dados do formulário e os armazena em um objeto -> user={}
        const user = {
            
            // Aqui vamos inserir os dados dos usuario vindos do formulário, em propriedades do objeto user
            name: userFormEdit.name.value,
            email: userFormEdit.email.value,
            phone: userFormEdit.phone.value,
            city: userFormEdit.city.value
        
        };

        users[editingUserIndex] = user; // Atualiza o usuário( user = {} ) existente no array de usuários( users = [] )
        localStorage.setItem('users', JSON.stringify(users)); // Salvamos o array( users = [] ) de usuários( user = {} ) atualizado no LocalStorage e convertemos o objeto( user = {} ) em string para armazenar no LocalStorage
        userModalEdit.style.display = 'none'; // Fecha o modal de edição
        renderTable(users); // Atualiza a tabela de usuários com as infos do usuario que foi EDITADO

    };

    // Adiciona um evento de clique para o botão de pesquisa
    searchBtn.onclick = () => {
    
        // Filtra os usuários com base no email digitado no campo de pesquisa
        const filteredUsers = users.filter(user => user.email.includes(searchEmail.value));
        renderTable(filteredUsers); // Renderiza a tabela com os usuários filtrados
    
    };

    // Função que renderiza/mostra a tabela de usuários na tela
    function renderTable(usersToRender) {
    
        // Limpa o conteúdo atual do corpo da tabela de usuários
        userTableBody.innerHTML = '';

        if ( usersToRender.length === 0 ) {

            userTableBody.innerHTML = '<tr><td colspan="5">Nenhum usuário encontrado.</td></tr>';

        } else {

            // Aqui o programa está percorrendo/passando( forEach ) por cada item( objeto user = {} ) que tem dentro do array( users = [] ) e coletamos cad obejto e seu indice/posição dentro do array 
            usersToRender.forEach((user, index) => {
    
                // Criamos uma nova linha( tr ) na tabela e inserimos essa linha na variavel row
                const row = document.createElement('tr');

                // Aqui estamos inserindo a linha( tr ) com os dados do usuário( user = {} )
                row.innerHTML = `

                    <!--Aqui estamos inserindo os dados do usuário( user = {} ) na linha da tabela-->
                    <td>${user.name}</td>
                    <td>${user.email}</td>
                    <td>${user.phone}</td>
                    <td>${user.city}</td>
                    <td class="actions">
                        <button class="editar" onclick="editUser(${index})">Editar</button>
                        <button class="excluir" onclick="deleteUser(${index})">Excluir</button>
                    </td>

                `;

                // Adiciona a nova linha( row ) na tabela no documento HTML
                userTableBody.appendChild(row);

            });

        }

    }

    window.editUser = index => {

        // Define o índice do usuário que está sendo editado
        editingUserIndex = index;

        //Pegamos o objeto( user = {} ) e seus atributos localizados na(o) posição/indice[ index ] dentro array( users = [] ) e armazenamos na variavel( const user )
        const user = users[index];

        // Preenche o formulário com os dados do usuário para edição
        userFormEdit.name.value = user.name;
        userFormEdit.email.value = user.email;
        userFormEdit.phone.value = user.phone;
        userFormEdit.city.value = user.city;

        // Abre o modal de edição com as informações atuais do usuário para serem editadas
        userModalEdit.style.display = 'block';

    };

    // Define a função global 'deleteUser' que recebe um índice como argumento
    window.deleteUser = index => {

        // Exibe o modal de confirmação, tornando-o visível
        confirmModal.style.display = 'block';

        // Define um evento de clique para o botão de confirmação de exclusão
        document.getElementById('confirmDeleteBtn').onclick = () => {

            users.splice(index, 1); // Remove( splice ) 1 usuário( user = {} ) da lista(  users = [] ) a partir do indice/posição( index )
            localStorage.setItem('users', JSON.stringify(users)); // Atualiza o LocalStorage com o array de usuários atualizado
            confirmModal.style.display = 'none'; // Fecha o modal de confirmação
            renderTable(users); // Atualiza a tabela de usuários
      
        };
    
    };

    // Função para validar email
    function validateEmail(email) {
        
        // Expressão regular para a validação do email digitado
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        return re.test(String(email).toLowerCase());
    
    }
    
    // Função para validar telefone
    function validatePhone(phone) {
        
        // Verifica se o telefone possui 10 ou 11 dígitos
        const re = /^\d{10,11}$/;
        return re.test(String(phone));
    
    }

    // Renderiza a tabela de usuários ao carregar a página
    renderTable(users);

});