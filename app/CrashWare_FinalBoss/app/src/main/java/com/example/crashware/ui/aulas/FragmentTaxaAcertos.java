package com.example.crashware.ui.aulas;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Bundle;

import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;

import com.example.crashware.R;
import com.example.crashware.ui.api.User;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link FragmentTaxaAcertos#newInstance} factory method to
 * create an instance of this fragment.
 */
public class FragmentTaxaAcertos extends Fragment {

    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    ImageView imgVoltar;
    Button btnConcluirAula;
    SharedPreferences prefs;




    public FragmentTaxaAcertos() {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment FragmentTaxaAcertos.
     */
    // TODO: Rename and change types and number of parameters
    public static FragmentTaxaAcertos newInstance(String param1, String param2) {
        FragmentTaxaAcertos fragment = new FragmentTaxaAcertos();
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
        View view = inflater.inflate(R.layout.fragment_taxa_acertos, container, false);

        prefs = requireContext().getSharedPreferences("CrashWare", Context.MODE_PRIVATE);

        imgVoltar = view.findViewById(R.id.imgVoltarCampos);
        btnConcluirAula = view.findViewById(R.id.btnConcluirAula);


        imgVoltar.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v)
            {
                requireActivity()//puxa o fragment atual
                        .getSupportFragmentManager()//acessa o gerenciador das fragments
                        .popBackStack();//simula o botão "voltar" do celular
            }
        });//

        btnConcluirAula.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v)
            {
                User.Conquista(24,prefs, getActivity(), new User.ConquistasCallback()
                {
                    @Override
                    public void onSuccess()
                    {

                    }
                });
                User.Conquista(28,prefs, getActivity(), new User.ConquistasCallback()
                {
                    @Override
                    public void onSuccess()
                    {

                    }
                });
            }
        });





        return view;

    }
}