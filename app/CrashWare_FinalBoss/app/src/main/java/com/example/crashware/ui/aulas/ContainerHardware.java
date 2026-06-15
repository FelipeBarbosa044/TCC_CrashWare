package com.example.crashware.ui.aulas;

import android.os.Bundle;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;
import androidx.core.graphics.Insets;
import androidx.core.view.ViewCompat;
import androidx.core.view.WindowInsetsCompat;
import androidx.fragment.app.Fragment;

import com.example.crashware.R;

public class ContainerHardware extends AppCompatActivity {

    private Fragment Aula1Hardware    = new Aula_fragment();

    private Fragment Exercicios = new FragmentExercicios();


    @Override
    protected void onCreate(Bundle savedInstanceState)

    {
        super.onCreate(savedInstanceState);
        EdgeToEdge.enable(this);
        setContentView(R.layout.activity_container_hardware);
        ViewCompat.setOnApplyWindowInsetsListener(findViewById(R.id.fragmentHardware_Container), (v, insets) -> {
            Insets systemBars = insets.getInsets(WindowInsetsCompat.Type.systemBars());
            v.setPadding(systemBars.left, systemBars.top, systemBars.right, systemBars.bottom);
            return insets;
        });//


        if (savedInstanceState == null)
        {
            getSupportFragmentManager().beginTransaction()
                    .replace(R.id.fragmentSoftware_Container, Aula1Hardware)
                    .commit();
        }



    }








}