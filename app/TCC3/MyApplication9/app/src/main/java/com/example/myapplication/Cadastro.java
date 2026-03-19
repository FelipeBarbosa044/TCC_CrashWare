package com.example.myapplication;

import androidx.appcompat.app.AppCompatActivity;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;

public class Cadastro extends AppCompatActivity {

    Button btnCadastro;
    EditText txtEmail, txtSenhaCad;
    TextView txtEntrar;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.cadastro);

        btnCadastro = (Button) findViewById(R.id.btnCadastro);
        txtEmail = (EditText) findViewById(R.id.txtEmail);
        txtSenhaCad = (EditText) findViewById(R.id.txtSenhaCad);
        txtEntrar = (TextView) findViewById(R.id.txtEntrar);


        btnCadastro.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                //Cadastrar()
            }
        });// Funcção do botão Cadastrar, criando a conta.

        txtEntrar.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

            }
        });// interação com texto "Entrar" levando para a tela de Login.

        //Cadastrar()
        // efetuar a função de cadastro como classe a parte.


    }
}