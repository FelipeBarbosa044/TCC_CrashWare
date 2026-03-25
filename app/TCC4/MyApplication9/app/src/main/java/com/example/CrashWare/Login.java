package com.example.CrashWare;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;

public class Login extends AppCompatActivity {
    Button btnLogin, btnEsqueci;
    TextView txtLogin, txtSenha, txtCadastro;
    ImageView imgLogoLogin, imgGoogleLogin, imgFacebookLogin;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.login);

        txtLogin=(EditText) findViewById(R.id.txtLogin);
        txtSenha = (EditText) findViewById(R.id.txtSenha);
        txtCadastro = (TextView) findViewById(R.id.txtCadastro);
        btnLogin = (Button) findViewById(R.id.btnLogin);
        btnEsqueci = (Button) findViewById(R.id.btnEsqueci);
        imgLogoLogin = (ImageView) findViewById(R.id.imgLogoLogin);
        imgGoogleLogin = (ImageView) findViewById(R.id.imgGoogleLogin);
        imgFacebookLogin = (ImageView) findViewById(R.id.imgFacebookLogin);


        btnLogin.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                //Logar();
            }
        });//Efetua a Função de Logar na conta

        btnEsqueci.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
             //Esqueci();
                Intent it =
                        new Intent(Login.this, RecuperarSenha.class);

                startActivity(it);

            }
        });//Botão de quando esquecer a senha/ manda para a tela de recuperção de senha

        txtCadastro.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent it =
                        new Intent(Login.this, Cadastro.class);

                startActivity(it);

            }
        });// vai mandar o usuário para tela de cadastro

        imgFacebookLogin.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view)
            {
                //LogarFacebook()

            }
        });// imagem clicavel para logar pelo facebook

        imgGoogleLogin.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view)
            {

                //LogarGoogle

            }
        });//imagem clicavel para logar pelo Google

        imgLogoLogin.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {


            }
        });//Imagem que redireciona a Home
    }
}