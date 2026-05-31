package com.example.crashware.ui.api;

import static androidx.core.content.ContextCompat.startActivity;

import android.app.Activity;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.widget.Toast;

import androidx.fragment.app.Fragment;

import com.example.crashware.ui.login.Cadastro;
import com.example.crashware.ui.login.ConfirmarIdentidade;
import com.example.crashware.ui.login.Login;
import com.example.crashware.ui.navegacao.Home;
import com.example.crashware.ui.senha.RedefinirSenha;

import org.json.JSONObject;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.Header;
import retrofit2.http.PATCH;
import retrofit2.http.POST;

public class Configuracoes {

    //Validar Email

    //Envia para a API
    static class EmailRequest {
        String email;
        String email_novo;
        public EmailRequest(String email, String email_novo) {
            this.email = email;
            this.email_novo = email_novo;
        }
    }



    // Armazena a resposta da API:
    public static class ValidarEmailResponse {
        String mensagem;
    }

    // INTERFACE da API:
    public static interface ValidarEmail {
        @POST("/auth/validar_email")
        Call<ValidarEmailResponse> validar(
                @Header("Authorization") String token,
                @Body EmailRequest request
        );
    }//Interface

    public static void Validar_Email(String email, String email_novo, SharedPreferences prefs, Fragment fragment) {

        //Pego o valor do token
        String token = prefs.getString("token", null);

        //Preparo ele para enviar para o header da requisição
        token = "Bearer " + token;

        // Criando a API
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("https://api-crashware.onrender.com/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();


        // Objeto que vou enviar para a API:
        EmailRequest dados = new EmailRequest(email_novo, email);

        // Fazendo que a interface da API seja utilizavel:
        ValidarEmail api = retrofit.create(ValidarEmail.class);

        // Monto a chamada da API:
        Call<ValidarEmailResponse> requisicao = api.validar(token,dados);

        requisicao.enqueue(new Callback<ValidarEmailResponse>() {
            @Override
            public void onResponse(
                    Call<ValidarEmailResponse> requisicao,
                    retrofit2.Response<ValidarEmailResponse> resposta
            ) {
                if(resposta.isSuccessful())
                {
                    //Requisição der certo

                    //Salvo o valor no SharedPreferences
                    prefs.edit()
                            .putString("alterar_email","true")
                            .apply();

                    // ir para Verifição de Email
                    Intent i = new Intent(fragment.requireContext(), ConfirmarIdentidade.class);
                    // passando os dados
                    i.putExtra("emailUsuario", email);
                    i.putExtra("emailNovo", email_novo);

                    fragment.startActivity(i);
                    fragment.requireActivity().finish();


                }
                else {
                    //Retorna erro caso a reqsição estiver errada

                    String erro = "Erro ao validar email";

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
            public void onFailure(Call<ValidarEmailResponse> call, Throwable t) {
                // Caso deu erro na requisição
                // erro de conexão (internet, URL, servidor fora)
                Toast.makeText(
                        fragment.requireContext(),
                        "Erro de conexão: " + t.getMessage(),
                        Toast.LENGTH_LONG
                ).show();
            }
        });

    }//Validar Email

    //Alterar Email


    // Armazena a resposta da API:
    public static class AlterarEmailResponse {
        String mensagem;
    }

    // INTERFACE da API:
    public static interface AlterarEmail {
        @PATCH("/auth/alterar_email")
        Call<AlterarEmailResponse> alterar(
                @Header("Authorization") String token,
                @Body EmailRequest request
        );
    }//Interface

    public static void Alterar_Email(String email_novo, SharedPreferences prefs, Activity context) {
        //Pego o valor do token
        String token = prefs.getString("token", null);

        //Preparo ele para enviar para o header da requisição
        token = "Bearer " + token;

        // Criando a API
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("https://api-crashware.onrender.com/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();


        // Objeto que vou enviar para a API:
        EmailRequest dados = new EmailRequest(null, email_novo);

        // Fazendo que a interface da API seja utilizavel:
        AlterarEmail api = retrofit.create(AlterarEmail.class);

        // Monto a chamada da API:
        Call<AlterarEmailResponse> requisicao = api.alterar(token, dados);

        requisicao.enqueue(new Callback<AlterarEmailResponse>() {
            @Override
            public void onResponse(
                    Call<AlterarEmailResponse> requisicao,
                    retrofit2.Response<AlterarEmailResponse> resposta
            ) {
                if (resposta.isSuccessful()) {
                    //Requisição der certo


                    Toast.makeText(context, "Email alterado com sucesso", Toast.LENGTH_LONG).show();

                    prefs.edit()
                            .putString("email",email_novo)
                            .apply();

                    Intent i = new Intent(context, Home.class);
                    context.startActivity(i);
                    context.finish();


                } else {
                    //Retorna erro caso a reqsição estiver errada

                    String erro = "Erro ao alterar email";

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
                    Toast.makeText(context, erro, Toast.LENGTH_LONG).show();

                    //Faço ele retornar para a tela home
                    Intent i = new Intent(context, Home.class);
                    context.startActivity(i);
                    context.finish();
                }
            }

            @Override
            public void onFailure(Call<AlterarEmailResponse> call, Throwable t) {
                // Caso deu erro na requisição
                // erro de conexão (internet, URL, servidor fora)
                Toast.makeText(
                        context,
                        "Erro de conexão: " + t.getMessage(),
                        Toast.LENGTH_LONG
                ).show();
            }


        });

    }//Alterar email


    //Deletar conta
    // Armazena a resposta da API:
    public static class DeletarContaResponse {
        String mensagem;
    }

    // INTERFACE da API:
    public static interface DeletarConta {
        @DELETE("/user/deletar_conta")
        Call<DeletarContaResponse> deletar(
                @Header("Authorization") String token
        );
    }//Interface

    public static void Deletar_Conta(SharedPreferences prefs,Fragment fragment) {
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
        DeletarConta api = retrofit.create(DeletarConta.class);

        // Monto a chamada da API:
        Call<DeletarContaResponse> requisicao = api.deletar(token);


        requisicao.enqueue(new Callback<DeletarContaResponse>() {
            @Override
            public void onResponse(
                    Call<DeletarContaResponse> requisicao,
                    retrofit2.Response<DeletarContaResponse> resposta
            ) {
                if (resposta.isSuccessful()) {
                    //Requisição der certo

                    DeletarContaResponse api = resposta.body();

                    //Aqui retorna a mensagem da API
                    Toast.makeText(fragment.requireContext(), api.mensagem, Toast.LENGTH_LONG).show();

                    // Aqui você faz logout

                    Toast.makeText(fragment.requireContext(),
                            "Conta desconectada",
                            Toast.LENGTH_SHORT).show();

                    //Deleto o token e o refresh_token
                    prefs.edit()
                            .remove("token")
                            .remove("refresh_token")
                            .remove("foto")
                            .apply();

                    //Vou para o login
                    Intent i = new Intent(fragment.requireContext(), Login.class);
                    fragment.startActivity(i);
                    fragment.requireActivity().finish();


                } else {
                    //Retorna erro caso a reqsição estiver errada

                    String erro = "Erro ao deletar conta";

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
            public void onFailure(Call<DeletarContaResponse> call, Throwable t) {
                // Caso deu erro na requisição
                // erro de conexão (internet, URL, servidor fora)
                Toast.makeText(
                        fragment.requireContext(),
                        "Erro de conexão: " + t.getMessage(),
                        Toast.LENGTH_LONG
                ).show();
            }


        });

    }//Deletar Conta

    //Alterar Nome
    //Envia para a API
    static class NomeRequest {
        String nome;
        public NomeRequest(String nome) {
            this.nome = nome;
        }
    }



    // Armazena a resposta da API:
    public static class AlterarNomeResponse {
        String mensagem;
    }

    // INTERFACE da API:
    public static interface AlterarNome {
        @PATCH("/auth/alterar_nome")
        Call<AlterarNomeResponse> alterar(
                @Header("Authorization") String token,
                @Body NomeRequest request
        );
    }//Interface

    public static void Alterar_Nome(String nome,SharedPreferences prefs,Activity context) {

        //Pego o valor do token
        String token = prefs.getString("token", null);

        //Preparo ele para enviar para o header da requisição
        token = "Bearer " + token;

        // Criando a API
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("https://api-crashware.onrender.com/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();


        // Objeto que vou enviar para a API:
        NomeRequest valor = new NomeRequest(nome);

        // Fazendo que a interface da API seja utilizavel:
        AlterarNome api = retrofit.create(AlterarNome.class);

        // Monto a chamada da API:
        Call<AlterarNomeResponse> requisicao = api.alterar(token, valor);

        requisicao.enqueue(new Callback<AlterarNomeResponse>() {
            @Override
            public void onResponse(
                    Call<AlterarNomeResponse> requisicao,
                    retrofit2.Response<AlterarNomeResponse> resposta
            ) {
                if (resposta.isSuccessful()) {
                    //Requisição der certo

                    AlterarNomeResponse api = resposta.body();

                    // salva no SharedPreferences
                    prefs.edit().putString("nome", nome).apply();

                    //Retorno a mensagem da API
                    Toast.makeText(context, api.mensagem, Toast.LENGTH_LONG).show();

                    //Faço ele retornar para a tela home
                    Intent i = new Intent(context, Home.class);
                    context.startActivity(i);
                    context.finish();


                } else {
                    //Retorna erro caso a reqsição estiver errada

                    String erro = "Erro ao alterar nome";

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
                    Toast.makeText(context, erro, Toast.LENGTH_LONG).show();


                    //Faço ele retornar para a tela home
                    Intent i = new Intent(context, Home.class);
                    context.startActivity(i);
                    context.finish();

                }
            }

            @Override
            public void onFailure(Call<AlterarNomeResponse> call, Throwable t) {
                // Caso deu erro na requisição
                // erro de conexão (internet, URL, servidor fora)
                Toast.makeText(
                        context,
                        "Erro de conexão: " + t.getMessage(),
                        Toast.LENGTH_LONG
                ).show();
            }


        });



    }//Alterar Nome


    //Verificar Senha

    //Envia para a API
    static class SenhaRequest {
        String senha;
        public SenhaRequest(String senha) {
            this.senha = senha;
        }
    }



    // Armazena a resposta da API:
    public static class VerificarSenhaResponse {
        String mensagem;
    }

    // INTERFACE da API:
    public static interface VerificarSenha {
        @POST("/auth/verificar_senha")
        Call<VerificarSenhaResponse> verificar(
                @Header("Authorization") String token,
                @Body SenhaRequest request
        );
    }//Interface

    public static void Verificar_Senha(String senha,String email,SharedPreferences prefs,Fragment fragment) {

        //Pego o valor do token
        String token = prefs.getString("token", null);

        //Preparo ele para enviar para o header da requisição
        token = "Bearer " + token;

        // Criando a API
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("https://api-crashware.onrender.com/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();


        // Objeto que vou enviar para a API:
        SenhaRequest valor = new SenhaRequest(senha);

        // Fazendo que a interface da API seja utilizavel:
        VerificarSenha api = retrofit.create(VerificarSenha.class);

        // Monto a chamada da API:
        Call<VerificarSenhaResponse> requisicao = api.verificar(token, valor);

        requisicao.enqueue(new Callback<VerificarSenhaResponse>() {
            @Override
            public void onResponse(
                    Call<VerificarSenhaResponse> requisicao,
                    retrofit2.Response<VerificarSenhaResponse> resposta
            ) {
                if (resposta.isSuccessful()) {
                    //Requisição der certo

                    //Salvo o valor no SharedPreferences
                    prefs.edit()
                            .putString("logado","true")
                            .apply();

                    //Levo para a tela de alterar senha
                    Intent i = new Intent(fragment.requireContext(), RedefinirSenha.class);
                    // passando os dados
                    i.putExtra("email_usuario", email);
                    fragment.requireContext().startActivity(i);
                    fragment.requireActivity().finish();

                } else {
                    //Retorna erro caso a reqsição estiver errada

                    String erro = "Erro ao Verificar Senha";

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
            public void onFailure(Call<VerificarSenhaResponse> call, Throwable t) {
                // Caso deu erro na requisição
                // erro de conexão (internet, URL, servidor fora)
                Toast.makeText(
                        fragment.requireContext(),
                        "Erro de conexão: " + t.getMessage(),
                        Toast.LENGTH_LONG
                ).show();
            }


        });


    }//Verificar Senha

    //Desativar Conta
    // Armazena a resposta da API:
    public static class DesativarContaResponse {
        String mensagem;
    }

    // INTERFACE da API:
    public static interface DesativarConta {
        @PATCH("/user/desativar_conta")
        Call<DesativarContaResponse> verificar(
                @Header("Authorization") String token
        );
    }//Interface

    public static void Desativar_Conta(SharedPreferences prefs,Fragment fragment)
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

        // Fazendo que a interface da API seja utilizavel:
        DesativarConta api = retrofit.create(DesativarConta.class);

        // Monto a chamada da API:
        Call<DesativarContaResponse> requisicao = api.verificar(token);

        requisicao.enqueue(new Callback<DesativarContaResponse>() {
            @Override
            public void onResponse(
                    Call<DesativarContaResponse> requisicao,
                    retrofit2.Response<DesativarContaResponse> resposta
            ) {
                if (resposta.isSuccessful()) {
                    //Requisição der certo

                    //Logout

                    Toast.makeText(fragment.requireContext(),
                            "Conta Desativada",
                            Toast.LENGTH_SHORT).show();

                    //Deleto o token e o refresh_token
                    prefs.edit()
                            .remove("token")
                            .remove("refresh_token")
                            .remove("foto")
                            .apply();

                    //Vou para o login
                    Intent i = new Intent(fragment.requireContext(), Login.class);
                    fragment.startActivity(i);
                    fragment.requireActivity().finish();
                } else {
                    //Retorna erro caso a reqsição der erro

                    String erro = "Erro ao Desativar  Conta";

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
            public void onFailure(Call<DesativarContaResponse> call, Throwable t) {
                // Caso deu erro na requisição
                // erro de conexão (internet, URL, servidor fora)
                Toast.makeText(
                        fragment.requireContext(),
                        "Erro de conexão: " + t.getMessage(),
                        Toast.LENGTH_LONG
                ).show();
            }
        });

    }//Desativar Conta


}//Configurações
