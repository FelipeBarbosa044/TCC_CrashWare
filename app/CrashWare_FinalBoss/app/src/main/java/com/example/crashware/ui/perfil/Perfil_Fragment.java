package com.example.crashware.ui.perfil;

import android.content.Context;
import android.content.SharedPreferences;
import android.net.Uri;
import android.os.Bundle;

import androidx.activity.result.ActivityResultLauncher;
import androidx.fragment.app.Fragment;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;
import android.widget.Toast;

import com.example.crashware.ui.sistemas.XP_Manager;

import com.bumptech.glide.Glide;
import com.bumptech.glide.load.engine.DiskCacheStrategy;
import com.example.crashware.R;
import com.example.crashware.ui.api.Auth;
import com.example.crashware.ui.api.User;
import com.google.android.material.imageview.ShapeableImageView;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.database.DatabaseReference;
import androidx.activity.result.contract.ActivityResultContracts;

public class Perfil_Fragment extends Fragment {

    //Objetos que vão ser utilizados
    private SharedPreferences.OnSharedPreferenceChangeListener listenerFoto;

    private SharedPreferences.OnSharedPreferenceChangeListener listenerBanner;
    TextView txtNomePerfil, txtQuantXP, txtPatente, txtVerTodasConquistas, txtNivelPerfil, txtQuantGemas;

    ImageView imgConfigPerfil;

    ShapeableImageView imgFotoPerfil, imgBanner;

    ProgressBar BarraProgressoPerfil;

    XP_Manager XP_Manager;

    private ActivityResultLauncher<String[]> escolherFoto;

    private ActivityResultLauncher<String[]> escolherBanner;

    //Memória do app
    SharedPreferences prefs;

    private FirebaseAuth auth;
    private DatabaseReference db;

    private String tipoImagem = ""; // "perfil" ou "banner"





    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    // TODO: Rename and change types of parameters
    private String mParam1;
    private String mParam2;

    public Perfil_Fragment()
    {
        // Required empty public constructor
    }

    // TODO: Rename and change types and number of parameters
    public static Perfil_Fragment newInstance(String param1, String param2) {
        Perfil_Fragment fragment = new Perfil_Fragment();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        //SharedPreferences
        prefs = requireContext().getSharedPreferences("CrashWare", Context.MODE_PRIVATE);

        //Inicializando classe de XP
        XP_Manager = new XP_Manager(requireContext());

        //Carrego a foto assim que a tela foi incializada
        Foto();


        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);


        }

        escolherFoto = registerForActivityResult(
                new ActivityResultContracts.OpenDocument(),
                uri -> {
                    if (uri != null) {
                        setImage(uri);
                    }
                }
        );
        escolherBanner = registerForActivityResult(
                new ActivityResultContracts.OpenDocument(),
                uri -> {
                    if (uri != null) {
                        setBanner(uri);
                    }
                }
        );
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        // Inflate the layout for this fragment
        View view = inflater.inflate(R.layout.fragment_perfil, container, false);

        //Inicia o Layout no Código
        txtNomePerfil         = view.findViewById(R.id.txtNomePerfil        );
        txtPatente            = view.findViewById(R.id.txtPatente           );
        txtQuantGemas         = view.findViewById(R.id.txtQuantGemas        );
        txtQuantXP            = view.findViewById(R.id.txtXPPerfil          );
        txtVerTodasConquistas = view.findViewById(R.id.txtVerTodasConquistas);
        imgFotoPerfil         = view.findViewById(R.id.imgFotoPerfil        );
        imgConfigPerfil       = view.findViewById(R.id.imgConfigPerfil      );
        imgBanner             = view.findViewById(R.id.imgBanner            );
        txtNivelPerfil        = view.findViewById(R.id.txtNivelPerfil       );
        BarraProgressoPerfil = view.findViewById(R.id.barraProgressoPerfil  );


        //Pego os dados no SharedPreferences
        String Nome = prefs.getString("nome", null);
        String Patente = prefs.getString("patente", "Iniciante");
        Integer Moedas = prefs.getInt("moedas", 0);
        Float xp = prefs.getFloat("xp",0);
        int Nivel = XP_Manager.getNivel();
        float Xp = XP_Manager.getXp();

        //função que atualiza o progresso do xp
        atualizarXp();


        // Listener da foto
        listenerFoto = new SharedPreferences.OnSharedPreferenceChangeListener() {
            @Override
            public void onSharedPreferenceChanged(SharedPreferences sharedPreferences, String key) {

                if (key.equals("foto")) {
                    carregarImagem();
                }
            }
        };

        // Listener do banner

        listenerBanner = new SharedPreferences.OnSharedPreferenceChangeListener() {
            @Override
            public void onSharedPreferenceChanged(SharedPreferences sharedPreferences, String key) {

                if (key.equals("banner")) {
                    carregarBanner();
                }
            }
        };

        prefs.registerOnSharedPreferenceChangeListener(listenerBanner);

        prefs.registerOnSharedPreferenceChangeListener(listenerFoto);

        //Atualizando as informações do Usuário
        txtNomePerfil.setText(Nome);
        txtPatente.setText(Patente);
        txtNivelPerfil.setText("Nível " + String.valueOf(Nivel));
        txtQuantGemas.setText(String.valueOf(Moedas));
        txtQuantXP.setText(String.valueOf(xp));

//        txtQuantDiasSeguidos.setText(Ofensiva);




        txtVerTodasConquistas.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v)
            {
                Fragment conquistasFragmento = new Conquistas_Fragment();

                getParentFragmentManager()
                        .beginTransaction()
                        .replace(R.id.fragment_container, conquistasFragmento)
                        .addToBackStack(null)
                        .commit();

            }
        });// interação com o texto que leva para a tela com todas as conquistas

        imgConfigPerfil.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v)
            {
                Fragment novoFragmento = new Configuracoes_Fragment();

                getParentFragmentManager()
                        .beginTransaction()
                        .replace(R.id.fragment_container, novoFragmento)
                        .addToBackStack(null)
                        .commit();
            }
        });// interação com a imagem que leva para a tela de configurações

        imgFotoPerfil.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v)
            {
                tipoImagem = "perfil";
                escolherFoto.launch(new String[]{"image/*"});

            }
        });//Interação com a foto de perfil

        imgBanner.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v)
            {
                tipoImagem = "banner";
                escolherBanner.launch(new String[]{"image/*"});

            }
        });//Interação com o Banner

        //Carrega a imagem
        carregarImagem();

        //Carrego o Banner
        carregarBanner();

        return view;

    }

    @Override
    public void onResume()
    {
        super.onResume();
        atualizarXp();

    }

    private void atualizarXp()
    {
        int nivel = XP_Manager.getNivel();

        int xp = (int) XP_Manager.getXp();

        txtNivelPerfil.setText("Nível " + nivel);

        txtQuantXP.setText(xp + "/" + BarraProgressoPerfil.getMax() + " XP");

        BarraProgressoPerfil.setProgress(xp);
    }

    private void Foto(){

        //Verifico o token
        Auth.verificarToken(requireActivity(), prefs, true, new Auth.AuthCallback() {

            @Override
            public void onSuccess() {
                //Se token for valido executo a requisição
                User.Perfil(requireContext(), prefs, new User.PerfilCallback()
                {
                    @Override
                    public void sucesso(User.PerfilResponse usuario) {

                        String nome= usuario.nome;
                        String patente = usuario.patente;
                        String foto = usuario.foto;
                        String banner = usuario.banner;
                        Integer moedas = usuario.moedas;
                        Float xp = usuario.xp;



                        //Atualizo as informações para não rodar cache
                        txtNomePerfil.setText(nome);
                        txtPatente.setText(patente);
                        txtQuantGemas.setText(String.valueOf(moedas));
                        txtQuantXP.setText(String.valueOf(xp));




                        //Salvo o link da foto
                        String link_foto =  "https://yegrosiecwjebeetlwwg.supabase.co/storage/v1/object/public/FOTOS/"
                                + foto
                                + "?t=" + System.currentTimeMillis();

                        //Salvo o link do banner
                        String link_banner =  "https://yegrosiecwjebeetlwwg.supabase.co/storage/v1/object/public/banner/"
                                + banner
                                + "?t=" + System.currentTimeMillis();

                        //Carrega a foto atual do usuario
                        Glide.with(requireContext())
                                .load(link_foto)
                                .skipMemoryCache(true)
                                .diskCacheStrategy(DiskCacheStrategy.NONE)
                                .into(imgFotoPerfil);

                        //Carrega o banner atual do usuario
                        Glide.with(requireContext())
                                .load(link_banner)
                                .skipMemoryCache(true)
                                .diskCacheStrategy(DiskCacheStrategy.NONE)
                                .into(imgBanner);
                    }
                });//Perfil

            }//
        });//Token


    }//Foto

    private void setImage(Uri uri) {
        if (!isAdded()) return;

        //Pego a foto do banco
        String foto = prefs.getString("foto", null);

        //Verifico se vai adicionar ou alterar
        if("default.png".equals(foto)) {
            //Add a foto
            Toast.makeText(getContext(), "Adicionando Foto..", Toast.LENGTH_LONG).show();

            //Verifico o token
            Auth.verificarToken(requireActivity(), prefs, true, new Auth.AuthCallback() {

                @Override
                public void onSuccess() {
                    //Se token for valido executo a requisição
                    User.Adicionar_Foto(requireContext(), prefs, uri, imgFotoPerfil);

                }
            });
        }else
        {
            //Altero a foto
            Toast.makeText(getContext(), "Alterando Foto..", Toast.LENGTH_LONG).show();

            //Verifico o token
            Auth.verificarToken(requireActivity(), prefs, true, new Auth.AuthCallback() {

                @Override
                public void onSuccess() {
                    //Se token for valido executo a requisição
                    User.Alterar_Foto(requireContext(),prefs,uri,imgFotoPerfil);
                }
            });

        }


    }

    private void setBanner(Uri uri) {
        if (!isAdded()) return;

        //Pego o banner
        String banner = prefs.getString("banner", null);

        //Verifico se vai adicionar ou alterar
        if ("default.png".equals(banner)) {
            //Add o banner
            Toast.makeText(getContext(), "Adicionando Banner...", Toast.LENGTH_LONG).show();

            //Verifico o token
            Auth.verificarToken(requireActivity(), prefs, true, new Auth.AuthCallback() {

                @Override
                public void onSuccess() {
                    //Se token for valido executo a requisição
                    User.Adicionar_Banner(requireContext(), prefs, uri, imgBanner);
                }
            });



        } else {
            //Altero o banner
            Toast.makeText(getContext(), "Alterando Banner...", Toast.LENGTH_LONG).show();
            //Verifico o token
            Auth.verificarToken(requireActivity(), prefs, true, new Auth.AuthCallback() {

                @Override
                public void onSuccess() {
                    //Se token for valido executo a requisição
                    User.Alterar_Banner(requireContext(), prefs, uri, imgBanner );
                }
            });
        }
    }

    private void carregarImagem() {
        if (!isAdded()) return;

        //Pego a foto
        String fotoPerfil = prefs.getString("foto", null);

        //Salvo o link da foto
        String link_foto =  "https://yegrosiecwjebeetlwwg.supabase.co/storage/v1/object/public/FOTOS/"
                + fotoPerfil
                + "?t=" + System.currentTimeMillis();

        //Carrega a foto atual do usuario
        Glide.with(requireContext())
                .load(link_foto)
                .skipMemoryCache(true)
                .diskCacheStrategy(DiskCacheStrategy.NONE)
                .into(imgFotoPerfil);

    }

    private void carregarBanner() {
        if (!isAdded()) return;

        //Pego a foto
        String bannerPerfil = prefs.getString("banner", null);

        //Salvo o link da foto
        String link_banner =  "https://yegrosiecwjebeetlwwg.supabase.co/storage/v1/object/public/banner/"
                + bannerPerfil
                + "?t=" + System.currentTimeMillis();

        //Carrega o banner atual do usuario
        Glide.with(requireContext())
                .load(link_banner)
                .skipMemoryCache(true)
                .diskCacheStrategy(DiskCacheStrategy.NONE)
                .into(imgBanner);


    }

}