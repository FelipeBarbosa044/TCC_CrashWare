package com.example.crashware.ui.navegacao;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.ProgressBar;

import androidx.activity.EdgeToEdge;
import androidx.appcompat.app.AppCompatActivity;

import com.example.crashware.R;
import com.example.crashware.ui.api.Aula;
import com.example.crashware.ui.api.Auth;
import com.example.crashware.ui.api.Loja;
import com.example.crashware.ui.api.Ofensiva;
import com.example.crashware.ui.api.User;
import com.example.crashware.ui.config.Banido;
import com.example.crashware.ui.config.ThemeConfig;

public class carregamentoLogin  extends  AppCompatActivity{
    private ProgressBar barra;

    private SharedPreferences prefs;

    @Override
    protected void onCreate(Bundle savedInstanceState) {


        ThemeConfig.aplicarTema(this);

        super.onCreate(savedInstanceState);

        EdgeToEdge.enable(this);

        setContentView(R.layout.carregamento);

        prefs = getSharedPreferences("CrashWare", MODE_PRIVATE);

        barra = findViewById(R.id.carregandoTela);

        barra.setProgress(10);

        iniciarCarregamento();
    }

    private void iniciarCarregamento() {

        // 30%
        barra.setProgress(30);

        PegarInformacoes();
    }

    private void PegarInformacoes()
    {

                Loja.VerificarTema(prefs,carregamentoLogin.this,new  Loja.TemaCallback(){
                    @Override
                    public void onSuccess(Boolean valor)
                    {
                        if(valor == true)
                        {
                            prefs.edit()
                                    .putBoolean("tema_gelo", true)
                                    .apply();

                            Aulas_Concluidas();

                        }else
                        {
                            prefs.edit()
                                    .putBoolean("tema_gelo", false)
                                    .apply();

                            Aulas_Concluidas();
                        }
                    }

                    @Override
                    public void onError()
                    {
                        //Se der erro a requisição:
//                        txtComprarGelo.setText("Comprar");
//                        txtComprarGelo.setEnabled(true);

//                SincronizarOfensiva();
                    }

                });



    }//Pegar Informacoes



    private void Aulas_Concluidas()
    {
        //Pego a quantidade de aulas concluida do usuário
        Aula.AulasConcluidas(prefs, carregamentoLogin.this, new Aula.AulasCallback() {
            @Override
            public void onSuccess() {
                //Sincronizo a Ofensiva
                SincronizarOfensiva();
            }
        });
    }
    private void SincronizarOfensiva() {

        //Sicronizo com o banco de dados a ofensiva
        Ofensiva.SicronizarOfensiva(prefs, carregamentoLogin.this, new Ofensiva.OfensivaCallback() {
            @Override
            public void onSuccess() {
                // Se Sicronizar Ofensiva der certo

                // 40%
                barra.setProgress(40);

                carregarPerfil();
            }

        });

    }//Sincronizar Ofensiva


    private void carregarPerfil()
    {

        User.Perfil(
                this,
                prefs,
                new User.PerfilCallback() {

                    @Override
                    public void sucesso(User.PerfilResponse usuario) {
                        // 50%
                        barra.setProgress(50);


                        //Primeira conquista e valido a ofensiva
                        primeiroLogin(usuario);

                    }
                }
        );
    }


    private  void primeiroLogin(User.PerfilResponse usuario)
    {

        //Primeira conquista
         User.Conquista(9,prefs, carregamentoLogin.this, new User.ConquistasCallback()
            {
                @Override
                public void onSuccess()
                {
                    //Valido a Ofensiva
                    Ofensiva.ValidarOfensiva(prefs, carregamentoLogin.this, new Ofensiva.OfensivaCallback()
                    {
                        @Override
                        public void onSuccess()
                        {
                            //Se validar ofensiva der certo
                            // 60%
                            barra.setProgress(60);

                            //Verifico se usuário está banido/desativado
                            if(usuario.ativo == false)
                            {
                                //Levo para a tela de Banido/Desativado
                                Intent intent = new Intent(carregamentoLogin.this, Banido.class);
                                // passando o motivo do banimento
                                intent.putExtra("motivo_banimento", usuario.motivo_banimento);
                                startActivity(intent);
                                finish();
                            }else{
                                //Se tiver ativo salvo os dados
                                salvarDados(usuario);
                            }



                        }
                    });
                }
            });

    }//Primeiro Login


    private void salvarDados(User.PerfilResponse usuario) {

        prefs.edit()

                .putString("nome", usuario.nome)
                .putString("email", usuario.email)
                .putString("foto", usuario.foto)
                .putString("banner", usuario.banner)
                .putString("telefone",usuario.telefone)
                .putString("criado_em" , usuario.criado_em)
                .putString("patente",usuario.patente)

                .putInt(
                        "moedas",
                        usuario.moedas != null ? usuario.moedas : 0
                )

                .putFloat(
                        "xp_total",
                        usuario.xp != null ? usuario.xp : 0f
                )

                .putInt(
                        "ofensiva",
                        usuario.ofensiva != null ? usuario.ofensiva : 1
                )

                .putBoolean(
                        "ativo",
                        usuario.ativo != null && usuario.ativo
                )

                .apply();

        if(usuario.adm == true)
        {
            //Exibo a conquista
            User.Conquista(23, prefs, this, new User.ConquistasCallback() {
                @Override
                public void onSuccess() {
                    abrirHome();
                }
            });
        }else
        {
            abrirHome();
        }

    }//salvarDados

    private void abrirHome() {
        // 100%
        barra.setProgress(100);

        Intent intent =
                new Intent(carregamentoLogin.this, Home.class);

        startActivity(intent);

        finish();
    }
}
