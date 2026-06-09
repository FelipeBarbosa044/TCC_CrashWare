package com.example.crashware.ui.senha;

import android.content.Intent;
import android.os.Bundle;
import android.util.Patterns;
import android.view.View;
import android.widget.Button;
import android.widget.CompoundButton;
import android.widget.EditText;
import android.widget.RadioButton;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.annotation.NonNull;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.example.crashware.ui.navegacao.Home;
import com.example.crashware.ui.login.Login;
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

public class RecuperarSenha extends AppCompatActivity {

    Button btnRecSenha;

    RadioButton rdbEmail, rdbTelefone;

    TextView txtEntrarLembrou;

    EditText txtEmailRec;


    // Dados que vai para a API:
    class VerificarEmailRequest {
        String email;

        public VerificarEmailRequest(String email) {
            this.email = email;
        }
    }

    // Armazena a resposta da API:
    class Verificar_EmailResponse {
        String mensagem;
    }

    // INTERFACE da API:
    interface verificar_email {
        @POST("/auth/verificar_email")
        Call<Verificar_EmailResponse> verificar(@Body VerificarEmailRequest request);
    }


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.recuperar_senha);


        //Iniciando o layout no código
        btnRecSenha = findViewById(R.id.btnRecSenha);
        rdbEmail = findViewById(R.id.radioEmail);
        rdbTelefone = findViewById(R.id.radioTelefone);
        txtEntrarLembrou = findViewById(R.id.txtEntrarLembrou);
        txtEmailRec = findViewById(R.id.txtEmailRec);


        txtEmailRec.setHint("Escolha a forma de recuperação");

        rdbEmail.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(@NonNull CompoundButton compoundButton, boolean estado) {
                if (estado) {
                    txtEmailRec.setHint("seu@email.com");
                    txtEmailRec.setText("");
                }
            }
        });//Se radioButton email estiver selecionado muda o hint para tal e limpa a caixa de texto

        rdbTelefone.setOnCheckedChangeListener(new CompoundButton.OnCheckedChangeListener() {
            @Override
            public void onCheckedChanged(@NonNull CompoundButton compoundButton, boolean estado) {
                if (estado) {
                    txtEmailRec.setHint("(DDD) 9XXXX-XXXX");
                    txtEmailRec.setText("");

                }

            }
        });//Se radioButton Telefone estiver selecionado muda o hint para tal e limpa a caixa de texto


        btnRecSenha.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                RecSenha();

            }
        });// Interação de clique com o botão de recuperar senha que deverá encaminhar email ou SMS para alteração da senha cadastrada

        txtEntrarLembrou.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent lembrou =
                        new Intent(RecuperarSenha.this, Login.class);
                startActivity(lembrou);

                finish();//fecha esta tela após passar para a próxima

            }
        });


        //
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main3), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });
        //
    }

    private void RecTelefone() {

    }//Recuperação caso o rdb de Telefone esteja checado

    private void RecEmail() {

    }//Recuperação caso o rdb de email esteja marcado

    private void RecSenha() {
        String valor = txtEmailRec.getText().toString().trim();

        if (valor.isEmpty()) {
            txtEmailRec.setError("Preencha o campo");
            return;
        }// se o campo de digitação estiver vazio não avança

        if (rdbEmail.isChecked()) {

            //Validação do email:

            //Email não pode ter espaço EX: "jo ao@gmail.com"
            if (valor.contains(" ") || !Patterns.EMAIL_ADDRESS.matcher(valor).matches()) {
                Toast.makeText(RecuperarSenha.this, "Email inválido", Toast.LENGTH_LONG).show();
                return;
            }


            //Mensagem caso passa da validaçao:
            Toast.makeText(RecuperarSenha.this, "Verificando dados...", Toast.LENGTH_LONG).show();


            // Objeto que vou enviar para a API:
            VerificarEmailRequest dados = new VerificarEmailRequest(valor);

            // Criando a API
            Retrofit retrofit = new Retrofit.Builder()
                    .baseUrl("https://api-crashware.onrender.com/")
                    .addConverterFactory(GsonConverterFactory.create())
                    .build();

            // Fazendo que a interface da API seja utilizavel:
            verificar_email api = retrofit.create(verificar_email.class);

            // Monto a chamada da API:
            Call<Verificar_EmailResponse> requisicao = api.verificar(dados);

            //
            // executo a requisicao:
            requisicao.enqueue(new Callback<Verificar_EmailResponse>() {

                @Override
                public void onResponse(
                        Call<Verificar_EmailResponse> requisicao,
                        retrofit2.Response<Verificar_EmailResponse> resposta
                ) {
                    // Caso a API RETORNOU A MENSAGEM
                    if (resposta.isSuccessful()) {
                        // sucesso (200–299)

                        //Vai para a tela de Confirmar identidade:
                        //E leva o email dessa tela.
                        Intent intent = new Intent(RecuperarSenha.this, EnvioCodigo_Senha.class);
                        intent.putExtra("email_usuario", valor);
                        startActivity(intent);
                        finish();//fecha esta tela após passar para a próxima

                    } else {
                        // erro da API (400, 422, 500...)
                        String erro = "Email não autenticado ou inválido";

                        try {
                            String detail = resposta.errorBody().string();
                            JSONObject json = new JSONObject(detail);

                            if (detail != null) {
                                erro = json.getString("detail");

                            }
                        } catch (Exception e) {
                            // ignora, mantém mensagem padrão
                        }

                        Toast.makeText(RecuperarSenha.this, erro, Toast.LENGTH_LONG).show();
                    }
                }

                @Override
                public void onFailure(Call<Verificar_EmailResponse> requisicao, Throwable t) {
                    // Caso deu erro na requisição
                    // erro de conexão (internet, URL, servidor fora)
                    Toast.makeText(
                            RecuperarSenha.this,
                            "Erro de conexão: " + t.getMessage(),
                            Toast.LENGTH_LONG
                    ).show();
                }
            });
        }//

        // se o email estiver escolhido, trata como Email e avança de tela

        else if (rdbTelefone.isChecked())
        {
            //

            // Aqui futuramente pode mandar para outra tela ou API que envie SMS
            txtEmailRec.setError("Recuperação por telefone ainda não implementada");

        }//se telefone estiver marcado trata com telefone

        else
        {
            txtEmailRec.setError("Escolha uma opção");
        }//se nada funcionar trata como erro de obtenção do valor

    }//De algum modo, programar um envio de email ou sms
}