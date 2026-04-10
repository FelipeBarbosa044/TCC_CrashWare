package com.example.crashware;

import static com.example.crashware.R.id.btnEntrar;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

public class Login extends AppCompatActivity {

    Button btnEntrar, btnCadLogin;

    ImageView  imgOlho;

    TextView txtEsqueceu, txtEmailLogin, txtSenhaLogin;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.login);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {

            //Iniciando o layout para o código

            btnEntrar        = (Button)    findViewById(R.id.btnEntrar    );
            btnCadLogin      = (Button)    findViewById(R.id.btnCadLogin  );
            imgOlho          = (ImageView) findViewById(R.id.imgOlho      );
            txtEsqueceu      = (TextView)  findViewById(R.id.txtEsqueceu  );
            txtEmailLogin    = (TextView)  findViewById(R.id.txtEmailLogin);
            txtSenhaLogin    = (TextView)  findViewById(R.id.txtSenhaCad  );


            btnEntrar.setOnClickListener(new View.OnClickListener()
            {
                @Override
                public void onClick(View v)
                {
                    //Logar();
                    Intent entrar =
                            new Intent(Login.this, Home.class);

                    startActivity(entrar);

                }
            });//Função do botão entrar, realizando o login e mandando para a tela de home



            imgOlho.setOnClickListener(new View.OnClickListener()
            {
                @Override
                public void onClick(View v)
                {

                }
            });// interação de clique com a imagem de revelar/esconder a senha na hora do login

            txtEsqueceu.setOnClickListener(new View.OnClickListener()
            {
                @Override
                public void onClick(View v)
                {
                    //Intent para levar a tela de recuperarsenha.xml
                    Intent login =
                            new Intent(Login.this, Cadastro.class);

                    startActivity(login);

                }
            });// interação com o texto de "Esqueceu sua senha" levando para a tela de recuperação


            btnCadLogin.setOnClickListener(new View.OnClickListener()
            {
                @Override
                public void onClick(View v)
                {
                    CriarConta();
                    Intent Criar =
                        new Intent(Login.this, Cadastro.class);

                    startActivity(Criar);

                }
            });// interação com o botão de Cadastrar-se, direcionando através do intent para tela de cadastro

            //NÃO MEXA, VAI QUEBRAR O CÓDIGO
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
            //NÃO MEXER DE JEITO NENHUM, TODA E QUALQUER PROGRAMAÇÃO DEVE SER REALIZADA ACIMA DESTA.
            //a não ser as classes.... kkkkkkk







        });//

    }

    private void CriarConta()
    {
        Intent esquecer =
                new Intent(Login.this, Cadastro.class);

        startActivity(esquecer);
    }

    private void Logar()
    {
        //algo está errado na lógica abaixo cuidado...
        //if (txtEmailLogin = txtEmailLogin; txtSenhaLogin = txtSenhaLogin)
        {
            Intent Home =
                    new Intent(Login.this, Home.class);

            startActivity(Home);
        }

    }//função de login, verificando se email e senha batem com o banco de dados
}