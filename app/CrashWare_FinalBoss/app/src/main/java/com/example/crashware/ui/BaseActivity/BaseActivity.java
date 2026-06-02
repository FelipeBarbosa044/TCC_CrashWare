package com.example.crashware.ui.BaseActivity;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;

import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.app.AppCompatDelegate;

import com.example.crashware.R;
import com.example.crashware.ui.api.Auth;

public class BaseActivity extends AppCompatActivity {

    protected SharedPreferences prefs;

//    public static final int TEMA_Sistema=0;
//    public static final int TEMA_Escuro=1;
//    public static final int TEMA_Claro=2;
//    public static final int TEMA_Gelo=3;
//
//    private int temaAtual;
    @Override
    protected void onCreate(Bundle savedInstanceState) {

       // aplicarTema(temaAtual);

        super.onCreate(savedInstanceState);

        //SharedPreferences
        prefs = this.getSharedPreferences("CrashWare", Context.MODE_PRIVATE);

        //SharedPreferences prefs = getSharedPreferences("TemaPrefs",MODE_PRIVATE);
        //temaAtual = prefs.getInt("temaOpcao",TEMA_Sistema);

        Auth.verificarToken(this, prefs, true, null);
    }

}
