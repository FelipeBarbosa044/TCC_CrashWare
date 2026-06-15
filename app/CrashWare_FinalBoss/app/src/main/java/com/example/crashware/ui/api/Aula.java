package com.example.crashware.ui.api;

import android.content.SharedPreferences;
import android.widget.Toast;

import androidx.fragment.app.Fragment;

import org.json.JSONObject;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.http.Body;
import retrofit2.http.Header;
import retrofit2.http.POST;

public class Aula {

    //Sincronizar aula e usuario

    //Envio para API
    static class SincronizarAulaRequest {
        Integer id_aula;
        public SincronizarAulaRequest(Integer id_aula) {
            this.id_aula = id_aula;
        }
    }

    // Armazena a resposta da API:
    public static class SincronizarAulaResponse {
        //Ignora
    }

    // INTERFACE da API:
    public static interface sincronizar_aula {
        @POST("/materia/sincronizar_aula")
        Call<SincronizarAulaResponse> sincronizar(
                @Header("Authorization") String token,
                @Body SincronizarAulaRequest request
        );

    }//Interface

    public static void SincronizarAula(Integer id_aula, SharedPreferences prefs)
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

        //Objeto para sinncronizar aula e aluno
        SincronizarAulaRequest dados = new SincronizarAulaRequest(id_aula);

        // Fazendo que a interface da API seja utilizavel:
        sincronizar_aula api = retrofit.create(sincronizar_aula.class);

        // Monto a chamada da API:
        Call<SincronizarAulaResponse> requisicao = api.sincronizar(token ,dados);

        //Executo a requisição
        requisicao.enqueue(new Callback<SincronizarAulaResponse>() {
            @Override
            public void onResponse(
                    Call<SincronizarAulaResponse> requisicao,
                    retrofit2.Response<SincronizarAulaResponse> resposta
            ) {
                if(resposta.code() == 409)
                {
                    //Ignora
                    return;
                }
                if (resposta.isSuccessful()) {
                    //Requisição der certo
                    //Ignora

                } else {
                    //Retorna erro caso a reqsição estiver errada

                    String erro = "Erro ao Sincronizar Aula";

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
                    //Toast.makeText(fragment.requireContext(), erro, Toast.LENGTH_LONG).show();


                }
            }

            @Override
            public void onFailure(Call<SincronizarAulaResponse> call, Throwable t) {
                // Caso deu erro na requisição
                // erro de conexão (internet, URL, servidor fora)
//                Toast.makeText(
//                        fragment.requireContext(),
//                        "Erro de conexão: " + t.getMessage(),
//                        Toast.LENGTH_LONG
//                ).show();
            }


        });



    }//Sincronizar Aula



    }//Aula
