package com.example.crashware.ui.login;

import android.content.Intent;
import android.os.Bundle;
import android.util.Patterns;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import android.text.method.HideReturnsTransformationMethod;
import android.text.method.PasswordTransformationMethod;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

// Funções que permitem requisições para a API (retrofit)
import com.example.crashware.R;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Retrofit;
import retrofit2.converter.gson.GsonConverterFactory;
import retrofit2.http.Body;
import retrofit2.http.POST;

//Permite eu pegar o valor do erro
import org.json.JSONObject;



public class Cadastro extends AppCompatActivity {

    Button btnCadastro;

    EditText txtEmailCad, txtSenhaCad, txtConfirmarCad, txtNomeCad;

    TextView txtEntrarCad;

    ImageView imgOlhoSenha, imgOlhoConfirmar;


    // Dados que vai para a API:
    class CadastroRequest {
        String nome_usuario;
        String email;
        String senha;

        public CadastroRequest(String nome, String email, String senha) {
            this.nome_usuario = nome;
            this.email = email;
            this.senha = senha;
        }
    }

    // Armazena a resposta da API:
    class CadastroResponse {
        String mensagem;
    }

    // INTERFACE da API:
    interface cadastro {
        @POST("/auth/cadastro")
        Call<CadastroResponse> cadastrar(@Body CadastroRequest request);
    }

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.cadastro);

        // Iniciando o Layout
        btnCadastro      = findViewById(R.id.btnCriarConta        );
        txtEmailCad      = findViewById(R.id.txtEmailCad          );
        txtSenhaCad      = findViewById(R.id.txtSenhaCad          );
        txtConfirmarCad  = findViewById(R.id.txtConfirmarSenhaCad );
        txtNomeCad       = findViewById(R.id.txtNomeCad           );
        txtEntrarCad     = findViewById(R.id.txtEntrarCad         );
        imgOlhoSenha     = findViewById(R.id.imgOlhoSenha         );
        imgOlhoConfirmar = findViewById(R.id.imgOlhoSenhaConfirmar);



        // Botão cadastrar
        btnCadastro.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View v)
            {
                Cadastrar();
            }
        });// interação que efetua a função de cadastrar salvando os dados no banco

        // Ir para tela de login
        txtEntrarCad.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View v)
            {
                Intent entrar =
                        new Intent(Cadastro.this, Login.class);
                startActivity(entrar);
            }
        });//interação com o botão entrar que efetua intent, levando até a tela de login novamente

        imgOlhoSenha.setOnClickListener(new View.OnClickListener()
        {
            boolean visivel = false;

            @Override
            public void onClick(View v) {

                if (visivel)
                {
                    txtSenhaCad.setTransformationMethod(PasswordTransformationMethod.getInstance());
                    imgOlhoSenha.setImageResource(R.drawable.olho_icon);
                    visivel = false;
                }

                else
                {
                    txtSenhaCad.setTransformationMethod(HideReturnsTransformationMethod.getInstance());
                    imgOlhoSenha.setImageResource(R.drawable.olhofechado_icon);
                    visivel = true;
                }

                txtSenhaCad.setSelection(txtSenhaCad.getText().length());
            }
        });//click na imagem de mostrar/esconder senha,
        //seta a imagem para tal, e muda para que esconda ou mostre a senha

        imgOlhoConfirmar.setOnClickListener(new View.OnClickListener()
        {
            boolean visivel = false;

            @Override
            public void onClick(View v)
            {

                if (visivel)
                {
                    txtConfirmarCad.setTransformationMethod(PasswordTransformationMethod.getInstance());
                    imgOlhoConfirmar.setImageResource(R.drawable.olho_icon);
                    visivel = false;
                }

                else
                {
                    txtConfirmarCad.setTransformationMethod(HideReturnsTransformationMethod.getInstance());
                    imgOlhoConfirmar.setImageResource(R.drawable.olhofechado_icon);
                    visivel = true;
                }

                txtConfirmarCad.setSelection(txtConfirmarCad.getText().length());
            }
        });//click na imagem de mostrar/esconder senha,
        //seta a imagem para tal, e muda para que esconda ou mostre a senha, so que na confirmação


        // Ajuste de layout (EdgeToEdge)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main_cadastro), (v, insets) ->
        {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });//

    }

    private void Cadastrar() {

        String nome      = txtNomeCad.getText().toString().trim();
        String email     = txtEmailCad.getText().toString().trim().toLowerCase();
        String senha     = txtSenhaCad.getText().toString();
        String confirmar = txtConfirmarCad.getText().toString();

        if (nome.isEmpty() || email.isEmpty()  || senha.isEmpty() || confirmar.isEmpty()) {
            Toast.makeText(this, "Preencha todos os campos", Toast.LENGTH_LONG).show();
            return;
        }

        if (!senha.equals(confirmar)) {
            Toast.makeText(this, "Senhas não coincidem", Toast.LENGTH_LONG).show();
            return;
        }


        //Nome não pode ter numero

        if (!nome.matches("^[A-Za-zÀ-ÿ]+(\\s[A-Za-zÀ-ÿ]+)*$")) {
            Toast.makeText(this, "Nome inválido", Toast.LENGTH_LONG).show();
            return;
        }

        if(nome.length() < 5)
        {
            Toast.makeText(this, "Nome deve ter pelo menos 5 caracteres", Toast.LENGTH_LONG).show();
            return;
        }

        //Email não pode ter espaço EX: "jo ao@gmail.com", o trim() só tira o espaço dos lados.

        if (email.contains(" ") || !Patterns.EMAIL_ADDRESS.matcher(email).matches())
        {
            Toast.makeText(this, "Email inválido", Toast.LENGTH_LONG).show();
            return;
        }
        //

        // validação de tamanho da senha
        if (senha.length() < 8)
        {
            Toast.makeText(this, "Senha deve ter no mínimo 8 caracteres", Toast.LENGTH_LONG).show();
            return;
        }
        //

        // validação se a senha possui espaços

        if (senha.contains(" "))
        {
            Toast.makeText(this, "Senha não pode conter espaços", Toast.LENGTH_LONG).show();
            return;
        }
        //



        //Mensagem caso passa da validaçao:
        Toast.makeText(this, "Verificando dados...", Toast.LENGTH_LONG).show();

        // Objeto que vou enviar para a API:
        CadastroRequest dados = new CadastroRequest(nome, email, senha);

        // Criando a API
        Retrofit retrofit = new Retrofit.Builder()
                .baseUrl("https://api-crashware.onrender.com/")
                .addConverterFactory(GsonConverterFactory.create())
                .build();

        // Fazendo que a interface da API seja utilizavel:
        cadastro api = retrofit.create(cadastro.class);

        // Monto a chamada da API:
        Call<CadastroResponse> requisicao = api.cadastrar(dados);

        // executo a requisicao:
        requisicao.enqueue(new Callback<CadastroResponse>() {
            @Override
            public void onResponse(
                    Call<CadastroResponse> requisicao,
                    retrofit2.Response<CadastroResponse> resposta
            ) {
                // Caso a API RETORNOU A MENSAGEM
                if (resposta.isSuccessful()) {
                    // sucesso (200–299)

                    // ir para Verifição de Email
                    Intent i = new Intent(Cadastro.this, ConfirmarIdentidade.class);
                    // passando os dados
                    i.putExtra("nome_usuario", nome);
                    i.putExtra("emailUsuario", email);

                    startActivity(i);
                    finish();

                } else {
                    // erro da API (400, 422, 500...)
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

                    Toast.makeText(Cadastro.this, erro, Toast.LENGTH_LONG).show();
                }
            }

            @Override
            public void onFailure(Call<CadastroResponse> requisicao, Throwable t) {
                // Caso deu erro na requisição
                // erro de conexão (internet, URL, servidor fora)
                Toast.makeText(
                        Cadastro.this,
                        "Erro de conexão: " + t.getMessage(),
                        Toast.LENGTH_LONG
                ).show();
            }
        });
    }
}//