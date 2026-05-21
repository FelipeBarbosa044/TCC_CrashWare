package com.example.crashware.ui.Models;

public class Anotacao
{
    // Variáveis presentes na anotação
    private String titulo;
    private String conteudo;

    private String dataCriacao;
    private String dataEdicao;

    // CONSTRUTOR
    public Anotacao(String titulo,
                    String conteudo,
                    String dataCriacao,
                    String dataEdicao)
    {
        this.titulo = titulo;
        this.conteudo = conteudo;

        this.dataCriacao = dataCriacao;
        this.dataEdicao = dataEdicao;
    }

    // GETTERS
    public String getTitulo()
    {
        return titulo;
    }

    public String getConteudo()
    {
        return conteudo;
    }

    public String getDataCriacao()
    {
        return dataCriacao;
    }

    public String getDataEdicao()
    {
        return dataEdicao;
    }

    // SETTERS
    public void setTitulo(String titulo)
    {
        this.titulo = titulo;
    }

    public void setConteudo(String conteudo)
    {
        this.conteudo = conteudo;
    }

    public void setDataCriacao(String dataCriacao)
    {
        this.dataCriacao = dataCriacao;
    }

    public void setDataEdicao(String dataEdicao)
    {
        this.dataEdicao = dataEdicao;
    }
}