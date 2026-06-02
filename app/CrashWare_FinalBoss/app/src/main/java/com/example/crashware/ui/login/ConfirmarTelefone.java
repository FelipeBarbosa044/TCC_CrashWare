package com.example.crashware.ui.login;

import static android.widget.Toast.LENGTH_LONG;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.example.crashware.R;
import com.example.crashware.ui.api.Configuracoes;

public class ConfirmarTelefone extends AppCompatActivity {

    EditText txtCodigoTel;
    TextView txtTel;

    Button btnVerificar, btnReceber;

    SharedPreferences prefs;

    String telefone, emailUsuario;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_confirmar_telefone);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main2), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        prefs = this.getSharedPreferences("CrashWare", Context.MODE_PRIVATE);


        //Pego os valores de outra tela
        telefone = getIntent().getStringExtra("telefoneUsuario");
        emailUsuario = getIntent().getStringExtra("emailUsuario");


        txtTel = findViewById(R.id.txtConfirmarNumero);
        txtCodigoTel = findViewById(R.id.txtCodigoVerificacao);
        btnReceber = findViewById(R.id.btnReceber);
        btnVerificar = findViewById(R.id.btnVerificar);

        Toast CodIncorreto = Toast.makeText(this,"Código Incorreto! Tente novamente",LENGTH_LONG);
        Toast Preencha = Toast.makeText(this,"Preencha o código",LENGTH_LONG);


        txtTel.setText(telefone);

        String CodigoTel = txtCodigoTel.getText().toString().trim();

        btnVerificar.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v)
            {
                if (CodigoTel.isEmpty())
                {
                    Preencha.show();

                }

                else
                {
                    //Chamo o metodo de verificar sms


                }

            }
        });//

        btnReceber.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v)
            {

                Toast.makeText(ConfirmarTelefone.this, "Enviando SMS...", Toast.LENGTH_LONG).show();

                //Chamo o metodo de Enviar SMS
                Configuracoes.Enviar_SMS(telefone,emailUsuario,prefs,ConfirmarTelefone.this);
            }
        });//



    }
}