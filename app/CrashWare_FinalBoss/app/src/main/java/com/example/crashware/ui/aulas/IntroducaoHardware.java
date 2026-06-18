package com.example.crashware.ui.aulas;

import android.content.Context;
import android.content.SharedPreferences;
import android.net.Uri; // IMPORTANTE
import android.os.Bundle;

import androidx.fragment.app.Fragment;
import androidx.fragment.app.FragmentManager;

import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.Button;
import android.widget.ImageView;

import com.example.crashware.R;
import com.example.crashware.ui.api.Aula;
import com.example.crashware.ui.api.Auth;

import android.content.res.ColorStateList;
import android.graphics.Color;

// Importações do Media3 ExoPlayer
import androidx.media3.common.MediaItem;
import androidx.media3.exoplayer.ExoPlayer;
import androidx.media3.ui.PlayerView;

/**
 * A simple {@link Fragment} subclass.
 * Use the {@link IntroducaoHardware#newInstance} factory method to
 * create an instance of this fragment.
 */
public class IntroducaoHardware extends Fragment {

    ImageView imgVoltarAula;
    Button btnFazerExercicio;
    SharedPreferences prefs;

    // Variáveis para o Player
    private PlayerView playerView;
    private ExoPlayer player;

    private static final String ARG_PARAM1 = "param1";
    private static final String ARG_PARAM2 = "param2";

    private String mParam1;
    private String mParam2;

    public IntroducaoHardware() {
        // Required empty public constructor
    }

    public static IntroducaoHardware newInstance(String param1, String param2) {
        IntroducaoHardware fragment = new IntroducaoHardware();
        Bundle args = new Bundle();
        args.putString(ARG_PARAM1, param1);
        args.putString(ARG_PARAM2, param2);
        fragment.setArguments(args);
        return fragment;
    }

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        prefs = requireActivity().getSharedPreferences("CrashWare", Context.MODE_PRIVATE);

        if (getArguments() != null) {
            mParam1 = getArguments().getString(ARG_PARAM1);
            mParam2 = getArguments().getString(ARG_PARAM2);
        }
    }

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {

        // Inflate the layout for this fragment
        View view =  inflater.inflate(R.layout.fragment_aula_hardware, container, false);

        imgVoltarAula = view.findViewById(R.id.imgVoltarCampos);
        btnFazerExercicio = view.findViewById(R.id.btnFazerExercicio);

        // 1. Vincular o PlayerView do seu fragment_aula_hardware.xml
        playerView = view.findViewById(R.id.playerView);

        // Começa bloqueado enquanto verifica/sincroniza
        btnFazerExercicio.setEnabled(false);
        //Deixa o botão cinza
        btnFazerExercicio.setBackgroundTintList(ColorStateList.valueOf(Color.GRAY));

        btnFazerExercicio.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view)
            {
                //Cria o novo caminho para fragmento
                Fragment novoFragmento = new FragmentExercicios();

                // Cria o pacote de dados (Mantido os IDs originais da sua API de Hardware)
                Bundle bundle = new Bundle();
                bundle.putInt("id_exercicio", 7);
                bundle.putInt("id_conquista", 19);
                bundle.putString("titulo", "Introdução Hardware");

                novoFragmento.setArguments(bundle);

                //Sobrepoe a tela do fragment para a de exercicios
                getParentFragmentManager()
                        .beginTransaction()
                        .replace(R.id.fragmentHardware_Container, novoFragmento)
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
                //Seleciona a fragment atual e simula o Clique do botão voltar do celular
                requireActivity()
                        .getOnBackPressedDispatcher()
                        .onBackPressed();
            }
        });//interação com a imagem de voltar

        // 2. Inicializar o player de vídeo local e configurar a tela cheia
        initializePlayer();

        // Executa a sincronização da API normalmente
        SincronizarAula();

        return view;
    }

    private void initializePlayer() {
        // Inicializa o ExoPlayer
        player = new ExoPlayer.Builder(requireContext()).build();
        playerView.setPlayer(player);

        // Buscamos os componentes principais do seu XML usando os IDs reais dele
        final View headerLayout = requireActivity().findViewById(R.id.header);
        // Para pegar o ScrollView, precisamos subir até o pai do cardVideo
        final View scrollViewLayout = (View) playerView.getParent().getParent().getParent();
        // O código acima navega do playerView -> CardView -> ConstraintLayout(conteudo) -> ScrollView

        playerView.setFullscreenButtonClickListener(new PlayerView.FullscreenButtonClickListener() {
            @Override
            public void onFullscreenButtonClick(boolean isFullscreen) {
                // Pegamos o CardView do vídeo para alterar as margens e o tamanho dele
                View cardVideo = requireActivity().findViewById(R.id.cardVideo);
                ViewGroup.MarginLayoutParams cardParams = (ViewGroup.MarginLayoutParams) cardVideo.getLayoutParams();

                if (isFullscreen) {
                    // 1. Força o celular a deitar (Modo Paisagem)
                    requireActivity().setRequestedOrientation(android.content.pm.ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE);

                    // 2. Oculta os botões virtuais e a barra de notificações do Android
                    View decorView = requireActivity().getWindow().getDecorView();
                    decorView.setSystemUiVisibility(
                            View.SYSTEM_UI_FLAG_FULLSCREEN |
                                    View.SYSTEM_UI_FLAG_HIDE_NAVIGATION |
                                    View.SYSTEM_UI_FLAG_IMMERSIVE_STICKY
                    );

                    // 3. MATOU A CHARADA: Esconde o Header e o ScrollView com todos os textos
                    if (headerLayout != null) headerLayout.setVisibility(View.GONE);

                    // Em vez de esconder o ScrollView (o que sumiria com o vídeo também),
                    // vamos esconder apenas os outros irmãos do CardView dentro do container "conteudo"
                    View conteudoLayout = requireActivity().findViewById(R.id.conteudo);
                    if (conteudoLayout instanceof ViewGroup) {
                        ViewGroup vg = (ViewGroup) conteudoLayout;
                        for (int i = 0; i < vg.getChildCount(); i++) {
                            View child = vg.getChildAt(i);
                            if (child.getId() != R.id.cardVideo) {
                                child.setVisibility(View.GONE); // Esconde tudo o que NÃO for o vídeo
                            }
                        }
                    }

                    // 4. Remove as margens laterais (40dp) do CardView temporariamente para colar nas bordas
                    cardParams.setMargins(0, 0, 0, 0);
                    cardParams.height = ViewGroup.LayoutParams.MATCH_PARENT;
                    cardParams.width = ViewGroup.LayoutParams.MATCH_PARENT;
                    cardVideo.setLayoutParams(cardParams);

                } else {
                    // 1. Retorna o celular para a posição em pé (Modo Retrato)
                    requireActivity().setRequestedOrientation(android.content.pm.ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);

                    // 2. Traz de volta as barras do sistema operacional
                    View decorView = requireActivity().getWindow().getDecorView();
                    decorView.setSystemUiVisibility(View.SYSTEM_UI_FLAG_VISIBLE);

                    // 3. Mostra o Header novamente
                    if (headerLayout != null) headerLayout.setVisibility(View.VISIBLE);

                    // 4. Mostra de volta todos os textos e botões da aula
                    View conteudoLayout = requireActivity().findViewById(R.id.conteudo);
                    if (conteudoLayout instanceof ViewGroup) {
                        ViewGroup vg = (ViewGroup) conteudoLayout;
                        for (int i = 0; i < vg.getChildCount(); i++) {
                            View child = vg.getChildAt(i);
                            // Restaura a visibilidade padrão. O botão de exercícios obedece à lógica da sua API
                            if (child.getId() == R.id.btnFazerExercicio) {
                                // Deixa a sua função SincronizarAula cuidar dele ou bota VISIBLE se preferir
                                child.setVisibility(View.VISIBLE);
                            } else {
                                child.setVisibility(View.VISIBLE);
                            }
                        }
                    }

                    // 5. Devolve as margens originais (40dp) e a altura padrão (220dp) ao CardView
                    int marginInPx = (int) (40 * getResources().getDisplayMetrics().density);
                    int heightInPx = (int) (220 * getResources().getDisplayMetrics().density);
                    cardParams.setMargins(marginInPx, (int) (30 * getResources().getDisplayMetrics().density), marginInPx, 0);
                    cardParams.height = heightInPx;
                    cardParams.width = ViewGroup.LayoutParams.MATCH_PARENT;
                    cardVideo.setLayoutParams(cardParams);
                }
            }
        });

        // Caminho do seu vídeo local
        String videoPath = "android.resource://" + requireActivity().getPackageName() + "/" + R.raw.aulaintroducao;
        Uri videoUri = Uri.parse(videoPath);

        MediaItem mediaItem = MediaItem.fromUri(videoUri);
        player.setMediaItem(mediaItem);
        player.prepare();
        player.setPlayWhenReady(false);
    }

    @Override
    public void onDestroyView() {
        super.onDestroyView();

        // Se o usuário fechar a tela enquanto estava em tela cheia, garante que a rotação volta ao normal
        if (requireActivity().getRequestedOrientation() == android.content.pm.ActivityInfo.SCREEN_ORIENTATION_LANDSCAPE) {
            requireActivity().setRequestedOrientation(android.content.pm.ActivityInfo.SCREEN_ORIENTATION_PORTRAIT);
            View decorView = requireActivity().getWindow().getDecorView();
            decorView.setSystemUiVisibility(View.SYSTEM_UI_FLAG_VISIBLE);
        }

        if (player != null) {
            player.release(); // Libera o reprodutor completamente da memória
            player = null;
        }
    }

    public void SincronizarAula(){
        //Verifico o token
        Auth.verificarToken(requireActivity(), prefs, true, new Auth.AuthCallback() {

            @Override
            public void onSuccess()
            {
                //Se verificar token certo
                //Sincronizo aula e exercicio com usuario usando os IDs originais (7)
                Aula.SincronizarAula(7, prefs);

                Aula.SincronizarExercicio(7, prefs, new Aula.UsuarioExercicioCallback()
                {
                    @Override
                    public void Terminou()
                    {
                        //Oculta o botão de exercicios
                        btnFazerExercicio.setVisibility(View.GONE);
                    }

                    @Override
                    public void NaoTerminou()
                    {
                        //Deixa o botão de exercicios clicavel
                        btnFazerExercicio.setVisibility(View.VISIBLE);
                        btnFazerExercicio.setEnabled(true);
                        btnFazerExercicio.setBackgroundTintList(null);
                    }
                });
            }
        });
    }
}