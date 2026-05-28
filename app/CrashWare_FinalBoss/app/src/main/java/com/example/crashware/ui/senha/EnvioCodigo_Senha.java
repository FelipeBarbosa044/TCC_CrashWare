package com.example.crashware.ui.senha;


import android.content.Intent;
import android.os.Bundle;
import android.os.CountDownTimer;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.example.crashware.R;

// Funções que permitem requisições para a API (retrofit)


import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.http.Body;
import retrofit2.http.POST;

//Permite eu pegar o valor do erro
import org.json.JSONObject;

public class EnvioCodigo_Senha extends AppCompatActivity {

    TextView txtNomeEmail, txtTempoEnviar;

    EditText txtCodigo;

    Button btnEnviarCod,btnVerificarCod;

    String emailUsuario;

    class Verificar_EmailRequest {
        String email;
        String codigo;
        public Verificar_EmailRequest(String email,String codigo) {

            this.email = email;
            this.codigo = codigo;
        }
    }

    //Request Reenviar Email
    class Reenviar_EmailRequest
    {
        String email;
        public  Reenviar_EmailRequest(String email) {

            this.email = email;
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
        Call<EnvioCodigo_Senha.Verificar_EmailResponse> verificar(@Body EnvioCodigo_Senha.Verificar_EmailRequest request);
    }

    //Interface Reenviar Email
    interface reenviar_email{
        @POST("/auth/reenviar_codigo")
        Call<EnvioCodigo_Senha.Reenviar_EmailResponse> reenviar(@Body EnvioCodigo_Senha.Reenviar_EmailRequest request);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_envio_codigo_senha);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.Envio), (v, insets) -> {

            //
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;


        });//


        //Iniciando o Layout no código
        txtCodigo       = findViewById(R.id.txtCodigoVerificacao);
        txtNomeEmail    = findViewById(R.id.txtNomeEmail        );
        txtTempoEnviar  = findViewById(R.id.txtTempoEnviar      );
        btnEnviarCod    = findViewById(R.id.btnReceber);
        btnVerificarCod = findViewById(R.id.btnVerificar        );


        //Pega o email da outra tela
        emailUsuario = getIntent().getStringExtra("email_usuario");

        //Se o emailUsuario trazido da outra tela for diferente de null, ou seja, Existir, procede com a validação
        if (emailUsuario != null)
        {
            //Faz o Email do usuário aparecer no texto da tela
            txtNomeEmail.setText(emailUsuario);
        }


        btnEnviarCod.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view)
            {
                //Torna o botão Indisponivel e inicia as Funções
                btnEnviarCod.setEnabled(false);
                EnviarCodigo();
                iniciarTimer();
            }
        });//Interação com o Botão de Enviar Código

        btnVerificarCod.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view)
            {

                VerificarEmail();
                //Executa a função com verificação de Email

            }
        });//Interação com o botão de verificar email

    }//

    private void iniciarTimer()
    {
        //inicia um contador de 60 segundos
        new CountDownTimer(60000, 1000)
        {
            @Override
            public void onTick(long millisUntilFinished)
            {
                int segundos = (int) (millisUntilFinished / 1000);
                txtTempoEnviar.setText("faltam " + segundos + " segundos");
            }//atualiza os segundos que faltam em tempo real


            @Override
            public void onFinish() {
                txtTempoEnviar.setText("Você pode reenviar o código");
                btnEnviarCod.setText("Reenviar Código");
                btnEnviarCod.setEnabled(true);
            }// quando termina contagem torna o botão clicavel novamente

        }.start();
    }//Função Timer para envio de código via Email



    private void VerificarEmail()
    {
        String codigo = txtCodigo.getText().toString().trim();
        String email = emailUsuario;

        if (emailUsuario == null || emailUsuario.isEmpty()) {
            Toast.makeText(EnvioCodigo_Senha.this, "Erro ao obter email", Toast.LENGTH_LONG).show();
            return;
        }//Verifica se o Email foi obtido



        if (codigo.isEmpty() ) {
            Toast.makeText(EnvioCodigo_Senha.this, "Preencha todos os campos", Toast.LENGTH_LONG).show();
            return;
        }//se o código for vazio retorna mensagem para preenchê-lo


        //Validações:
        if (codigo.length() != 6 || !codigo.matches("\\d+")) {
            Toast.makeText(EnvioCodigo_Senha.this, "Código inválido (6 números)", Toast.LENGTH_LONG).show();
            return;
        }//Código tem que ter 6 caracteres e não pode passar disso, e só aceita número, não pode letra


        //Mensagem caso passa da validaçao:
        Toast.makeText(EnvioCodigo_Senha.this, "Verificando Código", Toast.LENGTH_LONG).show();

        // Objeto que vou enviar para a API:
        EnvioCodigo_Senha.Verificar_EmailRequest dados = new EnvioCodigo_Senha.Verificar_EmailRequest(email , codigo);
        // Preciso do Email do cadastro.



        // Criando a API
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("https://api-crashware.onrender.com/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        // Fazendo que a interface da API seja utilizavel:
        EnvioCodigo_Senha.verificar_email api = retrofit.create(EnvioCodigo_Senha.verificar_email.class);

        // Monto a chamada da API:
        Call<EnvioCodigo_Senha.Verificar_EmailResponse> requisicao = api.verificar(dados);

        // executo a requisicao:
        requisicao.enqueue(new Callback<EnvioCodigo_Senha.Verificar_EmailResponse>() {
            @Override
            public void onResponse(
                    Call<EnvioCodigo_Senha.Verificar_EmailResponse> call,
                    retrofit2.Response<EnvioCodigo_Senha.Verificar_EmailResponse> resposta
            )
            {

                if (resposta.isSuccessful())
                {

                    Toast.makeText(EnvioCodigo_Senha.this, "Código Verificado", Toast.LENGTH_LONG).show();

                    //Vai para a tela de Redefinir Senha
                    Intent i = new Intent(EnvioCodigo_Senha.this, RedefinirSenha.class);
                    i.putExtra("email_usuario", email);
                    startActivity(i);
                    finish();
                }//

                else
                {
                    String erro = "Email Inválido";

                    try {
                        if (resposta.errorBody() != null) {
                            String detail = resposta.errorBody().string();
                            JSONObject json = new JSONObject(detail);
                            erro = json.optString("detail", erro);
                        }
                    } catch (Exception e) {}

                    Toast.makeText(EnvioCodigo_Senha.this, erro, Toast.LENGTH_LONG).show();
                }//se o código for inválido cai na excessão de erro, retornando mensagem

            }//Fim do OnResponse

            @Override
            public void onFailure(
                    Call<EnvioCodigo_Senha.Verificar_EmailResponse> call,
                    Throwable t
            ) {
                Toast.makeText(
                        EnvioCodigo_Senha.this,
                        "Erro de conexão: " + t.getMessage(),
                        Toast.LENGTH_LONG
                ).show();
            }
        });
    }//fim verificar email

    private void EnviarCodigo()
    {
        String email = emailUsuario;

        if (emailUsuario == null || emailUsuario.isEmpty())
        {
            Toast.makeText(EnvioCodigo_Senha.this, "Erro ao obter email", Toast.LENGTH_LONG).show();
            return;
        }//verificação de obtenção de Email


        // Objeto que vou enviar para a API:
        EnvioCodigo_Senha.Reenviar_EmailRequest dados = new EnvioCodigo_Senha.Reenviar_EmailRequest(email);

        // Criando a API
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("https://api-crashware.onrender.com/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        // Fazendo que a interface da API seja utilizavel:
        EnvioCodigo_Senha.reenviar_email api = retrofit.create(EnvioCodigo_Senha.reenviar_email.class);

        // Monto a chamada da API:
        Call<EnvioCodigo_Senha.Reenviar_EmailResponse> requisicao = api.reenviar(dados);


        requisicao.enqueue(new Callback<EnvioCodigo_Senha.Reenviar_EmailResponse>()
        {
            @Override
            public void onResponse
                    (
                            Call<EnvioCodigo_Senha.Reenviar_EmailResponse> requisicao,
                            retrofit2.Response<EnvioCodigo_Senha.Reenviar_EmailResponse> resposta
                    )
            {
                // Caso a API RETORNOU STATUS_CODE : 200
                if (resposta.isSuccessful())
                {

                    //Exibi isso:
                    Toast.makeText(EnvioCodigo_Senha.this,"Código Enviado!", Toast.LENGTH_LONG).show();

                }
                else
                {
                    // erro da API (400, 422, 500...)
                    String erro = "Código não enviado";

                    try {
                        String detail = resposta.errorBody().string();
                        JSONObject json = new JSONObject(detail);

                        if (detail != null) {
                            erro = json.getString("detail");

                        }
                    } catch (Exception e) {
                        // ignora, mantém mensagem padrão
                    }

                    Toast.makeText(EnvioCodigo_Senha.this, erro, Toast.LENGTH_LONG).show();
                }

            }// fim do OnResponse


            @Override
            public void onFailure(Call<EnvioCodigo_Senha.Reenviar_EmailResponse> requisicao, Throwable t)
            {
                // Caso deu erro na requisição
                // erro de conexão (internet, URL, servidor fora)
                Toast.makeText(EnvioCodigo_Senha.this,
                        "Erro de conexão: " + t.getMessage(),
                        Toast.LENGTH_LONG
                ).show();
            }
        });
    }//

}