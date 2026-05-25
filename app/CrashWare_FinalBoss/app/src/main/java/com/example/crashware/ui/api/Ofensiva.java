package com.example.crashware.ui.api;

import android.content.Context;
import android.content.SharedPreferences;
import android.widget.Toast;

import org.json.JSONObject;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.POST;

public class Ofensiva {

    // Armazena a resposta da API:
    public static class SicronizarOfensivaResponse {
        String mensagem;
    }

    // INTERFACE da API:
    public static interface SicronizarOfensiva {
        @POST("/user/sicronizar_ofensiva")
        Call<SicronizarOfensivaResponse> sicronizar(
                @Header("Authorization") String token
        );
    }//Interface

    public static void SicronizarOfensiva(SharedPreferences prefs, Context context) {

        //Pego o valor do token
        String token = prefs.getString("token", null);

        //Preparo ele para enviar para o header da requisição
        token = "Bearer " + token;

        // Criando a API
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("https://api-crashware.onrender.com/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        //

        // Fazendo que a interface da API seja utilizavel:
        SicronizarOfensiva api = retrofit.create(SicronizarOfensiva.class);

        // Monto a chamada da API:
        Call<SicronizarOfensivaResponse> requisicao = api.sicronizar(token);

        requisicao.enqueue(new Callback<SicronizarOfensivaResponse>() {
            @Override
            public void onResponse(
                    Call<SicronizarOfensivaResponse> requisicao,
                    retrofit2.Response<SicronizarOfensivaResponse> resposta
            ) {
                //Caso a requisição retornou resposta
                if (resposta.code() == 409) {
                    //Caso usuario ja estiver sicronizado

                    //Ignora

                    return;

                }
                if(resposta.isSuccessful())
                {
                    //Requisição der certo

                    //Ignora

                    return;
                }
                else {
                    //Retorna erro caso  a reqsição estiver errado

                    String erro = "Erro ao sicronizar";

                    try {
                        String detail = resposta.errorBody().string();

                        JSONObject json = new JSONObject(detail);


                        if (detail != null) {
                            erro = json.getString("detail");

                        }
                    } catch (Exception e) {
                        // ignora, mantém mensagem padrão
                    }

//                    //Aqui retorna o ERRO
//                    Toast.makeText(context, erro, Toast.LENGTH_LONG).show();
                }
            }

            @Override
            public void onFailure(Call<SicronizarOfensivaResponse> call, Throwable t) {
                // Caso deu erro na requisição
                // erro de conexão (internet, URL, servidor fora)
                Toast.makeText(
                        context,
                        "Erro de conexão: " + t.getMessage(),
                        Toast.LENGTH_LONG
                ).show();
            }
        });


    }//Sicronizar Ofensiva


    //Validar Ofensiva
    // Armazena a resposta da API:
    public static class ValidarOfensivaResponse {
        Integer ofensiva;
    }

    // INTERFACE da API:
    public static interface ValidarOfensiva {
        @POST("/user/validar_ofensiva")
        Call<ValidarOfensivaResponse> validar(
                @Header("Authorization") String token
        );
    }//Interface

    public static void ValidarOfensiva(SharedPreferences prefs, Context context) {

        //Pego o valor do token
        String token = prefs.getString("token", null);

        //Preparo ele para enviar para o header da requisição
        token = "Bearer " + token;

        // Criando a API
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("https://api-crashware.onrender.com/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        //

        // Fazendo que a interface da API seja utilizavel:
        ValidarOfensiva api = retrofit.create(ValidarOfensiva.class);

        // Monto a chamada da API:
        Call<ValidarOfensivaResponse> requisicao = api.validar(token);

        requisicao.enqueue(new Callback<ValidarOfensivaResponse>() {
            @Override
            public void onResponse(
                    Call<ValidarOfensivaResponse> requisicao,
                    retrofit2.Response<ValidarOfensivaResponse> resposta
            ) {
                if(resposta.isSuccessful())
                {
                    //Requisição der certo

                    ValidarOfensivaResponse dados = resposta.body();

                    Integer ofensiva = dados.ofensiva;

                    //Atualizo o valor da ofensiva
                    prefs.edit()
                            .putInt("ofensiva",ofensiva)
                            .apply();

                }
                else {
                    //Retorna erro caso  a reqsição estiver errado

                    String erro = "Erro ao validar ofensiva";

                    try {
                        String detail = resposta.errorBody().string();

                        JSONObject json = new JSONObject(detail);


                        if (detail != null) {
                            erro = json.getString("detail");

                        }
                    } catch (Exception e) {
                        // ignora, mantém mensagem padrão
                    }

//                    //Aqui retorna o ERRO
//                    Toast.makeText(context, erro, Toast.LENGTH_LONG).show();
                }
            }

            @Override
            public void onFailure(Call<ValidarOfensivaResponse> call, Throwable t) {
                // Caso deu erro na requisição
                // erro de conexão (internet, URL, servidor fora)
                Toast.makeText(
                        context,
                        "Erro de conexão: " + t.getMessage(),
                        Toast.LENGTH_LONG
                ).show();
            }
        });


    }//Validar Ofensiva

}//Ofensiva
