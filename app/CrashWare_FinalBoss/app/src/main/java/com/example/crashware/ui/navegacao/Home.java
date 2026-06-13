package com.example.crashware.ui.navegacao;

import android.content.SharedPreferences;
import android.os.Bundle;
import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.fragment.app.Fragment;

import com.example.crashware.ui.BaseActivity.BaseActivity;
import com.example.crashware.ui.anotacoes.Anotacoes_fragment;
import com.example.crashware.ui.aulas.EscolhaTrilha_fragment;
import com.example.crashware.ui.perfil.Perfil_Fragment;
import com.example.crashware.R;
import com.google.android.material.bottomnavigation.BottomNavigationView;

public class Home extends BaseActivity {

    // Fragmentos instanciados
//    private Fragment inicio    = new Inicio_fragment();
//    private Fragment loja      = new Loja_fragment();
//    private Fragment anotacoes = new Anotacoes_fragment();
//    private Fragment aulas     = new EscolhaTrilha_fragment();
//    private Fragment perfil    = new Perfil_Fragment();
//
//    private Fragment active = inicio;

    private Fragment inicio, loja, anotacoes, aulas, perfil;
    private Fragment active;
    private Fragment fragmentAntesDaTelaExtra = null;
    private java.util.Deque<Fragment> pilhaExtras = new java.util.ArrayDeque<>();


    @Override
    protected void onCreate(Bundle savedInstanceState) {


        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.home);

        getSupportFragmentManager().addOnBackStackChangedListener(() -> {

            int backStackCount = getSupportFragmentManager().getBackStackEntryCount();

            if (!pilhaExtras.isEmpty() && backStackCount < pilhaExtras.size()) {
                // Usuário voltou de uma tela extra
                Fragment anterior = pilhaExtras.pop();

                androidx.fragment.app.FragmentTransaction tx =
                        getSupportFragmentManager().beginTransaction();

                for (Fragment f : getSupportFragmentManager().getFragments()) {
                    boolean ehNavFragment = f == inicio || f == loja ||
                            f == anotacoes || f == aulas || f == perfil;
                    if (!ehNavFragment && !f.isHidden()) {
                        tx.hide(f);
                    }
                }

                tx.show(anterior).commit();
                active = anterior;

            } else if (pilhaExtras.isEmpty() && backStackCount == 0) {
                // Fallback navbar
                Fragment[] navFragments = {inicio, loja, anotacoes, aulas, perfil};
                for (Fragment f : navFragments) {
                    if (f != null && !f.isHidden()) {
                        active = f;
                        break;
                    }
                }
            }
        });

        BottomNavigationView menu = findViewById(R.id.NavBar);

        if (savedInstanceState == null) {

            inicio    = new Inicio_fragment();
            loja      = new Loja_fragment();
            anotacoes = new Anotacoes_fragment();
            aulas     = new EscolhaTrilha_fragment();
            perfil    = new Perfil_Fragment();
            active    = inicio;


            getSupportFragmentManager().beginTransaction()
                    .add(R.id.fragment_container, perfil, "perfil").hide(perfil)
                    .add(R.id.fragment_container, aulas, "aulas").hide(aulas)
                    .add(R.id.fragment_container, anotacoes, "anotacoes").hide(anotacoes)
                    .add(R.id.fragment_container, loja, "loja").hide(loja)
                    .add(R.id.fragment_container, inicio, "inicio")
                    .commit();

        }

        else
        {

            inicio    = getSupportFragmentManager().findFragmentByTag("inicio");
            loja      = getSupportFragmentManager().findFragmentByTag("loja");
            anotacoes = getSupportFragmentManager().findFragmentByTag("anotacoes");
            aulas     = getSupportFragmentManager().findFragmentByTag("aulas");
            perfil    = getSupportFragmentManager().findFragmentByTag("perfil");

            Fragment[] navFragments = {inicio, loja, anotacoes, aulas, perfil};
            for (Fragment f : navFragments)
            {
                if (f != null && !f.isHidden())
                {
                    active = f;
                    break;
                }
            }
        }



        // Configuração do clique no menu
        menu.setOnItemSelectedListener(item -> {
            Fragment selected = null;

            int id = item.getItemId();
            if (id == R.id.nav_home)          selected = inicio;
            else if (id == R.id.nav_loja)     selected = loja;
            else if (id == R.id.nav_anotacoes) selected = anotacoes;
            else if (id == R.id.nav_materias) selected = aulas;
            else if (id == R.id.nav_perfil)   selected = perfil;

            if (selected != null && selected != active)
            {
                // Limpa a pilha ANTES do pop para o listener não agir
                pilhaExtras.clear();

                if (getSupportFragmentManager().getBackStackEntryCount() > 0) {
                    getSupportFragmentManager().popBackStackImmediate(
                            null,
                            androidx.fragment.app.FragmentManager.POP_BACK_STACK_INCLUSIVE
                    );
                }

                getSupportFragmentManager().beginTransaction()
                        .hide(active)
                        .show(selected)
                        .commit();

                active = selected;
            }
            return true;
        });

        // Define o item selecionado inicialmente
        if (savedInstanceState == null)
        {
            menu.setSelectedItemId(R.id.nav_home);
        }

        // AJUSTE DO PADDING -> Para arrumar o erro anterior
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.mainfragment), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());

            // Aplicamos padding apenas no topo (status bar) e laterais.
            // O "bottom" fica 0 para a Navbar encostar no fim da tela.
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, 0);

            return insets;
        });
    }

    public void irParaTelaExtra(Fragment novoFragmento) {
        String tag = novoFragmento.getClass().getSimpleName();
        Fragment existente = getSupportFragmentManager().findFragmentByTag(tag);

        pilhaExtras.push(active); // ← empilha quem estava ativo

        if (existente != null) {
            getSupportFragmentManager().beginTransaction()
                    .hide(active)
                    .show(existente)
                    .addToBackStack(null)
                    .commit();
            active = existente;
        } else {
            getSupportFragmentManager().beginTransaction()
                    .hide(active)
                    .add(R.id.fragment_container, novoFragmento, tag)
                    .addToBackStack(null)
                    .commit();
            active = novoFragmento;
        }
    }
}