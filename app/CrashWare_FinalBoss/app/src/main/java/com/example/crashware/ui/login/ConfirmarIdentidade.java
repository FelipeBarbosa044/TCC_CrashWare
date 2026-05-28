package com.example.crashware.ui.login;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import android.widget.Toast;


// Funções que permitem requisições para a API (retrofit)


import com.example.crashware.R;
import com.example.crashware.ui.api.Auth;
import com.example.crashware.ui.api.Configuracoes;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.http.Body;
import retrofit2.http.POST;

//Permite eu pegar o valor do erro
import org.json.JSONObject;

//Importar email e Nome


public class ConfirmarIdentidade extends AppCompatActivity {


    SharedPreferences prefs;

    Button btnVerificar, btnEnviar;

    TextView txtNomeEmail, txtTempoEnviar;

    EditText txtCodigoVerificacao;

    String emailUsuario;

    String emailNovo = null;

    String nomeUsuario = null;


    // Dados que vai para a API:

    //Request Verificar Email
    class Verificar_EmailRequest {
        String email;
        String codigo;
        public Verificar_EmailRequest(String email,String codigo) {

            this.email = email;
            this.codigo = codigo;
        }
    }

    //Request Enviar Email
    class Reenviar_EmailRequest {
        String email;
        String email_novo;
        public  Reenviar_EmailRequest(String email,String email_novo) {

            this.email = email;
            this.email_novo = email_novo;
        }
    }

    // Armazena a resposta da API:

    //Response Verificar Email
    class Verificar_EmailResponse {
        String mensagem;
    }

    //Response Reenviar Email
    class Reenviar_EmailResponse {
        String mensagem;
    }

    // INTERFACE da API:

    //Interface Verificar Email
    interface verificar_email{
        @POST("/auth/verificar_codigo")
        Call<Verificar_EmailResponse> verificar(@Body Verificar_EmailRequest request);
    }

    //Interface Reenviar Email
    interface reenviar_email{
        @POST("/auth/reenviar_codigo")
        Call<Reenviar_EmailResponse> reenviar(@Body Reenviar_EmailRequest request);
    }


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        prefs = this.getSharedPreferences("CrashWare", Context.MODE_PRIVATE);

        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_confirmar_identidade);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main2), (v, insets) -> {


            //
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
            //


        });

        btnEnviar            = findViewById(R.id.btnReceber);
        btnVerificar         = findViewById(R.id.btnVerificar        );
        txtNomeEmail         = findViewById(R.id.txtNomeEmail        );
        txtTempoEnviar       = findViewById(R.id.txtTempoEnviar      );
        txtCodigoVerificacao = findViewById(R.id.txtCodigoVerificacao);

        //Pego os valores de outra tela
        nomeUsuario = getIntent().getStringExtra("nome");
        emailUsuario = getIntent().getStringExtra("emailUsuario");
        emailNovo = getIntent().getStringExtra("emailNovo");

        //Mudo o email na exibição
        txtNomeEmail.setText(emailNovo != null ? emailNovo : emailUsuario);

        btnEnviar.setEnabled(true);


        btnVerificar.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View v)
            {
                VerificarEmail(prefs);


            }
        });//

        btnEnviar.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v)
            {
                ReenviarCodigo();
                iniciarTimer();
                btnEnviar.setEnabled(false);
            }
        });//



    }

    private void iniciarTimer()
    {
        new CountDownTimer(60000, 1000) {
            @Override
            public void onTick(long millisUntilFinished) {
                int segundos = (int) (millisUntilFinished / 1000);
                txtTempoEnviar.setText("faltam " + segundos + " segundos");
            }

            @Override
            public void onFinish() {
                txtTempoEnviar.setText("Você pode reenviar o código");
                btnEnviar.setEnabled(true);
            }
        }.start();
    }//

    private void VerificarEmail(SharedPreferences prefs)
    {

        //Verifico a navegação do usuario
        String alterar_email = prefs.getString("alterar_email", "false");

        //Verifico a navegação do usuario
        String alterar_nome = prefs.getString("alterar_nome", "false");



        String codigo = txtCodigoVerificacao.getText().toString().trim();
        String email = emailUsuario;
        String email_novo = emailNovo;
        String nome  = nomeUsuario;

        if (emailUsuario == null || emailUsuario.isEmpty()) {
            Toast.makeText(this, "Erro ao obter email", Toast.LENGTH_LONG).show();
            return;
        }



        if (codigo.isEmpty() ) {
            Toast.makeText(this, "Preencha todos os campos", Toast.LENGTH_LONG).show();
            return;
        }


        //Validações:
        if (codigo.length() != 6 || !codigo.matches("\\d+")) {
            Toast.makeText(this, "Código inválido (6 números)", Toast.LENGTH_LONG).show();
            return;
        }

        //Código tem que ter 6 caracteres e não pode passar disso, e o só aceita número, não pode letra


        //Mensagem caso passa da validaçao:
        Toast.makeText(this, "Verificando Código...", Toast.LENGTH_LONG).show();

        // Objeto que vou enviar para a API:
        Verificar_EmailRequest dados = new Verificar_EmailRequest(email , codigo);
        // Preciso do Email do cadastro.


        // Criando a API
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("https://api-crashware.onrender.com/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        // Fazendo que a interface da API seja utilizavel:
        verificar_email api = retrofit.create(verificar_email.class);

        // Monto a chamada da API:
        Call<Verificar_EmailResponse> requisicao = api.verificar(dados);

        // executo a requisicao:
        requisicao.enqueue(new Callback<Verificar_EmailResponse>()
        {
            @Override
            public void onResponse(
                    Call<Verificar_EmailResponse> requisicao,
                    retrofit2.Response<Verificar_EmailResponse> resposta
            )
            {

                //Se a requisição der certo
                if (resposta.isSuccessful()){


                    if(alterar_email.equals("true")) {

                        Toast.makeText(ConfirmarIdentidade.this, "Alterando email...", Toast.LENGTH_LONG).show();

                        //Altero o valor do alterar email no sharedePreferences
                        prefs.edit()
                                .putString("alterar_email","false")
                                .apply();

                        //Verifico o token
                        Auth.verificarToken(ConfirmarIdentidade.this, prefs, true, new Auth.AuthCallback() {
                            @Override
                            public void onSuccess() {

                                Toast.makeText(ConfirmarIdentidade.this, "Alterando nome...", Toast.LENGTH_LONG).show();

                                //Altero o valor do alterar nome no sharedePreferences
                                prefs.edit()
                                        .putString("alterar_nome","false")
                                        .apply();
                                //Altero o email
                                Configuracoes.Alterar_Email(email_novo,prefs,ConfirmarIdentidade.this);



                            }

                        });
                    }else if(alterar_nome.equals("true"))
                    {

                        //Verifico o token
                        Auth.verificarToken(ConfirmarIdentidade.this, prefs, true, new Auth.AuthCallback() {
                            @Override
                            public void onSuccess() {

                                //Altero o nome
                                Configuracoes.Alterar_Nome(nome,prefs,ConfirmarIdentidade.this);


                            }
                        });
                    }else
                    {
                        Toast.makeText(ConfirmarIdentidade.this, "Código Verificado", Toast.LENGTH_LONG).show();

                        //Vai para a tela de login
                        Intent i = new Intent(ConfirmarIdentidade.this, Login.class);
                        startActivity(i);
                        finish();
                    }


                }else{
                    //Se o codigo estiver errado
                    String erro = "Código expirado ou invalido";

                    try {
                        String detail = resposta.errorBody().string();
                        JSONObject json = new JSONObject(detail);

                        if (detail != null) {
                            erro = json.getString("detail");
                        }
                    } catch (Exception e) {
                        // ignora, mantém mensagem padrão
                    }

                    //Exibe o erro
                    Toast.makeText(ConfirmarIdentidade.this, erro, Toast.LENGTH_LONG).show();
                }
            }

            @Override
            public void onFailure(Call<Verificar_EmailResponse> requisicao, Throwable t) {
                // Caso deu erro na requisição
                // erro de conexão (internet, URL, servidor fora)
                Toast.makeText(
                        ConfirmarIdentidade.this,
                        "Erro de conexão: " + t.getMessage(),
                        Toast.LENGTH_LONG
                ).show();
            }

        });
    }


    private void ReenviarCodigo()
    {

        String email = emailUsuario;
        String email_novo = emailNovo;

        if (emailUsuario == null || emailUsuario.isEmpty()) {
            Toast.makeText(this, "Erro ao obter email", Toast.LENGTH_LONG).show();
            return;
        }//


        // Objeto que vou enviar para a API:
        Reenviar_EmailRequest dados = new Reenviar_EmailRequest(email,email_novo);

        // Criando a API
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("https://api-crashware.onrender.com/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        // Fazendo que a interface da API seja utilizavel:
        reenviar_email api = retrofit.create(reenviar_email.class);

        // Monto a chamada da API:
        Call<Reenviar_EmailResponse> requisicao = api.reenviar(dados);


        requisicao.enqueue(new Callback<Reenviar_EmailResponse>() {
            @Override
            public void onResponse
                    (
                            Call<Reenviar_EmailResponse> requisicao,
                            retrofit2.Response<Reenviar_EmailResponse> resposta
                    )
            {
                // Caso a API RETORNOU STATUS_CODE : 200
                if (resposta.isSuccessful())
                {

                    //Exibi isso:
                    Toast.makeText(ConfirmarIdentidade.this,"Código Enviado!", Toast.LENGTH_LONG).show();

                }

                else {
                    // erro da API (400, 422, 500...)

                    //Caso der erro na hora de reenviar.
                    String erro = "Não conseguimos enviar o código";

                    try
                    {
                        String detail = resposta.errorBody().string();
                        JSONObject json = new JSONObject(detail);

                        if (detail != null)
                        {
                            erro = json.getString("detail");

                        }
                    }
                    catch (Exception e)
                    {
                        // ignora, mantém mensagem padrão
                    }

                    Toast.makeText(ConfirmarIdentidade.this, erro, Toast.LENGTH_LONG).show();
                }
            }

            @Override
            public void onFailure(Call<Reenviar_EmailResponse> requisicao, Throwable t)
            {
                // Caso deu erro na requisição
                // erro de conexão (internet, URL, servidor fora)
                Toast.makeText(ConfirmarIdentidade.this,
                        "Erro de conexão: " + t.getMessage(),
                        Toast.LENGTH_LONG
                ).show();
            }
        });
    }//


}