package com.example.crashware;

import android.media.Image;
import android.os.Bundle;
import android.widget.Button;
import android.content.SharedPreferences;
import android.net.Uri;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;

import android.widget.EditText;
import android.widget.ImageView;
import android.widget.TextView;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;

import com.google.android.material.imageview.ShapeableImageView;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link ModuloSoftware#newInstance} factory method to
 * create an instance of this fragment.
 */
public class ModuloSoftware extends Fragment {

   private ImageView imgLivro1M1,imgLivro2M1,imgLivro1M2,imgLivro2M2,imgLivro3M2,imgLivro4M2,imgLivro5M2,imgLivro6M2,imgLivro7M2,imgLivro8M2;

   TextView txtTituloAula1M1, txtTituloAula2M1,txtTituloAula1M2,txtTituloAula2M2,txtTituloAula3M2,txtTituloAula4M2,txtTituloAula5M2,txtTituloAula6M2,txtTituloAula7M2,txtTituloAula8M2;

    // TODO: Rename parameter arguments, choose names that match
    // the fragment initialization parameters, e.g. ARG_ITEM_NUMBER
    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;



    public ModuloSoftware()
    {
        // Required empty public constructor
    }

    /**
     * Use this factory method to create a new instance of
     * this fragment using the provided parameters.
     *
     * @param param1 Parameter 1.
     * @param param2 Parameter 2.
     * @return A new instance of fragment ModuloSoftware.
     */
    // TODO: Rename and change types and number of parameters
    public static ModuloSoftware newInstance(String param1, String param2) {
        ModuloSoftware fragment = new ModuloSoftware();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
//        if (getArguments() != null) {
//            mParam1 = getArguments().getString(ARG_PARAM1);
//            mParam2 = getArguments().getString(ARG_PARAM2);
//        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState)
    {
        // Inflate the layout for this fragment

        View view = inflater.inflate(R.layout.fragment_modulo_software, container, false);

        txtTituloAula1M1 =(TextView) view.findViewById(R.id.txtTituloAula1M1);
        txtTituloAula2M1 =(TextView) view.findViewById(R.id.txtTituloAula2M1);
        txtTituloAula1M2 =(TextView) view.findViewById(R.id.txtTituloAula1M2);
        txtTituloAula2M2 =(TextView) view.findViewById(R.id.txtTituloAula2M2);
        txtTituloAula3M2 =(TextView) view.findViewById(R.id.txtTituloAula3M2);
        txtTituloAula4M2 =(TextView) view.findViewById(R.id.txtTituloAula4M2);
        txtTituloAula5M2 =(TextView) view.findViewById(R.id.txtTituloAula5M2);
        txtTituloAula6M2 =(TextView) view.findViewById(R.id.txtTituloAula6M2);
        txtTituloAula7M2 =(TextView) view.findViewById(R.id.txtTituloAula7M2);
        txtTituloAula8M2 =(TextView) view.findViewById(R.id.txtTituloAula8M2);

//        imgLivro1M1 =(android.widget.ImageView) view.findViewById(R.id.imgLivro2M2);


        txtTituloAula1M1.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View view)
            {
                Aula1m1();

            }
        });

        //
        return view;
        //

    }

    private void Aula1m1()
    {

    }
}