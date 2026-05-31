package com.example.crashware.ui.senha;

import static android.widget.Toast.LENGTH_LONG;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.text.method.HideReturnsTransformationMethod;
import android.text.method.PasswordTransformationMethod;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.example.crashware.R;
import com.example.crashware.ui.login.Login;


// Funções que permitem requisições para a API (retrofit)

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.http.Body;
import retrofit2.http.POST;

//Permite eu pegar o valor do erro
import org.json.JSONObject;

public class RedefinirSenha extends AppCompatActivity {

    SharedPreferences prefs;

    Button btnConfirmarNovaSenha;


    EditText txtCampoNovaSenha, txtCampoConfirmarNovaSenha;

    ImageView imgOlhoNovaSenha,imgConfirmarOlhoNovaSenha;

    String emailUsuario;


    // Dados que vai para a API:
    class  AlterarSenhaRequest{
        String email;
        String senha;

        public AlterarSenhaRequest(String email, String senha) {
            this.email = email;
            this.senha = senha;
        }
    }

    // Armazena a resposta da API:
    class AlterarSenhaResponse {
        String mensagem;
    }

    // INTERFACE da API:
    interface alterar_senha {
        @POST("/auth/alterar_senha")
        Call<AlterarSenhaResponse> alterar(@Body AlterarSenhaRequest request);
    }


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        prefs = this.getSharedPreferences("CrashWare", Context.MODE_PRIVATE);

        EdgeToEdge.enable(this);
        setContentView(R.layout.redefinir_senha);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.Redefinir), (v, insets) ->
        {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });



        btnConfirmarNovaSenha      = findViewById(R.id.btnConfirmarNovaSenha     );
        txtCampoNovaSenha          = findViewById(R.id.txtCampoNovaSenha         );
        txtCampoConfirmarNovaSenha = findViewById(R.id.txtCampoConfirmarNovaSenha);
        imgOlhoNovaSenha           = findViewById(R.id.imgOlhoNovaSenha          );
        imgConfirmarOlhoNovaSenha  = findViewById(R.id.imgOlhoConfirmarNovaSenha );

        //Pega o email da outra tela
        emailUsuario = getIntent().getStringExtra("email_usuario");

        imgOlhoNovaSenha.setOnClickListener(new View.OnClickListener()
        {
            boolean visivel = false;

            @Override
            public void onClick(View v) {

                if (visivel)
                {
                    txtCampoNovaSenha.setTransformationMethod(PasswordTransformationMethod.getInstance());
                    imgOlhoNovaSenha.setImageResource(R.drawable.olho_icon);
                    visivel = false;
                }

                else
                {
                    txtCampoNovaSenha.setTransformationMethod(HideReturnsTransformationMethod.getInstance());
                    imgOlhoNovaSenha.setImageResource(R.drawable.olhofechado_icon);
                    visivel = true;
                }

                txtCampoNovaSenha.setSelection(txtCampoNovaSenha.getText().length());
            }
        });//click na imagem de mostrar/esconder senha,
        //seta a imagem para tal, e muda para que esconda ou mostre a senha

        imgConfirmarOlhoNovaSenha.setOnClickListener(new View.OnClickListener()
        {
            boolean visivel = false;

            @Override
            public void onClick(View v)
            {

                if (visivel)
                {
                    txtCampoConfirmarNovaSenha.setTransformationMethod(PasswordTransformationMethod.getInstance());
                    imgConfirmarOlhoNovaSenha.setImageResource(R.drawable.olho_icon);
                    visivel = false;
                }

                else
                {
                    txtCampoConfirmarNovaSenha.setTransformationMethod(HideReturnsTransformationMethod.getInstance());
                    imgConfirmarOlhoNovaSenha.setImageResource(R.drawable.olhofechado_icon);
                    visivel = true;
                }

                txtCampoConfirmarNovaSenha.setSelection(txtCampoConfirmarNovaSenha.getText().length());
            }
        });//click na imagem de mostrar/esconder senha,
        //seta a imagem para tal, e muda para que esconda ou mostre a senha, so que na confirmação



        //Pega o email da outra tela
        emailUsuario = getIntent().getStringExtra("email_usuario");


        btnConfirmarNovaSenha.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v)
            {

                //Verifico a navegação do usuario
                String logado = prefs.getString("logado", "false");


                String email = emailUsuario;
                String senha = txtCampoNovaSenha.getText().toString().trim();
                String senhaconfirma = txtCampoConfirmarNovaSenha.getText().toString().trim();


                //Depois no futuro, se der tempo... REFORÇAR SEGURANÇA. EX: SENHA TEM QUE TER 1 LETRA MAISUCULA E UM SIMBOLO ESPECIAL.

                if  (senha.isEmpty()) {
                    Toast.makeText(RedefinirSenha.this, "Preencha todos os campos",
                            Toast.LENGTH_LONG).show();
                }

                // validação de tamanho da senha
                if (senha.length() < 8) {
                    Toast.makeText(RedefinirSenha.this, "Senha deve ter no mínimo 8 caracteres",
                            Toast.LENGTH_LONG).show();
                    return;
                }
                //
                // validação se a senha possui espaços

                if (senha.contains(" ")) {
                    Toast.makeText(RedefinirSenha.this,"Senha não pode conter espaços", Toast.LENGTH_LONG).show();
                    return;
                }

                //Verifica se a senha é igual ao confirmar senha
                if (senha.equals(senhaconfirma) )
                {
                    //Mensagem caso passa da validaçao:
                    Toast.makeText(RedefinirSenha.this, "Alterando senha...", Toast.LENGTH_LONG).show();

                    // Objeto que vou enviar para a API:
                    AlterarSenhaRequest dados = new AlterarSenhaRequest(email, senha);

                    // Criando a API
                    Retrofit retrofit = new Retrofit.Builder()
                            .baseUrl("https://api-crashware.onrender.com/")
                            .addConverterFactory(GsonConverterFactory.create())
                            .build();

                    // Fazendo que a interface da API seja utilizavel:
                    alterar_senha api = retrofit.create(alterar_senha.class);

                    // Monto a chamada da API:
                    Call<AlterarSenhaResponse> requisicao = api.alterar(dados);

                    requisicao.enqueue(new Callback<AlterarSenhaResponse>() {
                        @Override
                        public void onResponse(
                                Call<AlterarSenhaResponse> requisicao,
                                retrofit2.Response<AlterarSenhaResponse> resposta
                        )
                        { // Caso retorne a API Retorne uma mensagem.
                            if (resposta.isSuccessful())
                            {



                                if(logado.equals("true"))
                                {
                                    //Deleto o token e o refresh_token
                                    prefs.edit()
                                            .remove("token")
                                            .remove("refresh_token")
                                            .remove("alterar_email")
                                            .remove("alterar_nome")
                                            .remove("foto")
                                            .apply();

                                    //Altero o valor do "logado" no sharedePreferences
                                    prefs.edit()
                                            .putString("logado","false")
                                            .apply();

                                }

                                Toast.makeText(RedefinirSenha.this, "Senha Alterada com sucesso!", Toast.LENGTH_LONG).show();

                                //Vai para a tela de LOGIN
                                Intent i = new Intent(RedefinirSenha.this, Login.class);
                                startActivity(i);
                                finish();



                            }else
                            {
                                // erro da API (400, 422, 500...)
                                String erro = "Erro em Alterar a Senha";

                                try {
                                    String detail = resposta.errorBody().string();
                                    JSONObject json = new JSONObject(detail);

                                    if (detail != null) {
                                        erro = json.getString("detail");

                                    }
                                } catch (Exception e) {
                                    //Ignora e retorna o erro padrão
                                }

                                //Exibi o erro

                                Toast.makeText(RedefinirSenha.this, erro, Toast.LENGTH_LONG).show();

                            }

                        }
                        //Caso a API não retorne mensagem
                        @Override
                        public void onFailure(Call<AlterarSenhaResponse> requisicao, Throwable t) {
                            // Caso deu erro na requisição
                            // erro de conexão (internet, URL, servidor fora)
                            Toast.makeText(
                                    RedefinirSenha.this,
                                    "Erro de conexão: " + t.getMessage(),
                                    Toast.LENGTH_LONG
                            ).show();
                        }

                    });//
                }
                else
                {
                    Toast.makeText(RedefinirSenha.this, "Erro, senhas não coincidem", Toast.LENGTH_LONG).show();
                    return;
                }//


            }


        });// interação com o botão de confirmação ao trocar a senha, verificando se coincidem e alterando a senha no bd

    }
}