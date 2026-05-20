package com.example.crashware.ui.login;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.util.Patterns;
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

import android.text.method.HideReturnsTransformationMethod;
import android.text.method.PasswordTransformationMethod;

// Funções que permitem requisições para a API (retrofit)
import com.example.crashware.ui.api.Auth;
import com.example.crashware.ui.navegacao.Home;
import com.example.crashware.R;
import com.example.crashware.ui.senha.RecuperarSenha;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.http.Body;
import retrofit2.http.Header;
import retrofit2.http.POST;

//Permite eu pegar o valor do erro
import org.json.JSONObject;

//Importo a função de verificar token





public class Login extends AppCompatActivity {

    //Memória do app
    SharedPreferences prefs;

    Button btnEntrar;
    ImageView imgOlho;

    EditText txtEmailLogin, txtSenhaLogin;
    TextView txtEsqueceu, txtCadastre;

    // Dados que vai para a API:


    //Login
    class LoginRequest {
        String email;
        String senha;

        public LoginRequest(String email, String senha) {
            this.email = email;
            this.senha = senha;
        }
    }
    // Armazena a resposta da API:
    //Login
    class LoginResponse {
        String token;
        String refresh_token;

        String token_type;

        public String getToken() {
            return token;
        }

        public String getRefresh_token() {
            return refresh_token;
        }

    }




    // INTERFACE da API:
    //Login
    interface login {
        @POST("/auth/login")
        Call<LoginResponse> logar(@Body LoginRequest Loginrequest);
    }





    @Override
    protected void onCreate(Bundle savedInstanceState) {

        prefs = getSharedPreferences("CrashWare", MODE_PRIVATE);

//        //Verificando Token
//        Verificar_Token();



        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.login);



        //  Iniciando layout
        btnEntrar     = (Button)    findViewById(R.id.btnEntrarCad      );
        txtCadastre   = (TextView)  findViewById(R.id.txtCadastreLogin  );
        imgOlho       = (ImageView) findViewById(R.id.imgOlhoNovaSenha  );
        txtEsqueceu   = (TextView)  findViewById(R.id.txtEsqueceu       );
        txtEmailLogin = (EditText)  findViewById(R.id.txtEmailLogin     );
        txtSenhaLogin = (EditText)  findViewById(R.id.txtSenhaLogin     );


        //  Botão entrar
        btnEntrar.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view)
            {
                Logar();
            }
        });//interação com o botão de entrar, efetuando função que confere os dados e se estiverem corretos leva ao Home


        //  Ir para cadastro
        txtCadastre.setOnClickListener(v ->
        {
            Intent cadastro
                    = new Intent(Login.this, Cadastro.class);
            startActivity(cadastro);
        });// interação com o botão de cadastro na tela de login, direcionando para cadastrar usuário


        //  Esqueceu senha
        txtEsqueceu.setOnClickListener(v ->
        {
            Intent RecSenha =
                    new Intent(Login.this, RecuperarSenha.class);
            startActivity(RecSenha);
        });// interação com o texto de "esqueceu a senha" para levar a tela de recuperação

        // INSETS (EVITA CORTAR TELA) NÃO SE ATREVA A MEXER, SUJEITO A PAULADA
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });//

        imgOlho.setOnClickListener(new View.OnClickListener() {
            boolean senhaVisivel = false;

            @Override
            public void onClick(View view) {

                if (senhaVisivel) {
                    // esconder senha
                    txtSenhaLogin.setTransformationMethod(PasswordTransformationMethod.getInstance());
                    imgOlho.setImageResource(R.drawable.olho_icon);
                    senhaVisivel = false;
                } else {
                    // mostrar senha
                    txtSenhaLogin.setTransformationMethod(HideReturnsTransformationMethod.getInstance());
                    imgOlho.setImageResource(R.drawable.olhofechado_icon);
                    senhaVisivel = true;
                }

                txtSenhaLogin.setSelection(txtSenhaLogin.getText().length());
            }
        });//click na imagem de mostrar/esconder senha,
        //seta a imagem para tal, e muda para que esconda ou mostre a senha na area do login


    }//




    private void Logar()
    {

        //String nome = txtNomeCad.getText().toString().trim();
        String email = txtEmailLogin.getText().toString().trim();
        String senha = txtSenhaLogin.getText().toString();



        if (email.isEmpty() || senha.isEmpty())
        {
            Toast.makeText(this, "Preencha os campos", Toast.LENGTH_LONG).show();
            return;
        }


        //Email não pode ter espaço EX: "jo ao@gmail.com"
        if (email.contains(" ") || !Patterns.EMAIL_ADDRESS.matcher(email).matches()) {
            Toast.makeText(this, "Email inválido", Toast.LENGTH_LONG).show();
            return;
        }

        // Senha não pode conter espaços
        if (senha.contains(" ")) {
            Toast.makeText(this, "Senha não pode conter espaços", Toast.LENGTH_LONG).show();
            return;
        }


        // senha tbm n pode ter espaço.


        //Mensagem caso passa da validaçao:
        Toast.makeText(this, "Verificando dados...", Toast.LENGTH_LONG).show();



        // Objeto que vou enviar para a API:
        //Objeto do login
        LoginRequest dados = new Login.LoginRequest(email, senha);


        // Criando a API
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("https://api-crashware.onrender.com/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        // Fazendo que a interface da API seja utilizavel:

        //login
        login api = retrofit.create(login.class);



        // Monto a chamada da API:

        //login
        Call<LoginResponse> requisicao = api.logar(dados);


        // executo a requisicao:
        requisicao.enqueue(new Callback<LoginResponse>() {
            @Override
            public void onResponse(
                    Call<LoginResponse> requisicao,
                    retrofit2.Response<LoginResponse> resposta
            ) {
                // Caso a API RETORNOU A MENSAGEM


                // Se o email não tiver verificado

                if (resposta.code() == 403) {

                    //Mostra esse erro:
                    Toast.makeText(Login.this, "EMAIL NAO VERIFICADO", Toast.LENGTH_SHORT).show();

                    // Envia para a tela de VERIFICAR EMAIL:
                    Intent i = new Intent(Login.this, ConfirmarIdentidade.class);
                    i.putExtra("email_usuario", email);
                    startActivity(i);
                    finish();

                } else if (!resposta.isSuccessful())
                {
                    //Retorna erro caso o login estiver errado

                    String erro = "Erro no cadastro";

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
                    Toast.makeText(Login.this, erro, Toast.LENGTH_LONG).show();

                }else{
                    //Pego o token da API
                    LoginResponse dados = resposta.body();
                    String token = dados.getToken();
                    String refresh_token = dados.getRefresh_token();

                    //Salvo o valor no SharedPreferences
                    prefs.edit()
                            .putString("token",token)
                            .putString("refresh_token",refresh_token)
                            .putBoolean("PrimeiroLogin",true)
                            .apply();


                    //Vai para a HOME:
                    Intent i = new Intent(Login.this, Home.class);
                    startActivity(i);
                    finish();


                }
            }
            @Override
            public void onFailure(Call<LoginResponse> requisicao, Throwable t) {
                // Caso deu erro na requisição
                // erro de conexão (internet, URL, servidor fora)
                Toast.makeText(
                        Login.this,
                        "Erro de conexão: " + t.getMessage(),
                        Toast.LENGTH_LONG
                ).show();
            }
        });
    }
}