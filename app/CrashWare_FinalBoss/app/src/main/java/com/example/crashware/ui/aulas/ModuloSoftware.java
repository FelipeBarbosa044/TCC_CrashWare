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

public class ModuloSoftware extends AppCompatActivity {

    TextView txtTituloAula1M1, txtTituloAula2M1,txtTituloAula1M2,txtTituloAula2M2,txtTituloAula3M2,txtTituloAula4M2,txtTituloAula5M2,txtTituloAula6M2,txtTituloAula7M2,txtTituloAula8M2;

    ImageView imgBackS,
            imgLivro1M1S, imgLivro1M2S,
            imgLivro2M1S, imgLivro2M2S, imgLivro2M3S, imgLivro2M4S,
            imgLivro2M5S, imgLivro2M6S, imgLivro2M7S, imgLivro2M8S;;
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_modulo_software);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.ModuloSoftware), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });//

        txtTituloAula1M1 = findViewById(R.id.txtTituloAula1M1S);
        txtTituloAula2M1 = findViewById(R.id.txtTituloAula2M1S);
        txtTituloAula1M2 = findViewById(R.id.txtTituloAula1M2S);
        txtTituloAula2M2 = findViewById(R.id.txtTituloAula2M2S);
        txtTituloAula3M2 = findViewById(R.id.txtTituloAula3M2S);
        txtTituloAula4M2 = findViewById(R.id.txtTituloAula4M2S);
        txtTituloAula5M2 = findViewById(R.id.txtTituloAula5M2S);
        txtTituloAula6M2 = findViewById(R.id.txtTituloAula6M2S);
        txtTituloAula7M2 = findViewById(R.id.txtTituloAula7M2S);
        txtTituloAula8M2 = findViewById(R.id.txtTituloAula8M2S);
        imgBackS         = findViewById(R.id.imgBackSoftware  );
        imgLivro1M1S     = findViewById(R.id.imgLivro1M1S     );
        imgLivro1M2S     = findViewById(R.id.imgLivro1M2S     );
        imgLivro2M1S     = findViewById(R.id.imgLivro2M1S     );
        imgLivro2M2S     = findViewById(R.id.imgLivro2M2S     );
        imgLivro2M3S     = findViewById(R.id.imgLivro2M3S     );
        imgLivro2M4S     = findViewById(R.id.imgLivro2M4S     );
        imgLivro2M5S     = findViewById(R.id.imgLivro2M5S     );
        imgLivro2M6S     = findViewById(R.id.imgLivro2M6S     );
        imgLivro2M7S     = findViewById(R.id.imgLivro2M7S     );
        imgLivro2M8S     = findViewById(R.id.imgLivro2M8S     );

        // Módulo 1
        configurarAula(imgLivro1M1S, "aula_1_m1_software");
        configurarAula(imgLivro2M1S, "aula_2_m1_software");

        // Módulo 2
        configurarAula(imgLivro1M2S, "aula_1_m2_software");
        configurarAula(imgLivro2M2S, "aula_2_m2_software");
        configurarAula(imgLivro2M3S, "aula_3_m2_software");
        configurarAula(imgLivro2M4S, "aula_4_m2_software");
        configurarAula(imgLivro2M5S, "aula_5_m2_software");
        configurarAula(imgLivro2M6S, "aula_6_m2_software");
        configurarAula(imgLivro2M7S, "aula_7_m2_software");
        configurarAula(imgLivro2M8S, "aula_8_m2_software");

        txtTituloAula1M1.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v)
            {
                Aula1M1S();
            }
        });// interação com o título da aula 1

        imgBackS.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view)
            {
                finish();

            }
        });//Interação combotão voltar que finaliza a activity atual


    }//

    private void Aula1M1S()
    {
        Intent NovaAula = new Intent(ModuloSoftware.this, ContainerSoftware.class);
        startActivity(NovaAula);

    }

    private void configurarAula(ImageView imgLivro, String chave) {
        SharedPreferences prefs = getSharedPreferences("CrashWare", MODE_PRIVATE);

        // Restaura estado salvo
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


}