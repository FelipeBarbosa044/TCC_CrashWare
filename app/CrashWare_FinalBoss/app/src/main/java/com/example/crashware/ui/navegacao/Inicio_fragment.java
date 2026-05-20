package com.example.crashware.ui.navegacao;

import android.app.Dialog;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import androidx.constraintlayout.widget.ConstraintLayout;
import androidx.fragment.app.Fragment;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.engine.DiskCacheStrategy;
import com.example.crashware.R;
import com.example.crashware.ui.api.Auth;
import com.example.crashware.ui.api.User;
import com.example.crashware.ui.aulas.ModuloHardware;
import com.example.crashware.ui.aulas.ModuloSoftware;
import com.example.crashware.ui.sistemas.Ofensiva_Manager;
import com.google.android.material.bottomsheet.BottomSheetDialog;
import com.google.android.material.imageview.ShapeableImageView;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.database.DatabaseReference;
import com.google.firebase.database.FirebaseDatabase;
import com.google.firebase.database.ValueEventListener;

import android.animation.ObjectAnimator;
import android.view.animation.DecelerateInterpolator;
import android.animation.ValueAnimator;

import com.example.crashware.ui.sistemas.XP_Manager;


public class Inicio_fragment extends Fragment {

    //Iniciando as váriaveis, Objetos e funções que vão ser utilizadas
    private SharedPreferences.OnSharedPreferenceChangeListener listenerFoto;

    private TextView txtNomeInicio, txtAulasConcluidas, txtOfensiva, txtNivelInicio, txtXpInicio;
    private ShapeableImageView imgfotoInicio;
    ImageView imgNotificacoes;

    private FirebaseAuth auth;
    private DatabaseReference db;

    private ValueEventListener nomeListener;

    ProgressBar BarraProgressoNivel;

    ConstraintLayout btnRetomarS, btnRetomarH;

    // Memória do app
    SharedPreferences prefs;

    Button btnRetomar;

    XP_Manager XP_Manager;

    // =========================
    // OFENSIVA
    // =========================

    private static final String KEY_OFENSIVA = "ofensiva";
    private static final String KEY_ULTIMO_DIA = "ultimo_dia";

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);

        prefs = requireContext().getSharedPreferences("CrashWare", Context.MODE_PRIVATE);


        // Coleto as informações do usuário
        Perfil();

        //Adiciono a conquista de login
        PrimeiroLogin();

        XP_Manager = new XP_Manager(requireContext());


        auth = FirebaseAuth.getInstance();
        db = FirebaseDatabase.getInstance().getReference("usuarios");
    }

    @Nullable
    @Override
    public View onCreateView(@NonNull LayoutInflater inflater,
                             ViewGroup container,
                             Bundle savedInstanceState) {

        // variável que torna possível utilizar elementos do design no código
        View view = inflater.inflate(R.layout.fragment_inicio, container, false);

        // iniciando os elementos através do view
        txtNomeInicio       = view.findViewById(R.id.txtNomeInicio           );
        imgfotoInicio       = view.findViewById(R.id.imgFotoInicio           );
        txtAulasConcluidas  = view.findViewById(R.id.txtNumeroAulasConcluidas);
        txtOfensiva         = view.findViewById(R.id.txtDiasConsecutivos     );
        btnRetomarH         = view.findViewById(R.id.btnRetomarH             );
        btnRetomarS         = view.findViewById(R.id.btnRetomarS             );
        txtNivelInicio      = view.findViewById(R.id.txtNivelInicio          );
        BarraProgressoNivel = view.findViewById(R.id.BarraProgressoAula      );
        btnRetomar          = view.findViewById(R.id.btnRetomar              );
        txtXpInicio         = view.findViewById(R.id.txtXPInicio             );
        imgNotificacoes     = view.findViewById(R.id.layoutSino              );

        // Atualiza a interface de XP e nível
        atualizarInterfaceXp();


        //Chamar função Ofensiva
        Ofensiva_Manager ofensivaManager =
                new Ofensiva_Manager(requireContext());

        int ofensiva = ofensivaManager.verificarOfensiva();

        txtOfensiva.setText(ofensiva + " dias");




        // Listener da foto
        listenerFoto = new SharedPreferences.OnSharedPreferenceChangeListener() {
            @Override
            public void onSharedPreferenceChanged(SharedPreferences sharedPreferences, String key) {

                if (key.equals("foto")) {
                    carregarImagem();
                }
            }
        };

        prefs.registerOnSharedPreferenceChangeListener(listenerFoto);

        btnRetomar.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view)
            {
                XP_Manager.adicionarXp(50);

                atualizarInterfaceXp();
            }
        });

        btnRetomarS.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                Intent Software = new Intent(getActivity(), ModuloSoftware.class);
                startActivity(Software);
            }
        });

        btnRetomarH.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {

                Intent Hardware = new Intent(getActivity(), ModuloHardware.class);
                startActivity(Hardware);
            }
        });

        imgNotificacoes.setOnClickListener(new View.OnClickListener()
        {
            @Override
            public void onClick(View v)
            {
                BottomSheetDialog dialog = new BottomSheetDialog(requireContext());

                dialog.setContentView(R.layout.dialog_notificacoes);

                dialog.show();
            }
        });//Interação com imagem de notificações

        return view;
    }

    @Override
    public void onResume() {
        super.onResume();

        Perfil();
    }

    // =========================
    // XP / NÍVEL
    // =========================

    private void atualizarInterfaceXp()
    {
        int nivel = XP_Manager.getNivel();

        int xp = (int) XP_Manager.getXp();

        txtNivelInicio.setText("Nível " + nivel);

        // Animação da Barra de XP
        ObjectAnimator animacaoBarra = ObjectAnimator.ofInt
                (
                BarraProgressoNivel,
                "progress",
                BarraProgressoNivel.getProgress(),
                xp
                );

        animacaoBarra.setDuration(700);

        animacaoBarra.setInterpolator(new DecelerateInterpolator());

        animacaoBarra.start();


        // Animação para o texto de XP
        ValueAnimator animacaoTexto = ValueAnimator.ofInt(
                Integer.parseInt(
                        txtXpInicio.getText()
                                .toString()
                                .split("/")[0]
                                .replace(" XP", "")
                ),
                xp
        );

        animacaoTexto.setDuration(700);

        animacaoTexto.addUpdateListener(animation -> {

            int valorAtual = (int) animation.getAnimatedValue();

            txtXpInicio.setText(valorAtual + "/" + BarraProgressoNivel.getMax() + " XP");
        });

        animacaoTexto.start();
    }//


    // =========================
    // TOKEN
    // =========================






    // =========================
    // PERFIL
    // =========================

    private void Perfil() {

        //Verifico o token
        Auth.verificarToken(requireActivity(), prefs, true, new Auth.AuthCallback() {

            @Override
            public void onSuccess() {


                //Se token for valido executo a requisição
                User.Perfil(requireContext(), prefs, new User.PerfilCallback() {

                    @Override
                    public void sucesso(User.PerfilResponse usuario) {

                        String nome = usuario.nome;

                        String banner = usuario.banner;

                        Integer moedas = usuario.moedas;
                        Float xp = usuario.xp;


                        String foto = usuario.foto;

                        // Salvo os dados no SharedPreferences
                        prefs.edit()
                                .putString("foto", foto)
                                .putString("nome", nome)
                                .putString("banner",banner)
                                .putInt("moedas",moedas)
                                .putFloat("xp",xp)
                                .putInt("nivel", XP_Manager.getNivel())

                                .commit();

                        // Link da foto
                        String link_foto =
                                "https://yegrosiecwjebeetlwwg.supabase.co/storage/v1/object/public/FOTOS/"
                                        + foto
                                        + "?t=" + System.currentTimeMillis();

                        // Carrega foto
                        Glide.with(requireContext())
                                .load(link_foto)
                                .skipMemoryCache(true)
                                .diskCacheStrategy(DiskCacheStrategy.NONE)
                                .into(imgfotoInicio);

                        // Atualiza nome
                        txtNomeInicio.setText(nome);
                    }
                });//Perfil

            }//
        });//Token



    }//Perfil


    private void PrimeiroLogin() {
        //Conquista do primeiro login


        Boolean PrimeiroLogin = prefs.getBoolean("PrimeiroLogin",false);

        if(PrimeiroLogin == true)
        {
            User.Conquista(9,prefs,requireContext());
        }


    }

    // =========================
    // CARREGAR IMAGEM
    // =========================

    private void carregarImagem()
    {

        if (!isAdded()) return;

        String fotoPerfil = prefs.getString("foto", null);

        String link_foto =
                "https://yegrosiecwjebeetlwwg.supabase.co/storage/v1/object/public/FOTOS/"
                        + fotoPerfil
                        + "?t=" + System.currentTimeMillis();

        Glide.with(requireContext())
                .load(link_foto)
                .skipMemoryCache(true)
                .diskCacheStrategy(DiskCacheStrategy.NONE)
                .into(imgfotoInicio);
    }

    // =========================
    // CLEANUP
    // =========================

    @Override
    public void onDestroyView() {

        super.onDestroyView();

        if (prefs != null && listenerFoto != null) {
            prefs.unregisterOnSharedPreferenceChangeListener(listenerFoto);
        }
    }
}