package com.example.CrashWare;

import androidx.appcompat.app.AppCompatActivity;

import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;

public class RecuperarSenha extends AppCompatActivity {

    EditText  txtEmailRec;
    Button btnRecSenha ;
    ImageView imgLogo5;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.rescuperarenha);

        txtEmailRec = (EditText) findViewById(R.id.txtEmailRec);
        btnRecSenha = (Button) findViewById(R.id.btnRecSenha);
        imgLogo5 = (ImageView) findViewById(R.id.imgLogo5);


        btnRecSenha.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view)
            {
             //RecuperarSenha()

            }
        });// envia o email de recuperação de senha


        imgLogo5.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

            }
        });// imagem que leva de volta a home
    }
}