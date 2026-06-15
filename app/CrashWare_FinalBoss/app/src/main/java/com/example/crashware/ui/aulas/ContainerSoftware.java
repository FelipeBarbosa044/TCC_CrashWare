package com.example.crashware.ui.aulas;

import android.os.Bundle;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.fragment.app.Fragment;

import com.example.crashware.R;


public class ContainerSoftware extends AppCompatActivity {

    private Fragment Aula1Software    = new Aula_fragment();

    private Fragment Exercicio = new FragmentExercicios();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_container_software);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.fragmentSoftware_Container), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });

        if (savedInstanceState == null)
        {
            getSupportFragmentManager().beginTransaction()
                    .replace(R.id.fragmentSoftware_Container, Aula1Software)
                    .commit();
        }









    }
    public void irParaFragment(Fragment novoFragmento) {
        String tag = novoFragmento.getClass().getSimpleName();
        Fragment existente = getSupportFragmentManager().findFragmentByTag(tag);

        if (existente != null) {
            getSupportFragmentManager().beginTransaction()
                    .replace(R.id.fragmentSoftware_Container, existente, tag)
                    .addToBackStack(null)
                    .commit();
        }
        else {
            getSupportFragmentManager().beginTransaction()
                    .replace(R.id.fragmentSoftware_Container, novoFragmento, tag)
                    .addToBackStack(null)
                    .commit();
        }
    }
}