package com.example.crashware.ui.aulas;

import android.os.Bundle;

import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;

import com.example.crashware.R;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link Aula#newInstance} factory method to
 * create an instance of this fragment.
 */
public class Aula extends Fragment {

    ImageView imgVoltarAula;

    Button btnFazerExercicio;

    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    public Aula() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment Aula.
     */
    // TODO: Rename and change types and number of parameters
    public static Aula newInstance(String param1, String param2) {
        Aula fragment = new Aula();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view =  inflater.inflate(R.layout.fragment_aula, container, false);

        imgVoltarAula = view.findViewById(R.id.imgVoltarCampos);
        btnFazerExercicio = view.findViewById(R.id.btnFazerExercicio);

        btnFazerExercicio.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view)
            {
                //Cria o novo caminho para fragmento
                Fragment novoFragmento = new FragmentExercicios();

                //Sobrepoe a tela do fragment para a de exercicios
                getParentFragmentManager()
                        .beginTransaction()
                        .replace(R.id.fragmentSoftware_Container, novoFragmento)
                        .addToBackStack(null)
                        .commit();


            }

            private FragmentManager getSupportFragmentManager() {
                return null;
            }
        });//interação com o botão de "Fazer Exercicios"

        imgVoltarAula.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view)
            {
                //Seleciona a fragment atual
                requireActivity()
                        //Simula o Clique do botão voltar do celular
                        .getOnBackPressedDispatcher()
                        .onBackPressed();

            }
        });//interação com a imagem de voltar






        return view;
    }
}