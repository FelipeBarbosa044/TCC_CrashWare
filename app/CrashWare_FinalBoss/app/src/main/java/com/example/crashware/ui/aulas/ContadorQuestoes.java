package com.example.crashware.ui.aulas;

public class ContadorQuestoes
{
    public static int totalQuestoes = 0;
    public static int totalAcertos = 0;

    public static void registrarAcerto()
    {
        totalQuestoes++;
        totalAcertos++;
    }

    public static void registrarErro()
    {
        totalQuestoes++;
    }

    public static float getPorcentagem()
    {
        if (totalQuestoes == 0)
            return 0;

        return (totalAcertos * 100f) / totalQuestoes;
    }

    public static void resetar()
    {
        totalQuestoes = 0;
        totalAcertos = 0;
    }

}