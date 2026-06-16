package com.example.crashware.ui.api;

import android.content.SharedPreferences;
import android.widget.Toast;

import androidx.fragment.app.Fragment;

import org.json.JSONObject;

import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.http.Body;
import retrofit2.http.Header;
import retrofit2.http.PATCH;
import retrofit2.http.POST;

public class Aula {

    //Sincronizar aula e usuario

    //Envio para API
    static class SincronizarRequest {
        Integer id;

        Boolean acertou = null;

        String email;
        public SincronizarRequest(Integer id,Boolean acertou ,String email) {
            this.id = id;
            this.acertou = acertou;
            this.email = email;
        }
    }

    // Armazena a resposta da API:
    public static class SincronizarResponse {

        public Boolean acertou;

        public  Integer acertos;
    }

    // INTERFACE da API:
    public static interface sincronizar_aula {
        @POST("/materia/sincronizar_aula")
        Call<SincronizarResponse> sincronizar(
                @Header("Authorization") String token,
                @Body SincronizarRequest request
        );

    }//Interface

    public static void SincronizarAula(Integer id, SharedPreferences prefs)
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
        SincronizarRequest dados = new SincronizarRequest(id,null,null);

        // Fazendo que a interface da API seja utilizavel:
        sincronizar_aula api = retrofit.create(sincronizar_aula.class);

        // Monto a chamada da API:
        Call<SincronizarResponse> requisicao = api.sincronizar(token ,dados);

        //Executo a requisição
        requisicao.enqueue(new Callback<SincronizarResponse>() {
            @Override
            public void onResponse(
                    Call<SincronizarResponse> requisicao,
                    retrofit2.Response<SincronizarResponse> resposta
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
            public void onFailure(Call<SincronizarResponse> call, Throwable t) {
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

    //Sincronizar Exercicio



    // INTERFACE da API:
    public static interface sincronizar_exercicio {
        @POST("/materia/sincronizar_exercicio")
        Call<SincronizarResponse> sincronizar(
                @Header("Authorization") String token,
                @Body SincronizarRequest request
        );

    }//Interface


    // Callback
    public interface UsuarioExercicioCallback {

        void Terminou();

        void NaoTerminou();
    }
    public static void SincronizarExercicio(Integer id, SharedPreferences prefs,UsuarioExercicioCallback callback)
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

        //Objeto para sincroizar exercicio e aluno
        SincronizarRequest dados = new SincronizarRequest(id,null,null);

        // Fazendo que a interface da API seja utilizavel:
        sincronizar_exercicio api = retrofit.create(sincronizar_exercicio.class);

        // Monto a chamada da API:
        Call<SincronizarResponse> requisicao = api.sincronizar(token ,dados);

        //Executo a requisição
        requisicao.enqueue(new Callback<SincronizarResponse>() {
            @Override
            public void onResponse(
                    Call<SincronizarResponse> requisicao,
                    retrofit2.Response<SincronizarResponse> resposta
            ) {
                if(resposta.code() == 409)
                {
                    //Verifico se usuário terminou a aula
                    try {
                        String erroJson = resposta.errorBody().string();

                        JSONObject json = new JSONObject(erroJson);

                        JSONObject detail = json.getJSONObject("detail");

                        boolean terminou = detail.getBoolean("terminou");

                        if (terminou) {
                            // Usuário já terminou o exercício/aula
                            callback.Terminou();
                        }
                        else {
                            // Usuário já iniciou, mas ainda não terminou
                            callback.NaoTerminou();
                        }

                    } catch (Exception e) {
                        e.printStackTrace();
                    }

                    return;

                }
                if (resposta.isSuccessful()) {
                    //Requisição der certo

                    callback.NaoTerminou();

                } else {
                    //Retorna erro caso a reqsição estiver errada

                    String erro = "Erro ao Sincronizar Exercicio";

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
            public void onFailure(Call<SincronizarResponse> call, Throwable t) {
                // Caso deu erro na requisição
                // erro de conexão (internet, URL, servidor fora)
//                Toast.makeText(
//                        fragment.requireContext(),
//                        "Erro de conexão: " + t.getMessage(),
//                        Toast.LENGTH_LONG
//                ).show();
            }


        });


    }//Sincronizar exercicio com usuario


    //Buscar Questões


    // Response principal
    public static class ExercicioResponse {


        public List<QuestaoResponse> questoes;
        public Integer questao_atual;
    }

    // Cada questão
    public static class QuestaoResponse {
        public String pergunta;
        public List<AlternativaResponse> alternativas;
    }

    // Cada alternativa
    public static class AlternativaResponse {
        public String texto;
        public Boolean correta;
    }

    // INTERFACE da API:
    public static interface buscar_exercicio {
        @POST("/materia/buscar_exercicios")
        Call<ExercicioResponse> buscar(
                @Body SincronizarRequest request
        );

    }//Interface

    // Callback
    public interface ExercicioCallback {

        void onSuccess(List<QuestaoResponse> questoes,Integer questao_Atual);
    }

    public static void BuscarExercicio(Integer id,String email, SharedPreferences prefs,ExercicioCallback callback) {

        // Criando a API
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("https://api-crashware.onrender.com/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        //

        //Objeto da questão
        SincronizarRequest dados = new SincronizarRequest(id,null,email);

        // Fazendo que a interface da API seja utilizavel:
        buscar_exercicio api = retrofit.create(buscar_exercicio.class);

        // Monto a chamada da API:
        Call<ExercicioResponse> requisicao = api.buscar(dados);

        //Executo a requisição
        requisicao.enqueue(new Callback<ExercicioResponse>() {
            @Override
            public void onResponse(
                    Call<ExercicioResponse> requisicao,
                    retrofit2.Response<ExercicioResponse> resposta
            ) {
                if (resposta.isSuccessful()) {
                    //Requisição der certo

                    ExercicioResponse dados = resposta.body();


                    if (dados != null && dados.questoes != null) {

                        Integer questao_atual = dados.questao_atual;

                        callback.onSuccess(dados.questoes,questao_atual);
                    }

                } else {
                    //Retorna erro caso a reqsição estiver errada

                    String erro = "Erro ao Buscar Exercicio";

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
            public void onFailure(Call<ExercicioResponse> call, Throwable t) {
                // Caso deu erro na requisição
                // erro de conexão (internet, URL, servidor fora)
//                Toast.makeText(
//                        fragment.requireContext(),
//                        "Erro de conexão: " + t.getMessage(),
//                        Toast.LENGTH_LONG
//                ).show();
            }


        });
    }//Buscar Exercicio


    //Progresso Exercicio
    // Armazena a resposta da API:


    // INTERFACE da API:
    public static interface progresso_exercicio {
        @PATCH("/materia/progresso_exercicio")
        Call<SincronizarResponse> progredir(
                @Body SincronizarRequest request
        );

    }//Interface

    public static void ProgredirExercicio(Integer id,Boolean acertou,String email) {


        // Criando a API
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("https://api-crashware.onrender.com/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        //

        //Objeto da questão
        SincronizarRequest dados = new SincronizarRequest(id, acertou,email);

        // Fazendo que a interface da API seja utilizavel:
        progresso_exercicio api = retrofit.create(progresso_exercicio.class);

        // Monto a chamada da API:
        Call<SincronizarResponse> requisicao = api.progredir(dados);

        //Executo a requisição
        requisicao.enqueue(new Callback<SincronizarResponse>() {
            @Override
            public void onResponse(
                    Call<SincronizarResponse> requisicao,
                    retrofit2.Response<SincronizarResponse> resposta
            ) {
                if (resposta.isSuccessful()) {
                    //Requisição der certo

                    //Ignora

                } else {
                    //Retorna erro caso a reqsição estiver errada

                    String erro = "Erro ao Progredir Exercicio";

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
            public void onFailure(Call<SincronizarResponse> call, Throwable t) {
                // Caso deu erro na requisição
                // erro de conexão (internet, URL, servidor fora)
//                Toast.makeText(
//                        fragment.requireContext(),
//                        "Erro de conexão: " + t.getMessage(),
//                        Toast.LENGTH_LONG
//                ).show();
            }


        });

    }//ProgredirExercicio

    //Acabar Aula
    // INTERFACE da API:
    public static interface acabar_aula {
        @PATCH("/materia/acabar_aula")
        Call<SincronizarResponse> acabar(
                @Body SincronizarRequest request
        );
    }//Interface

        public static void AcabarAula(Integer id,String email) {

            // Criando a API
            Retrofit retrofit = new Retrofit.Builder()
                    .baseUrl("https://api-crashware.onrender.com/")
                    .addConverterFactory(GsonConverterFactory.create())
                    .build();

            //

            //Objeto da questão
            SincronizarRequest dados = new SincronizarRequest(id, null, email);

            // Fazendo que a interface da API seja utilizavel:
            acabar_aula api = retrofit.create(acabar_aula.class);

            // Monto a chamada da API:
            Call<SincronizarResponse> requisicao = api.acabar(dados);

            //Executo a requisição
            requisicao.enqueue(new Callback<SincronizarResponse>() {
                @Override
                public void onResponse(
                        Call<SincronizarResponse> requisicao,
                        retrofit2.Response<SincronizarResponse> resposta
                ) {
                    if (resposta.isSuccessful()) {
                        //Requisição der certo

                        //Ignora

                    } else {
                        //Retorna erro caso a reqsição estiver errada

                        String erro = "Erro ao Acabar Aula";

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
                public void onFailure(Call<SincronizarResponse> call, Throwable t) {
                    // Caso deu erro na requisição
                    // erro de conexão (internet, URL, servidor fora)
//                Toast.makeText(
//                        fragment.requireContext(),
//                        "Erro de conexão: " + t.getMessage(),
//                        Toast.LENGTH_LONG
//                ).show();
                }

            });

    }//Acabar Aula

    //Retornar acertos


    // INTERFACE da API:
    public static interface retornar_acertos {
        @POST("/materia/retornar_acertos")
        Call<SincronizarResponse> retornar(
                @Header("Authorization") String token,
                @Body SincronizarRequest request
        );

    }//Interface

    // Callback
    public interface AcertosCallback {

        void onSuccess(Integer acertos);
    }
    public static void RetornarAcertos(Integer id, SharedPreferences prefs, Fragment fragment,AcertosCallback callback) {

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
        SincronizarRequest dados = new SincronizarRequest(id, null, null);

        // Fazendo que a interface da API seja utilizavel:
        retornar_acertos api = retrofit.create(retornar_acertos.class);

        // Monto a chamada da API:
        Call<SincronizarResponse> requisicao = api.retornar(token, dados);

        //Executo a requisição
        requisicao.enqueue(new Callback<SincronizarResponse>() {
            @Override
            public void onResponse(
                    Call<SincronizarResponse> requisicao,
                    retrofit2.Response<SincronizarResponse> resposta
            ) {
                if (resposta.isSuccessful()) {
                    //Requisição der certo

                    SincronizarResponse dados = resposta.body();

                    //Pego os acertos
                    Integer acertos = dados.acertos;

                    callback.onSuccess(acertos);

                } else {
                    //Retorna erro caso a reqsição estiver errada

                    String erro = "Erro ao Retornar Acertos";

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
            public void onFailure(Call<SincronizarResponse> call, Throwable t) {
                 //Caso deu erro na requisição
                 //erro de conexão (internet, URL, servidor fora)
                Toast.makeText(
                        fragment.requireContext(),
                        "Erro de conexão: " + t.getMessage(),
                        Toast.LENGTH_LONG
                ).show();
            }

        });


    }//Retornar Acertos



    }//Aula
