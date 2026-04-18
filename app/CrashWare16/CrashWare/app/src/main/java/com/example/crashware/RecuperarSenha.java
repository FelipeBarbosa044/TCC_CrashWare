package com.example.crashware;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.RadioButton;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

public class RecuperarSenha extends AppCompatActivity {

    Button btnRecSenha;

    RadioButton rdbEmail, rdbTelefone;

    TextView txtEntrarLembrou, txtEmailRec;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.recuperar_senha);


        //Iniciando o layout no código
        btnRecSenha       = (Button)      findViewById(R.id.btnRecSenha     );
        rdbEmail          = (RadioButton) findViewById(R.id.radioEmail      );
        rdbTelefone       = (RadioButton) findViewById(R.id.radioTelefone   );
        txtEntrarLembrou  = (TextView)    findViewById(R.id.txtEntrarLembrou);
        txtEmailRec       = (TextView)    findViewById(R.id.txtEmailRec     );


        btnRecSenha.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v)
            {
                if (rdbEmail.isChecked())
                {
                    RecEmail();
                    //enviar email de recuperação
                }

                else if (rdbTelefone.isChecked())
                {
                    RecTelefone();
                 //enviar sms de recuperação
                }

                //else if (rdbTelefone = null; rdbEmail = null;)
                //{
                    //Aparecer na tela "Por favor selecione o modo de recuperação de senha"
                //}
                RecSenha();
            }
        });// Interação de clique com o botão de recuperar senha que deverá encaminhar email ou SMS para alteração da senha cadastrada

        txtEntrarLembrou.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view)
            {
                Intent lembrou =
                        new Intent(RecuperarSenha.this, Login.class);
                startActivity(lembrou);


            }
        });









        //
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main3), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });
        //
    }

    private void RecTelefone()
    {

    }//Recuperação caso o rdb de Telefone esteja checado

    private void RecEmail()
    {

    }//Recuperação caso o rdb de email esteja checado

    private void RecSenha()
    {

    }//De algum modo, programar um envio de email ou sms
}