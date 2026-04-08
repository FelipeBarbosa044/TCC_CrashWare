package com.example.crashware;

import static com.example.crashware.R.id.btnEntrar;

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

    Button btnEntrar;

    ImageView imgGoogleLogin, imgFacebookLogin, imgOlho;

    TextView txtCriarConta,txtEsqueceu;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.login);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {

            //Iniciando o layout para o código

            btnEntrar = (Button) findViewById(R.id.btnEntrar);
            imgGoogleLogin = (ImageView) findViewById(R.id.imgGoogle);
            imgFacebookLogin = (ImageView) findViewById(R.id.imgFacebook);
            imgOlho = (ImageView) findViewById(R.id.imgOlho);
            txtEsqueceu = (TextView)  findViewById(R.id.txtEsqueceu);
            txtCriarConta = (TextView) findViewById(R.id.txtCriarConta);


            btnEntrar.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v)
                {
                    //Logar();

                }
            });//Função do botão entrar, realizando o login e mandando para a tela de home

            imgGoogleLogin.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v)
                {
                    //GoogleLogar();
                }
            });//Interação de clique com imagem de logar pelo google, realizando o login de maneira facilitada.

            imgFacebookLogin.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v)
                {
                    //FacebookLogar();
                }
            });//Interação de clique com imagem de logar pelo facebook, realizando o login de maneira facilitada

            imgOlho.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v)
                {

                }
            });// interação de clique com a imagem de revelar/esconder a senha na hora do login

            txtEsqueceu.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View v)
                {
                    //Intent para levar a tele de recuperarsenha.xml

                }
            });// interação com o texto de "Esqueceu sua senha" levando para a tela de recuperação


            //NÃO MEXA, VAI QUEBRAR O CÓDIGO
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
            //NÃO MEXER DE JEITO NENHUM, TODA E QUALQUER PROGRAMAÇÃO DEVE SER REALIZADA ACIMA DESTA.







        });//

    }

    public void FacebookLogar() {
    }

    private void GoogleLogar()
    {

    }//Função de realizar o login através da conta do google, verificando se há no BD

    private void Logar()
    {

    }//função de login, verificando se email e senha batem com o banco de dados
}