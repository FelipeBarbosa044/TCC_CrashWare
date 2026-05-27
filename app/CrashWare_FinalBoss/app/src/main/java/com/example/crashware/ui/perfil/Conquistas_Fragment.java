package com.example.crashware.ui.perfil;

import android.os.Bundle;

import androidx.fragment.app.Fragment;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;

import com.example.crashware.R;
import com.example.crashware.ui.Adapters.ConquistaAdapter;
import com.example.crashware.ui.Models.Conquista;

import java.util.ArrayList;
import java.util.List;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link Conquistas_Fragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class Conquistas_Fragment extends Fragment {


    RecyclerView rvConquistasAdquiridas, rvConquistasBloqueadas;

    List<Conquista> listaConquistas;
    List<Conquista> listaConquistasBloqueadas;

    ImageView imgVoltar;
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    public Conquistas_Fragment() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment Conquistas_Fragment.
     */
    // TODO: Rename and change types and number of parameters
    public static Conquistas_Fragment newInstance(String param1, String param2) {
        Conquistas_Fragment fragment = new Conquistas_Fragment();
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
        View view = inflater.inflate(R.layout.fragment_conquistas, container, false);

        imgVoltar = view.findViewById(R.id.imgVoltarCampos);
        rvConquistasAdquiridas = view.findViewById(R.id.rvConquistasAdquiridas);
        rvConquistasBloqueadas = view.findViewById(R.id.rvConquistasBloqueadas);

        imgVoltar.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View v)
            {
                //Seleciona a fragment atual
                requireActivity()
                        //Simula o Clique do botão voltar do celular
                        .getOnBackPressedDispatcher()
                        .onBackPressed();

            }
        });//Interação com imagem de voltar

        // Layout do RecyclerView
        rvConquistasAdquiridas.setLayoutManager(
                new LinearLayoutManager(getContext())
        );
        //Bloqueadas
        rvConquistasBloqueadas.setLayoutManager(new LinearLayoutManager(getContext()));


        // Criando lista
        listaConquistas = new ArrayList<>();
        listaConquistasBloqueadas = new ArrayList<>();

        // Adicionando itens
        listaConquistas.add(new Conquista(
                "Primeira Aula",
                "Complete sua primeira aula",
                R.drawable.banner_icon
        ));

        listaConquistas.add(new Conquista(
                "Programador",
                "Complete 10 exercícios",
                R.drawable.banner_icon
        ));

        listaConquistas.add(new Conquista(
                "Persistente",
                "Entre no app por 7 dias",
                R.drawable.banner_icon
        ));

        // Adapter
        ConquistaAdapter adapter = new ConquistaAdapter(listaConquistas);

        // Passando adapter
        rvConquistasAdquiridas.setAdapter(adapter);


        return view;
    }
}