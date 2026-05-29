package com.example.crashware.ui.navegacao;



import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.widget.ProgressBar;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;

//
import com.example.crashware.ui.config.ThemeConfig;
//

import com.example.crashware.R;
import com.example.crashware.ui.api.Auth;
import com.example.crashware.ui.login.Login;

public class carregamento extends AppCompatActivity {

    ProgressBar Carregandotela;

    int progresso = 0 ;

    //Memória do app
    SharedPreferences prefs;

    private static final String KEY_THEME = "theme";

    @Override
    protected void onCreate(Bundle savedInstanceState)
    {
        prefs = getSharedPreferences("CrashWare", MODE_PRIVATE);


        aplicarTema();//carregando tema para o app

        super.onCreate(savedInstanceState);
        //Criando arquivo na memoria do app "CrashWare"


//        String EstadoToken = prefs.getString("EstadoToken","");

//        boolean EstadoToken = prefs.getBoolean("EstadoToken", false);








        EdgeToEdge.enable(this);
        setContentView(R.layout.carregamento);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.main), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;



        });
        Carregandotela = findViewById(R.id.carregandoTela);

        iniciarCarregamento( 300);

//        if (EstadoToken)
//        {
//
//
//        }
//        else
//        {
//            iniciarCarregamento(Login.class, 300);
//
//
//        }




    }



    private void iniciarCarregamento(int velocidade) {

        Handler handler = new Handler(Looper.getMainLooper());

        Runnable runnable = new Runnable() {
            @Override
            public void run() {

                progresso += 5;
                Carregandotela.setProgress(progresso);

                if (progresso < 30) {
                    handler.postDelayed(this, velocidade);
                } else {

                    //Verifico o token
                    Auth.verificarToken(carregamento.this,prefs,false,null);


                }
            }
        };

        handler.post(runnable);
    }

    private void aplicarTema()
    {
        String tema = prefs.getString(ThemeConfig.KEY_THEME, "claro");

        switch (tema)
        {
            case "escuro":
                setTheme(R.style.Theme_CrashWare);
                break;

            default:
                setTheme(R.style.Theme_CrashWare);
                break;
        }
    }

}