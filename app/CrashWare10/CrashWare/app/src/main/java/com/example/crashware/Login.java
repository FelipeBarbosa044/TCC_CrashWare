package com.example.crashware;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthInvalidCredentialsException;
import com.google.firebase.auth.FirebaseAuthInvalidUserException;

public class Login extends AppCompatActivity {

    Button btnEntrar, btnCadLogin;
    ImageView imgOlho;

    EditText txtEmailLogin, txtSenhaLogin;
    TextView txtEsqueceu;

    FirebaseAuth auth;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.login);

        //  Iniciando layout
        btnEntrar     = findViewById(R.id.btnEntrar);
        btnCadLogin   = findViewById(R.id.btnCadLogin);
        imgOlho       = findViewById(R.id.imgOlho);
        txtEsqueceu   = findViewById(R.id.txtEsqueceu);
        txtEmailLogin = findViewById(R.id.txtEmailLogin);
        txtSenhaLogin = findViewById(R.id.txtSenhaLogin);

        // Iniciando Firebase
        auth = FirebaseAuth.getInstance();

        //  Botão entrar
        btnEntrar.setOnClickListener(v -> Logar());

        //  Ir para cadastro
        btnCadLogin.setOnClickListener(v -> {
            Intent i = new Intent(Login.this, Cadastro.class);
            startActivity(i);
        });

        //  Esqueceu senha
        txtEsqueceu.setOnClickListener(v -> {
            Intent i = new Intent(Login.this, Cadastro.class);
            startActivity(i);
        });

        // INSETS (EVITA CORTAR TELA) NÃO SE ATREVA A MEXER, SUJEITO A PAULADA
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });
    }

    private void Logar() {

        String email = txtEmailLogin.getText().toString().trim();
        String senha = txtSenhaLogin.getText().toString();

        if (email.isEmpty() || senha.isEmpty()) {
            Toast.makeText(this, "Preencha os campos", Toast.LENGTH_LONG).show();
            return;
        }

        auth.signInWithEmailAndPassword(email, senha)
            .addOnSuccessListener(authResult -> {
                Toast.makeText(getApplicationContext(), "Login realizado!", Toast.LENGTH_LONG).show();
                Intent i = new Intent(Login.this, Home.class);
                startActivity(i);
                finish();
            })
            .addOnFailureListener(e -> {
                if (e instanceof FirebaseAuthInvalidCredentialsException) {
                    Toast.makeText(this, "Senha incorreta", Toast.LENGTH_LONG).show();
                } else if (e instanceof FirebaseAuthInvalidUserException) {
                    Toast.makeText(this, "Usuário não encontrado", Toast.LENGTH_LONG).show();
                } else {
                    Toast.makeText(this, "Erro: " + e.getMessage(), Toast.LENGTH_LONG).show();
                }
            });
    }
}
