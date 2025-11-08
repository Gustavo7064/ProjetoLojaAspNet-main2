-- CRIANDO O BANCO DE DADOS
CREATE DATABASE bdloja2dsa;

-- USANDO O BANCO DE DADOS
USE bdloja2dsa;

-- CRIANDO AS TABELAS DO BANCO DE DAODS
CREATE TABLE Usuario (
id int primary key auto_increment,
email varchar(40) not null,
senha varchar(40) not null
);

CREATE TABLE Cliente(
codCli int primary key auto_increment,
nomeCli varchar(40) not null,
telCli varchar(40) not null,
emailCli varchar(40) not null
);

CREATE TABLE Carrinho (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    UsuarioId INT NOT NULL,
    CriadoEm DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (UsuarioId) REFERENCES Usuario(Id)
);

CREATE TABLE CarrinhoItem (
    Id INT AUTO_INCREMENT PRIMARY KEY,
    CarrinhoId INT NOT NULL,
    JogoId INT NOT NULL,
    Nome VARCHAR(100),
    Preco DECIMAL(10,2),
    Quantidade INT DEFAULT 1,
    FOREIGN KEY (CarrinhoId) REFERENCES Carrinho(Id)
);

drop table Carrinho;
-- CONSULTANDO AS TABELAS DO BANCO DE DAODS
select*from Carrinho;
select*from CarrinhoItem;
SELECT * FROM Usuario;
SELECT * FROM Cliente;

insert into usuario (email,senha) values ('admin@email.com','123456')