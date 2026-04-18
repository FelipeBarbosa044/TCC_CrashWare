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

    // Fragmentos instanciados
    private Fragment inicio    = new Inicio_fragment();
    private Fragment loja      = new Loja_fragment();
    private Fragment anotacoes = new Anotacoes_fragment();
    private Fragment aulas     = new Aulas_fragment();
    private Fragment perfil    = new Perfil_Fragment();



    private Fragment active = inicio;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.home);

        BottomNavigationView menu = findViewById(R.id.NavBar);

        // Inicializa os Fragmentos escondidos e mostra apenas o "inicio"
        getSupportFragmentManager().beginTransaction()
                .add(R.id.fragment_container, perfil).hide(perfil)
                .add(R.id.fragment_container, aulas).hide(aulas)
                .add(R.id.fragment_container, anotacoes).hide(anotacoes)
                .add(R.id.fragment_container, loja).hide(loja)
                .add(R.id.fragment_container, inicio)
                .commit();

        // Configuração do clique no menu
        menu.setOnItemSelectedListener(item -> {
            Fragment selected = null;

            int id = item.getItemId();
            if (id == R.id.nav_home) {
                selected = inicio;
            } else if (id == R.id.nav_loja) {
                selected = loja;
            } else if (id == R.id.nav_anotacoes) {
                selected = anotacoes;
            } else if (id == R.id.nav_materias) {
                selected = aulas;
            } else if (id == R.id.nav_perfil) {
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

        // Define o item selecionado inicialmente
        menu.setSelectedItemId(R.id.nav_home);

        // AJUSTE DO PADDING -> Para arrumar o erro anterior
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.mainfragment), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());

            // Aplicamos padding apenas no topo (status bar) e laterais.
            // O "bottom" fica 0 para a Navbar encostar no fim da tela.
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, 0);

            return insets;
        });
    }
}