package com.example.crashware.ui.Models;

public class Anotacao
{
    // Variáveis presentes na anotação

    private Integer idAnotacao;
    private String titulo;
    private String conteudo;

    private String dataCriacao;
    private String dataEdicao;



    // CONSTRUTOR
    public Anotacao(
                    Integer idAnotacao,
                    String titulo,
                    String conteudo,
                    String dataCriacao,
                    String dataEdicao)
    {
        this.idAnotacao = idAnotacao;
        this.titulo = titulo;
        this.conteudo = conteudo;

        this.dataCriacao = dataCriacao;
        this.dataEdicao = dataEdicao;
    }

    // GETTERS

    public  Integer getIdAnotacao() {  return  idAnotacao; }

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

    public void setTitulo(Integer idAnotacao)
    {
        this.idAnotacao = idAnotacao;
    }

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