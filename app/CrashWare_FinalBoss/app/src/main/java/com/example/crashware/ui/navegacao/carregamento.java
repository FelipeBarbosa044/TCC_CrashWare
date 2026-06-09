package com.example.crashware.ui.navegacao;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.ProgressBar;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;

import com.example.crashware.R;
import com.example.crashware.ui.api.Auth;
import com.example.crashware.ui.api.User;
import com.example.crashware.ui.config.ThemeConfig;

public class carregamento extends AppCompatActivity {

    private ProgressBar barra;

    private SharedPreferences prefs;

    @Override
    protected void onCreate(Bundle savedInstanceState) {


        ThemeConfig.aplicarTema(this);

        super.onCreate(savedInstanceState);

        EdgeToEdge.enable(this);

        setContentView(R.layout.carregamento);

        prefs = getSharedPreferences("CrashWare", MODE_PRIVATE);

        barra = findViewById(R.id.carregandoTela);

        barra.setProgress(10);

        iniciarCarregamento();
    }

    private void iniciarCarregamento() {

        // 30%
        barra.setProgress(30);

        Auth.verificarToken(
                this,
                prefs,
                false,
                new Auth.AuthCallback() {

                    @Override
                    public void onSuccess() {

                        barra.setProgress(100);

                    }
                }
        );
    }
}