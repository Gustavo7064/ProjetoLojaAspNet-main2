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

-- CONSULTANDO AS TABELAS DO BANCO DE DAODS
SELECT * FROM Usuario;
SELECT * FROM Cliente;

insert into usuario (email,senha) values ('admin@email.com','123456')