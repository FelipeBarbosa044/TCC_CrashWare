package com.example.crashware.ui.api;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.Toast;

import androidx.fragment.app.Fragment;


import com.example.crashware.R;
import com.example.crashware.ui.anotacoes.Anotacoes_fragment;

import org.json.JSONObject;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.PATCH;
import retrofit2.http.POST;

public class Anotacoes {

    //Carregar Anotações

    // Armazena a resposta da API:
    public static class AnotacaoResponse{


        public int id_anotacao;
        public String titulo;
        public String texto;
        public String criado_em;
        public String atualizado_em;

    }

    public static class CarregarAnotacoesResponse {

        private List<AnotacaoResponse> anotacoes;

    }

    // INTERFACE da API:
    public static interface BuscarAnotacoes {
        @GET("/annotation/")
        Call<CarregarAnotacoesResponse> carregar(
                @Header("Authorization") String token
        );
    }//Interface

    // Callback
    public interface AnotacaoCallback {
        void sucesso(List<AnotacaoResponse>  anotacoes);

    }

    public static void Carregar_Anotacoes(SharedPreferences prefs, Fragment fragment, AnotacaoCallback callback) {

        //Pego o valor do token
        String token = prefs.getString("token", null);

        //Preparo ele para enviar para o header da requisição
        token = "Bearer " + token;

        // Criando a API
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("https://api-crashware.onrender.com/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();


        // Fazendo que a interface da API seja utilizavel:
        BuscarAnotacoes api = retrofit.create(BuscarAnotacoes.class);

        // Monto a chamada da API:
        Call<CarregarAnotacoesResponse> requisicao = api.carregar(token);

        requisicao.enqueue(new Callback<CarregarAnotacoesResponse>() {
            @Override
            public void onResponse(
                    Call<CarregarAnotacoesResponse> requisicao,
                    retrofit2.Response<CarregarAnotacoesResponse> resposta
            ) {
                if(resposta.isSuccessful())
                {
                    //Requisição der certo

                    //Retorno o objeto que contem as anotações

                    List<AnotacaoResponse> anotacoes = resposta.body().anotacoes;

                    callback.sucesso(anotacoes);


                }
                else {
                    //Retorna erro caso a reqsição estiver errada

                    String erro = "Erro ao Buscar Anotações";

                    try {
                        String detail = resposta.errorBody().string();

                        JSONObject json = new JSONObject(detail);


                        if (detail != null) {
                            erro = json.getString("detail");

                        }
                    } catch (Exception e) {
                        // ignora, mantém mensagem padrão
                    }

                    //Aqui retorna o ERRO
                    Toast.makeText(fragment.requireContext(), erro, Toast.LENGTH_LONG).show();
                }
            }

            @Override
            public void onFailure(Call<CarregarAnotacoesResponse> call, Throwable t) {
                // Caso deu erro na requisição
                // erro de conexão (internet, URL, servidor fora)
                Toast.makeText(
                        fragment.requireContext(),
                        "Erro de conexão: " + t.getMessage(),
                        Toast.LENGTH_LONG
                ).show();
            }
        });

    }//Buscar Anotações


    //Adicionar Anotação

    // Dados que vai para a API:
    static class AnotacaoRequest {

        public String titulo;
        public String texto;
        public Integer id;


        public AnotacaoRequest(String titulo, String texto , Integer id) {
            this.titulo = titulo;
            this.texto = texto;
            this.id = id;
        }
    }

    // Armazena a resposta da API:
    public static class AdicionarAnotacaoResponse{


        public String mensagem;
        public int id_anotacao;
        public String id;
        public String criado_em;
        public String atualizado_em;

    }

    // INTERFACE da API:
    public static interface AdicionarAnotacao {

        @POST("/annotation/adicionar_anotacao")
        Call<AdicionarAnotacaoResponse> adicionar(
                @Header("Authorization") String token,
                @Body AnotacaoRequest request
        );

    }

    public static void Adicionar_Anotacao(String titulo,String texto, SharedPreferences prefs, Fragment fragment) {

        //Pego o valor do token
        String token = prefs.getString("token", null);

        //Preparo ele para enviar para o header da requisição
        token = "Bearer " + token;

        //Objeto de Adicionar Anotação
        AnotacaoRequest dados = new AnotacaoRequest(titulo,texto,null);


        // Criando a API
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("https://api-crashware.onrender.com/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        // Fazendo que a interface da API seja utilizavel:
        AdicionarAnotacao api = retrofit.create(AdicionarAnotacao.class);


        // Monto a chamada da API
        Call<AdicionarAnotacaoResponse> requisicao = api.adicionar(token, dados);

        requisicao.enqueue(new Callback<AdicionarAnotacaoResponse>() {
            @Override
            public void onResponse(
                    Call<AdicionarAnotacaoResponse> requisicao,
                    retrofit2.Response<AdicionarAnotacaoResponse> resposta
            ) {
                if(resposta.isSuccessful())
                {
                    //Evita crashar
                    if (!fragment.isAdded()) {
                        return;
                    }

                    //Requisição der certo
                    Toast.makeText(fragment.requireContext(), "Anotação Criada", Toast.LENGTH_LONG).show();


                    //Avisa o Anotacoes_fragment para recarregar
                    fragment.getParentFragmentManager().setFragmentResult(
                            "atualizar_anotacoes",
                            new Bundle()
                    );


                    //Volta para a tela de Anotacoes_Fragment
                    fragment.requireActivity()
                            .getSupportFragmentManager()
                            .popBackStack();


                }
                else {
                    //Retorna erro caso a reqsição estiver errada

                    String erro = "Erro ao Adicionar Anotação";

                    try {
                        String detail = resposta.errorBody().string();

                        JSONObject json = new JSONObject(detail);


                        if (detail != null) {
                            erro = json.getString("detail");

                        }
                    } catch (Exception e) {
                        // ignora, mantém mensagem padrão
                    }

                    //Aqui retorna o ERRO
                    Toast.makeText(fragment.requireContext(), erro, Toast.LENGTH_LONG).show();
                }
            }

            @Override
            public void onFailure(Call<AdicionarAnotacaoResponse> call, Throwable t) {
                // Caso deu erro na requisição
                // erro de conexão (internet, URL, servidor fora)
                Toast.makeText(
                        fragment.requireContext(),
                        "Erro de conexão: " + t.getMessage(),
                        Toast.LENGTH_LONG
                ).show();
            }
        });

    }//Buscar Anotacoes


    //Editar Anotação

    // INTERFACE da API:
    public static interface EditarAnotacao {

        @PATCH("/annotation/editar_anotacao")
        Call<AdicionarAnotacaoResponse> editar(
                @Header("Authorization") String token,
                @Body AnotacaoRequest request
        );

    }

    public static void Editar_Anotacao(String titulo,String texto,Integer id, SharedPreferences prefs, Fragment fragment) {

        //Pego o valor do token
        String token = prefs.getString("token", null);

        //Preparo ele para enviar para o header da requisição
        token = "Bearer " + token;

        //Objeto de Adicionar Anotação
        AnotacaoRequest dados = new AnotacaoRequest(titulo, texto, id);


        // Criando a API
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("https://api-crashware.onrender.com/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        // Fazendo que a interface da API seja utilizavel:
        EditarAnotacao api = retrofit.create(EditarAnotacao.class);


        // Monto a chamada da API
        Call<AdicionarAnotacaoResponse> requisicao = api.editar(token, dados);

        requisicao.enqueue(new Callback<AdicionarAnotacaoResponse>() {
            @Override
            public void onResponse(
                    Call<AdicionarAnotacaoResponse> requisicao,
                    retrofit2.Response<AdicionarAnotacaoResponse> resposta
            ) {
                if(resposta.isSuccessful())
                {
                    //Requisição der certo



                }
                else {
                    //Retorna erro caso a reqsição estiver errada

                    String erro = "Erro ao Editar Anotação";

                    try {
                        String detail = resposta.errorBody().string();

                        JSONObject json = new JSONObject(detail);


                        if (detail != null) {
                            erro = json.getString("detail");

                        }
                    } catch (Exception e) {
                        // ignora, mantém mensagem padrão
                    }

                    //Aqui retorna o ERRO
                    Toast.makeText(fragment.requireContext(), erro, Toast.LENGTH_LONG).show();
                }
            }

            @Override
            public void onFailure(Call<AdicionarAnotacaoResponse> call, Throwable t) {
                // Caso deu erro na requisição
                // erro de conexão (internet, URL, servidor fora)
                Toast.makeText(
                        fragment.requireContext(),
                        "Erro de conexão: " + t.getMessage(),
                        Toast.LENGTH_LONG
                ).show();
            }
        });



    }//Editar Anotação



    //Excluir Anotação

    // INTERFACE da API:
    public static interface DeletarAnotacao {

        @DELETE("/annotation/deletar_anotacao")
        Call<AdicionarAnotacaoResponse> deletar(
                @Header("Authorization") String token,
                @Body AnotacaoRequest request
        );

    }
    public static void Deletar_Anotacao(Integer id, SharedPreferences prefs, Fragment fragment) {

        //Pego o valor do token
        String token = prefs.getString("token", null);

        //Preparo ele para enviar para o header da requisição
        token = "Bearer " + token;

        //Objeto de Adicionar Anotação
        AnotacaoRequest dados = new AnotacaoRequest(null, null, id);


        // Criando a API
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("https://api-crashware.onrender.com/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        // Fazendo que a interface da API seja utilizavel:
        DeletarAnotacao api = retrofit.create(DeletarAnotacao.class);

        // Monto a chamada da API
        Call<AdicionarAnotacaoResponse> requisicao = api.deletar(token, dados);

        requisicao.enqueue(new Callback<AdicionarAnotacaoResponse>() {
            @Override
            public void onResponse(
                    Call<AdicionarAnotacaoResponse> requisicao,
                    retrofit2.Response<AdicionarAnotacaoResponse> resposta
            ) {
                if(resposta.isSuccessful())
                {
                    //Requisição der certo



                }
                else {
                    //Retorna erro caso a reqsição estiver errada

                    String erro = "Erro ao Deletar Anotação";

                    try {
                        String detail = resposta.errorBody().string();

                        JSONObject json = new JSONObject(detail);


                        if (detail != null) {
                            erro = json.getString("detail");

                        }
                    } catch (Exception e) {
                        // ignora, mantém mensagem padrão
                    }

                    //Aqui retorna o ERRO
                    Toast.makeText(fragment.requireContext(), erro, Toast.LENGTH_LONG).show();
                }
            }

            @Override
            public void onFailure(Call<AdicionarAnotacaoResponse> call, Throwable t) {
                // Caso deu erro na requisição
                // erro de conexão (internet, URL, servidor fora)
                Toast.makeText(
                        fragment.requireContext(),
                        "Erro de conexão: " + t.getMessage(),
                        Toast.LENGTH_LONG
                ).show();
            }
        });



    }//Deletar Anotação



}//Anotações




