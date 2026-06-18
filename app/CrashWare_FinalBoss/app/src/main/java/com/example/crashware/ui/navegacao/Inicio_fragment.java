package com.example.crashware.ui.navegacao;

import static android.widget.Toast.LENGTH_LONG;
import static android.widget.Toast.LENGTH_SHORT;

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
import com.example.crashware.ui.api.Aula;
import com.example.crashware.ui.api.Auth;
import com.example.crashware.ui.api.Ofensiva;
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
import android.widget.Toast;

import com.example.crashware.ui.sistemas.XP_Manager;


public class Inicio_fragment extends Fragment {

    //Iniciando as váriaveis, Objetos e funções que vão ser utilizadas
    private SharedPreferences.OnSharedPreferenceChangeListener listenerFoto;

    private SharedPreferences.OnSharedPreferenceChangeListener listenerRecursos;

    private SharedPreferences.OnSharedPreferenceChangeListener listenerAulas;

    private TextView txtNomeInicio, txtAulasConcluidas, txtOfensiva, txtNivelInicio, txtXpInicio,txtModulo,txtProxModulo,txtTituloAulaHome,txtAulaHome,txtModuloHome;
    private ShapeableImageView imgfotoInicio;
    ImageView imgNotificacoes, imgRaposa;

    private FirebaseAuth auth;
    private DatabaseReference db;

    private ValueEventListener nomeListener;

    ProgressBar BarraProgressoNivel;

    ConstraintLayout btnRetomarS, btnRetomarH;

    // Memória do app
    SharedPreferences prefs;

    Button btnRetomar;

    XP_Manager XP_Manager;

    int Carinho = 0;

    // =========================
    // OFENSIVA
    // =========================

    private static final String KEY_OFENSIVA = "ofensiva";
    private static final String KEY_ULTIMO_DIA = "ultimo_dia";

    @Override
    public void onCreate(@Nullable Bundle savedInstanceState) {

        super.onCreate(savedInstanceState);

        prefs = requireContext().getSharedPreferences("CrashWare", Context.MODE_PRIVATE);

        //Adiciono a conquista de login e sicronizo a ofensiva
        XP_Manager = new XP_Manager(requireContext());



//        XP_Manager = new XP_Manager(requireContext());

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

        //Ultima Aula
        btnRetomar          = view.findViewById(R.id.btnRetomar              ); //Botao Retomar ou Começar
        txtProxModulo       = view.findViewById(R.id.txtProxModulo           ); //Prox modulo
        txtTituloAulaHome   = view.findViewById(R.id.txtTituloAulaHome       ); //Titulo
        txtAulaHome         = view.findViewById(R.id.txtAulaHome             ); //Numero
        txtModuloHome       = view.findViewById(R.id.txtModuloHome            ); //Trilha
        txtModulo           = view.findViewById(R.id.txtModulo               ); //Modulo


        //Pego as informações do SharedPreferences

        txtXpInicio         = view.findViewById(R.id.txtXPInicio             );
        imgNotificacoes     = view.findViewById(R.id.layoutSino              );
        imgRaposa           = view.findViewById(R.id.imgRaposa               );


        //(Não mexam aqui)

//        //Coleto as informações do usuário
//        Perfil();

        // Atualiza a interface de XP e nível
        atualizarInterfaceXp();

        Toast conquista = Toast.makeText(getContext(),"Conquista Adquirida",LENGTH_LONG);


        verificarHumorRaposa();


        // Listener da foto
        listenerFoto = new SharedPreferences.OnSharedPreferenceChangeListener() {
            @Override
            public void onSharedPreferenceChanged(SharedPreferences sharedPreferences, String key) {

                if (key.equals("foto")) {
                    carregarImagem();
                }
            }
        };

        //Listener do xp/nivel
        listenerRecursos = new SharedPreferences.OnSharedPreferenceChangeListener() {
            @Override
            public void onSharedPreferenceChanged(SharedPreferences sharedPreferences, String key) {

                if (key.equals("xp_total")) {
                    //função que atualiza o progresso do xp
                    atualizarInterfaceXp();
                }

            }
        };

        //Listener das aulas concluidas
        listenerAulas = new SharedPreferences.OnSharedPreferenceChangeListener() {
            @Override
            public void onSharedPreferenceChanged(SharedPreferences sharedPreferences, String key) {

                if (key.equals("aulas_concluidas")) {
                    //função que atualiza o progresso do xp
                    int aulas = sharedPreferences.getInt("aulas_concluidas", 0);
                    txtAulasConcluidas.setText(String.valueOf(aulas));
                }

            }
        };

        prefs.registerOnSharedPreferenceChangeListener(listenerFoto);

        prefs.registerOnSharedPreferenceChangeListener(listenerRecursos);

        prefs.registerOnSharedPreferenceChangeListener(listenerAulas);

        imgRaposa.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view)
            {


                Carinho ++;
                //
                if (Carinho == 10)
                {

                    //exibo conquista
                        User.Conquista(17,prefs, getActivity(), new User.ConquistasCallback()
                        {
                            @Override
                            public void onSuccess()
                            {

                            }
                        });

                }


                else if (Carinho > 10)
                {
                    Toast.makeText(getContext(),"Quanto amor ein pae!", LENGTH_SHORT).show();
                }
            }
        });



        btnRetomar.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view)
            {

                String trilha = prefs.getString("trilha", "Hardware");

                if(trilha.equals("Hardware"))
                {
                    //Vai para a tela "IntroducaoHardware"
                }else
                {
                    //Vai para a tela "IntroducaoSoftware"
                }

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

        //Valido a Ofensiva
        ValidarOfensiva();

        //Atualizar aulas
        RetornarAulas_Concluidas();

        //Atualiza XP/GEMAS e Patente
        CarregarRecursos();

        //Informações do usuário
        carregarDadosLocais();



//        atualizarInterfaceXp();

    }



    // =========================
    // XP / NÍVEL
    // =========================

    private void atualizarInterfaceXp()
    {
        int nivel = XP_Manager.getNivel();

        int xpAtual = XP_Manager.getXpAtualNivel();

        int xpMaximo = XP_Manager.getXpPorNivel();

        txtNivelInicio.setText("Nível " + nivel);

        BarraProgressoNivel.setMax(xpMaximo);

        ObjectAnimator animacaoBarra = ObjectAnimator.ofInt(
                BarraProgressoNivel,
                "progress",
                BarraProgressoNivel.getProgress(),
                xpAtual
        );

        animacaoBarra.setDuration(700);
        animacaoBarra.setInterpolator(new DecelerateInterpolator());
        animacaoBarra.start();

        int xpAnterior = BarraProgressoNivel.getProgress();

        ValueAnimator animacaoTexto = ValueAnimator.ofInt(
                xpAnterior,
                xpAtual
        );

        animacaoTexto.setDuration(700);

        animacaoTexto.addUpdateListener(animation -> {

            int valorAtual =
                    (int) animation.getAnimatedValue();

            txtXpInicio.setText(valorAtual + "/" + xpMaximo + " XP");
        });

        animacaoTexto.start();
    }


    // =========================
    // PERFIL
    // =========================

    private void Perfil() {

        //Verifico o token
        Auth.verificarToken(requireActivity(), prefs, true, new Auth.AuthCallback() {

            @Override
            public void onSuccess()
            {


                //Se token for valido executo a requisição
                User.Perfil(requireContext(), prefs, new User.PerfilCallback() {

                    @Override
                    public void sucesso(User.PerfilResponse usuario) {

                        String nome = usuario.nome;
                        String email = usuario.email;
                        String telefone = usuario.telefone;
                        String foto = usuario.foto;
                        String banner = usuario.banner;
                        String criado_em = usuario.criado_em;
                        Integer moedas = usuario.moedas;
                        Float xp = usuario.xp;
                        Integer ofensiva = usuario.ofensiva;
                        Boolean ativo = usuario.ativo;

                        // Salvo os dados no SharedPreferences
                        prefs.edit()
                                .putString("email",email)
                                .putString("telefone",telefone)
                                .putString("foto", foto)
                                .putString("nome", nome)
                                .putString("banner",banner)
                                .putString("criado_em",criado_em)
                                .putInt("moedas",moedas)
                                .putFloat("xp_total", xp)
                                .putInt("ofensiva",ofensiva)

                                .commit();


                        if(ativo == false)
                        {
                            //Coloca aqui a mensagem de banimento junto com o botão de "entendi"

                        }


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

                        //Atualiza a ofensiva
                        txtOfensiva.setText(String.valueOf(ofensiva + " dias"));

                    }
                });//Perfil

            }//
        });//Token



    }//Perfil





    private void ValidarOfensiva()
    {

        //Verifico o token
        Auth.verificarToken(requireActivity(), prefs, true, new Auth.AuthCallback() {

            @Override
            public void onSuccess()
            {
                //Se verificar token  certo

                //Valido a ofensiva
                Ofensiva.ValidarOfensiva(prefs, requireContext(),new Ofensiva.OfensivaCallback()
                {
                    @Override
                    public void onSuccess()
                    {
                        //Ignora
                    }

                });
            }
        });


    }//Validar Ofensiva

    private void RetornarAulas_Concluidas()
    {
        //Verifico o Token

        //Verifico o token
        Auth.verificarToken(requireActivity(), prefs, true, new Auth.AuthCallback() {

            @Override
            public void onSuccess()
            {
                //Se verificar token  certo

                //Pego as aulas concluidas
                Aula.AulasConcluidas(prefs, requireContext(), new Aula.AulasCallback()
                 {
                    @Override
                    public void onSuccess() {
                        //Pego as aulas
                        int aulas = prefs.getInt("aulas_concluidas", 0);
                        txtAulasConcluidas.setText(String.valueOf(aulas));
                    }

                });
            }
        });

    }


    private void CarregarRecursos()
    {

        //Atualiza XP/GEMAS e a Patente
        String email = prefs.getString("email", "");

        User.Patente(email,prefs);

        User.AtualizarRecursos(email,prefs);


    }//Carregar Recursos


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


        if (prefs != null) {
            if (listenerFoto != null) {
                prefs.unregisterOnSharedPreferenceChangeListener(listenerFoto);
            }

            if (listenerRecursos != null) {
                prefs.unregisterOnSharedPreferenceChangeListener(listenerRecursos);
            }

            if (listenerAulas != null) {
                prefs.unregisterOnSharedPreferenceChangeListener(listenerAulas);
            }
        }
    }



    private void carregarDadosLocais() {

        String nome = prefs.getString("nome", "");
        String foto = prefs.getString("foto", "");
        Integer ofensiva = prefs.getInt("ofensiva", 1);
        Integer aulas = prefs.getInt("aulas_concluidas", 0);

        String trilha = prefs.getString("trilha", "Hardware");
        String numero = prefs.getString("numero", "1");
        String botao =  prefs.getString("botao", "Começar");
        String titulo = prefs.getString("tituloUltimaAula", "Introdução Hardware");
        String proximoModulo = prefs.getString("proximoModulo", "Fundamentos");

        txtNomeInicio.setText(nome);

        txtOfensiva.setText(ofensiva + " dias");

        txtAulasConcluidas.setText(String.valueOf(aulas));

        //Ultima Aula
        btnRetomar.setText(botao);
        txtTituloAulaHome.setText(titulo);
        txtAulaHome.setText("Aula " + numero);
        txtModuloHome.setText(trilha);
        txtModulo.setText(proximoModulo);

        if (foto != null && !foto.isEmpty()) {

            String linkFoto =
                    "https://yegrosiecwjebeetlwwg.supabase.co/storage/v1/object/public/FOTOS/"
                            + foto
                            + "?t=" + System.currentTimeMillis();

            Glide.with(requireContext())
                    .load(linkFoto)
                    .skipMemoryCache(true)
                    .diskCacheStrategy(DiskCacheStrategy.NONE)
                    .into(imgfotoInicio);

        }


    }

    private void verificarHumorRaposa() {
        // Instancia o Manager
        Ofensiva_Manager ofensivaManager = new Ofensiva_Manager(requireContext());

        // Pega a ofensiva ANTES da verificação matemática
        int ofensivaAntiga = ofensivaManager.getOfensiva();

        // Roda a verificação (isso atualiza os dias automaticamente)
        int ofensivaNova = ofensivaManager.verificarOfensiva();

        // Compara para saber se ele perdeu o combo
        if (ofensivaAntiga > 1 && ofensivaNova == 1) {

            // Perdeu a ofensiva
            // Troque 'raposasad_icon' pelo nome exato da sua imagem triste
            imgRaposa.setImageResource(R.drawable.raposasad_icon);

        } else {

            // Manteve, aumentou ou é o primeiro dia. Raposa feliz padrão.
            imgRaposa.setImageResource(R.drawable.raposa_icon);
        }
    }//

}