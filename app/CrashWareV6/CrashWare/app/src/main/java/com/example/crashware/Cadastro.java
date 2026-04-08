package com.example.crashware;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;

public class Cadastro extends AppCompatActivity {

    Button btnCadastro;
    EditText txtEmail, txtSenhaCad;
    TextView txtEntrar;
    ImageView imgLogoCad, imgGoogleCad, imgFacebookCad;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.cadastro);

        btnCadastro    = (Button) findViewById(R.id.btnCadastro);
        txtEmail       = (EditText) findViewById(R.id.txtEmail);
        txtSenhaCad    = (EditText) findViewById(R.id.txtSenhaCad);
        txtEntrar      = (TextView) findViewById(R.id.txtEntrar);
        imgGoogleCad   = (ImageView) findViewById(R.id.imgGoogleCad);
        imgFacebookCad = (ImageView) findViewById(R.id.imgFacebookCad);
        imgLogoCad     = (ImageView) findViewById(R.id.imgLogoCad);


        btnCadastro.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view)
            {
                Cadastrar();
            }
        });// Funcção do botão Cadastrar, criando a conta.

        txtEntrar.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                Intent it =
                        new Intent(Cadastro.this, Login.class);
                startActivity(it);

            }
        });// interação com texto "Entrar" levando para a tela de Login.

        imgGoogleCad.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                CadastrarGoogle();
            }
        });// imagem do google clicavel para facilitar o login

        imgFacebookCad.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                CadastrarFacebook();

            }
        });//imagem do Facebook clicavel para facilitar o login

        imgLogoCad.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

            }
        });//Logo da tela de cadastro para levar a Home




    }

    private void Cadastrar()
    {
        Intent it=
                new Intent(Cadastro.this, Home.class);
        startActivity(it);

    }//Função para efetuar o cadastro e mandar as informações pro banco

    private void CadastrarFacebook()
    {

    }//Função para fazer o cadastro através do facebook e mandar para o banco

    private void CadastrarGoogle()
    {

    }//Função para fazer o cadastro através do google e mandar para o banco
}