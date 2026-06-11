package com.example.crashware.ui.Models;

public class Conquista {

    private String titulo;
    private String descricao;
    private int imagem;
    private int fundo;

    public Conquista(String titulo, String descricao, int imagem, int fundo) {
        this.titulo = titulo;
        this.descricao = descricao;
        this.imagem = imagem;
        this.fundo = fundo;
    }

    public String getTitulo() {
        return titulo;
    }

    public String getDescricao() {
        return descricao;
    }

    public int getImagem() {
        return imagem;
    }

    public int getFundo(){return fundo;}
}
