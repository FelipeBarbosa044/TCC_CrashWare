package com.example.crashware;

import android.content.Intent;
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

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthUserCollisionException;
import com.google.firebase.auth.FirebaseAuthWeakPasswordException;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;

import java.util.HashMap;
import java.util.Map;

public class Cadastro extends AppCompatActivity {

    Button btnCadastro;

    EditText txtEmailCad, txtSenhaCad, txtConfirmarCad, txtTelCad;
    TextView txtEntrarCad;

    FirebaseAuth auth;
    DatabaseReference db;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.cadastro);

        // Iniciando o Layout
        btnCadastro     = findViewById(R.id.btnCriarConta);
        txtEmailCad     = findViewById(R.id.txtEmailCad);
        txtSenhaCad     = findViewById(R.id.txtSenhaCad);
        txtTelCad       = findViewById(R.id.txtTelCad);
        txtConfirmarCad = findViewById(R.id.txtConfirmarSenhaCad);
        txtEntrarCad    = findViewById(R.id.txtEntrarCad);

        // Iniciando Firebase
        auth = FirebaseAuth.getInstance();
        db   = FirebaseDatabase.getInstance().getReference("usuarios");

        // Botão cadastrar
        btnCadastro.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Cadastrar();
            }
        });

        // Ir para tela de login
        txtEntrarCad.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                Intent i = new Intent(Cadastro.this, Login.class);
                startActivity(i);
            }
        });

        // Ajuste de layout (EdgeToEdge)
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main2), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });
    }

    private void Cadastrar() {

        String email     = txtEmailCad.getText().toString().trim();
        String telefone  = txtTelCad.getText().toString().trim();
        String senha     = txtSenhaCad.getText().toString();
        String confirmar = txtConfirmarCad.getText().toString();

        if (email.isEmpty() || telefone.isEmpty() || senha.isEmpty()) {
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
    }
}
