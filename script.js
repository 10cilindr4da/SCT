// Classes 

class Usuario {
    constructor(nome, email, senha) {
        this.nome = nome;
        this.email = email;
        this.senha = senha;
    }
}

class Tarefa {
    constructor(id, usuarioEmail, titulo, descricao, prazo, status) {
        this.id = id;
        this.usuarioEmail = usuarioEmail; 
        this.titulo = titulo;
        this.descricao = descricao;
        this.prazo = prazo;
        this.status = status; 
    }
}

// Variáveis globais 
var listaUsuarios = [];
var listaTarefas = [];
var usuarioLogado = null;
var proximoIdTarefa = 1;

// será usado para alternar as telas de login e cadastro na mesma página. 

function alternarTela(tela) {
    if (tela == "cadastro") {
        document.getElementById("boxLogin").style.display = "none";
        document.getElementById("boxCadastro").style.display = "block";
    } else {
        document.getElementById("boxCadastro").style.display = "none";
        document.getElementById("boxLogin").style.display = "block";
    }
}

// Responsável pelo cadastro do usuariol
function cadastrarUsuario() {
    var nome = document.getElementById("cadNome").value;
    var email = document.getElementById("cadEmail").value;
    var senha = document.getElementById("cadSenha").value;

    if (nome == "" || email == "" || senha == "") {
        alert("Preencha todos os campos do cadastro!");
        return;
    }

    for (var i = 0; i < listaUsuarios.length; i++) {
        if (listaUsuarios[i].email == email) {
            alert("Este e-mail já está cadastrado");
            return;
        }
    }

    var novoUsuario = new Usuario(nome, email, senha);
    listaUsuarios.push(novoUsuario);

    alert("Usuário cadastrado com sucesso! Faça login para continuar.");
    document.getElementById("cadNome").value = "";
    document.getElementById("cadEmail").value = "";
    document.getElementById("cadSenha").value = "";

    alternarTela("login");
}

// Autenticar usuário
function autenticar() {
    var email = document.getElementById("loginEmail").value;
    var senha = document.getElementById("loginSenha").value;

    var achou = false;

    for (var i = 0; i < listaUsuarios.length; i++) {
        if (listaUsuarios[i].email == email && listaUsuarios[i].senha == senha) {
            usuarioLogado = listaUsuarios[i];
            achou = true;
            break;
        }
    }

    if (achou) {
        document.getElementById("secaoautenticacao").style.display = "none";
        document.getElementById("secaoPainel").style.display = "block";
        document.getElementById("boasVindas").innerHTML = "Olá, <b>" + usuarioLogado.nome + "</b>! Seja bem-vindo.";
        listarTarefas();
    } else {
        alert("E-mail ou senha incorretos!");
    }
}

// responsável por encerrar a sessão 
function encerrarSessao() {
    usuarioLogado = null;
    document.getElementById("secaoPainel").style.display = "none";
    document.getElementById("secaoautenticacao").style.display = "block";
    document.getElementById("loginEmail").value = "";
    document.getElementById("loginSenha").value = "";
}

// Salvar e editar tarefa
function salvarTarefa() {
    var id = document.getElementById("tarefaId").value;
    var titulo = document.getElementById("tarefaTitulo").value;
    var descricao = document.getElementById("tarefaDescricao").value;
    var prazo = document.getElementById("tarefaPrazo").value;
    var status = document.getElementById("tarefaStatus").value;

    if (titulo == "") {
        alert("O título da tarefa é obrigatório!");
        return;
    }

    if (id != "") {
        // Editar tarefa existente
        for (var i = 0; i < listaTarefas.length; i++) {
            if (listaTarefas[i].id == id) {
                listaTarefas[i].titulo = titulo;
                listaTarefas[i].descricao = descricao;
                listaTarefas[i].prazo = prazo;
                listaTarefas[i].status = status;
                break;
            }
        }
    } else {
        // Nova tarefa 
        var novaTarefa = new Tarefa(proximoIdTarefa, usuarioLogado.email, titulo, descricao, prazo, "PENDENTE");
        proximoIdTarefa++;
        listaTarefas.push(novaTarefa);
    }

    limparFormularioTarefa();
    listarTarefas();
}

//  Listar tarefas do proprietário 
function listarTarefas() {
    var divTabela = document.getElementById("tabelaTarefas");
    var filtro = document.getElementById("filtroStatus").value;

    var html = "<table><tr><th>Título</th><th>Descrição</th><th>Prazo</th><th>Status</th><th>Ações</th></tr>";
    var encontrou = false;

    for (var i = 0; i < listaTarefas.length; i++) {
        var t = listaTarefas[i];

        // Somente o proprietário consulta as tarefas se estiver logado
        if (t.usuarioEmail == usuarioLogado.email) {
            
            // Filltro por status
            if (filtro == "TODAS" || t.status == filtro) {
                encontrou = true;
                html += "<tr>";
                html += "<td><b>" + t.titulo + "</b></td>";
                html += "<td>" + t.descricao + "</td>";
                html += "<td>" + t.prazo + "</td>";
                html += "<td>" + t.status + "</td>";
                html += "<td>";
                
                //  Botão Concluir
                if (t.status != "CONCLUIDA") {
                    html += "<button onclick='concluirTarefa(" + t.id + ")'>✓ Concluir</button> ";
                }
                
                // Botão Editar
                html += "<button onclick='carregarParaEditar(" + t.id + ")'>✎ Editar</button> ";
                
                // Botão Excluir
                html += "<button onclick='excluirTarefa(" + t.id + ")' class='btn-perigo'>✕ Excluir</button>";
                
                html += "</td>";
                html += "</tr>";
            }
        }
    }

    html += "</table>";

    if (!encontrou) {
        divTabela.innerHTML = "<p>Nenhuma tarefa encontrada.</p>";
    } else {
        divTabela.innerHTML = html;
    }
}

//  Alterar status para cocluida
function concluirTarefa(id) {
    for (var i = 0; i < listaTarefas.length; i++) {
        if (listaTarefas[i].id == id) {
            listaTarefas[i].status = "CONCLUIDA";
            break;
        }
    }
    listarTarefas();
}

// Preenche o formulário para edição
function carregarParaEditar(id) {
    for (var i = 0; i < listaTarefas.length; i++) {
        if (listaTarefas[i].id == id) {
            document.getElementById("tarefaId").value = listaTarefas[i].id;
            document.getElementById("tarefaTitulo").value = listaTarefas[i].titulo;
            document.getElementById("tarefaDescricao").value = listaTarefas[i].descricao;
            document.getElementById("tarefaPrazo").value = listaTarefas[i].prazo;
            document.getElementById("tarefaStatus").value = listaTarefas[i].status;
            document.getElementById("tituloForm").innerHTML = "Editar Tarefa";
            break;
        }
    }
}

// Excluir Tarefa
function excluirTarefa(id) {
    for (var i = 0; i < listaTarefas.length; i++) {
        if (listaTarefas[i].id == id) {
            listaTarefas.splice(i, 1);
            break;
        }
    }
    listarTarefas();
}

// Limpa o formulário após salvar ou cancelar colocand como nulo
function limparFormularioTarefa() {
    document.getElementById("tarefaId").value = "";
    document.getElementById("tarefaTitulo").value = "";
    document.getElementById("tarefaDescricao").value = "";
    document.getElementById("tarefaPrazo").value = "";
    document.getElementById("tarefaStatus").value = "PENDENTE";
    document.getElementById("tituloForm").innerHTML = "Cadastrar Nova Tarefa";
}