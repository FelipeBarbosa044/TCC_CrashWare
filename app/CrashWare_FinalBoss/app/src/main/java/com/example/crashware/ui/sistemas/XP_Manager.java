package com.example.crashware.ui.sistemas;

import android.content.Context;
import android.content.SharedPreferences;

public class XP_Manager
{
    private SharedPreferences prefs;

    private static final String PREFS_NAME = "CrashWare";
    private static final String KEY_XP_TOTAL = "xp_total";

    private static final int XP_POR_NIVEL = 500;

    public XP_Manager(Context context)
    {
        prefs = context.getSharedPreferences(
                PREFS_NAME,
                Context.MODE_PRIVATE
        );
    }

    public float getXpTotal()
    {
        return prefs.getFloat(KEY_XP_TOTAL, 0);
    }

    public int getXpAtualNivel()
    {
        return (int)(getXpTotal() % XP_POR_NIVEL);
    }

    public int getXpPorNivel()
    {
        return XP_POR_NIVEL;
    }

    public void adicionarXp(float quantidade)
    {
        float xpTotal = getXpTotal() + quantidade;

        prefs.edit()
                .putFloat(KEY_XP_TOTAL, xpTotal)
                .apply();
    }

    public int getNivel()
    {
        return ((int) getXpTotal() / XP_POR_NIVEL) + 1;
    }

    public void resetar()
    {
        prefs.edit()
                .putFloat(KEY_XP_TOTAL, 0)
                .apply();
    }
}