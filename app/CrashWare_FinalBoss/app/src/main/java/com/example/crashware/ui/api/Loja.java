package com.example.crashware.ui.api;

import android.content.Context;
import android.content.SharedPreferences;
import android.widget.Toast;

import androidx.fragment.app.Fragment;

import org.json.JSONObject;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.Header;
import retrofit2.http.POST;

public class Loja {

    //Comprar Item
    //Envio para API
    static class ComprarRequest {
        String nome;
        Integer moedas;
        public ComprarRequest(String nome, Integer moedas) {
            this.nome = nome;
            this.moedas = moedas;
        }
    }

    // Armazena a resposta da API:
    public static class CompraResponse {
        String mensagem;
    }

    // INTERFACE da API:
    public static interface comprar_item {
        @POST("/loja/")
        Call<CompraResponse> comprar(
                @Header("Authorization") String token,
                @Body ComprarRequest request
        );
    }//Interface

    // Callback
    public interface ComprarCallback {

        void onSuccess();
    }

    public static void ComprarItem(String nome,Integer moedas,String mensagem,SharedPreferences prefs, Fragment fragment,ComprarCallback callback)
    {

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

        //Objeto do item
        ComprarRequest dados = new ComprarRequest(nome,moedas);

        // Fazendo que a interface da API seja utilizavel:
        comprar_item api = retrofit.create(comprar_item.class);

        // Monto a chamada da API:
        Call<CompraResponse> requisicao = api.comprar(token,dados);

        requisicao.enqueue(new Callback<CompraResponse>() {
            @Override
            public void onResponse(
                    Call<CompraResponse> requisicao,
                    retrofit2.Response<CompraResponse> resposta
            ) {

                if(resposta.isSuccessful())
                {
                    //Requisição der certo

                    Integer gemas = prefs.getInt("moedas", 0);

                    gemas -= moedas;

                    //Salvo no Shared Preferences
                    prefs.edit().putInt("moedas" , gemas).apply();

                    if(nome.equals("congelamento"))
                    {
                        //Atualizo o inventario
                        Integer congelamentos = prefs.getInt("congelamentos",0);

                        congelamentos += 1;

                        //Salvo no Shared Preferences
                        prefs.edit().putInt("congelamentos" , congelamentos).apply();
                    }
                    if(nome.equals("booster"))
                    {
                        //Atualizo o inventario
                        Integer booster = prefs.getInt("booster",0);

                        booster += 1;

                        //Salvo no Shared Preferences
                        prefs.edit().putInt("booster" , booster).apply();
                    }

                    Toast.makeText(fragment.requireContext(), mensagem, Toast.LENGTH_LONG).show();

                    callback.onSuccess();

                }
                else {
                    //Retorna erro caso  a reqsição estiver errado

                    String erro = "Erro Ao Comprar Item";

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
            public void onFailure(Call<CompraResponse> call, Throwable t) {
                 //Caso deu erro na requisição
                 //erro de conexão (internet, URL, servidor fora)
                Toast.makeText(
                        fragment.requireContext(),
                        "Erro de conexão: " + t.getMessage(),
                        Toast.LENGTH_LONG
                ).show();
            }
        });
    }//Comprar Item

    //Verificar temas

    // Armazena a resposta da API:
    public static class TemaResponse {
        String mensagem;

        Integer congelamentos;

        Integer booster;


    }

    // INTERFACE da API:
    public static interface tema {
        @GET("/loja/tema")
        Call<TemaResponse> verificar(
                @Header("Authorization") String token
        );
    }//Interface

    // Callback
    public interface TemaCallback {

        void onSuccess(Boolean valor);

        void onError();
    }

    public static void VerificarTema(SharedPreferences prefs, Context context, TemaCallback callback) {

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
        tema api = retrofit.create(tema.class);

        // Monto a chamada da API:
        Call<TemaResponse> requisicao = api.verificar(token);

        requisicao.enqueue(new Callback<TemaResponse>() {
            @Override
            public void onResponse(
                    Call<TemaResponse> requisicao,
                    retrofit2.Response<TemaResponse> resposta
            ) {

                if(resposta.code() == 409)
                {
                    try {

                        //Pego o congelamentos e  booster do detail do HTTEXCEPTION da api
                        String erroJson = resposta.errorBody().string();

                        JSONObject json = new JSONObject(erroJson);

                        JSONObject detail = json.getJSONObject("detail");

                        int congelamentos = detail.getInt("congelamentos");
                        int booster = detail.getInt("booster");

                        //Salvo no Shared Preferences
                        prefs.edit()
                                .putInt("congelamentos" , congelamentos)
                                .putInt("booster" , booster)
                                .apply();

                    } catch (Exception e) {
                        e.printStackTrace();
                    }

                    //Se usuário não tem o tema
                    callback.onSuccess(false);
                }


                if (resposta.isSuccessful()) {
                    //Requisição der certo

                    //Pego a quantidade de booster e congelamentos que o usuario tem
                    TemaResponse dados = resposta.body();

                    Integer congelamentos = dados.congelamentos;
                    Integer booster = dados.booster;


                    //Salvo no Shared Preferences
                    prefs.edit()
                            .putInt("congelamentos" , congelamentos)
                            .putInt("booster" , booster)
                            .apply();


                    //Usuario já tem o tema
                    callback.onSuccess(true);

                } else {
                    //Retorna erro caso  a reqsição estiver errado

                    String erro = "Erro Ao Verificar Tema";

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

                    callback.onError();
                }
            }

            @Override
            public void onFailure(Call<TemaResponse> call, Throwable t) {
                //Caso deu erro na requisição
                //erro de conexão (internet, URL, servidor fora)
//                Toast.makeText(
//                        context,
//                        "Erro de conexão: " + t.getMessage(),
//                        Toast.LENGTH_LONG
//                ).show();
           }
        });
    }//Verificar Tema


}//Loja
