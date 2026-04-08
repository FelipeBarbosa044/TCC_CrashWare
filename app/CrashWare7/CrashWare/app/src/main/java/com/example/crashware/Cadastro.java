package com.example.crashware;

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

public class Cadastro extends AppCompatActivity {

    Button btnCadastro;

    ImageView GoogleCad, FacebookCad;

    TextView txtEmailCad, txtSenhaCad, txtConfirmarCad, txtEntrarCad;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.cadastro);

        //Iniciando o Layout pelo código

        btnCadastro     = (Button) findViewById(R.id.btnCriarConta);
        GoogleCad       = (ImageView) findViewById(R.id.imgGoogleCad);
        FacebookCad     = (ImageView) findViewById(R.id.imgFacebookCad);
        txtEmailCad     = (TextView) findViewById(R.id.txtEmailCad);
        txtSenhaCad     = (TextView) findViewById(R.id.txtSenhaCad);
        txtEntrarCad    = (TextView) findViewById(R.id.txtEntrarCad);
        txtConfirmarCad = (TextView) findViewById(R.id.txtConfirmarSenhaCad);

        btnCadastro.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v)
            {
                //Cadastrar();
            }
        });// Interação com o botão de cadastro, realizando conexão com o banco e cadastrando a nova conta

        GoogleCad.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v)
            {
                //CadastrarGoogle();
            }
        });//Interação com o botão de cadastro, realizando conexão com o banco e cadastrando a nova conta através do google

        FacebookCad.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v)
            {
                //CadastrarFacebook();
            }
        });//Interação com o botão de cadastro, realizando conexão com o banco e cadastrando a nova conta através do facebook

        txtEntrarCad.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v)
            {
                //intent para levar a tela de login
            }
        });// interação com o texto de "já possui uma Conta?", levando a tela de login

        //
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main2), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });//

    }

    private void CadastrarFacebook()
    {

    }//função para realizar o cadastro da conta no banco através do facebook

    private void CadastrarGoogle()
    {

    }//função para realizar o cadastro da conta no banco através do google

    private void Cadastrar()
    {

    }//função que irá realizar o cadastro no app através do BD
}