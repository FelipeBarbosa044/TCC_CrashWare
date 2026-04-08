package com.example.crashware;

import androidx.appcompat.app.AppCompatActivity;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;

public class RecuperarSenha extends AppCompatActivity {

    EditText  txtEmailRec;
    TextView txtEntrarLembrou;
    Button btnRecSenha ;
    ImageView imgLogo5;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.recuperar_senha);

        txtEmailRec = (EditText) findViewById(R.id.txtEmailRec);
        btnRecSenha = (Button) findViewById(R.id.btnRecSenha);
        imgLogo5 = (ImageView) findViewById(R.id.imgLogo5);
        txtEntrarLembrou = (TextView) findViewById(R.id.txtEntrarLembrou);

        btnRecSenha.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view)
            {
                RecSenha();

            }
        });// envia o email de recuperação de senha


        imgLogo5.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                //Intent home =
                //      new Intent(RecuperarSenha.this, home.class);
                //startActivity(home);
                //Pré colocação de código que vai levar pro home
            }
        });// imagem que leva de volta a home

        txtEntrarLembrou.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view)
            {
                Intent it=
                        new Intent(RecuperarSenha.this, Login.class);
                startActivity(it);

            }
        });// interação com o texto caso o usuário lembre a senha, manda para a tela de login novamente


    }//

    private void RecSenha()
    {

    }//Função para enviar email de recuperação de senha
    //deve verificar se o email existe no banco e caso sim enviar a senha provisória
}