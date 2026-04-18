package com.example.crashware;

import android.content.Intent;
import android.net.Uri;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.TextView;

import androidx.activity.result.ActivityResultLauncher;
import androidx.activity.result.contract.ActivityResultContracts;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.fragment.app.Fragment;

import com.google.android.material.imageview.ShapeableImageView;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.database.DataSnapshot;
import com.google.firebase.database.DatabaseError;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

public class Inicio_fragment extends Fragment {

    private TextView txtNomeInicio;
    private ShapeableImageView imgfotoInicio;

    private ActivityResultLauncher<String[]> escolherImagem;

    private FirebaseAuth auth;
    private DatabaseReference db;

    private ValueEventListener nomeListener;



    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        auth = FirebaseAuth.getInstance();
        db = FirebaseDatabase.getInstance().getReference("usuarios");

        escolherImagem = registerForActivityResult(
                new ActivityResultContracts.OpenDocument(),
                uri -> {
                    if (uri == null || !isAdded()) return;

                    requireContext().getContentResolver().takePersistableUriPermission(
                            uri,
                            Intent.FLAG_GRANT_READ_URI_PERMISSION
                    );

                    setImage(uri);
                }
        );//função que salva a imagem escolhida para a variavel "uri"

    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container,
                             Bundle savedInstanceState) {

        //variável que torna possivel utilizar elementos do design no código
        View view = inflater.inflate(R.layout.fragment_inicio, container, false);

        //iniciando os elementos através do view
        txtNomeInicio = view.findViewById(R.id.txtNomeInicio);
        imgfotoInicio = view.findViewById(R.id.imgFotoInicio);

        //funções que vão ser utilizadas
        carregarNomeFirebase();
        carregarImagemLocal();


        imgfotoInicio.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view)
            {
                escolherImagem.launch(new String[]{"image/*"});
            }
        });//interação com a foto de inicio, alterando e executando a foto escolhida como atual


        // retorna váriavel que mostra a tela do fragmento
        return view;
        //


    }



    //função que
    private void setImage(Uri uri) {
        if (!isAdded()) return;

        imgfotoInicio.setImageURI(uri);

        // salva apenas enquanto app estiver instalado (persistente do Android)
        requireContext().getContentResolver().takePersistableUriPermission(
                uri,
                Intent.FLAG_GRANT_READ_URI_PERMISSION
        );

        getContext()
                .getSharedPreferences("perfil", 0)
                .edit()
                .putString("fotoPerfil", uri.toString())
                .apply();
    }

    private void carregarImagemLocal() {
        if (!isAdded()) return;

        String uriString = requireContext()
                .getSharedPreferences("perfil", 0)
                .getString("fotoPerfil", null);

        if (uriString != null) {
            try {
                imgfotoInicio.setImageURI(Uri.parse(uriString));
            } catch (Exception ignored) {
                // se falhar, apenas ignora
            }
        }
    }

    // =========================
    // FIREBASE (NOME)
    // =========================

    private void carregarNomeFirebase() {
        if (auth.getCurrentUser() == null) return;

        String uid = auth.getCurrentUser().getUid();

        nomeListener = new ValueEventListener() {
            @Override
            public void onDataChange(@NonNull DataSnapshot snapshot) {
                if (!isAdded()) return;

                if (snapshot.exists()) {
                    String nome = snapshot.child("nome").getValue(String.class);
                    txtNomeInicio.setText(nome != null ? nome : "Sem nome");
                }
            }

            @Override
            public void onCancelled(@NonNull DatabaseError error) {
                if (isAdded()) {
                    txtNomeInicio.setText("Erro");
                }
            }
        };

        db.child(uid).addValueEventListener(nomeListener);
    }

    // =========================
    // CLEANUP
    // =========================

    @Override
    public void onDestroyView() {
        super.onDestroyView();

        if (auth.getCurrentUser() != null && nomeListener != null) {
            db.child(auth.getCurrentUser().getUid())
                    .removeEventListener(nomeListener);
        }

        txtNomeInicio = null;
        imgfotoInicio = null;
    }
}