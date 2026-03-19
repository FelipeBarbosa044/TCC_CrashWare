package com.example.myapplication;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

public class Login extends AppCompatActivity {
    Button btnLogin, btnEsqueci;
    TextView txtLogin, txtSenha, txtCadastro;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.login);

        txtLogin=(EditText) findViewById(R.id.txtLogin);
        txtSenha = (EditText) findViewById(R.id.txtSenha);
        txtCadastro = (TextView) findViewById(R.id.txtCadastro);
        btnLogin = (Button) findViewById(R.id.btnLogin);
        btnEsqueci = (Button) findViewById(R.id.btnEsqueci);


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
            }
        });//Botão de quando esquecer a senha

        txtCadastro.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

            }
        });// vai mandar o usuário para tela de cadastro
    }
}