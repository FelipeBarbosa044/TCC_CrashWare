package com.example.crashware.ui.aulas;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.View;
import android.widget.ImageView;
import android.widget.TextView;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

import com.example.crashware.R;

public class ModuloHardware extends AppCompatActivity {

    ImageView imgVoltarH,
            imgLivro1M1H, imgLivro1M2H, imgLivro2M1H, imgLivro2M2H, imgLivro2M3H, imgLivro2M4H, imgLivro3M1H, imgLivro3M2H, imgLivro3M3H, imgLivro3M4H, imgLivro3M5H;

    TextView txtTituloAula1M1H, txtTituloAula2M1H,txtTituloAula1M2H,txtTituloAula2M2H,txtTituloAula3M2H,txtTituloAula4M2H,
            txtTituloAula1M3H,txtTituloAula2M3H,txtTituloAula3M3H, txtTituloAula4M3H, txtTituloAula5M3H, txtTituloAula6M3H;


    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_modulo_hardware);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.ModuloHardware), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });//

        txtTituloAula1M1H = findViewById(R.id.txtTituloAula1M1H);
        txtTituloAula2M1H = findViewById(R.id.txtTituloAula2M1H);
        txtTituloAula1M2H = findViewById(R.id.txtTituloAula1M2H);
        txtTituloAula2M2H = findViewById(R.id.txtTituloAula2M2H);
        txtTituloAula3M2H = findViewById(R.id.txtTituloAula3M2H);
        txtTituloAula4M2H = findViewById(R.id.txtTituloAula4M2H);
        txtTituloAula1M3H = findViewById(R.id.txtTituloAula1M3H);
        txtTituloAula2M3H = findViewById(R.id.txtTituloAula2M3H);
        txtTituloAula3M3H = findViewById(R.id.txtTituloAula3M3H);
        txtTituloAula4M3H = findViewById(R.id.txtTituloAula4M3H);
        txtTituloAula5M3H = findViewById(R.id.txtTituloAula5M3H);
        txtTituloAula6M3H = findViewById(R.id.txtTituloAula6M3H);
        imgVoltarH        = findViewById(R.id.imgVoltarH       );
        imgLivro1M1H      = findViewById(R.id.imgLivro1M1H     );
        imgLivro1M2H      = findViewById(R.id.imgLivro1M2H     );
        imgLivro2M1H      = findViewById(R.id.imgLivro2M1H     );
        imgLivro2M2H      = findViewById(R.id.imgLivro2M2H     );
        imgLivro2M3H      = findViewById(R.id.imgLivro2M3H     );
        imgLivro2M4H      = findViewById(R.id.imgLivro2M4H     );
        imgLivro3M1H      = findViewById(R.id.imgLivro3M1H     );
        imgLivro3M2H      = findViewById(R.id.imgLivro3M2H     );
        imgLivro3M3H      = findViewById(R.id.imgLivro3M3H     );
        imgLivro3M4H      = findViewById(R.id.imgLivro3M4H     );
        imgLivro3M5H      = findViewById(R.id.imgLivro3M5H     );

        // Módulo 1
        configurarAula(imgLivro1M1H, "aula_1_m1_hardware");
        configurarAula(imgLivro1M2H, "aula_2_m1_hardware");

        // Módulo 2
        configurarAula(imgLivro2M1H, "aula_1_m2_hardware");
        configurarAula(imgLivro2M2H, "aula_2_m2_hardware");
        configurarAula(imgLivro2M3H, "aula_3_m2_hardware");
        configurarAula(imgLivro2M4H, "aula_4_m2_hardware");


        // Módulo 3
        configurarAula(imgLivro3M1H, "aula_1_m3_hardware");
        configurarAula(imgLivro3M2H, "aula_2_m3_hardware");
        configurarAula(imgLivro3M3H, "aula_3_m3_hardware");
        configurarAula(imgLivro3M4H, "aula_4_m3_hardware");
        configurarAula(imgLivro3M5H, "aula_5_m3_hardware");


        imgVoltarH.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view)
            {
                finish();

            }
        });//

        txtTituloAula1M1H.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v)
            {
                Aula1M1H();
            }
        });//


    }

    private void configurarAula(ImageView imgLivro, String chave) {

        SharedPreferences prefs = getSharedPreferences("CrashWare", MODE_PRIVATE);

        // Restaura o estado salvo ao abrir a tela
        if (prefs.getBoolean(chave, false)) {
            imgLivro.setImageResource(R.drawable.aulaconcluida_icon);
        }

        // Alterna ao clicar
        imgLivro.setOnClickListener(v -> {
            boolean concluida = prefs.getBoolean(chave, false);

            if (!concluida) {
                imgLivro.setImageResource(R.drawable.aulaconcluida_icon);
                prefs.edit().putBoolean(chave, true).apply();
            } else {
                imgLivro.setImageResource(R.drawable.aulaassistir_icon);
                prefs.edit().putBoolean(chave, false).apply();
            }
        });
    }
    private void Aula1M1H()
    {
        Intent NovaAula = new Intent(ModuloHardware.this, ContainerHardware.class);
        startActivity(NovaAula);

    }



}