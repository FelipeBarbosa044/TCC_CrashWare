package com.example.crashware;

import android.os.Bundle;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.fragment.app.Fragment;

import com.google.android.material.bottomnavigation.BottomNavigationView;

public class Home extends AppCompatActivity {

    // Seus fragments

        private Fragment inicio    = new Inicio_fragment();
        private Fragment loja      = new Loja_fragment();
        private Fragment anotacoes = new Anotacoes_fragment();
        private Fragment salvos    = new Salvos_fragment();
        private Fragment perfil    = new Perfil_Fragment();

        private Fragment active = inicio;

        @Override
        protected void onCreate(Bundle savedInstanceState) {
            super.onCreate(savedInstanceState);
            EdgeToEdge.enable(this);
            setContentView(R.layout.home);

            BottomNavigationView menu = findViewById(R.id.NavBar);

            //Adiciona os Fragments
            getSupportFragmentManager().beginTransaction()
                    .add(R.id.fragment_container, perfil).hide(perfil)
                    .add(R.id.fragment_container, salvos).hide(salvos)
                    .add(R.id.fragment_container, anotacoes).hide(anotacoes)
                    .add(R.id.fragment_container, loja).hide(loja)
                    .add(R.id.fragment_container, inicio)
                    .commit();

            //  CLIQUE DO MENU
            menu.setOnItemSelectedListener(item -> {

                Fragment selected = null;

                if (item.getItemId() == R.id.nav_home) {
                    selected = inicio;
                } else if (item.getItemId() == R.id.nav_loja) {
                    selected = loja;
                } else if (item.getItemId() == R.id.nav_anotacoes) {
                    selected = anotacoes;
                } else if (item.getItemId() == R.id.nav_materias) {
                    selected = salvos;
                } else if (item.getItemId() == R.id.nav_perfil) {
                    selected = perfil;
                }

                if (selected != null && selected != active) {
                    getSupportFragmentManager().beginTransaction()
                            .hide(active)
                            .show(selected)
                            .commit();

                    active = selected;
                }

                return true;

            });
            //muito código eu sei, mas não é tão complicado, o fragment funciona de modo que todas as
            //telas existem ao mesmo tempo e no mesmo lugar, apenas alguns ficam ociosos e o atual é representado na tela
            // 😊 façamos o L devagar

            //
            ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.mainfragment), (v, insets) -> {
                Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
                v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
                return insets;
            });
            //
        }

}






