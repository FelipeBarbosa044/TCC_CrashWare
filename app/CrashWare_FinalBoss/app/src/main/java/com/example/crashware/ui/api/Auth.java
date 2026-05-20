package com.example.crashware.ui.api;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.widget.Toast;

import com.example.crashware.ui.login.Login;
import com.example.crashware.ui.navegacao.Home;
import com.example.crashware.ui.navegacao.carregamento;

import org.json.JSONObject;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.http.Header;
import retrofit2.http.POST;

public class Auth {

    //Token
    static class RefreshTokenResponse{
        String token;
        String token_type;

        public String getToken() {
            return token;
        }


    }

    //Refresh Token
    static class TokenResponse{

        Integer id;

        public Integer getId() {
            return id;
        }
    }


    //Vericiar Token
    static interface Token {
        @POST("/auth/verificar_token")
        Call<TokenResponse> verificar(
                @Header("Authorization") String token
        );
    }

    //Verificar Refreshh Token
    static interface VerificarRefreshToken {
        @POST("/auth/verificar_refresh_token")
        Call<TokenResponse> verificar(
                @Header("Authorization") String refresh_token
        );
    }

    //Refresh_Token
    static interface RefreshToken {
        @POST("/auth/refresh_token")
        Call<RefreshTokenResponse> gerar(
                @Header("Authorization") String refresh_token
        );
    }


    public interface AuthCallback {

        void onSuccess();

    }

    //Função de verificar Token
    public static void verificarToken(Activity context, SharedPreferences prefs,boolean home,AuthCallback callback)
    {

        //Pego o valor do token
        String token = prefs.getString("token",null);

        //Preparo ele para enviar para o header da requisição
        token = "Bearer " + token;

        // Criando a API
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("https://api-crashware.onrender.com/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        //

        // Fazendo que a interface da API seja utilizavel:
        Token api = retrofit.create(Token.class);

        // Monto a chamada da API:
        Call<TokenResponse> requisicao = api.verificar(token);

        requisicao.enqueue(new Callback<TokenResponse>() {
            @Override
            public void onResponse(
                    Call<TokenResponse> requisicao,
                    retrofit2.Response<TokenResponse> resposta
            ) {
                //Se o token for valido
                if (resposta.isSuccessful())
                {

                    if(home == false)
                    {
                        //Levo para a tela HOME
                        Intent i = new Intent(context, Home.class);
                        context.startActivity(i);
                        context.finish();
                    }else
                    {
                        if (callback != null)
                        {
                            callback.onSuccess();
                        }
                    }
                }else {
                    String erro = null;
                    try {
                        String detail = resposta.errorBody().string();

                        JSONObject json = new JSONObject(detail);


                        if (detail != null) {
                            erro = json.getString("detail");

                        }


                    } catch (Exception e) {
                        // ignora, mantém mensagem padrão
                    }


                    if ("Acesso Negado".equals(erro)) {
                        //Sair da conta

                        //Deleto o token e o refresh_token
                        prefs.edit()
                                .remove("token")
                                .remove("refresh_token")
                                .apply();

                        //Vou para o login

                        Intent i = new Intent(context, Login.class);

                        //Faz com que o usuario nao consiga voltar para a home , caso ele estiver deslogado
                        i.setFlags(
                                Intent.FLAG_ACTIVITY_NEW_TASK |
                                Intent.FLAG_ACTIVITY_CLEAR_TASK
                        );
                        context.startActivity(i);
                        context.finish();

                        return;
                    }

                    //Verifico o refresh token
                    verificarRefreshToken(context, prefs, home,callback);
                }
            }


            @Override
            public void onFailure(Call<TokenResponse> call, Throwable t) {
                // Caso deu erro na requisição
                // erro de conexão (internet, URL, servidor fora)
//                Toast.makeText(
//                        context,
//                        "Erro de conexão: " + t.getMessage(),
//                        Toast.LENGTH_LONG
//                ).show();
            }
        });


        //

    }//Verificar Token

    public static void verificarRefreshToken(Activity context, SharedPreferences prefs,boolean home,AuthCallback callback)
    {
        //Pego o valor do token
        String refresh_token = prefs.getString("refresh_token",null);

        //Preparo ele para enviar para o header da requisição
        refresh_token = "Bearer " + refresh_token;

        // Criando a API
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("https://api-crashware.onrender.com/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        //

        // Fazendo que a interface da API seja utilizavel:
        VerificarRefreshToken api = retrofit.create(VerificarRefreshToken.class);

        // Monto a chamada da API:
        Call<TokenResponse> requisicao = api.verificar(refresh_token);

        requisicao.enqueue(new Callback<TokenResponse>() {
            @Override
            public void onResponse(
                    Call<TokenResponse> requisicao,
                    retrofit2.Response<TokenResponse> resposta
            )
            {
                if (resposta.isSuccessful())
                {
                    //Se o refresh_Token estiver valido


                    //Gero um novo token
                    Refresh_Token(context,prefs,home,callback);

                }else
                {
                    //Sair da conta

                    //Deleto o token e o refresh_token
                    prefs.edit()
                            .remove("token")
                            .remove("refresh_token")
                            .apply();

                    //Vou para o login

                    Intent i = new Intent(context, Login.class);

                    i.setFlags(
                            Intent.FLAG_ACTIVITY_NEW_TASK |
                            Intent.FLAG_ACTIVITY_CLEAR_TASK
                    );
                    context.startActivity(i);
                    context.finish();
                }
            }

            @Override
            public void onFailure(Call<TokenResponse> call, Throwable t) {
                // Caso deu erro na requisição
                // erro de conexão (internet, URL, servidor fora)
//                Toast.makeText(
//                        context,
//                        "Erro de conexão: " + t.getMessage(),
//                        Toast.LENGTH_LONG
//                ).show();
            }
        });//requisição

    }//Verificar Refresh Token


    public static void Refresh_Token(Activity context,SharedPreferences prefs,boolean home,AuthCallback callback) {
        //Pego o valor do Refesh_Token
        String refresh_token = prefs.getString("refresh_token", null);

        //Preparo ele para enviar para o header da requisição
        refresh_token = "Bearer " + refresh_token;

        // Criando a API
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("https://api-crashware.onrender.com/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        //

        // Fazendo que a interface da API seja utilizavel:
        RefreshToken api = retrofit.create(RefreshToken.class);

        // Monto a chamada da API:
        Call<RefreshTokenResponse> requisicao = api.gerar(refresh_token);

        //Gero a requisição
        requisicao.enqueue(new Callback<RefreshTokenResponse>() {
            @Override
            public void onResponse(
                    Call<RefreshTokenResponse> requisicao,
                    retrofit2.Response<RefreshTokenResponse> resposta
            )
            {
                if(resposta.isSuccessful())
                {
                    //Pego o token da API
                    RefreshTokenResponse dados = resposta.body();

                    if (dados != null)
                    {
                        //Salvo o valor no SharedPreferences
                        String token = dados.getToken();

                        prefs.edit()
                                .putString("token", token)
                                .apply();
                    }


                    if(!home)
                    {
                        //Vou para a HOME
                        Intent i = new Intent(context, Home.class);
                        context.startActivity(i);
                        context.finish();

                    }else {

                        //O token foi gerado
                        if (callback != null)
                        {
                            callback.onSuccess();
                        }
                    }
                }else
                {
                    String erro = "Erro inesperado, saia e entre denovo na sua conta";

                    //Aqui retorna o ERRO
                    Toast.makeText(context, erro, Toast.LENGTH_LONG).show();
                }
            }

            @Override
            public void onFailure(Call<RefreshTokenResponse> call, Throwable t) {
                // Caso deu erro na requisição
                // erro de conexão (internet, URL, servidor fora)
//                Toast.makeText(
//                        context,
//                        "Erro de conexão: " + t.getMessage(),
//                        Toast.LENGTH_LONG
//                ).show();
            }
        });//Requisição

    }//Refresh Token


}//Auth