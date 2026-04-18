package com.example.crashware;

import android.content.Intent;
import android.os.Bundle;


import androidx.fragment.app.Fragment;



import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link Aulas_fragment#newInstance} factory method to
 * create an instance of this fragment.
 */
public class Aulas_fragment extends Fragment
{
    Button btnExplorarH, btnExplorarS;



    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    public Aulas_fragment()
    {
        // Required empty public constructor
    }




    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment Salvos.
     */
    // TODO: Rename and change types and number of parameters
    public static Aulas_fragment newInstance(String param1, String param2) {



        Aulas_fragment fragment = new Aulas_fragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState)
    {
        super.onCreate(savedInstanceState);


        if (getArguments() != null)
        {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState)
    {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_aulas, container, false);




        btnExplorarH = view.findViewById(R.id.btnExplorarH);
        btnExplorarS = view.findViewById(R.id.btnExplorarS);


        btnExplorarS.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View v)
            {
                Fragment fragment = new ModuloSoftware();

                requireActivity().getSupportFragmentManager()
                        .beginTransaction()
                        .replace(R.id.fragment_container, fragment)
                        .addToBackStack(null)
                        .commit();
            }
        });// função do botão que vai levar para as aulas de software

        btnExplorarH.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View v)
            {

                Fragment fragment = new ModuloHardware();

                requireActivity().getSupportFragmentManager()
                        .beginTransaction()
                        .replace(R.id.fragment_container, fragment)
                        .addToBackStack(null)
                        .commit();

            }
        });// função do botão que vai levar para as aulas de hardware

        return view;
        //necessário para executar tudo e mostrar na tela



    }
}