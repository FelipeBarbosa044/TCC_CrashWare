package com.example.crashware.ui.config;

import static androidx.core.content.ContentProviderCompat.requireContext;

import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.example.crashware.R;
import com.example.crashware.ui.api.Auth;
import com.example.crashware.ui.login.Login;

public class Banido extends AppCompatActivity {

    Button Voltar;

    SharedPreferences prefs;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_banido);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main2), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        //SharedPreferences
        prefs = this.getSharedPreferences("CrashWare", Context.MODE_PRIVATE);

        Voltar = findViewById(R.id.btnVerificar);

        Voltar.setOnClickListener(v -> {
            // Quando clicar em Voltar
            //Dou Logout
            Auth.Logout(prefs,Banido.this);
        });

        // Recebe o motivo do banimento
        String motivo = getIntent().getStringExtra("motivo_banimento");


        TextView txtMotivo = findViewById(R.id.txtMotivoBanimento);
        TextView txtTituloMotivo = findViewById(R.id.txtTituloMotivoBanido);

        if (motivo != null && !motivo.isEmpty()) {
            //Foi Banido
            txtMotivo.setText(motivo);
            txtTituloMotivo.setVisibility(View.VISIBLE); // Mostra o Título
        } else {
            //Foi Desativado
            txtMotivo.setText("Sua conta foi Desativada.");
            txtTituloMotivo.setVisibility(View.GONE); // Esconde o Titulo
        }

    }
}