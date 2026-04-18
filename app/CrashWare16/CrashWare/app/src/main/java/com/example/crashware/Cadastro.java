package com.example.crashware;

import android.content.Intent;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import android.text.method.HideReturnsTransformationMethod;
import android.text.method.PasswordTransformationMethod;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthUserCollisionException;
import com.google.firebase.auth.FirebaseAuthWeakPasswordException;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;

import java.util.HashMap;
import java.util.Map;

public class Cadastro extends AppCompatActivity {

    Button btnCadastro, btnEntrarCad;

    EditText txtEmailCad, txtSenhaCad, txtConfirmarCad, txtTelCad, txtNomeCad;

    ImageView imgOlhoSenha, imgOlhoConfirmar;


    FirebaseAuth auth;
    DatabaseReference db;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.cadastro);

        // Iniciando o Layout
        btnCadastro      = (Button)    findViewById(R.id.btnCriarConta       );
        txtEmailCad      = (EditText)  findViewById(R.id.txtEmailCad         );
        txtSenhaCad      = (EditText)  findViewById(R.id.txtSenhaCad         );
        txtTelCad        = (EditText)  findViewById(R.id.txtTelCad           );
        txtConfirmarCad  = (EditText)  findViewById(R.id.txtConfirmarSenhaCad);
        txtNomeCad       = (EditText)  findViewById(R.id.txtNomeCad          );
        btnEntrarCad     = (Button)    findViewById(R.id.btnEntrarCad        );
        imgOlhoSenha     = (ImageView) findViewById(R.id.imgOlho             );
        imgOlhoConfirmar = (ImageView) findViewById(R.id.imgOlho2            );

        // Iniciando Firebase
        auth = FirebaseAuth.getInstance();
        db   = FirebaseDatabase.getInstance().getReference("usuarios");

        // Botão cadastrar
        btnCadastro.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View v)
            {
                Cadastrar();
            }
        });// interação que efetua a função de cadastrar salvando os dados no banco

        // Ir para tela de login
        btnEntrarCad.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View v)
            {
                Intent entrar =
                        new Intent(Cadastro.this, Login.class);
                startActivity(entrar);
            }
        });//interação com o botão entrar que efetua intent, levando até a tela de login novamente

        imgOlhoSenha.setOnClickListener(new View.OnClickListener()
        {
            boolean visivel = false;

            @Override
            public void onClick(View v) {

                if (visivel)
                {
                    txtSenhaCad.setTransformationMethod(PasswordTransformationMethod.getInstance());
                    imgOlhoSenha.setImageResource(R.drawable.olho_icon);
                    visivel = false;
                }

                else
                {
                    txtSenhaCad.setTransformationMethod(HideReturnsTransformationMethod.getInstance());
                    imgOlhoSenha.setImageResource(R.drawable.olhofechado_icon);
                    visivel = true;
                }

                txtSenhaCad.setSelection(txtSenhaCad.getText().length());
            }
        });//click na imagem de mostrar/esconder senha,
        //seta a imagem para tal, e muda para que esconda ou mostre a senha

        imgOlhoConfirmar.setOnClickListener(new View.OnClickListener()
        {
            boolean visivel = false;

            @Override
            public void onClick(View v)
            {

                if (visivel)
                {
                    txtConfirmarCad.setTransformationMethod(PasswordTransformationMethod.getInstance());
                    imgOlhoConfirmar.setImageResource(R.drawable.olho_icon);
                    visivel = false;
                }

                else
                {
                    txtConfirmarCad.setTransformationMethod(HideReturnsTransformationMethod.getInstance());
                    imgOlhoConfirmar.setImageResource(R.drawable.olhofechado_icon);
                    visivel = true;
                }

                txtConfirmarCad.setSelection(txtConfirmarCad.getText().length());
            }
        });//click na imagem de mostrar/esconder senha,
        //seta a imagem para tal, e muda para que esconda ou mostre a senha, so que na confirmação


        // Ajuste de layout (EdgeToEdge)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main2), (v, insets) ->
        {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });//
        
    }

    private void Cadastrar() {

        String nome      = txtNomeCad.getText().toString().trim();
        String email     = txtEmailCad.getText().toString().trim();
        String telefone  = txtTelCad.getText().toString().trim();
        String senha     = txtSenhaCad.getText().toString();
        String confirmar = txtConfirmarCad.getText().toString();

        if (nome.isEmpty() || email.isEmpty() || telefone.isEmpty() || senha.isEmpty()) {
            Toast.makeText(this, "Preencha todos os campos", Toast.LENGTH_LONG).show();
            return;
        }

        if (!senha.equals(confirmar)) {
            Toast.makeText(this, "Senhas não coincidem", Toast.LENGTH_LONG).show();
            return;
        }

        auth.createUserWithEmailAndPassword(email, senha)
            .addOnSuccessListener(authResult -> {
                String uid = authResult.getUser().getUid();

                Map<String, Object> dados = new HashMap<>();
                dados.put("nome", nome);
                dados.put("email", email);
                dados.put("telefone", telefone);

                db.child(uid).setValue(dados)
                    .addOnSuccessListener(unused -> {
                        Toast.makeText(getApplicationContext(), "Cadastro realizado!", Toast.LENGTH_LONG).show();
                        Intent i = new Intent(Cadastro.this, Login.class);
                        startActivity(i);
                        finish();
                    })
                    .addOnFailureListener(e -> {
                        Toast.makeText(getApplicationContext(), "Erro ao salvar dados: " + e.getMessage(), Toast.LENGTH_LONG).show();
                    });
            })
            .addOnFailureListener(e -> {
                if (e instanceof FirebaseAuthUserCollisionException) {
                    Toast.makeText(this, "E-mail já cadastrado", Toast.LENGTH_LONG).show();
                } else if (e instanceof FirebaseAuthWeakPasswordException) {
                    Toast.makeText(this, "Senha muito fraca (mínimo 6 caracteres)", Toast.LENGTH_LONG).show();
                } else {
                    Toast.makeText(this, "Erro no cadastro: " + e.getMessage(), Toast.LENGTH_LONG).show();
                }
            });
    }//Função cadastrar que salva os dados inseridos em string e envia para o firebase

}
